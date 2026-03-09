"use client";
import { useState, useEffect } from "react";
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
import DesktopGate from "@/components/DesktopGate";
import Loader from "@/components/Loader";

export default function Home() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMobile) {
    return (
      <LanguageProvider>
        <Loader />
        <LanguageToggle />
        <DesktopGate />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <Loader />
      <LanguageToggle />
      <main className="page-bg">
        <div className="ribbon-wrap">
          <div className="ribbon">
            <Hero />
            <Message />
            <Venue />
            <Timeline />
            <DressCode />
            <Contacts />
            <RSVPForm />
            <Final />
          </div>
        </div>
      </main>
    </LanguageProvider>
  );
}
