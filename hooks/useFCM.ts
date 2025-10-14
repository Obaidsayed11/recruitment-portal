import { useEffect, useState } from "react";

import { messaging } from "../firebase/firebase";
import { MessagePayload, onMessage } from "firebase/messaging";
import { toast } from "sonner";
import useFcmToken from "./useFCMToken";

const useFCM = () => {
  const fcmToken = useFcmToken();
  const [messages, setMessages] = useState<MessagePayload[]>([]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, [fcmToken]);
  return { fcmToken, messages };
};

export default useFCM;
