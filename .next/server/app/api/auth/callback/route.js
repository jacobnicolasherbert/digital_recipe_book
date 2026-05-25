"use strict";(()=>{var e={};e.id=292,e.ids=[292],e.modules={2934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2188:e=>{e.exports=require("prettier/plugins/html")},7413:e=>{e.exports=require("prettier/standalone")},852:e=>{e.exports=require("async_hooks")},4300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},4492:e=>{e.exports=require("node:stream")},2781:e=>{e.exports=require("stream")},3837:e=>{e.exports=require("util")},19:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>b,patchFetch:()=>y,requestAsyncStorage:()=>x,routeModule:()=>g,serverHooks:()=>f,staticGenerationAsyncStorage:()=>m});var a={};r.r(a),r.d(a,{GET:()=>h});var o=r(9303),i=r(8716),s=r(670),n=r(344),l=r(1615),p=r(7070),c=r(2723);let d="https://hgebyvbifmgorfkcnzfl.supabase.co",u=new c.R(process.env.RESEND_API_KEY);async function h(e){let t=new URL(e.url),r=t.searchParams.get("code");if(r){let e=(0,n.createRouteHandlerClient)({cookies:l.cookies},{supabaseUrl:d,supabaseKey:"sb_publishable_lGGQZ5rkUlb25jH6m7ZI0g_3-JOJqtx"}),{data:t}=await e.auth.exchangeCodeForSession(r),a=t?.user;if(a?.email&&Date.now()-new Date(a.created_at).getTime()<6e4){let e=a.user_metadata?.name?.split(" ")[0]??a.email.split("@")[0];await u.emails.send({from:"The Recipe Book <onboarding@resend.dev>",to:a.email,subject:"Welcome to The Recipe Book \uD83D\uDCD6",html:`<!DOCTYPE html>
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
              <p style="margin:0 0 16px;font-size:18px;color:#2c1f0e;">Welcome, ${e}!</p>
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
                    <a href="${d.replace("supabase.co","vercel.app")||"https://your-site.com"}"
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
</html>`}).catch(e=>{console.error("Resend error:",e)})}}return p.NextResponse.redirect(t.origin)}let g=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/auth/callback/route",pathname:"/api/auth/callback",filename:"route",bundlePath:"app/api/auth/callback/route"},resolvedPagePath:"/workspaces/digital_recipe_book/app/api/auth/callback/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:x,staticGenerationAsyncStorage:m,serverHooks:f}=g,b="/api/auth/callback/route";function y(){return(0,s.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:m})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[948,958,438],()=>r(19));module.exports=a})();