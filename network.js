(function(root){'use strict';
let session=null,loaded=false;const cfg=root.SOUVERAIN_CONFIG||{},configured=()=>/^https:\/\/[\w.-]+\.supabase\.co\/?$/.test(cfg.supabaseUrl)&&Boolean(cfg.publishableKey);
const endpoint=()=>cfg.supabaseUrl.replace(/\/$/,'');
async function request(path,body,token){const r=await fetch(endpoint()+path,{method:'POST',headers:{apikey:cfg.publishableKey,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});let data;try{data=await r.json();}catch{throw new Error('Réponse serveur illisible.');}if(!r.ok){const err=new Error(data.message||data.msg||data.error_description||data.error||'Connexion refusée.');err.status=r.status;throw err;}return data;}
async function auth(){if(!configured())throw new Error('Multijoueur à configurer : voir INSTALLATION.md.');if(!loaded){try{session=JSON.parse(localStorage.getItem('souverain-auth-v2'));}catch{}loaded=true;}if(session?.access_token&&session.expires_at>Date.now()/1000+60)return session;
 if(session?.refresh_token){try{const d=await request('/auth/v1/token?grant_type=refresh_token',{refresh_token:session.refresh_token});session={...d,expires_at:Date.now()/1000+d.expires_in};try{localStorage.setItem('souverain-auth-v2',JSON.stringify(session));}catch{}return session;}catch(e){throw new Error('Session non renouvelée : '+e.message);}}
 const d=await request('/auth/v1/signup',{data:{game:'souverain'}});if(!d.access_token)throw new Error('Activez les connexions anonymes dans Supabase Authentication.');session={...d,expires_at:Date.now()/1000+d.expires_in};try{localStorage.setItem('souverain-auth-v2',JSON.stringify(session));}catch{}return session;}
async function rpc(name,args){const a=await auth();return request('/rest/v1/rpc/'+name,args,a.access_token);}
root.Online={configured,rpc,auth};
})(globalThis);
