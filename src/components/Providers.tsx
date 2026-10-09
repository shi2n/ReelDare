"use client";

import { UserProvider } from "@/lib/user";
import XPToast from "@/components/XPToast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {children}
      <XPToast />
    </UserProvider>
  );
}
