"use client";

import Link from "next/link";
import { useState } from "react";
import type { AuthUser } from "@/lib/auth";

type HeaderClientProps = {
  user: AuthUser | null;
  logoutAction: () => Promise<void>;
};

export default function HeaderClient({ user, logoutAction }: HeaderClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  const authLinks = user ? (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
      <Link
        href="/dashboard"
        className="font-medium transition-colors hover:text-blue-100"
        onClick={() => setIsOpen(false)}
      >
        Dashboard
      </Link>
      <span className="text-sm font-medium text-blue-50">
        {user.name} <span className="text-blue-200">({user.email})</span>
      </span>
      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-lg bg-white px-4 py-2 font-medium text-blue-700 transition-colors hover:bg-blue-50"
        >
          Logout
        </button>
      </form>
    </div>
  ) : (
    <>
      <Link
        href="/login"
        className="font-medium transition-colors hover:text-blue-100"
        onClick={() => setIsOpen(false)}
      >
        Login
      </Link>
      <Link
        href="/register"
        className="rounded-lg bg-white px-4 py-2 text-center font-medium text-blue-700 transition-colors hover:bg-blue-50"
        onClick={() => setIsOpen(false)}
      >
        Register
      </Link>
    </>
  );

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="flex items-center justify-between px-4 py-4 md:px-8">
        <Link
          href="/"
          className="text-2xl font-bold transition-colors hover:text-blue-100"
        >
          Soccer Planner
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="font-medium transition-colors hover:text-blue-100"
          >
            Home
          </Link>
          {authLinks}
        </div>

        <button
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span
            className={`h-0.5 w-6 bg-white transition-all ${
              isOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all ${
              isOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {isOpen && (
        <div className="space-y-3 bg-blue-700 px-4 py-4 md:hidden">
          <Link
            href="/"
            className="block py-2 font-medium transition-colors hover:text-blue-100"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="block py-2 font-medium transition-colors hover:text-blue-100"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          )}
          <div className="flex flex-col gap-3">{authLinks}</div>
        </div>
      )}
    </header>
  );
}
