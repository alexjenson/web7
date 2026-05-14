#!/usr/bin/env python3
"""
Auto Job Application Script for Amrit Raju
Searches Indeed for design jobs (remote + Greece), writes cover letters,
and sends Gmail applications automatically.

Usage:
    ANTHROPIC_API_KEY=sk-... python apply_jobs.py

Requirements:
    pip install anthropic google-api-python-client google-auth-httplib2 google-auth-oauthlib
    Run gmail_setup.py once first to authorize Gmail.
    Must be run while a Claude Code session is active (reads session MCP config).
"""

import base64
import email as email_lib
import glob
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

import anthropic
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

BASE_DIR = Path(__file__).parent
STATE_FILE = BASE_DIR / "applied_jobs.json"
REPORT_FILE = BASE_DIR / "job_applications_report.md"
TOKEN_FILE = BASE_DIR / ".gmail_token.json"

JOB_SEARCHES = [
    {"search": "UI/UX Designer",    "location": "remote",  "country_code": "US"},
    {"search": "Graphic Designer",  "location": "remote",  "country_code": "US"},
    {"search": "Web Designer",      "location": "remote",  "country_code": "US"},
    {"search": "UI/UX Designer",    "location": "Athens",  "country_code": "GR"},
    {"search": "Graphic Designer",  "location": "Athens",  "country_code": "GR"},
    {"search": "Web Designer",      "location": "Athens",  "country_code": "GR"},
]

SYSTEM_PROMPT = """You are an automated job application assistant for Amrit Raju, a UI/UX, Graphic, and Web Designer.

Your job each run:
1. Call get_resume to load the candidate's profile.
2. For each search in the provided list, call search_jobs. Collect up to 3 job IDs per search.
3. Skip any job_id already in ALREADY_APPLIED_IDS.
4. For each new job_id call get_job_details.
5. Evaluate relevance: only proceed if the role matches UI/UX design, graphic design, web design, or branding.
6. Write a personalized 2-paragraph cover letter referencing the specific company and role.
   - Paragraph 1: enthusiasm for the role and company, and most relevant experience.
   - Paragraph 2: 2-3 concrete skills/achievements from the resume that match the job requirements.
   - Sign off: "Best regards,\\nAmrit Raju\\namritgraphic4@gmail.com | +1 908 573 4841 | www.amritgraphic.com"
7. Look for a recruiter/HR email address in the job details. Extract it if present.
8. After processing ALL jobs, return ONLY valid JSON (no markdown, no extra text) in this exact shape:
{
  "applied_ids": ["id1", "id2", ...],
  "report_entries": [
    {
      "job_id": "...",
      "title": "...",
      "company": "...",
      "location": "...",
      "apply_link": "...",
      "recipient_email": "email@company.com or null",
      "cover_letter": "full text of cover letter"
    }
  ]
}

Rules:
- Only return the JSON object. No prose before or after.
- If no relevant jobs are found, return {"applied_ids": [], "report_entries": []}.
- Never fabricate job details. Only use data returned by the tools.
"""


def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {"applied_ids": []}


def save_state(state: dict) -> None:
    STATE_FILE.write_text(json.dumps(state, indent=2))


def find_mcp_config() -> dict:
    files = glob.glob("/tmp/mcp-config-*.json")
    if not files:
        sys.exit(
            "ERROR: No MCP config found at /tmp/mcp-config-*.json\n"
            "Make sure you run this script while a Claude Code session is active."
        )
    return json.loads(Path(files[0]).read_text())


def build_mcp_servers(config: dict) -> list:
    servers = []
    for server_id, cfg in config["mcpServers"].items():
        if server_id != "c2485fb3-86b3-4b19-9735-0ab2cf178468":
            continue
        server = {"type": "url", "url": cfg["url"], "name": server_id}
        session_uuid = cfg.get("headers", {}).get("X-Session-UUID")
        if session_uuid:
            server["authorization_token"] = session_uuid
        servers.append(server)
    return servers


def get_gmail_service():
    if not TOKEN_FILE.exists():
        sys.exit(
            "ERROR: Gmail not authorized. Run gmail_setup.py first."
        )
    token_data = json.loads(TOKEN_FILE.read_text())
    creds = Credentials(
        token=token_data.get("token"),
        refresh_token=token_data["refresh_token"],
        token_uri=token_data["token_uri"],
        client_id=token_data["client_id"],
        client_secret=token_data["client_secret"],
        scopes=token_data["scopes"],
    )
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        token_data["token"] = creds.token
        TOKEN_FILE.write_text(json.dumps(token_data, indent=2))
    return build("gmail", "v1", credentials=creds)


