"use client";

import { useState, useEffect, useCallback } from "react";

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const isSupported = "Notification" in window;
    setSupported(isSupported);
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!supported) return "denied" as NotificationPermission;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, [supported]);

  const sendNotification = useCallback(
    (options: NotificationOptions) => {
      if (!supported || permission !== "granted") return null;
      try {
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon ?? "/icons/icon-192.png",
          badge: options.badge ?? "/icons/icon-192.png",
          tag: options.tag,
          data: options.data,
        });
        return notification;
      } catch (e) {
        return null;
      }
    },
    [supported, permission]
  );

  // Schedule a notification for a future time
  const scheduleReminder = useCallback(
    (options: NotificationOptions, triggerAt: Date) => {
      const delay = triggerAt.getTime() - Date.now();
      if (delay <= 0) return null;
      const timeoutId = setTimeout(() => {
        sendNotification(options);
      }, delay);
      return timeoutId;
    },
    [sendNotification]
  );

  // Schedule session reminders (24h + 15min before)
  const scheduleSessionReminders = useCallback(
    (sessionTitle: string, sessionStart: Date, opponent?: string) => {
      const timeouts: ReturnType<typeof setTimeout>[] = [];

      // 24h before
      const t24h = new Date(sessionStart.getTime() - 24 * 60 * 60 * 1000);
      if (t24h.getTime() > Date.now()) {
        const id = scheduleReminder(
          {
            title: "Session Tomorrow",
            body: `Your moot "${sessionTitle}"${opponent ? ` vs ${opponent}` : ""} is tomorrow.`,
            tag: `session-24h-${sessionStart.getTime()}`,
          },
          t24h
        );
        if (id) timeouts.push(id);
      }

      // 15min before
      const t15m = new Date(sessionStart.getTime() - 15 * 60 * 1000);
      if (t15m.getTime() > Date.now()) {
        const id = scheduleReminder(
          {
            title: "Session Starting Soon",
            body: `Your moot "${sessionTitle}" starts in 15 minutes. Time to prepare.`,
            tag: `session-15m-${sessionStart.getTime()}`,
          },
          t15m
        );
        if (id) timeouts.push(id);
      }

      // 2min before
      const t2m = new Date(sessionStart.getTime() - 2 * 60 * 1000);
      if (t2m.getTime() > Date.now()) {
        const id = scheduleReminder(
          {
            title: "Enter Chambers Now",
            body: `Your moot "${sessionTitle}" begins in 2 minutes. Join the lobby now.`,
            tag: `session-2m-${sessionStart.getTime()}`,
          },
          t2m
        );
        if (id) timeouts.push(id);
      }

      return () => timeouts.forEach(clearTimeout);
    },
    [scheduleReminder]
  );

  return {
    supported,
    permission,
    requestPermission,
    sendNotification,
    scheduleReminder,
    scheduleSessionReminders,
  };
}
