"use client";
import { LanguageProvider } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import Hero from "@/components/Hero";
import Message from "@/components/Message";
import Venue from "@/components/Venue";
import Timeline from "@/components/Timeline";
import DressCode from "@/components/DressCode";
import RSVPForm from "@/components/RSVPForm";
import Contacts from "@/components/Contacts";
import Final from "@/components/Final";

export default function Home() {
  return (
    <LanguageProvider>
      <LanguageToggle />
      <main style={{ overflowX: "hidden" }}>
        <Hero />
        <Message />
        <Venue />
        <Timeline />
        <DressCode />
        <RSVPForm />
        <Contacts />
        <Final />
      </main>
    </LanguageProvider>
  );
}
