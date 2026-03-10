"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const ADMIN_KEY = "wedding_admin";

const InviteConstructor = dynamic(
  () => import("@/components/builder/InviteConstructor"),
  { ssr: false }
);

export default function ConstructorShell() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const adminParam = searchParams.get("admin");
    if (adminParam === "1") {
      localStorage.setItem(ADMIN_KEY, "1");
    }
    setAuthorized(localStorage.getItem(ADMIN_KEY) === "1");
  }, [searchParams]);

  // Loading state
  if (authorized === null) return null;

  // Not admin — redirect to home
  if (!authorized) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }

  return (
    <LanguageProvider>
      <LanguageToggle />
      <InviteConstructor />
    </LanguageProvider>
  );
}
