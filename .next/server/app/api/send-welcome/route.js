"use strict";(()=>{var e={};e.id=749,e.ids=[749],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2188:e=>{e.exports=require("prettier/plugins/html")},7413:e=>{e.exports=require("prettier/standalone")},852:e=>{e.exports=require("async_hooks")},6113:e=>{e.exports=require("crypto")},4492:e=>{e.exports=require("node:stream")},2781:e=>{e.exports=require("stream")},3837:e=>{e.exports=require("util")},352:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>f,patchFetch:()=>g,requestAsyncStorage:()=>u,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>h});var o={};r.r(o),r.d(o,{POST:()=>d});var n=r(9303),i=r(8716),s=r(670),a=r(2723),p=r(7070);let l=new a.R(process.env.RESEND_API_KEY);async function d(e){if(!process.env.RESEND_API_KEY||process.env.RESEND_API_KEY.startsWith("your_"))return console.warn("[send-welcome] RESEND_API_KEY not configured — skipping email."),p.NextResponse.json({skipped:!0});try{let{email:t,name:r}=await e.json();return await l.emails.send({from:"The Recipe Book <onboarding@resend.dev>",to:t,subject:"Welcome to The Recipe Book",html:`
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
            <p style="font-size:20px;font-style:italic;color:#2c1f0e;margin:0 0 16px;">Welcome, ${r}!</p>
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
                  <a href="https://digital-recipe-book-g37n.vercel.app"
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
</html>`}),p.NextResponse.json({success:!0})}catch(e){return console.error("[send-welcome] Resend error:",e),p.NextResponse.json({error:e.message},{status:500})}}let c=new n.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/send-welcome/route",pathname:"/api/send-welcome",filename:"route",bundlePath:"app/api/send-welcome/route"},resolvedPagePath:"/workspaces/digital_recipe_book/app/api/send-welcome/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:u,staticGenerationAsyncStorage:h,serverHooks:m}=c,f="/api/send-welcome/route";function g(){return(0,s.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:h})}},9925:e=>{var t=Object.defineProperty,r=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyNames,n=Object.prototype.hasOwnProperty,i={};function s(e){var t;let r=["path"in e&&e.path&&`Path=${e.path}`,"expires"in e&&(e.expires||0===e.expires)&&`Expires=${("number"==typeof e.expires?new Date(e.expires):e.expires).toUTCString()}`,"maxAge"in e&&"number"==typeof e.maxAge&&`Max-Age=${e.maxAge}`,"domain"in e&&e.domain&&`Domain=${e.domain}`,"secure"in e&&e.secure&&"Secure","httpOnly"in e&&e.httpOnly&&"HttpOnly","sameSite"in e&&e.sameSite&&`SameSite=${e.sameSite}`,"partitioned"in e&&e.partitioned&&"Partitioned","priority"in e&&e.priority&&`Priority=${e.priority}`].filter(Boolean),o=`${e.name}=${encodeURIComponent(null!=(t=e.value)?t:"")}`;return 0===r.length?o:`${o}; ${r.join("; ")}`}function a(e){let t=new Map;for(let r of e.split(/; */)){if(!r)continue;let e=r.indexOf("=");if(-1===e){t.set(r,"true");continue}let[o,n]=[r.slice(0,e),r.slice(e+1)];try{t.set(o,decodeURIComponent(null!=n?n:"true"))}catch{}}return t}function p(e){var t,r;if(!e)return;let[[o,n],...i]=a(e),{domain:s,expires:p,httponly:c,maxage:u,path:h,samesite:m,secure:f,partitioned:g,priority:y}=Object.fromEntries(i.map(([e,t])=>[e.toLowerCase(),t]));return function(e){let t={};for(let r in e)e[r]&&(t[r]=e[r]);return t}({name:o,value:decodeURIComponent(n),domain:s,...p&&{expires:new Date(p)},...c&&{httpOnly:!0},..."string"==typeof u&&{maxAge:Number(u)},path:h,...m&&{sameSite:l.includes(t=(t=m).toLowerCase())?t:void 0},...f&&{secure:!0},...y&&{priority:d.includes(r=(r=y).toLowerCase())?r:void 0},...g&&{partitioned:!0}})}((e,r)=>{for(var o in r)t(e,o,{get:r[o],enumerable:!0})})(i,{RequestCookies:()=>c,ResponseCookies:()=>u,parseCookie:()=>a,parseSetCookie:()=>p,stringifyCookie:()=>s}),e.exports=((e,i,s,a)=>{if(i&&"object"==typeof i||"function"==typeof i)for(let s of o(i))n.call(e,s)||void 0===s||t(e,s,{get:()=>i[s],enumerable:!(a=r(i,s))||a.enumerable});return e})(t({},"__esModule",{value:!0}),i);var l=["strict","lax","none"],d=["low","medium","high"],c=class{constructor(e){this._parsed=new Map,this._headers=e;let t=e.get("cookie");if(t)for(let[e,r]of a(t))this._parsed.set(e,{name:e,value:r})}[Symbol.iterator](){return this._parsed[Symbol.iterator]()}get size(){return this._parsed.size}get(...e){let t="string"==typeof e[0]?e[0]:e[0].name;return this._parsed.get(t)}getAll(...e){var t;let r=Array.from(this._parsed);if(!e.length)return r.map(([e,t])=>t);let o="string"==typeof e[0]?e[0]:null==(t=e[0])?void 0:t.name;return r.filter(([e])=>e===o).map(([e,t])=>t)}has(e){return this._parsed.has(e)}set(...e){let[t,r]=1===e.length?[e[0].name,e[0].value]:e,o=this._parsed;return o.set(t,{name:t,value:r}),this._headers.set("cookie",Array.from(o).map(([e,t])=>s(t)).join("; ")),this}delete(e){let t=this._parsed,r=Array.isArray(e)?e.map(e=>t.delete(e)):t.delete(e);return this._headers.set("cookie",Array.from(t).map(([e,t])=>s(t)).join("; ")),r}clear(){return this.delete(Array.from(this._parsed.keys())),this}[Symbol.for("edge-runtime.inspect.custom")](){return`RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`}toString(){return[...this._parsed.values()].map(e=>`${e.name}=${encodeURIComponent(e.value)}`).join("; ")}},u=class{constructor(e){var t,r,o;this._parsed=new Map,this._headers=e;let n=null!=(o=null!=(r=null==(t=e.getSetCookie)?void 0:t.call(e))?r:e.get("set-cookie"))?o:[];for(let e of Array.isArray(n)?n:function(e){if(!e)return[];var t,r,o,n,i,s=[],a=0;function p(){for(;a<e.length&&/\s/.test(e.charAt(a));)a+=1;return a<e.length}for(;a<e.length;){for(t=a,i=!1;p();)if(","===(r=e.charAt(a))){for(o=a,a+=1,p(),n=a;a<e.length&&"="!==(r=e.charAt(a))&&";"!==r&&","!==r;)a+=1;a<e.length&&"="===e.charAt(a)?(i=!0,a=n,s.push(e.substring(t,o)),t=a):a=o+1}else a+=1;(!i||a>=e.length)&&s.push(e.substring(t,e.length))}return s}(n)){let t=p(e);t&&this._parsed.set(t.name,t)}}get(...e){let t="string"==typeof e[0]?e[0]:e[0].name;return this._parsed.get(t)}getAll(...e){var t;let r=Array.from(this._parsed.values());if(!e.length)return r;let o="string"==typeof e[0]?e[0]:null==(t=e[0])?void 0:t.name;return r.filter(e=>e.name===o)}has(e){return this._parsed.has(e)}set(...e){let[t,r,o]=1===e.length?[e[0].name,e[0].value,e[0]]:e,n=this._parsed;return n.set(t,function(e={name:"",value:""}){return"number"==typeof e.expires&&(e.expires=new Date(e.expires)),e.maxAge&&(e.expires=new Date(Date.now()+1e3*e.maxAge)),(null===e.path||void 0===e.path)&&(e.path="/"),e}({name:t,value:r,...o})),function(e,t){for(let[,r]of(t.delete("set-cookie"),e)){let e=s(r);t.append("set-cookie",e)}}(n,this._headers),this}delete(...e){let[t,r,o]="string"==typeof e[0]?[e[0]]:[e[0].name,e[0].path,e[0].domain];return this.set({name:t,path:r,domain:o,value:"",expires:new Date(0)})}[Symbol.for("edge-runtime.inspect.custom")](){return`ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`}toString(){return[...this._parsed.values()].map(s).join("; ")}}},2044:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{RequestCookies:function(){return o.RequestCookies},ResponseCookies:function(){return o.ResponseCookies}});let o=r(9925)}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[948,438],()=>r(352));module.exports=o})();