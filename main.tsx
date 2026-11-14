import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Home from "@/components/Home";
import LoginForm from "@/components/LoginForm";
import UsernameForm from "@/components/UsernameForm";
import EditForm from "@/components/EditForm";
import Portfolio, { type PublicProfile } from "@/components/Portfolio";
import { browserClient, configured } from "@/lib/supabase/browser";
import { confirmSignIn } from "@/lib/auth-confirmation";
import { emptyProfile, profileValues, usernameSchema } from "@/lib/validation";
import { routePath, appPath } from "@/lib/paths";
import { uz } from "@/lib/text";
import Link from "@/lib/navigation";
import "@/styles.css";

function App() {
  const [path, setPath] = useState(() => routePath(location.pathname));
  const [session, setSession] = useState<{id:string}|null>(null);
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<PublicProfile|null>(null);
  const [status, setStatus] = useState("");
  useEffect(() => {
    const change = () => setPath(routePath(location.pathname));
    addEventListener("popstate", change);
    const init = async () => {
      if (path.startsWith("/auth/")) {
        const ok = configured() && await confirmSignIn(new URLSearchParams(location.search), browserClient().auth);
        location.replace(appPath(ok ? "/" : "/login")); return;
      }
      if (!configured()) return;
      const {data} = await browserClient().auth.getUser();
      const user = data.user;
      setSession(user ? {id:user.id} : null); setUserId(user?.id ?? "");
      setProfile(null);
      const routeName = path.startsWith("/") ? path.slice(1) : "";
      if (routeName && usernameSchema.safeParse(routeName).success && !["login","edit","onboarding"].includes(routeName)) {
        const {data: row} = await browserClient().from("profiles").select("*").eq("username", routeName).maybeSingle();
        if (row) setProfile({id:row.user_id,username:row.username,...profileValues(row)});
        else setStatus(uz.notFound);
        return;
      }
      if (user) {
        const {data: row} = await browserClient().from("profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (row) setProfile({id:row.user_id,username:row.username,...profileValues(row)});
      }
    };
    void init();
    return () => removeEventListener("popstate", change);
  }, [path]);
  useEffect(() => {
    if (profile) { document.title = [profile.full_name || profile.username, profile.headline].filter(Boolean).join(" — "); const desc=document.querySelector('meta[name="description"]'); desc?.setAttribute("content",profile.bio); }
  },[profile]);
  const errorPage = (message:string) => <main className="shell py-24"><h1 className="text-3xl font-bold">{message}</h1><Link className="btn mt-8" href="/">{uz.home}</Link></main>;
  if (!configured()) return errorPage(uz.setup);
  if (path === "/") return <Home/>;
  if (path === "/login") return <main className="shell max-w-lg py-20"><Link className="font-bold" href="/">Portfolio</Link><h1 className="mb-8 mt-12 text-3xl font-semibold">{uz.login}</h1><LoginForm/></main>;
  if (path === "/onboarding") return <main className="shell max-w-lg py-20"><h1 className="mb-8 text-3xl font-semibold">{uz.choose}</h1>{session ? profile ? <p>{uz.edit}</p> : <UsernameForm/> : <Link className="btn" href="/login">{uz.login}</Link>}</main>;
  if (path === "/edit") return <main className="shell max-w-3xl py-10">{session ? profile ? <EditForm initial={profile} username={profile.username} userId={userId}/> : <UsernameForm/> : <Link className="btn" href="/login">{uz.login}</Link>}</main>;
  const username = path.slice(1);
  if (!usernameSchema.safeParse(username).success) return errorPage(uz.notFound);
  if (!profile || profile.username !== username) return errorPage(status || uz.loadError);
  return <Portfolio profile={profile} user={session}/>;
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
