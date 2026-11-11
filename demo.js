// DEMO MODE for the Parents App: sample family, nothing is read from or sent to the real database.
(function(){
const K=()=>new Date(Date.now()+18e6),iso=d=>d.toISOString().slice(0,10),dAgo=n=>iso(new Date(K().getTime()-n*864e5));
const todayS=iso(K()),ym=todayS.slice(0,7);
const addM=n=>{const d=K();return iso(new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+n,1))).slice(0,7)};
const WA='0300-0000001',ROLL='101';
const keys={pw:WA,pc:ROLL};
const gi=Storage.prototype.getItem,si=Storage.prototype.setItem,ri=Storage.prototype.removeItem;
Storage.prototype.getItem=function(k){return this===localStorage&&(k in keys)?keys[k]:gi.call(this,k)};
Storage.prototype.setItem=function(k,v){if(this===localStorage&&(k in keys))return;return si.call(this,k,v)};
Storage.prototype.removeItem=function(k){if(this===localStorage&&(k in keys))return;return ri.call(this,k)};
const kids=[[101,'Hamza Khan','Noorani Qaida','Afternoon',3000,'Hamza ne is dauran Noorani Qaida mein acha sabaq yaad kiya hai. Takhti ki mashq aur kalme dohraane mein behtar hua hai. Hazri bhi achi rahi. Hosla afzai ke saath, mazeed mehnat ki zaroorat hai.'],[102,'Maryam Khan','Nazra Quran','Afternoon',3000,'Maryam Nazra mein behtareen chal rahi hain. Para ka sabaq waqt par yaad karti hain aur tajweed ka khayal rakhti hain. Mashallah, isi tarah mehnat jaari rakhein.'],[103,'Yusuf Khan','Noorani Qaida','Afternoon',3000,'Yusuf ne naya takhti shuru kiya hai aur duaen yaad kar raha hai. Kabhi kabhi chhutti ki wajah se sabaq ruka, lekin overall taraqqi achi hai.']];
const months=[addM(-2),addM(-1),ym];
const students=kids.map((k,ki)=>{const att=[];for(let i=0;i<60;i++){const dt=dAgo(i);if(new Date(dt+'T00:00:00Z').getUTCDay()===0)continue;const v=(k[0]*7+i*3)%10,st=v<7?'Present':v<9?'Leave':'Absent',isQ=k[2]==='Noorani Qaida',n=(k[0]%9)+5+Math.floor((60-i)/8);
  att.push({date:dt,status:st,lesson:st==='Present'?(isQ?'Qaida - Takhti ':'Para ')+n:null,notes:st==='Present'?'Sabaq acha raha':null})}
  return{roll_no:k[0],name:k[1],level:k[2],timing:k[3],monthly_fee:k[4],status:'Active',attendance:att,
  fees:months.map((m,mi)=>{const paid=mi<2||ki===0,pd=m+'-0'+(2+ki);return{month:m,amount:k[4],status:paid?'Paid':'Unpaid',paid_on:paid?(pd>todayS?todayS:pd):null}}).reverse(),
  exams:ki===0?[{exam_name:'Monthly test',exam_date:dAgo(9),marks_obtained:42,total_marks:50,result:'Pass',remarks:'Good effort'}]:ki===1?[{exam_name:'Monthly test',exam_date:dAgo(9),marks_obtained:47,total_marks:50,result:'Pass',remarks:'Excellent'}]:[],
  ai_summary:{summary:'Assalamu alaikum! '+k[5],generated_at:todayS+'T02:00:00Z'}}});
const DATA={family:{family_id:'F-DEMO',guardian_name:'Ahmed Khan'},students};
const of=window.fetch.bind(window);
window.fetch=function(u,o){
  if(String(u).includes('/rpc/parent_login_public')){let b={};try{b=JSON.parse(o.body)}catch(e){}
    const ok=String(b.p_whatsapp||'').replace(/\D/g,'')==='03000000001'&&['101','102','103'].includes(String(b.p_code||'').trim());
    return Promise.resolve(new Response(JSON.stringify(ok?DATA:null),{status:200,headers:{'Content-Type':'application/json'}}))}
  return of(u,o)};
const st=document.createElement('style');st.textContent='#dbar{position:fixed;top:0;left:0;right:0;z-index:99;background:#d4a84b;color:#1b2440;font:600 12.5px Poppins,sans-serif;padding:6px 10px;text-align:center}';document.head.appendChild(st);
const bar=document.createElement('div');bar.id='dbar';bar.textContent='🎯 DEMO – sample family only. Login: WhatsApp 0300-0000001 and Roll No 101 (102 or 103 also work).';document.body.prepend(bar);document.body.style.paddingTop='38px';
})();
