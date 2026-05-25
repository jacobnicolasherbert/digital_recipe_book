import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  // If no API key is configured, skip silently (useful during local dev)
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith("your_")) {
    console.warn("[send-welcome] RESEND_API_KEY not configured — skipping email.");
    return NextResponse.json({ skipped: true });
  }

  try {
    const { email, name } = await request.json();

    await resend.emails.send({
      // Replace with your verified Resend domain in production.
      // "onboarding@resend.dev" works for the single verified address on Resend's free plan.
      from: "The Recipe Book <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to The Recipe Book",
      html: buildWelcomeEmail(name),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[send-welcome] Resend error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function buildWelcomeEmail(name: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-site.com";
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f7f0e6;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f0e6;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
        style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(44,31,14,.12);max-width:600px;width:100%;">
        <tr>
          <td style="background:#2c1f0e;padding:32px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-family:sans-serif;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#c49a3c;">
              A collection of cherished dishes
            </p>
            <h1 style="margin:0;font-style:italic;font-size:36px;color:#f7f0e6;line-height:1.15;">
              The Recipe Book
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-top:1px solid #ede0cc;"></td>
                <td style="padding:12px 16px;color:#c49a3c;font-size:14px;white-space:nowrap;text-align:center;">✦</td>
                <td style="border-top:1px solid #ede0cc;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 40px 32px;">
            <p style="font-size:20px;font-style:italic;color:#2c1f0e;margin:0 0 16px;">Welcome, ${name}!</p>
            <p style="font-size:15px;color:#5a3e28;line-height:1.8;margin:0 0 16px;">
              You've just joined <strong>The Recipe Book</strong> — a place to collect, share, and celebrate
              the recipes that matter most.
            </p>
            <p style="font-size:15px;color:#5a3e28;line-height:1.8;margin:0 0 28px;">
              Whether it's a dish passed down through generations or something you invented last Tuesday,
              your recipes have a home here. Start by adding your first recipe, or browse what others have shared.
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#b84c21;border-radius:8px;">
                  <a href="${siteUrl}"
                    style="display:inline-block;padding:12px 28px;color:#fff;font-family:sans-serif;
                           font-size:14px;font-weight:500;letter-spacing:.04em;text-decoration:none;">
                    Open my cookbook →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f7f0e6;padding:20px 40px;border-top:1px solid #ede0cc;text-align:center;">
            <p style="margin:0;font-family:sans-serif;font-size:11px;color:#5a3e28;letter-spacing:.04em;">
              Made with care &amp; good ingredients.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
