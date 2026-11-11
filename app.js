const SB='https://yffwwdfdrqpexqfrcqmd.supabase.co', KEY='sb_publishable_oVBCGxvhVuUztj9Y35I4wA_7TYLn0Aw';
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rs=n=>'Rs. '+Number(n||0).toLocaleString('en-US');
let DUE=5,BRAND='Maarifat-ul-Uloom Academy';   // changed by the owner in the Academy App > Settings
const ord=n=>n+(['th','st','nd','rd'][(n%100>10&&n%100<14)?0:(n%10<4?n%10:0)]);
const T={
en:{portal:'PARENTS PORTAL',loginHead:'Parent Login',wa:'WhatsApp Number',code:'Roll Number',hint:"Roll No = your child's roll number given at admission (for example 101). If you have more than one child, any one roll number works.",remember:'Remember me on this phone',login:'Login',logout:'Logout',wrong:'Wrong WhatsApp number or roll number.',many:'Too many wrong attempts. Please try again later.',gen:'Something went wrong. Please try again.',welcome:'Welcome',nokids:'No active student found for this number yet.',level:'Level',timing:'Timing',progress:'Progress summary',noSum:'The progress summary will appear here soon, in sha Allah.',updated:'Updated',att:'Attendance',thisMonth:'This month',present:'Present',absent:'Absent',leave:'Leave',last:'Recent classes (last 60 days)',calendar:'Calendar',noAtt:'No attendance recorded yet.',fees:'Fees',family:'All children',noFees:'No fee record yet.',paidOn:'paid on',exams:'Exam results',noExam:'No exam results yet.',marks:'Marks',rcard:'Monthly report card (print / PDF)',receipt:'Receipt',Present:'Present',Absent:'Absent',Leave:'Leave',Paid:'Paid',Unpaid:'Unpaid',Pass:'Pass',Fail:'Fail'},
ru:{portal:'PARENTS PORTAL',loginHead:'Parent Login',wa:'WhatsApp Number',code:'Roll Number',hint:'Roll No = admission ke waqt bache ko diya gaya roll number (jaise 101). Agar aik se ziyada bache hain to kisi bhi aik ka roll number chal jata hai.',remember:'Is phone par yaad rakhein',login:'Login',logout:'Logout',wrong:'WhatsApp number ya roll number ghalat hai.',many:'Bohat zyada ghalat koshishen. Kuch der baad dobara koshish karein.',gen:'Kuch masla aa gaya. Dobara koshish karein.',welcome:'Khush aamdeed',nokids:'Is number par abhi koi active bacha nahi mila.',level:'Level',timing:'Waqt',progress:'Taraqqi ka khulasa',noSum:'Taraqqi ka khulasa jald yahan nazar aayega, in sha Allah.',updated:'Update',att:'Hazri',thisMonth:'Is mahine',present:'Hazir',absent:'Ghair hazir',leave:'Chhutti',last:'Haali classes (pichhle 60 din)',calendar:'Calendar',noAtt:'Abhi tak koi hazri darj nahi hui.',fees:'Fees',family:'Tamam bache',noFees:'Abhi fees ka koi record nahi.',paidOn:'ada ki',exams:'Imtihan ke nataij',noExam:'Abhi koi imtihan ka nateeja nahi.',marks:'Number',rcard:'Mahana report card (print / PDF)',receipt:'Rasid',Present:'Hazir',Absent:'Ghair hazir',Leave:'Chhutti',Paid:'Ada shuda',Unpaid:'Baqi',Pass:'Pass',Fail:'Fail'}
};
let lang=localStorage.getItem('plang')||'en',D=null,ix=0;
const t=k=>k==='feeNote'?(lang==='en'?'\u26a0\ufe0f Please submit the monthly fee by the '+ord(DUE)+' of every month.':'\u26a0\ufe0f Maahana fees har mahine ki '+DUE+' tareekh tak zaroor jama karwayen.'):(T[lang][k]||k);
const nowK=()=>new Date(Date.now()+18e6).toISOString();

