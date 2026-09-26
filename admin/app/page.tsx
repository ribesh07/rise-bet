"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/hooks/useAuth";

export default function HomeLanding() {
  const router = useRouter();

  useEffect(() => {
    router.replace(
      isAuthenticated() ? "/dashboard" : "/login"
    );
  }, [router]);

  return null;
}
