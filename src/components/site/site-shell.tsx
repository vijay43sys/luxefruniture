import type { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { WhatsappFloat } from "./whatsapp-float";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}
