"use client";

import dynamic from "next/dynamic";
import { LanguageProvider } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const InviteConstructor = dynamic(
  () => import("@/components/builder/InviteConstructor"),
  { ssr: false }
);

export default function ConstructorShell() {
  return (
    <LanguageProvider>
      <LanguageToggle />
      <InviteConstructor />
    </LanguageProvider>
  );
}
