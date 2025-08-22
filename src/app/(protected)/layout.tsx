"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/layout/sidebar";
import { Loader2 } from "lucide-react";
import { BrainIcon } from "@/components/shared/icons";

function ProtectedLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <BrainIcon className="h-12 w-12 text-primary animate-pulse" />
            <p className="text-muted-foreground">正在加载您的学习空间...</p>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            {children}
        </div>
      </main>
    </div>
  );
}


export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
        </AuthProvider>
    );
}
