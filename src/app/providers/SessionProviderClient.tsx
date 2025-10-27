// app/providers/SessionProviderClient.tsx
"use client";

import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
  session?: any;
}

export default function SessionProviderClient({ children, session }: Props) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
