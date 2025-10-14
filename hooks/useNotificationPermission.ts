// hooks/useNotificationPermission.ts

"use client";

import { useEffect, useState } from "react";

const useNotificationPermissionStatus = () => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    const updatePermission = () => setPermission(Notification.permission);

    // Initial check and request permission
    updatePermission();
    Notification.requestPermission().then(updatePermission);

    // Listen for changes in notification permission status (if supported by browser)
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "notifications" })
        .then((notificationPerm) => {
          notificationPerm.onchange = updatePermission;
        });
    }
  }, []);

  return permission;
};

export default useNotificationPermissionStatus;
