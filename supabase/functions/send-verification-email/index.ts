import { serve } from "std/http/server.ts";
import { Resend } from "resend";

// Add type declaration for Deno
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  confirmationUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl }: VerificationEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "FocusFlow <onboarding@resend.dev>",
      to: [email],
      subject: "Bevestig je FocusFlow account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welkom bij FocusFlow! 🎯</h1>
          <p>Bedankt voor het aanmelden bij FocusFlow. Klik op de knop hieronder om je account te bevestigen:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Account Bevestigen
            </a>
          </div>
          <p>Of kopieer en plak deze link in je browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${confirmationUrl}</p>
          <p style="margin-top: 30px; color: #6b7280; font-size: 12px;">
            Als je dit account niet hebt aangemaakt, kun je deze email negeren.
          </p>
        </div>
      `,
    });

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
