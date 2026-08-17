"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  Notification,
} from "@/lib/notifications";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell({ uid }: { uid: string }) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUnreadCount(uid).then(setUnread);
    // light polling so the badge updates without a full page reload
    const interval = setInterval(() => {
      getUnreadCount(uid).then(setUnread);
    }, 60000);
    return () => clearInterval(interval);
  }, [uid]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (next && notifications === null) {
      setNotifications(await getNotifications(uid, 20));
    }
  }

  async function handleNotificationClick(n: Notification) {
    if (!n.read) {
      await markAsRead(n.id);
      setUnread((c) => Math.max(0, c - 1));
      setNotifications((prev) =>
        prev ? prev.map((p) => (p.id === n.id ? { ...p, read: true } : p)) : prev
      );
    }
    setOpen(false);
  }

  async function handleMarkAllRead() {
    await markAllAsRead(uid);
    setUnread(0);
    setNotifications((prev) =>
      prev ? prev.map((p) => ({ ...p, read: true })) : prev
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative text-ink hover:text-gold-deep transition-colors"
      >
        <span className="text-lg leading-none">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-gold text-ink text-[10px] font-mono font-semibold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 border border-rule bg-card shadow-lg z-20">
          <div className="flex items-center justify-between px-4 py-3 border-b border-rule">
            <p className="font-ui text-sm font-semibold text-ink">
              Notifications
            </p>
            {unread > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="font-mono text-[10px] uppercase tracking-wide text-gold-deep hover:text-ink"
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications === null ? (
            <p className="px-4 py-6 text-sm text-slate text-center">
              Loading…
            </p>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate text-center">
              Nothing yet.
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-rule">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link}
                  onClick={() => handleNotificationClick(n)}
                  className={`block px-4 py-3 text-sm hover:bg-paper transition-colors ${
                    n.read ? "text-slate" : "text-ink bg-gold/5"
                  }`}
                >
                  <p className={n.read ? "" : "font-semibold"}>{n.message}</p>
                  <p className="text-xs text-slate mt-1 font-mono">
                    {timeAgo(n.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
