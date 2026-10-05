import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/firebase-admin";
import { getEarnings, listBookings, listOrders, NotesAppError } from "@/lib/notesapp";

export const runtime = "nodejs";

// Admin-only snapshot of bookings, orders, digital sales and earnings.
export async function GET(req: Request) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const [bookings, orders, digital, earnings] = await Promise.all([
      listBookings("?limit=25"),
      listOrders("?limit=25"),
      listOrders("?kind=digital&limit=25"),
      getEarnings("?limit=25"),
    ]);
    return NextResponse.json({ bookings, orders, digital, earnings });
  } catch (e) {
    if (e instanceof NotesAppError) {
      return NextResponse.json({ error: e.code, message: e.message }, { status: 502 });
    }
    throw e;
  }
}