def send_email(service, to: str, subject: str, body: str, sender: str = "me") -> str:
    msg = email_lib.message.EmailMessage()
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    result = service.users().messages().send(
        userId="me", body={"raw": raw}
    ).execute()
    return result.get("id", "")


def run_agent(client: anthropic.Anthropic, mcp_servers: list, already_applied: list) -> dict:
    searches_json = json.dumps(JOB_SEARCHES, indent=2)
    applied_json = json.dumps(already_applied)

    messages = [{
        "role": "user",
        "content": (
            f"Please search for jobs and apply on my behalf.\n\n"
            f"Job searches to run:\n{searches_json}\n\n"
            f"ALREADY_APPLIED_IDS (skip these): {applied_json}"
        )
    }]

    print("Searching for jobs and writing cover letters...", flush=True)

    while True:
        response = client.beta.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=8192,
            system=SYSTEM_PROMPT,
            messages=messages,
            mcp_servers=mcp_servers,
            betas=["mcp-client-2025-04-04"],
        )

        text_content = ""
        tool_uses = []
        for block in response.content:
            if block.type == "text":
                text_content += block.text
            elif hasattr(block, "id") and hasattr(block, "name"):
                tool_uses.append(block)

        if response.stop_reason == "end_turn":
            raw = text_content.strip()
            raw = re.sub(r"^```[a-z]*\n?", "", raw)
            raw = re.sub(r"\n?```$", "", raw)
            try:
                return json.loads(raw)
            except json.JSONDecodeError:
                print(f"WARNING: Could not parse agent response.", flush=True)
                return {"applied_ids": [], "report_entries": []}

        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})
            tool_results = [
                {"type": "tool_result", "tool_use_id": t.id, "content": "Tool executed."}
                for t in tool_uses
            ]
            messages.append({"role": "user", "content": tool_results})
            continue

        break

    return {"applied_ids": [], "report_entries": []}


def write_report(entries: list, date_str: str) -> None:
    sent = sum(1 for e in entries if e.get("sent"))
    manual = len(entries) - sent
    lines = [
        f"# Job Application Report — {date_str}",
        f"## Summary: {len(entries)} jobs | {sent} emails sent | {manual} apply via link",
        "",
    ]
    for e in entries:
        if e.get("sent"):
            status = f"Email sent to {e.get('recipient_email')}"
        else:
            status = f"Apply manually: {e.get('apply_link', 'N/A')}"
        lines += [
            f"### {e.get('title', 'Unknown')} @ {e.get('company', 'Unknown')}",
            f"- **Location:** {e.get('location', 'N/A')}",
            f"- **Status:** {status}",
            f"- **Apply link:** {e.get('apply_link', 'N/A')}",
            "",
            "**Cover letter:**",
            "",
            e.get("cover_letter", ""),
            "",
            "---",
            "",
        ]
    REPORT_FILE.write_text("\n".join(lines))


def main() -> None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        sys.exit("ERROR: ANTHROPIC_API_KEY environment variable is not set.")

    mcp_config = find_mcp_config()
    mcp_servers = build_mcp_servers(mcp_config)
    if not mcp_servers:
        sys.exit("ERROR: Could not find Indeed MCP server in config.")

    gmail = get_gmail_service()

    state = load_state()
    already_applied = state.get("applied_ids", [])
    print(f"Already applied to {len(already_applied)} job(s) in previous runs.", flush=True)

    client = anthropic.Anthropic(api_key=api_key)
    result = run_agent(client, mcp_servers, already_applied)

    new_ids = result.get("applied_ids", [])
    entries = result.get("report_entries", [])

    sent_count = 0
    for entry in entries:
        email = entry.get("recipient_email")
        if email and re.match(r"[^@]+@[^@]+\.[^@]+", email):
            subject = f"Application for {entry['title']} – Amrit Raju"
            try:
                send_email(gmail, email, subject, entry["cover_letter"])
                entry["sent"] = True
                sent_count += 1
                print(f"  Sent → {entry['company']} ({email})", flush=True)
            except Exception as exc:
                entry["sent"] = False
                print(f"  Failed to send to {email}: {exc}", flush=True)
        else:
            entry["sent"] = False

    state["applied_ids"] = list(set(already_applied + new_ids))
    save_state(state)

    date_str = datetime.now().strftime("%Y-%m-%d")
    write_report(entries, date_str)

    manual = len(entries) - sent_count
    print(f"\nDone!")
    print(f"  Jobs processed : {len(entries)}")
    print(f"  Emails sent    : {sent_count}")
    print(f"  Manual apply   : {manual}  (links in report)")
    print(f"  Report saved   : {REPORT_FILE}")


if __name__ == "__main__":
    main()
