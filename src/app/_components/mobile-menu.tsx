"use client";

import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { GoogleLogin } from "./login";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const session = useSession();

  return (
    <>
      <div className="flex h-full items-center pl-10 sm:hidden">
        <button
          className="text-4xl"
          onClick={() => {
            setOpen(true);
          }}
        >
          <GiHamburgerMenu />
        </button>
      </div>
      {open && (
        <div className="absolute z-1001 h-screen w-full sm:hidden">
          <div
            className={`absolute z-1002 h-full w-full bg-gray-800/50`}
            onClick={() => {
              setOpen(false);
            }}
          ></div>
          <div
            className={`bg-background fixed z-1003 flex h-full w-full flex-col items-center justify-between gap-4 py-5 text-lg transition-all duration-600 ${open ? "left-0" : "-left-full"}`}
          >
            <div className="flex flex-col items-center gap-4">
              <Image src={"/logo.png"} alt={"logo"} width={100} height={100} />
              <Link
                href={"/"}
                className="text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Home
              </Link>
              <Link
                href={"/cards"}
                className="text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Flashcards
              </Link>
              {session && (
                <Link
                  href={"/my-cards"}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  My Flashcards
                </Link>
              )}
            </div>
            <div className="py-auto self-center">
              <GoogleLogin />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