// ---- academy name / logo / due day come from the owner's Settings ----
function applyBrand(s){
  if(s.due_day)DUE=+s.due_day;
  if(s.academy_name){BRAND=s.academy_name;document.querySelectorAll('h1,.fn').forEach(e=>e.textContent=BRAND);document.title=document.title.replace('Maarifat-ul-Uloom Academy',BRAND)}
  if(s.logo_dark_url)document.querySelectorAll('.lgD').forEach(i=>i.src=s.logo_dark_url);
  if(s.logo_light_url)document.querySelectorAll('.lgL').forEach(i=>i.src=s.logo_light_url);
  if(D)render();
}
if(!/[?&]demo\b/.test(location.search))fetch(SB+'/rest/v1/rpc/public_settings',{method:'POST',headers:{'Content-Type':'application/json',apikey:KEY},body:'{}'}).then(r=>r.json()).then(s=>{if(s&&typeof s==='object')applyBrand(s)}).catch(()=>{});

// ---- printing (report card + receipts): opens a clean page, parent saves it as PDF or prints ----
const PCSS='@page{size:A4;margin:14mm}*{box-sizing:border-box}body{font:14px/1.5 Arial,Helvetica,sans-serif;color:#1b2440;margin:0}.pg{border:3px double #d4a84b;border-radius:10px;padding:22px 26px}.hd{display:flex;align-items:center;gap:14px;border-bottom:2px solid #d4a84b;padding-bottom:12px;margin-bottom:14px}.hd img{width:70px;height:70px;border-radius:50%}.hd h1{margin:0;font:700 20px Georgia,serif}.hd small{color:#6b7289;letter-spacing:1.5px;font-size:10px}h2{text-align:center;letter-spacing:3px;margin:8px 0 6px;font-size:17px}.ct{text-align:center;color:#6b7289;margin-bottom:8px}table{width:100%;border-collapse:collapse;margin:8px 0}td,th{border:1px solid #d9deea;padding:6px 10px;text-align:left}th{background:#f6f0e3;width:34%}.t4 th{width:auto}.amt{font-size:22px;font-weight:700;color:#146c43}.sec{background:#f6f0e3;padding:6px 10px;font-weight:700;margin-top:14px;border-left:4px solid #d4a84b}.sum{margin:8px 0;line-height:1.7}.sg{display:flex;justify-content:space-between;margin-top:46px;font-size:12px;color:#6b7289}.sg div{border-top:1px solid #1b2440;padding-top:4px;min-width:150px;text-align:center}.ft{margin-top:18px;text-align:center;color:#6b7289;font-size:11px}';
function pdoc(title,body){const w=window.open('','_blank');if(!w){alert(lang==='en'?'Please allow pop-ups to print.':'Print ke liye pop-up ki ijazat dein.');return}
  w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>'+esc(title)+'</title><style>'+PCSS+'</style></head><body>'+body+'<scr'+'ipt>onload=function(){setTimeout(function(){print()},500)}</scr'+'ipt></body></html>');w.document.close()}
const HDR=()=>'<div class="hd"><img src="'+((document.querySelector('.lgD')||{}).src||'')+'" alt=""><div><h1>'+esc(BRAND)+'</h1><small>QURANIC EDUCATION \u00b7 MODERN SKILLS \u00b7 BRIGHT FUTURE</small></div></div>';
function reportCard(){
  const s=D.students[ix],ym=nowK().slice(0,7),att=s.attendance||[],mon=att.filter(a=>String(a.date).startsWith(ym)),cnt=k=>mon.filter(a=>a.status===k).length,tot=mon.length,pct=tot?Math.round(cnt('Present')*100/tot):0;
  const last=att.find(a=>a.lesson),fee=(s.fees||[]).find(f=>f.month===ym),ex=s.exams||[],ai=s.ai_summary,g=(D.family||{}).guardian_name||'';
  const exRows=ex.length?'<table class="t4"><tr><th>Exam</th><th>Date</th><th>Marks</th><th>Result</th></tr>'+ex.map(e=>'<tr><td>'+esc(e.exam_name)+'</td><td>'+esc(e.exam_date||'')+'</td><td>'+esc(e.marks_obtained)+' / '+esc(e.total_marks)+'</td><td>'+esc(e.result||'')+'</td></tr>').join('')+'</table>':'<div class="sum">No exam results yet.</div>';
  const recent=att.filter(a=>a.status==='Present'&&(a.lesson||a.notes)).slice(0,5);
  pdoc('Report card '+s.name+' '+ym,'<div class="pg">'+HDR()+'<h2>MONTHLY REPORT CARD</h2><div class="ct">Mahana Report Card \u00b7 '+esc(ym)+'</div>'+
   '<table><tr><th>Student</th><td>'+esc(s.name)+'</td></tr><tr><th>Roll No</th><td>'+esc(s.roll_no)+'</td></tr><tr><th>Guardian</th><td>'+esc(g)+'</td></tr><tr><th>Level / Timing</th><td>'+esc(s.level||'-')+' \u00b7 '+esc(s.timing||'-')+'</td></tr></table>'+
   '<div class="sec">Attendance \u2013 '+esc(ym)+'</div><table class="t4"><tr><th>Present</th><th>Absent</th><th>Leave</th><th>Attendance %</th></tr><tr><td>'+cnt('Present')+'</td><td>'+cnt('Absent')+'</td><td>'+cnt('Leave')+'</td><td>'+(tot?pct+'%':'-')+'</td></tr></table>'+
   '<div class="sec">Current lesson / Maujooda sabaq</div><div class="sum">'+(last?esc(last.lesson)+(last.notes?' \u2013 '+esc(last.notes):''):'-')+'</div>'+
   (recent.length?'<div class="sum"><small>Recent: '+recent.map(a=>esc(a.date)+': '+esc(a.lesson||a.notes)).join(' \u00b7 ')+'</small></div>':'')+
   '<div class="sec">Progress summary / Taraqqi ka khulasa</div>'+(ai&&ai.summary?fmtSum(ai.summary,1):'<div class=sum>-</div>')+''+
   '<div class="sec">Exam results / Imtihan</div>'+exRows+
   '<div class="sec">Fee status / Fees</div><div class="sum">'+(fee?esc(ym)+': '+rs(fee.amount)+' \u2013 '+esc(fee.status)+(fee.paid_on?' ('+esc(fee.paid_on)+')':''):'-')+'</div>'+
   '<div class="sg"><div>Parent / Guardian</div><div>Teacher / Academy</div></div><div class="ft">Generated from the Parents App on '+esc(nowK().slice(0,10))+' \u00b7 '+esc(BRAND)+'</div></div>');
}
function receiptDoc(month){
  const rows=[];D.students.forEach(c=>(c.fees||[]).forEach(f=>{if(f.month===month)rows.push({n:c.name,a:f.amount,s:f.status,p:f.paid_on,r:c.roll_no})}));
  if(!rows.length||rows.some(r=>r.s!=='Paid'))return;
  const tot=rows.reduce((n,r)=>n+r.a,0),pd=rows.map(r=>r.p).filter(Boolean).sort().pop()||'',no='R-'+month.replace('-','')+'-'+rows[0].r,g=(D.family||{}).guardian_name||'';
  pdoc('Fee receipt '+no,'<div class="pg">'+HDR()+'<h2>FEE RECEIPT</h2><table><tr><th>Receipt No</th><td>'+esc(no)+'</td></tr><tr><th>Date</th><td>'+esc(pd)+'</td></tr><tr><th>Received from</th><td>'+esc(g)+'</td></tr><tr><th>Student(s)</th><td>'+esc(rows.map(r=>r.n).join(', '))+'</td></tr><tr><th>Fee for month</th><td>'+esc(month)+'</td></tr>'+(rows.length>1?rows.map(r=>'<tr><th>'+esc(r.n)+'</th><td>'+rs(r.a)+'</td></tr>').join(''):'')+'<tr><th>Total received</th><td class="amt">'+rs(tot)+'</td></tr></table><p>Received with thanks. JazakAllah Khair.</p><div class="sg"><div>Parent / Guardian</div><div>Academy stamp &amp; signature</div></div><div class="ft">Computer generated receipt \u00b7 '+esc(BRAND)+'</div></div>');
}

function setTheme(d){document.documentElement.dataset.theme=d?'dark':'light';$('bTh').textContent=d?'\u2600\ufe0f':'\ud83c\udf19';localStorage.setItem('pdark',d?'1':'0')}
$('bTh').onclick=()=>setTheme(document.documentElement.dataset.theme!=='dark');
$('bLang').onclick=()=>{lang=lang==='en'?'ru':'en';localStorage.setItem('plang',lang);apply()};
function apply(){
  document.documentElement.lang=lang==='en'?'en':'ur-Latn';
  document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
  $('bLang').textContent=lang==='en'?'Roman':'English';
  if(D)render();
}
function showErr(m){$('err').textContent=m}

async function login(wa,code,remember,silent){
  showErr('');
  try{
    const r=await fetch(SB+'/rest/v1/rpc/parent_login_public',{method:'POST',headers:{'Content-Type':'application/json',apikey:KEY},body:JSON.stringify({p_whatsapp:wa,p_code:code})});
    const d=await r.json();
    if(!r.ok){if(!silent)showErr((d&&d.message)==='too_many_attempts'?t('many'):t('gen'));return false}
    if(!d){if(!silent)showErr(t('wrong'));localStorage.removeItem('pc');return false}
    D=d;ix=0;
    if(remember){localStorage.setItem('pw',wa);localStorage.setItem('pc',code)}
    render();return true;
  }catch(e){if(!silent)showErr(t('gen'));return false}
}
$('lf').onsubmit=e=>{e.preventDefault();login($('wa').value.trim(),$('cd').value.trim(),$('rm').checked)};
$('bOut').onclick=()=>{localStorage.removeItem('pw');localStorage.removeItem('pc');D=null;$('dash').classList.add('hide');$('login').classList.remove('hide');$('bOut').classList.add('hide');$('cd').value=''};

function render(){
  $('login').classList.add('hide');$('dash').classList.remove('hide');$('bOut').classList.remove('hide');
  const S=D.students||[],g=esc((D.family||{}).guardian_name||'');
  let h=`<h2 style="margin-top:0">${t('welcome')}, ${g}</h2>`;
  if(!S.length){$('dash').innerHTML=h+`<div class="card">${t('nokids')}</div>`;return}
  if(ix>=S.length)ix=0;
  const s=S[ix],ym=nowK().slice(0,7),att=s.attendance||[],mon=att.filter(a=>String(a.date).startsWith(ym)),cnt=k=>mon.filter(a=>a.status===k).length;
  h+=`<div class="chips">${S.map((x,i)=>`<button data-ix="${i}" class="${i===ix?'on':''}">${esc(x.name)}</button>`).join('')}</div>`;
  h+=`<div class="card"><div class="rowx"><b style="font-size:18px">${esc(s.name)}</b><span class="badge Paid">#${s.roll_no}</span></div><div class="mut">${t('level')}: ${esc(s.level||'-')} \u00b7 ${t('timing')}: ${esc(s.timing||'-')}</div></div>`;
  h+=`<button class="btn" data-print="report" style="margin-top:0;margin-bottom:12px">\ud83d\udda8\ufe0f ${t('rcard')}</button>`;
  const ai=s.ai_summary;
  h+=`<h2>${t('progress')}</h2><div class="card">`+(ai&&ai.summary?`${fmtSum(ai.summary)}<div class="mut" style="margin-top:6px">${t('updated')}: ${esc(String(ai.generated_at||'').slice(0,10))}</div>`:`<div class="mut">${t('noSum')}</div>`)+'</div>';
  h+=`<h2>${t('att')} \u2013 ${t('thisMonth')}</h2><div class="kpis"><div class="kpi"><div>${cnt('Present')}</div><small>${t('present')}</small></div><div class="kpi"><div>${cnt('Absent')}</div><small>${t('absent')}</small></div><div class="kpi"><div>${cnt('Leave')}</div><small>${t('leave')}</small></div></div>`;
  h+=calHtml(att);
  const M={};
  S.forEach(c=>(c.fees||[]).forEach(f=>{const m=M[f.month]=M[f.month]||{rows:[],total:0};m.rows.push({n:c.name,a:f.amount,s:f.status,p:f.paid_on});m.total+=f.amount}));
  const months=Object.keys(M).sort().reverse();
  h+=`<h2>${t('fees')}</h2><div class="note">${t('feeNote')}</div><div class="card"><b>${t('family')}</b>`+(months.length?months.map(k=>{const m=M[k],all=m.rows.every(r=>r.s==='Paid'),st=all?'Paid':'Unpaid';
    return `<div class="item"><div class="rowx"><span><b>${esc(k)}</b> \u00b7 ${rs(m.total)}</span><span><span class="badge ${st}">${t(st)}</span>${all?` <button data-rc="${esc(k)}" style="border:1px solid var(--line);background:var(--card);color:var(--tx);border-radius:999px;padding:3px 10px;font:600 11px Poppins,sans-serif;cursor:pointer">\ud83e\uddfe ${t('receipt')}</button>`:''}</span></div><div class="mut">${m.rows.map(r=>esc(r.n)+' '+rs(r.a)+(r.s==='Paid'&&r.p?' ('+t('paidOn')+' '+esc(r.p)+')':'')).join(' \u00b7 ')}</div></div>`}).join(''):`<div class="mut">${t('noFees')}</div>`)+'</div>';
  const ex=s.exams||[];
  h+=`<h2>${t('exams')}</h2><div class="card">`+(ex.length?ex.map(e=>`<div class="item"><div class="rowx"><span><b>${esc(e.exam_name)}</b> <span class="mut">${esc(e.exam_date||'')}</span></span><span class="badge ${esc(e.result)}">${t(e.result)}</span></div><div>${t('marks')}: ${esc(e.marks_obtained)} / ${esc(e.total_marks)}</div>${e.remarks?`<div class="mut">${esc(e.remarks)}</div>`:''}</div>`).join(''):`<div class="mut">${t('noExam')}</div>`)+'</div>';
  $('dash').innerHTML=h;
}
$('dash').onclick=e=>{
  const p=e.target.closest('[data-print]');if(p){reportCard();return}
  const r=e.target.closest('[data-rc]');if(r){receiptDoc(r.dataset.rc);return}
  const b=e.target.closest('[data-ix]');if(b){ix=+b.dataset.ix;render();window.scrollTo({top:0,behavior:'smooth'})}
};

setTheme(localStorage.getItem('pdark')==='1');
apply();
(async()=>{const w=localStorage.getItem('pw'),c=localStorage.getItem('pc');if(w&&c){$('wa').value=w;$('rm').checked=true;await login(w,c,true,true)}})();

// ---------- Progress summary: one idea per paragraph, colour coded ----------
(function(){const st=document.createElement('style');st.textContent='.sm{display:grid;gap:10px}.sm p{margin:0;padding:11px 14px;border-radius:14px;border-left:5px solid var(--c);background:color-mix(in srgb,var(--c) 13%,var(--card));line-height:1.7;font-size:14.5px;animation:up .45s both}.sm p.hi{background:none;border:0;padding:0 2px;font-weight:600;color:var(--gold)}.sm small{display:block;font-weight:600;color:var(--c);letter-spacing:.5px;font-size:11px;text-transform:uppercase;margin-bottom:2px}';document.head.appendChild(st)})();
const SUMK=[
 ['improve',/(mazeed|zaroorat|kamzor|tawajjuh|dhyan|mushkil|weak|improve|needs? |koshish karni)/i,'#d98a1f','\ud83d\udca1','Focus area'],
 ['att',/(hazri|attendance|chhutti|chutti|ghair|absent|leave|present|naagha)/i,'#2f6fd0','\ud83d\udcc5','Attendance'],
 ['good',/(mashallah|masha allah|behtareen|behtar|excellent|great|shabash|taraqqi|acha|achi|achha|accha|achhi|good|well)/i,'#1e8e5a','\u2b50','Doing well'],
 ['lesson',/./,'#8a6a1f','\ud83d\udcd6','Lesson']];
function fmtSum(txt,print){
  const raw=String(txt||'').trim();if(!raw)return '';
  let p=raw.split(/\n+/).map(x=>x.trim()).filter(Boolean);
  if(p.length<2)p=(raw.match(/[^.!?\u06d4]+[.!?\u06d4]*/g)||[raw]).map(x=>x.trim()).filter(Boolean);
  const gr=/^(assalam|salam|\u0627\u0644\u0633\u0644\u0627\u0645)/i,out=[];
  p.forEach(s=>{if(out.length&&s.length<12&&!gr.test(s)&&!gr.test(out[out.length-1]))out[out.length-1]+=' '+s;else out.push(s)});
  const html=out.map((s,i)=>{
    if(i===0&&gr.test(s)&&s.length<70)return print?'<p style="margin:0 0 8px;font-weight:700;color:#8a6a1f">'+esc(s)+'</p>':'<p class="hi" style="--c:var(--gold)">'+esc(s)+'</p>';
    const k=SUMK.find(x=>x[1].test(s))||SUMK[3];
    return print?'<p style="margin:0 0 8px;padding:8px 12px;border-left:4px solid '+k[2]+';background:#f6f0e3;line-height:1.6">'+k[3]+' <b style="color:'+k[2]+'">'+k[4]+':</b> '+esc(s)+'</p>':'<p style="--c:'+k[2]+'"><small>'+k[3]+' '+k[4]+'</small>'+esc(s)+'</p>'}).join('');
  return print?html:'<div class="sm">'+html+'</div>';
}

// ---------- Attendance calendar (replaces the long "recent classes" list) ----------
(function(){const st=document.createElement('style');st.textContent='.cal-h{display:flex;justify-content:space-between;align-items:center;margin:4px 0 10px}.cal-h b{font-size:16px}.cal-n{border:1px solid var(--line);background:var(--field);color:var(--tx);border-radius:999px;width:38px;height:38px;font:700 18px Poppins,sans-serif;cursor:pointer}.cal-n:disabled{opacity:.35;cursor:default}.cal-g{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.cal-w{text-align:center;font-size:11px;font-weight:600;color:var(--mut)}.cd{aspect-ratio:1;min-height:38px;border-radius:12px;border:1px solid var(--line);background:var(--field);color:var(--tx);font:600 13px Poppins,sans-serif;cursor:pointer;padding:0}.cd.P{background:#d9f3e6;color:#146c43;border-color:#8fd3b0}.cd.A{background:#fde1de;color:#a02a1e;border-color:#f0a8a0}.cd.L{background:#fff1cf;color:#8a5a00;border-color:#efcf86}.cd.T{box-shadow:inset 0 0 0 2px var(--gold)}.cd.S{outline:3px solid var(--navy);outline-offset:1px}.cd.E{visibility:hidden}:root[data-theme=dark] .cd.P{background:#14452f;color:#9be6c0;border-color:#1e8e5a}:root[data-theme=dark] .cd.A{background:#4a1f1b;color:#ffb4ab;border-color:#c0392b}:root[data-theme=dark] .cd.L{background:#4a3a14;color:#f3d98b;border-color:#b7791f}:root[data-theme=dark] .cd.S{outline-color:var(--gold)}.cal-lg{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;margin:12px 0 4px;color:var(--mut)}.cal-lg i{display:inline-block;width:12px;height:12px;border-radius:4px;margin-right:5px;vertical-align:-1px}.cal-d{margin-top:10px;padding:12px 14px;border-radius:14px;background:var(--field);border:1px dashed var(--line)}';document.head.appendChild(st)})();
let CAL={m:null,sel:null,att:[]};
const CMON=['January','February','March','April','May','June','July','August','September','October','November','December'];
function calInner(){
  const att=CAL.att,map={};att.forEach(a=>map[String(a.date).slice(0,10)]=a);
  const [y,mo]=CAL.m.split('-').map(Number),dow=new Date(Date.UTC(y,mo-1,1)).getUTCDay(),dim=new Date(Date.UTC(y,mo,0)).getUTCDate(),cur=nowK().slice(0,7);
  const dates=att.map(a=>String(a.date).slice(0,7)).sort(),minM=dates[0]||cur;
  let cells='',cP=0,cA=0,cL=0;
  for(let i=0;i<dow;i++)cells+='<button class="cd E" type="button" tabindex="-1"></button>';
  for(let d=1;d<=dim;d++){const ds=CAL.m+'-'+String(d).padStart(2,'0'),a=map[ds],k=a?(a.status==='Present'?'P':a.status==='Absent'?'A':a.status==='Leave'?'L':''):'';
    if(k==='P')cP++;else if(k==='A')cA++;else if(k==='L')cL++;
    cells+='<button class="cd '+k+(ds===nowK().slice(0,10)?' T':'')+(CAL.sel===ds?' S':'')+'" type="button" data-cal="day" data-d="'+ds+'">'+d+'</button>'}
  const a=CAL.sel&&map[CAL.sel];
  const det=a?'<div class="cal-d"><div class="rowx"><b>'+esc(CAL.sel)+'</b><span class="badge '+esc(a.status)+'">'+t(a.status)+'</span></div>'+(a.lesson?'<div style="margin-top:6px">\ud83d\udcd6 '+esc(a.lesson)+'</div>':'')+(a.notes?'<div class="mut" style="margin-top:4px">'+esc(a.notes)+'</div>':'')+'</div>':
    CAL.sel?'<div class="cal-d mut">'+esc(CAL.sel)+' \u2013 '+t('noAtt')+'</div>':'<div class="mut" style="margin-top:10px;font-size:12.5px">Tap a date to see the lesson and notes.</div>';
  return '<div class="cal-h"><button class="cal-n" type="button" data-cal="prev"'+(CAL.m<=minM?' disabled':'')+'>\u2039</button><b>'+CMON[mo-1]+' '+y+'</b><button class="cal-n" type="button" data-cal="next"'+(CAL.m>=cur?' disabled':'')+'>\u203a</button></div>'+
   '<div class="cal-g">'+['S','M','T','W','T','F','S'].map(x=>'<div class="cal-w">'+x+'</div>').join('')+cells+'</div>'+
   '<div class="cal-lg"><span><i style="background:#1e8e5a"></i>'+t('present')+' '+cP+'</span><span><i style="background:#c0392b"></i>'+t('absent')+' '+cA+'</span><span><i style="background:#d9a21f"></i>'+t('leave')+' '+cL+'</span></div>'+det;
}
function calHtml(att){
  CAL={m:nowK().slice(0,7),sel:null,att:att||[]};
  return '<h2>'+t('att')+' \u2013 '+t('calendar')+'</h2><div class="card" id="cal">'+calInner()+'</div>';
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-cal]');if(!b)return;
  const k=b.dataset.cal,[y,m]=CAL.m.split('-').map(Number);
  if(k==='prev')CAL.m=new Date(Date.UTC(y,m-2,1)).toISOString().slice(0,7);
  else if(k==='next')CAL.m=new Date(Date.UTC(y,m,1)).toISOString().slice(0,7);
  else if(k==='day')CAL.sel=CAL.sel===b.dataset.d?null:b.dataset.d;
  const c=document.getElementById('cal');if(c)c.innerHTML=calInner()});
