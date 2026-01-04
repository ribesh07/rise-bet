"use client";
import { useEffect } from "react";

export default function TelegramRedirect() {
  useEffect(() => {
    // Replace with your Telegram group link
    window.location.href = "https://t.me/bcgame";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
        <h1 className="text-xl font-semibold mb-2">Redirecting to Telegram</h1>
        <p className="text-gray-600">
          If you are not redirected automatically,{' '}
          <a
            href="https://t.me/bcgame"
            className="text-blue-600 underline"
          >
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
