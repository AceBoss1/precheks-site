import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { isAdminEmail } from "./admin";

// Server-only. Set FIREBASE_SERVICE_ACCOUNT_JSON to the full service-account
// JSON (Firebase Console → Project settings → Service accounts).
function adminApp() {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not set");
  return initializeApp({ credential: cert(JSON.parse(raw)) });
}

export const adminDb = () => getFirestore(adminApp());

/** Returns the admin's email if the request carries a valid admin ID token. */
export async function requireAdmin(req: Request): Promise<string | null> {
  const token = req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token) return null;
  try {
    const decoded = await getAuth(adminApp()).verifyIdToken(token);
    return isAdminEmail(decoded.email) ? decoded.email! : null;
  } catch {
    return null;
  }
}
