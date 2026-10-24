import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function FinanceAccessLink() {
  const [signedIn, setSignedIn] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);
  return <span className="flex items-center gap-2"><Button asChild variant="secondary" size="sm"><Link to="/auth">{signedIn ? "Open finance" : "Finance sign-in"}</Link></Button>{signedIn && <Button variant="secondary" size="icon" aria-label="Sign out" title="Sign out" onClick={async () => { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); await navigate({ to: "/auth", replace: true }); }}><LogOut /></Button>}</span>;
}