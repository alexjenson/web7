#!/usr/bin/env python3
"""
One-time Gmail OAuth setup.

Run this once to authorize the app and save a token that apply_jobs.py
will use to send emails automatically on every future run.

Steps:
  1. Go to https://console.cloud.google.com
  2. Create a project → Enable Gmail API
  3. Credentials → Create OAuth 2.0 Client ID (Desktop app)
  4. Download the JSON → save as gmail_credentials.json next to this file
  5. Run:  python gmail_setup.py
  6. A browser tab opens — sign in and click Allow
  7. Token saved to .gmail_token.json — you're done
"""

import json
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]
CREDS_FILE = Path(__file__).parent / "gmail_credentials.json"
TOKEN_FILE = Path(__file__).parent / ".gmail_token.json"


def main():
    if not CREDS_FILE.exists():
        print(f"ERROR: {CREDS_FILE} not found.")
        print("Download your OAuth 2.0 credentials from Google Cloud Console")
        print("and save them as gmail_credentials.json next to this script.")
        return

    flow = InstalledAppFlow.from_client_secrets_file(str(CREDS_FILE), SCOPES)
    creds = flow.run_local_server(port=0)

    token_data = {
        "token": creds.token,
        "refresh_token": creds.refresh_token,
        "token_uri": creds.token_uri,
        "client_id": creds.client_id,
        "client_secret": creds.client_secret,
        "scopes": list(creds.scopes),
    }
    TOKEN_FILE.write_text(json.dumps(token_data, indent=2))
    print(f"\nAuthorization complete. Token saved to {TOKEN_FILE}")
    print("You can now run apply_jobs.py — emails will be sent automatically.")


if __name__ == "__main__":
    main()
