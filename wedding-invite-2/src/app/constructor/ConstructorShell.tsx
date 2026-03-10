"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const ADMIN_KEY = "wedding_admin";

const InviteConstructor = dynamic(
  () => import("@/components/builder/InviteConstructor"),
  { ssr: false }
);

export default function ConstructorShell() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const adminParam = searchParams.get("admin");

  useEffect(() => {
    if (adminParam === "1") {
      localStorage.setItem(ADMIN_KEY, "1");
      return;
    }

    if (adminParam === "0") {
      localStorage.removeItem(ADMIN_KEY);
    }
  }, [adminParam]);

  const authorized =
    adminParam === "1"
      ? true
      : adminParam === "0"
        ? false
        : typeof window !== "undefined" && localStorage.getItem(ADMIN_KEY) === "1";

  useEffect(() => {
    if (!authorized) {
      router.replace("/");
    }
  }, [authorized, router]);

  if (!authorized) return null;

  return (
    <LanguageProvider>
      <LanguageToggle />
      <InviteConstructor />
    </LanguageProvider>
  );
}

