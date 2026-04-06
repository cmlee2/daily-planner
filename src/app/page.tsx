"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { todayString } from "@/lib/dates";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/day/${todayString()}`);
  }, [router]);

  return null;
}
