const VALID_USERNAME = /^[a-zA-Z0-9._]{1,30}$/;

export function parseUsername(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  let username = trimmed;

  if (trimmed.includes("instagram.com/")) {
    const match = trimmed.match(/instagram\.com\/([a-zA-Z0-9._]{1,30})/);
    username = match?.[1] ?? "";
  } else if (trimmed.startsWith("@")) {
    username = trimmed.slice(1);
  }

  return VALID_USERNAME.test(username) ? username : null;
}
