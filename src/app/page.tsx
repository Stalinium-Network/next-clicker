"use client";
import AuthModal from "@/components/modals/auth/auth";

export default function Home() {
  window.url = 'http://localhost:3001';
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <AuthModal />
    </main>
  );
}
