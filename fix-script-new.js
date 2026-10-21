const BANK=[
{arm:"Ա",lower:"ա",latin:"A",cyr:"А"},{arm:"Բ",lower:"բ",latin:"B",cyr:"Б"},{arm:"Գ",lower:"գ",latin:"G",cyr:"Г"},{arm:"Դ",lower:"դ",latin:"D",cyr:"Д"},
{arm:"Ե",lower:"ե",latin:"Ye / E",cyr:"Е / Йе"},{arm:"Զ",lower:"զ",latin:"Z",cyr:"З"},{arm:"Է",lower:"է",latin:"Ē",cyr:"Э"},{arm:"Ը",lower:"ը",latin:"Æ / Ə",cyr:"Ы"},
{arm:"Թ",lower:"թ",latin:"Tʰ",cyr:"Т'"},{arm:"Ժ",lower:"ժ",latin:"Zh",cyr:"Ж"},{arm:"Ի",lower:"ի",latin:"I",cyr:"И"},{arm:"Լ",lower:"լ",latin:"L",cyr:"Л"},
{arm:"Խ",lower:"խ",latin:"Kh",cyr:"Х"},{arm:"Ծ",lower:"ծ",latin:"Ts",cyr:"Тц"},{arm:"Կ",lower:"կ",latin:"K",cyr:"К"},{arm:"Հ",lower:"հ",latin:"H",cyr:"Х (h)"},
{arm:"Ձ",lower:"ձ",latin:"Dz",cyr:"Дз"},{arm:"Ղ",lower:"ղ",latin:"Gh",cyr:"Г' (Гх)"},{arm:"Ճ",lower:"ճ",latin:"TCh",cyr:"Тч"},{arm:"Մ",lower:"մ",latin:"M",cyr:"М"},
{arm:"Յ",lower:"յ",latin:"Y",cyr:"Й"},{arm:"Ն",lower:"ն",latin:"N",cyr:"Н"},{arm:"Շ",lower:"շ",latin:"Sh",cyr:"Ш"},{arm:"Ո",lower:"ո",latin:"Vo",cyr:"Во"},
{arm:"Չ",lower:"չ",latin:"Ch",cyr:"Ч"},{arm:"Պ",lower:"պ",latin:"P",cyr:"П"},{arm:"Ջ",lower:"ջ",latin:"J",cyr:"Дж"},{arm:"Ռ",lower:"ռ",latin:"Ř",cyr:"Ръ"},
{arm:"Ս",lower:"ս",latin:"S",cyr:"С"},{arm:"Վ",lower:"վ",latin:"V",cyr:"В"},{arm:"Տ",lower:"տ",latin:"T",cyr:"Т"},{arm:"Ր",lower:"ր",latin:"R",cyr:"Рь"},
{arm:"Ց",lower:"ց",latin:"Tsʰ",cyr:"Ц"},{arm:"ՈՒ",lower:"ու",latin:"U",cyr:"У"},{arm:"Փ",lower:"փ",latin:"Pʰ",cyr:"П' (Пх)"},{arm:"Ք",lower:"ք",latin:"Kʰ",cyr:"К' (Кх)"},
{arm:"Օ",lower:"օ",latin:"O",cyr:"О"},{arm:"Ֆ",lower:"ֆ",latin:"F",cyr:"Ф"},{arm:"ԵՎ",lower:"և",latin:"Yev",cyr:"Йев"}];
const TIPS={
"Ս":"Похожа на английскую U, но читается как «С».",
"Ի":"Читается как «И».",
"Ր":"Мягкий, короткий «рь», как в слове «река».",
"Ռ":"Грубый «ръ», как в слове «рак».",
"Ղ":"Гортанный звук, что-то среднее между «г» и «гх».",
"Խ":"",
"Հ":"Лёгкий выдох, англ. «h», как в слове «hi».",
"Թ":"Придыхательный англ. «t», как в слове «tea».",
"Փ":"Придыхательный англ. «p», как в слове «pig».",
"Ք":"Придыхательный англ. «q», как в слове «queen».",
"Ձ":"Звонкий «дз», как в слове «дзюдо».",
"Ծ":"«Тц» без придыхания.",
"Ց":"",
"Ջ":"Звонкий «дж», как в слове «джем».",
"Ճ":"«Тч» без придыхания.",
"Չ":"",
"Ը":"Краткий нейтральный гласный: на слух близок к «ы», как в английском but.",
"Յ":"Как русская «й»."};
const HARD=Object.keys(TIPS);
const PAGE_URL="https://martirosyanvazgen2006-create.github.io/armenian-test/";
let tm=null,lastPct=0,S={mode:"cyr",set:"all",count:"10"},qs=[],cur=0,score=0,mist=[],locked=false;
const $=id=>document.getElementById(id);
let pending=null;
function inProgress(){return !$("quiz").classList.contains("hidden")&&(cur>0||locked)}
function hideWarn(){pending=null;const w=$("warn");if(w)w.classList.add("hidden")}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function opts(correct,key){const all=[...new Set(BANK.map(x=>x[key]))];return shuffle([correct,...shuffle(all.filter(x=>x!==correct)).slice(0,3)])}
function start(){
  clearTimeout(tm);hideWarn();
  const pool=shuffle(S.set==="hard"?BANK.filter(x=>HARD.includes(x.arm)):BANK);
  qs=pool.slice(0,S.count==="all"?pool.length:Math.min(+S.count,pool.length));
  cur=0;score=0;mist=[];locked=false;
  $("quiz").classList.remove("hidden");$("result").classList.add("hidden");render();
}
function render(){
  if(cur>=qs.length){return result()}
  locked=false;
  const q=qs[cur],key=S.mode,correct=q[key];
  $("instruction").textContent="Выберите соответствие для "+(key==="latin"?"латиницы":"кириллицы");
  $("character").innerHTML=q.arm+'<span class="lower">'+q.lower+'</span>';
  $("progress").textContent="Вопрос "+(cur+1)+" из "+qs.length;
  $("bar").style.width=(cur/qs.length*100)+"%";
  const box=$("answers");box.innerHTML="";
  opts(correct,key).forEach(o=>{
    const b=document.createElement("button");b.className="answer";b.textContent=o;
    b.onclick=()=>{
      if(locked)return;locked=true;
      const all=[...box.children];all.forEach(x=>x.disabled=true);
      if(o===correct){score++;b.classList.add("correct")}
      else{b.classList.add("wrong");all.find(x=>x.textContent===correct).classList.add("correct");mist.push({q,sel:o,correct})}
      tm=setTimeout(()=>{cur++;render()},o===correct?450:1100);
    };
    box.appendChild(b);
  });
}
function result(){
  $("quiz").classList.add("hidden");$("result").classList.remove("hidden");
  const t=qs.length,pct=t?Math.round(score/t*100):0;lastPct=pct;
  $("tg").href="https://t.me/share/url?url="+encodeURIComponent(PAGE_URL)+"&text="+encodeURIComponent(shareText(false));
  $("score").textContent=score+" / "+t;$("percent").textContent="Точность: "+pct+"%";
  $("message").textContent=pct===100?"Идеальный результат — все ответы правильные!":pct>=80?"Очень хороший результат!":pct>=60?"Хороший результат, но есть что повторить.":pct>=40?"Неплохо. Разберите ошибки и попробуйте ещё раз.":"Попробуйте ещё раз — практика поможет.";
  const list=$("mistakes");list.innerHTML="";
  $("mistakesBox").classList.toggle("hidden",!mist.length);$("retry").classList.toggle("hidden",!mist.length);
  mist.forEach(m=>{
    const d=document.createElement("div");d.className="mistake";
    const tip=TIPS[m.q.arm]?'<span class="tip">'+TIPS[m.q.arm]+'</span>':'';
    d.innerHTML='<strong>'+m.q.arm+' '+m.q.lower+'</strong>ваш ответ: '+m.sel+' · правильный: '+m.correct+tip;
    list.appendChild(d);
  });
}
document.querySelectorAll("[data-group]").forEach(g=>{
  g.querySelectorAll(".pill").forEach(b=>b.onclick=()=>{
    const apply=()=>{S[g.dataset.group]=b.dataset.v;g.querySelectorAll(".pill").forEach(x=>x.classList.toggle("active",x===b));start()};
    if(b.dataset.v===S[g.dataset.group])return;
    if(inProgress()){pending=apply;$("warn").classList.remove("hidden")}else apply();
  });
});
function shareText(withUrl){
  const t=qs.length;let x="Мой результат в тесте на армянские буквы: "+score+" из "+t+" ("+lastPct+"%).";
  if(mist.length){const seen=new Set(),u=mist.filter(m=>!seen.has(m.q.arm)&&seen.add(m.q.arm));
    x+="\nОшибки: "+u.slice(0,6).map(m=>m.q.arm+m.q.lower+" (ответил «"+m.sel+"», верно «"+m.correct+"»)").join("; ")+(u.length>6?" и ещё "+(u.length-6):"")+".";}
  x+="\nВ тесте есть подсказки по каждой букве, а преподаватель поможет разобраться с ошибками. Проверьте себя:";
  return withUrl?x+" "+PAGE_URL:x;
}
async function share(){
  const text=shareText(false);
  try{if(navigator.share){await navigator.share({title:"Հայերեն — тест",text:text,url:PAGE_URL});return}}catch(e){if(e&&e.name==="AbortError")return}
  const full=shareText(true);
  try{await navigator.clipboard.writeText(full)}catch(e){const a=document.createElement("textarea");a.value=full;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(_){}a.remove()}
  const b=$("share");b.textContent="Скопировано ✓";setTimeout(()=>b.textContent="Поделиться результатом и разбором",2200);
}
$("share").onclick=share;
$("warnYes").onclick=()=>{const f=pending;hideWarn();if(f)f()};
$("warnNo").onclick=hideWarn;
$("retry").onclick=()=>{clearTimeout(tm);qs=shuffle(mist.map(m=>m.q));cur=0;score=0;mist=[];locked=false;$("quiz").classList.remove("hidden");$("result").classList.add("hidden");render();window.scrollTo({top:0,behavior:"smooth"})};
$("rm").onclick=()=>{const a=$("about"),o=a.classList.toggle("open");$("rm").textContent=o?"Свернуть":"Читать дальше"};
$("restart").onclick=start;
start();
