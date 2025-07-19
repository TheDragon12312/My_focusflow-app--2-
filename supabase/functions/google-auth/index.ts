// /functions/google-auth/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
// import { OAuth2Client } from "google-auth-library"; // Node.js only

import { OAuth2Client } from "https://esm.sh/google-auth-library@9.0.0"; // Deno-compatible import

const corsHeaders = {                              // ▶ ADD
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization,x-client-info,apikey,content-type",
  "Access-Control-Max-Age": "86400"
};

const oauthClient = new OAuth2Client(
  import.meta.env.VITE_GOOGLE_CLIENT_ID,
  import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  'YOUR_REDIRECT_URI'
);
serve(async (req) => {
  /* ────────────────────────────── 1. handle pre-flight ───────────────────── */
  if (req.method === "OPTIONS") {                  // ▶ ADD
    return new Response("ok", {                    //  any 200/204 is fine
      status: 204,
      headers: corsHeaders
    });
  }

  /* ────────────────────────────── 2. route endpoints ─────────────────────── */
const url  = new URL(req.url);
const path = url.pathname.split("/").filter(Boolean);
if (path[0] === "google-auth") path.shift();
const endpoint = path[0] ?? "login";

if (endpoint === "login") {
  const authUrl = oauthClient.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"],
    prompt: "consent"
  });
  return new Response(JSON.stringify({ authUrl }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" } // ▶ CHANGE
  });
}

  /* …other endpoints that DO need auth… */
});
