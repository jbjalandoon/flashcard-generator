import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "~/server/auth";
import { GoogleLogin } from "./_components/login";
import { MobileMenu } from "./_components/mobile-menu";

export const metadata: Metadata = {
  title: "Free Flashcard Generator",
  description: "Generate flashcards instantly with the help of AI for free.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="dark">
        <TRPCReactProvider>
          <header className="bg-background fixed top-0 z-999 h-22 w-screen border-b-1">
            <nav className="container mx-auto flex h-full w-full justify-between">
              <MobileMenu />
              <div className="hidden h-full items-center gap-5 text-2xl sm:flex">
                <Image
                  src={"/logo.png"}
                  alt={"logo"}
                  width={100}
                  height={100}
                />
                <Link
                  href={"/"}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Home
                </Link>
                <Link
                  href={"/cards"}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Flashcards
                </Link>
              </div>
              <div className="hidden items-center justify-center gap-10 sm:flex">
                {session && (
                  <Link
                    href={"/my-cards"}
                    className="text-muted-foreground hover:text-foreground text-xl"
                  >
                    My Flashcards
                  </Link>
                )}
                <GoogleLogin />
              </div>
            </nav>
          </header>
          <div id="portal"></div>
          <main className="relative flex min-h-screen flex-col pt-30 sm:pt-40">
            <div className="flex justify-center">{children}</div>
            <footer className="mt-auto flex h-14 w-full items-center justify-center">
              <Link href={"/privacy-policy"} className="underline">
                Privacy Policy
              </Link>
            </footer>
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
