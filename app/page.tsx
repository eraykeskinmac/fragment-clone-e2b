"use client";

import { AuthDialog } from "@/components/auth-dialog";
import { Navbar } from "@/components/navbar";
import { AuthViewType, useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isAuthDialogOpen, setAuthDialog] = useState(false);
  const [authView, setAuthView] = useState<AuthViewType>("sign_in");
  const { session } = useAuth(setAuthDialog, setAuthView);

  function logout() {
    supabase ? supabase.auth.signOut() : console.warn("supabase not loaded");
  }

  return (
    <main className="flex min-h-screen max-h-screen">
      {supabase && (
        <AuthDialog
          open={isAuthDialogOpen}
          setOpen={setAuthDialog}
          view={authView}
          supabase={supabase}
        />
      )}
      <div className="grid w-full md:grid-cols-2">
        <div>
          <Navbar
            session={session}
            showLogin={() => setAuthDialog(true)}
            signOut={logout}
          />
        </div>
      </div>
    </main>
  );
}
