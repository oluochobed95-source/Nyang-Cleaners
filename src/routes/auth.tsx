import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/Mascot";
import { financeAccess } from "@/lib/finance.functions";
import "@lovable.dev/cloud-auth-js/styles.css";

export const Route = createFileRoute("/auth")({ head: () => ({ meta: [
  { title: "Finance sign-in | Nyang Cleaners" }, { name: "description", content: "Secure sign-in for the Nyang Cleaners financial dashboard." },
  { property: "og:title", content: "Nyang Cleaners finance sign-in" }, { property: "og:description", content: "Private financial management for Nyang Cleaners." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
] }), component: Auth });
function Auth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user))); }, []);
  async function proceed() {
    setBusy(true); setError("");
    try { if (!await financeAccess()) { setSignedIn(true); setError("This account does not have finance access. Sign in with the approved owner account."); return; } await router.navigate({ to: "/admin/finance" }); }
    catch (e) { setError(e instanceof Error ? e.message : "Sign-in could not be completed."); }
    finally { setBusy(false); }
  }
  async function signIn(provider: "google" | "lovable") {
    setBusy(true); setError("");
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}/auth` });
    if (result.error) { setError(result.error.message); setBusy(false); return; }
    if (result.redirected) return;
    setSignedIn(true); await proceed();
  }
  async function signOut() { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); setSignedIn(false); setError(""); }
  return <main className="min-h-screen bg-background font-sans"><header className="border-b px-5 py-4"><Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary"><Mascot simple className="size-9" />Nyang Cleaners</Link></header><section className="mx-auto max-w-md px-5 py-20"><ShieldCheck className="size-10 text-primary" /><h1 className="mt-5 font-display text-3xl font-bold">Financial management</h1><p className="mt-2 text-muted-foreground">Private access for the Nyang Cleaners finance team.</p><div className="mt-8 grid gap-3">{signedIn ? <><Button disabled={busy} onClick={proceed}>Open finance dashboard</Button><Button variant="outline" onClick={signOut}>Use another account</Button></> : <><Button variant="outline" className="h-11" disabled={busy} onClick={() => signIn("google")}>Sign in with Google</Button><Button className="lovable-auth-button h-11" disabled={busy} onClick={() => signIn("lovable")}>Sign in with Lovable</Button></>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div></section></main>;
}