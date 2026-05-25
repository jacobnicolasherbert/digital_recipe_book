import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient(
      { cookies },
      { supabaseUrl, supabaseKey }
    );

    const { data } = await supabase.auth.exchangeCodeForSession(code);
    const user = data?.user;

    // Send welcome email only on the very first sign-in (user created < 60s ago)
    if (user?.email) {
      const ageMs = Date.now() - new Date(user.created_at).getTime();
      const isNewUser = ageMs < 60_000;

      if (isNewUser) {
        const name =
          user.user_metadata?.name?.split(" ")[0] ??
          user.email.split("@")[0];

        await resend.emails.send({
          // Replace with your verified Resend domain in production
          from: "The Recipe Book <onboarding@resend.dev>",
          to: user.email,
          subject: "Welcome to The Recipe Book 📖",
          html: welcomeEmail(name),
        }).catch((err) => {
          // Non-fatal — log but don't block the redirect
          console.error("Resend error:", err);
        });
      }
    }
  }

  return NextResponse.redirect(requestUrl.origin);
}

function welcomeEmail(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome</title>
</head>
<body style="margin:0;padding:0;background:#f7f0e6;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f0e6;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(44,31,14,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:#2c1f0e;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#c49a3c;">A collection of cherished dishes</p>
              <h1 style="margin:0;font-size:32px;font-style:italic;color:#f7f0e6;font-weight:700;line-height:1.2;">The Recipe Book</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 16px;font-size:18px;color:#2c1f0e;">Welcome, ${name}!</p>
              <p style="margin:0 0 16px;font-size:15px;color:#5a3e28;line-height:1.7;">
                Your account is all set. The Recipe Book is your personal kitchen companion — a place to collect, organise, and revisit the dishes that matter to you.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#5a3e28;line-height:1.7;">
                Start by adding your first recipe, browse what others have shared, or tag your favourites. Everything you add is saved securely to your account.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#b84c21;border-radius:8px;">
                    <a href="${supabaseUrl.replace("supabase.co", "vercel.app") || "https://your-site.com"}"
                       style="display:inline-block;padding:14px 32px;color:#fff;font-family:sans-serif;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:0.03em;">
                      Open The Recipe Book →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider flourish -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #ede0cc;margin:0;"/>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a08060;font-family:sans-serif;">
                You received this because you signed in with Google. No further emails will be sent.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
