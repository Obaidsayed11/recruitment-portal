"use client";
import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import firebaseApp from "../firebase/firebase";

// Helper function to get and set cookies
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
};

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
};

const useFcmToken = () => {
  const [token, setToken] = useState<string>("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<NotificationPermission>("default");
  const [soundAllowed, setSoundAllowed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSoundAllowed(localStorage.getItem("soundAllowed") === "true");
    }
  }, []); // checks if soundAllowed was saved in localStorage before.

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          const existingToken = getCookie("fcm_token"); // Check if token exists in cookies

          if (existingToken) {
            console.log("Using existing FCM token from cookies.");
            setToken(existingToken);
            return; // Skip generating a new token
          }

          const messaging = getMessaging(firebaseApp);

          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          if (
            permission === "granted" &&
            localStorage.getItem("soundAllowed") === null
          ) {
            const allowSound = confirm(
              "Would you like to enable sound for notifications?"
            );
            if (allowSound) {
              localStorage.setItem("soundAllowed", "true");
              setSoundAllowed(true);
            }
          }

          if (permission === "granted") {
            const newToken = await getToken(messaging, {
              vapidKey:
                "BE1__AqmKVesKMjQVXfCL92sgLc653Dj8ycLrT0jAycZon8RQQvgNKlvZz5LgEhUQYhxaS0zkt725357-Hh1244",
            });

            if (newToken) {
              setToken(newToken);
              setCookie("fcm_token", newToken, 30); // Store token in cookies for 30 days
            } else {
              console.log("No registration token available.");
            }
          }
        }
      } catch (error) {
        console.log("An error occurred while retrieving token:", error);
      }
    };

    retrieveToken();
  }, []);

  // Function to send FCM token to backend

  return { fcmToken: token, notificationPermissionStatus, soundAllowed };
};

export default useFcmToken;
