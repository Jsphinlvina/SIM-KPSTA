"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleGuard({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentRole = localStorage.getItem("role");
    if (!token || currentRole !== role) {
      router.replace("/login");
      return;
    }
    setAllowed(true);
  }, [role, router]);

  if (!allowed) return null;
  return <>{children}</>;
}
