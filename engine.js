/* Souverain — moteur déterministe, sans dépendance ni service externe. */
(function(root){
'use strict';
const nations=[
 {name:'République d’Aurélie',short:'Aurélie',capital:'Montclair',color:'#d0ac57',motto:'La force du dialogue',leader:'Camille Morel',bonus:'agriculture'},
 {name:'Union de Boréane',short:'Boréane',capital:'Nordvik',color:'#7ba9bb',motto:'Le nord se souvient',leader:'Erik Voss',bonus:'industry'},
 {name:'Fédération de Valtis',short:'Valtis',capital:'Valbourg',color:'#b88472',motto:'Bâtir demain',leader:'Nora Valen',bonus:'industry'},
 {name:'Royaume d’Estéria',short:'Estéria',capital:'Belrive',color:'#9a91bf',motto:'Unis dans la durée',leader:'Élise II',bonus:'trade'},
 {name:'République de Solmar',short:'Solmar',capital:'Port-Soleil',color:'#c79659',motto:'L’horizon nous appartient',leader:'Diego Serra',bonus:'trade'},
 {name:'Confédération de Méridia',short:'Méridia',capital:'Méride',color:'#8da976',motto:'Libres, ensemble',leader:'Amira Sorel',bonus:'agriculture'},
 {name:'État de Karst',short:'Karst',capital:'Rochefort',color:'#92a29e',motto:'Tenir, toujours',leader:'Anton Karel',bonus:'military'},
 {name:'République de Nérive',short:'Nérive',capital:'Néris',color:'#b27788',motto:'Entre terre et mer',leader:'Lina Orsen',bonus:'energy'}
];
const buildings={farm:{name:'Ferme',icon:'♧',cost:{money:180,materials:25},days:2,desc:'+18 nourriture / jour',resource:'food',yield:18},factory:{name:'Usine',icon:'▥',cost:{money:300,materials:40},days:3,desc:'+14 matériaux / jour',resource:'materials',yield:14},refinery:{name:'Raffinerie',icon:'◉',cost:{money:350,materials:45},days:3,desc:'+12 carburant / jour',resource:'fuel',yield:12},market:{name:'Centre commercial',icon:'◇',cost:{money:260,materials:30},days:2,desc:'+65 crédits / jour',resource:'money',yield:65},fort:{name:'Fortification',icon:'⬡',cost:{money:220,materials:35},days:2,desc:'+30 % défense locale'},hospital:{name:'Hôpital',icon:'✚',cost:{money:280,materials:35},days:3,desc:'+0,4 popularité / jour, entretien 8 crédits'}};
const units={infantry:{name:'Infanterie',cost:{money:100,food:15,materials:10},days:1,power:10,upkeep:3},tank:{name:'Blindés',cost:{money:260,fuel:30,materials:35},days:2,power:24,upkeep:8}};
const resourceNames={money:'crédits',food:'nourriture',fuel:'carburant',materials:'matériaux'};
function rng(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
function log(s,type,title,body,author='Agence mondiale'){s.news.unshift({id:s.nextId++,day:s.day,type,title,body,author});s.news=s.news.slice(0,120);}
function create(player=0,leader=''){
 const s={version:1,seed:731902,day:1,player,leader:leader.trim().slice(0,40)||nations[player].leader,paused:true,speed:1,nextId:1,resources:{money:1800,food:180,fuel:140,materials:180},popularity:76,tax:20,policy:'balanced',provinces:[],relations:nations.map((_,i)=>({value:i===player?100:35+(i*9)%35,status:i===player?'self':'peace',trade:false,ceasefireUntil:0})),queue:[],operations:[],news:[],requests:[],won:false,lost:false};
 const names=['Hauts','Plaine','Bassin','Vallée','Côte','Marches'];
 for(let r=0;r<6;r++)for(let q=0;q<8;q++){
  const owner=Math.floor(q/2)+Math.floor(r/3)*4,idx=(r%3)*2+q%2,id=r*8+q;
  s.provinces.push({id,q,r,owner,original:owner,name:idx===0?nations[owner].capital:names[idx]+' de '+nations[owner].short,capital:idx===0,height:9+(q*13+r*7)%22,terrain:idx===4?'coast':idx===2?'mountain':idx===1?'plain':'forest',buildings:idx===0?['market']:idx===1?['farm']:[],troops:{infantry:idx===0?3:1,tank:idx===0?1:0}});
 }
 log(s,'world','Une nouvelle ère diplomatique','Huit nations ouvrent leurs frontières aux échanges. Chaque gouvernement prépare sa feuille de route.');
 log(s,'government','Votre mandat commence',s.leader+' prend la direction de '+nations[player].short+'. Objectif : préserver la stabilité et étendre votre influence.',nations[player].short);
 return s;
}
function adjacent(a,b){const dq=b.q-a.q,dr=b.r-a.r;return (Math.abs(dq)===1&&dr===0)||(dq===0&&Math.abs(dr)===1)||(dr===1&&dq===(a.r%2?1:-1))||(dr===-1&&dq===(a.r%2?1:-1));}
function neighbors(s,id){return s.provinces.filter(p=>adjacent(s.provinces[id],p));}
function costText(cost){return Object.entries(cost).map(([k,v])=>v+' '+resourceNames[k]).join(' · ');}
function afford(s,cost){return Object.entries(cost).every(([k,v])=>s.resources[k]>=v);}
function pay(s,cost){if(!afford(s,cost))return false;for(const[k,v]of Object.entries(cost))s.resources[k]-=v;return true;}
function owned(s){return s.provinces.filter(p=>p.owner===s.player);}
function power(p){return p.troops.infantry*10+p.troops.tank*24;}
function income(s){
 const ps=owned(s),out={money:ps.length*(18+s.tax*1.8),food:ps.length*5,fuel:ps.length*3,materials:ps.length*4};
 for(const p of ps){for(const b of p.buildings){const def=buildings[b];if(def.resource)out[def.resource]+=def.yield*(nations[s.player].bonus==='agriculture'&&b==='farm'?1.2:nations[s.player].bonus==='industry'&&b==='factory'?1.2:nations[s.player].bonus==='energy'&&b==='refinery'?1.2:1);if(b==='hospital')out.money-=8;}
 out.money-=p.troops.infantry*3+p.troops.tank*8;out.food-=p.troops.infantry*2+p.troops.tank;out.fuel-=p.troops.tank;
 }
 for(const op of s.operations){out.money-=op.troops.infantry*3+op.troops.tank*8;out.food-=op.troops.infantry*2+op.troops.tank;out.fuel-=op.troops.tank;}
 for(const rel of s.relations)if(rel.trade&&rel.status!=='war'){out.money+=nations[s.player].bonus==='trade'?75:60;out.food+=5;out.fuel+=5;}
 if(s.policy==='social'){out.money-=80;out.food+=10;}if(s.policy==='industry'){out.money-=45;out.materials+=15;}
 if(s.popularity<30)out.money*=.7;
 return Object.fromEntries(Object.entries(out).map(([k,v])=>[k,Math.round(v)]));
}
function build(s,id,type){const p=s.provinces[id],b=buildings[type];if(!p||p.owner!==s.player||!b)return 'Province invalide.';if(p.buildings.includes(type)||s.queue.some(x=>x.province===id&&x.kind==='build'&&x.type===type))return 'Ce bâtiment existe déjà ou est en chantier.';if(p.buildings.length+s.queue.filter(x=>x.province===id&&x.kind==='build').length>=4)return 'Cette province dispose de quatre emplacements.';if(!pay(s,b.cost))return 'Ressources insuffisantes.';s.queue.push({id:s.nextId++,kind:'build',province:id,type,due:s.day+b.days});return null;}
function recruit(s,id,type){const p=s.provinces[id],u=units[type];if(!p||p.owner!==s.player||!u)return 'Province invalide.';if(s.queue.filter(x=>x.kind==='unit'&&x.province===id).length>=4)return 'Quatre recrutements sont déjà en attente ici.';if(!pay(s,u.cost))return 'Ressources insuffisantes.';s.queue.push({id:s.nextId++,kind:'unit',province:id,type,due:s.day+u.days});return null;}
function cancel(s,id){const i=s.queue.findIndex(x=>x.id===id);if(i<0)return 'Ordre introuvable.';const x=s.queue.splice(i,1)[0],cost=(x.kind==='build'?buildings:units)[x.type].cost;for(const[k,v]of Object.entries(cost))s.resources[k]+=Math.floor(v*.75);return null;}
function order(s,from,to){const a=s.provinces[from],b=s.provinces[to];if(!a||!b||a.owner!==s.player||!adjacent(a,b))return 'Choisissez une province voisine.';if(power(a)===0)return 'Aucune unité disponible.';if(b.owner!==s.player&&s.relations[b.owner].status!=='war')return 'Une déclaration de guerre est nécessaire.';if(!pay(s,{fuel:8+a.troops.tank*4}))return 'Carburant insuffisant.';s.operations.push({id:s.nextId++,from,to,troops:{...a.troops},due:s.day+(b.terrain==='mountain'?3:2)});a.troops={infantry:0,tank:0};return null;}
function diplomatic(s,target,action){const r=s.relations[target];if(!r||target===s.player)return 'Pays invalide.';
 if(action==='war'){if(r.status==='war')return 'Vous êtes déjà en guerre.';if(r.ceasefireUntil>s.day)return 'Le cessez-le-feu interdit une guerre jusqu’au jour '+r.ceasefireUntil+'.';r.status='war';r.trade=false;r.value=-80;s.popularity=Math.max(0,s.popularity-8);log(s,'war','Déclaration de guerre',nations[s.player].short+' déclare la guerre à '+nations[target].short+'.',s.leader);return null;}
 if(action==='embassy'){if(r.status==='war')return 'Impossible pendant la guerre.';if(!pay(s,{money:100}))return 'Il faut 100 crédits.';r.value=Math.min(100,r.value+15);log(s,'diplomacy','Une délégation reçue',nations[s.player].short+' ouvre un dialogue avec '+nations[target].short+'.');return null;}
 if(action==='aid'){if(!pay(s,{money:200,food:20}))return 'Ressources insuffisantes.';r.value=Math.min(100,r.value+25);log(s,'diplomacy','Une aide humanitaire envoyée',nations[s.player].short+' apporte son soutien à '+nations[target].short+'.');return null;}
 if(s.requests.some(x=>x.target===target&&x.action===action))return 'Une proposition est déjà en cours.';
 if(action==='trade'&&r.trade)return 'Un accord commercial est déjà actif.';if(action==='alliance'&&r.status==='alliance')return 'Vous êtes déjà alliés.';if(action==='peace'&&r.status!=='war')return 'Vous êtes déjà en paix.';if(action!=='peace'&&r.status==='war')return 'Négociez d’abord la paix.';
 if(!['trade','alliance','peace'].includes(action))return 'Action inconnue.';
 s.requests.push({id:s.nextId++,target,action,due:s.day+2});log(s,'diplomacy','Proposition transmise','Une proposition de '+({trade:'commerce',alliance:'défense mutuelle',peace:'cessez-le-feu'}[action])+' a été envoyée à '+nations[target].short+'.',s.leader);return null;
}
function trade(s,resource,amount,buy){if(!['food','fuel','materials'].includes(resource)||![20,50,100].includes(amount))return 'Échange invalide.';const price={food:2,fuel:4,materials:3}[resource];if(buy){if(!pay(s,{money:price*amount}))return 'Crédits insuffisants.';s.resources[resource]+=amount;}else{if(!pay(s,{[resource]:amount}))return 'Stock insuffisant.';s.resources.money+=Math.floor(price*amount*.7);}return null;}
function publish(s,title,body){title=title.trim().slice(0,100);body=body.trim().slice(0,900);if(!title||!body)return 'Ajoutez un titre et un texte.';log(s,'statement',title,body,s.leader+' · '+nations[s.player].short);return null;}
function resolve(s,op){const dest=s.provinces[op.to];if(dest.owner===s.player){dest.troops.infantry+=op.troops.infantry;dest.troops.tank+=op.troops.tank;return;}
 if(s.relations[dest.owner].status!=='war'){const home=s.provinces[op.from].owner===s.player?s.provinces[op.from]:owned(s)[0];if(home){home.troops.infantry+=op.troops.infantry;home.troops.tank+=op.troops.tank;}log(s,'army','Opération interrompue','La paix empêche l’assaut. Les unités rentrent dans une province amie.');return;}
 const attack=power({troops:op.troops})*(.85+rng(s)*.3)*(s.resources.food===0?.65:1)*(nations[s.player].bonus==='military'?1.15:1);
 const defense=power(dest)*(dest.buildings.includes('fort')?1.3:1)*(dest.terrain==='mountain'?1.2:1);
 if(attack>defense){dest.owner=s.player;dest.troops={infantry:Math.max(op.troops.infantry>0?1:0,Math.floor(op.troops.infantry*.65)),tank:Math.floor(op.troops.tank*.7)};s.popularity=Math.min(100,s.popularity+3);log(s,'army','Province sécurisée',dest.name+' passe sous votre contrôle. Vos forces ont subi des pertes.');}else{dest.troops.infantry=Math.max(0,Math.ceil(dest.troops.infantry*.7));dest.troops.tank=Math.max(0,Math.floor(dest.troops.tank*.8));log(s,'war','Offensive repoussée','Les forces envoyées à '+dest.name+' ont été perdues. Renforcez vos unités avant un nouvel assaut.');}
}
function tick(s){if(s.lost||s.won)return;s.day++;const inc=income(s);for(const k of Object.keys(s.resources))s.resources[k]=Math.max(0,s.resources[k]+inc[k]);
 const hospitals=owned(s).filter(p=>p.buildings.includes('hospital')).length;
 s.popularity=Math.max(0,Math.min(100,s.popularity+(20-s.tax)*.09+(s.policy==='social'?.8:s.policy==='industry'?-.2:0)+hospitals*.4-(s.resources.food===0?3:0)-(s.resources.money===0?2:0)));
 for(const x of s.queue.filter(x=>x.due<=s.day)){const p=s.provinces[x.province];if(p.owner!==s.player){log(s,'war','Chantier perdu',p.name+' a changé de propriétaire. Un ordre est abandonné.');continue;}if(x.kind==='build')p.buildings.push(x.type);else p.troops[x.type]++;log(s,x.kind==='build'?'economy':'army',x.kind==='build'?'Construction terminée':'Unité opérationnelle',(x.kind==='build'?buildings:units)[x.type].name+' disponible à '+p.name+'.');}s.queue=s.queue.filter(x=>x.due>s.day);
 for(const op of s.operations.filter(x=>x.due<=s.day))resolve(s,op);s.operations=s.operations.filter(x=>x.due>s.day);
 for(const req of s.requests.filter(x=>x.due<=s.day)){const r=s.relations[req.target],ok=req.action==='peace'?rng(s)<.65:req.action==='trade'?r.value>=45&&r.status!=='war':r.value>=75&&r.status!=='war';if(ok){if(req.action==='trade')r.trade=true;else if(req.action==='alliance')r.status='alliance';else{r.status='peace';r.value=20;r.ceasefireUntil=s.day+5;}log(s,'diplomacy','Accord accepté',nations[req.target].short+' accepte votre proposition de '+({trade:'commerce',alliance:'défense mutuelle',peace:'cessez-le-feu'}[req.action])+'.');}else log(s,'diplomacy','Proposition refusée',nations[req.target].short+' refuse votre proposition. Améliorez les relations ou réessayez plus tard.');}s.requests=s.requests.filter(x=>x.due>s.day);
 if(s.day%4===0){for(let i=0;i<8;i++){if(i===s.player)continue;const ps=s.provinces.filter(p=>p.owner===i);if(!ps.length)continue;const p=ps[Math.floor(rng(s)*ps.length)];p.troops.infantry++;if(s.day%12===0)p.troops.tank++;
 if(s.relations[i].status==='war'){const borders=ps.flatMap(a=>neighbors(s,a.id).filter(b=>b.owner===s.player).map(b=>({a,b})));if(borders.length){const {a,b}=borders[Math.floor(rng(s)*borders.length)];if(power(a)>power(b)*(b.buildings.includes('fort')?1.3:1)*1.1+5){a.troops.infantry=Math.max(0,Math.floor(a.troops.infantry*.5));b.owner=i;b.troops={infantry:2,tank:0};s.popularity=Math.max(0,s.popularity-4);log(s,'war','Frontière percée',nations[i].short+' occupe '+b.name+'.');}}}
 }}
 if(s.day%5===0){const i=Math.floor(rng(s)*8);if(i!==s.player)log(s,'world','Communiqué de '+nations[i].short,['Le gouvernement annonce un programme de modernisation des infrastructures.','Le ministère appelle à renforcer la coopération régionale.','Les forces armées organisent un exercice de défense territorial.'][Math.floor(rng(s)*3)],nations[i].leader);}
 if(s.day%7===0){const event=Math.floor(rng(s)*4);if(event===0){s.resources.food=Math.max(0,s.resources.food-40);log(s,'event','Récolte perturbée','Une période de sécheresse fait perdre 40 unités de nourriture.');}else if(event===1){s.resources.money+=200;log(s,'event','Investissement étranger','Un fonds régional investit dans votre pays : +200 crédits.');}else if(event===2){s.popularity=Math.max(0,s.popularity-5);log(s,'event','Manifestation dans la capitale','Les habitants demandent davantage de services publics : −5 popularité.');}else{s.resources.materials+=35;log(s,'event','Nouveau gisement','Des réserves exploitables fournissent 35 matériaux.');}}
 if(!owned(s).length){s.lost=true;s.paused=true;log(s,'war','Gouvernement en exil','Votre dernier territoire est tombé. La partie est terminée.');}
 if(owned(s).length>=30){s.won=true;s.paused=true;log(s,'government','Puissance continentale','Vous contrôlez 30 provinces. Votre mandat entre dans l’histoire.');}
}
function validate(s){if(!s||s.version!==1||!Number.isInteger(s.player)||s.player<0||s.player>7||!Array.isArray(s.provinces)||s.provinces.length!==48||!Number.isInteger(s.day)||s.day<1)return false;const keys=['money','food','fuel','materials'];if(!s.resources||!keys.every(k=>Number.isFinite(s.resources[k])&&s.resources[k]>=0)||!Number.isFinite(s.popularity)||s.popularity<0||s.popularity>100||!Number.isFinite(s.tax)||s.tax<10||s.tax>40)return false;if(!['balanced','social','industry'].includes(s.policy)||![1,2,4].includes(s.speed)||typeof s.leader!=='string'||s.leader.length>40||!Number.isInteger(s.seed)||!Number.isInteger(s.nextId))return false;if(!Array.isArray(s.relations)||s.relations.length!==8||!s.relations.every(r=>r&&Number.isFinite(r.value)&&['self','peace','war','alliance'].includes(r.status)&&typeof r.trade==='boolean'&&Number.isFinite(r.ceasefireUntil)))return false;
 if(!s.provinces.every((p,i)=>p&&p.id===i&&p.q===i%8&&p.r===Math.floor(i/8)&&Number.isInteger(p.owner)&&p.owner>=0&&p.owner<8&&typeof p.name==='string'&&Number.isFinite(p.height)&&p.height>=0&&p.height<=100&&Array.isArray(p.buildings)&&p.buildings.length<=4&&p.buildings.every(b=>buildings[b])&&p.troops&&Object.keys(units).every(k=>Number.isInteger(p.troops[k])&&p.troops[k]>=0&&p.troops[k]<100000)))return false;
 const validId=i=>Number.isInteger(i)&&i>=0&&i<48;
 if(!Array.isArray(s.queue)||!s.queue.every(x=>validId(x.province)&&Number.isInteger(x.due)&&Number.isInteger(x.id)&&((x.kind==='build'&&buildings[x.type])||(x.kind==='unit'&&units[x.type]))))return false;
 if(!Array.isArray(s.operations)||!s.operations.every(x=>validId(x.from)&&validId(x.to)&&Number.isInteger(x.due)&&x.troops&&Object.keys(units).every(k=>Number.isInteger(x.troops[k])&&x.troops[k]>=0)))return false;
 if(!Array.isArray(s.requests)||!s.requests.every(x=>Number.isInteger(x.target)&&x.target>=0&&x.target<8&&['trade','alliance','peace'].includes(x.action)&&Number.isInteger(x.due)))return false;
 return Array.isArray(s.news)&&s.news.length<=120&&s.news.every(n=>n&&typeof n.title==='string'&&typeof n.body==='string'&&typeof n.author==='string'&&Number.isInteger(n.day));}
 const API={nations,buildings,units,resourceNames,create,tick,income,owned,neighbors,adjacent,power,costText,afford,build,recruit,cancel,order,diplomatic,trade,publish,validate};if(typeof module!=='undefined')module.exports=API;else root.Game=API;
})(typeof window!=='undefined'?window:globalThis);
