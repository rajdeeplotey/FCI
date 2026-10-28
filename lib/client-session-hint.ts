// Non-secret, JS-readable companion to the HttpOnly portal session cookie. It
// only tells the marketing header that a client is probably signed in, so the
// Login link can go straight to /portal instead of bouncing through /login.
// The real session is always verified server-side.
export const CLIENT_SESSION_HINT_COOKIE = "fci_client_signed_in";

export function clientSessionHintCookie(signedIn: boolean, secure: boolean) {
  return `${CLIENT_SESSION_HINT_COOKIE}=${signedIn ? "1" : ""}; Path=/; SameSite=Lax; Max-Age=${signedIn ? 43200 : 0}${secure ? "; Secure" : ""}`;
}

export function hasClientSessionHint() {
  return typeof document !== "undefined" &&
    document.cookie.split("; ").includes(`${CLIENT_SESSION_HINT_COOKIE}=1`);
}

export function setClientSessionHint() {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CLIENT_SESSION_HINT_COOKIE}=1; Path=/; SameSite=Lax; Max-Age=43200${secure}`;
}

export function clearClientSessionHint() {
  if (typeof document === "undefined") return;
  document.cookie = `${CLIENT_SESSION_HINT_COOKIE}=; Path=/; SameSite=Lax; Max-Age=0`;
}
