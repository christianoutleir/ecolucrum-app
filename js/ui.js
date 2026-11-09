// Renderização das telas, gráfico, planta do nível e avisos (toast).
import { ICON, MISSIONS, HOME_IDS, REWARDS, LEVELS, WEEKLY } from './config.js';
import { pad, dkey, daysAgo, byId, fmt, $, isOk, esc } from './utils.js';
import { S, balance, todayEntry, level, streak, impact, weekBottleDays, weeklyClaimedRecently } from './state.js';

let filter = 'Todas';
export function setFilter(f){ filter = f; }

// Planta do card de saldo: cresce conforme o nível (0 a 4)
function drawPlant(lv){
  const g = [];
  g.push('<ellipse cx="48" cy="102" rx="30" ry="5" fill="rgba(0,0,0,.18)"/>');
  g.push('<path d="M28 84h40l-5 18H33z" fill="#C87A3E"/><rect x="25" y="80" width="46" height="7" rx="2" fill="#DB8D4E"/>');
  const h = [6,22,36,50,62][lv];
  g.push(`<path d="M48 81V${81-h}" stroke="#E3F0DE" stroke-width="3" stroke-linecap="round"/>`);
  const leaf = (x,y,r,s) => `<path d="M${x} ${y}c${8*s} -2 ${14*s} -8 ${16*s} -16c${-9*s} 0 ${-15*s} 6 ${-16*s} 16Z" fill="${r}"/>`;
  if (lv===0) g.push('<ellipse cx="48" cy="77" rx="5" ry="3.5" fill="#E9B949"/>');
  if (lv>=1) { g.push(leaf(48,81-h+4,'#9FD3AE',1)); g.push(leaf(48,81-h+4,'#7CC193',-1)); }
  if (lv>=2) { g.push(leaf(48,62,'#9FD3AE',1)); g.push(leaf(48,68,'#7CC193',-1)); }
  if (lv>=3) g.push(`<circle cx="48" cy="${81-h-4}" r="18" fill="#7CC193"/><circle cx="38" cy="${81-h+6}" r="12" fill="#9FD3AE"/><circle cx="59" cy="${81-h+5}" r="13" fill="#6AB283"/>`);
  if (lv>=4) g.push(`<circle cx="40" cy="${81-h-8}" r="3" fill="#E9B949"/><circle cx="57" cy="${81-h-2}" r="3" fill="#E9B949"/><circle cx="47" cy="${81-h+10}" r="3" fill="#E9B949"/>`);
  $('plant').innerHTML = g.join('');
}

const svg = (k, sw=1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

// Card de uma missão (aberta, em análise ou feita)
function missionHTML(m){
  const e = todayEntry(m.id);
  const state = !e ? 'open' : (e.status==='pending' ? 'pending' : 'done');
  const impactTxt = m.water ? `~${m.water} L de água` : `~${String(m.co2).replace('.',',')} kg CO₂e`;
  const camTxt = m.proof ? `<span class="cam">${svg('cam',2)}foto</span> · ` : '';
  const thumb = e && e.proof && e.proof.thumb;
  const left = thumb ? `<img class="thumb" src="${thumb}" alt="Foto enviada">` : `<div class="ico${m.w?' w':''}">${svg(m.ico)}</div>`;
  const right = state==='done' ? '<span class="stamp">FEITO</span>'
    : state==='pending' ? '<span class="stamp wait">EM ANÁLISE</span>'
    : `<button class="btn-do${m.proof?' photo':''}" data-do="${m.id}">${m.proof?'Enviar foto':'Concluir'}</button>`;
  return `<div class="mission ${state==='open'?'':state}">${left}
    <div style="min-width:0"><h3>${m.t}</h3><div class="meta">${camTxt}<em>+${m.pts}</em> · ${impactTxt}</div></div>${right}</div>`;
}

export function render(){
  const bal = balance(), lv = level();

  // Cabeçalho e Início
  $('pillPts').textContent = fmt(bal);
  $('heroPts').textContent = fmt(bal);
  $('lvlName').textContent = LEVELS[lv].n;
  const next = LEVELS[lv+1];
  $('lvlNext').textContent = next ? `faltam ${fmt(next.min - S.total)} para ${next.n}` : 'nível máximo';
  $('lvlBar').style.width = next ? ((S.total-LEVELS[lv].min)/(next.min-LEVELS[lv].min)*100)+'%' : '100%';
  drawPlant(lv);

  const im = impact();
  $('stStreak').textContent = streak();
  $('stWater').textContent = fmt(Math.round(im.w)) + ' L';
  $('stCo2').textContent = im.c.toFixed(1).replace('.',',') + ' kg';

  const doneN = MISSIONS.filter(m => { const e = todayEntry(m.id); return e && isOk(e); }).length;
  $('todayCount').textContent = `${doneN}/${MISSIONS.length}`;
  $('homeMissions').innerHTML = HOME_IDS.map(id => missionHTML(byId(id))).join('');

  // Missões
  const cats = ['Todas', ...new Set(MISSIONS.map(m => m.cat))];
  $('filters').innerHTML = cats.map(c => `<button class="chip" data-f="${c}" aria-pressed="${c===filter}">${c}</button>`).join('');
  $('allMissions').innerHTML = MISSIONS.filter(m => filter==='Todas' || m.cat===filter).map(missionHTML).join('');
  const wd = weekBottleDays(), claimed = weeklyClaimedRecently();
  $('weekDots').innerHTML = Array.from({length:WEEKLY.need},(_,i)=>`<i class="${i<wd?'on':''}"></i>`).join('');
  $('weekNote').textContent = claimed ? 'Desafio concluído nesta semana.' : wd>=WEEKLY.need ? 'Concluído!' : `${wd} de ${WEEKLY.need} dias`;

  // Recompensas
  $('rewards').innerHTML = REWARDS.map(r => {
    const ok = bal >= r.cost;
    return `<div class="coupon"><div class="l"><span class="tag">${r.tag}</span><h3>${r.t}</h3><p>${r.d}</p></div>
      <div class="r"><span class="cost">${fmt(r.cost)}</span>
      <button class="btn-redeem" data-r="${r.id}" ${ok?'':'disabled'}>Resgatar</button>
      ${ok?'':`<span class="need">faltam ${fmt(r.cost-bal)}</span>`}</div></div>`;
  }).join('');
  $('walletWrap').hidden = !S.coupons.length;
  $('wallet').innerHTML = S.coupons.slice().reverse().map(c => {
    const r = REWARDS.find(x=>x.id===c.id);
    return `<div class="code"><div style="min-width:0"><div style="font-size:13px;font-weight:600">${r?r.t:''}</div><b>${c.code}</b></div><button class="btn-ghost" data-copy="${c.code}">Copiar</button></div>`;
  }).join('');

  // Progresso
  renderChart();
  const proofs = S.log.filter(e => e.proof && e.proof.thumb).sort((a,b)=>b.ts-a.ts);
  $('proofsEmpty').hidden = proofs.length > 0;
  $('proofCount').textContent = proofs.length ? `${proofs.length} foto${proofs.length>1?'s':''}` : '';
  $('proofs').innerHTML = proofs.map(e => {
    const p = e.status==='pending';
    return `<figure><img src="${e.proof.thumb}" alt="Comprovação: ${esc(byId(e.id).t)}"><span class="st${p?' wait':''}">${p?'EM ANÁLISE':'APROVADA'}</span><figcaption>${byId(e.id).t}</figcaption></figure>`;
  }).join('');
  $('levels').innerHTML = LEVELS.map((l,i)=>`<div class="${i===lv?'cur':''}"><b>${l.n}</b>${fmt(l.min)}</div>`).join('');
  $('log').innerHTML = S.log.slice().sort((a,b)=>b.ts-a.ts).slice(0,15).map(e => {
    const name = e.type==='m' ? byId(e.id).t : e.type==='w' ? 'Desafio da semana concluído' : 'Resgate: ' + (REWARDS.find(r=>r.id===e.id)||{}).t;
    const dt = new Date(e.ts);
    const when = dt.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit'}) + ' · ' + pad(dt.getHours())+':'+pad(dt.getMinutes());
    const tagTxt = e.status==='pending' ? ' · <b>foto em análise</b>' : (e.proof ? ' · foto aprovada' : '');
    return `<li><div style="min-width:0"><div>${name}</div><div class="d">${when}${tagTxt}</div></div><span class="p" style="${e.pts<0?'color:var(--danger)':e.status==='pending'?'opacity:.5':''}">${e.pts>0?'+':''}${fmt(e.pts)}</span></li>`;
  }).join('');
}

// Gráfico de barras dos últimos 7 dias
function renderChart(){
  const days = Array.from({length:7},(_,i)=>daysAgo(6-i));
  const vals = days.map(d => S.log.filter(e=>e.day===dkey(d) && e.pts>0 && isOk(e)).reduce((s,e)=>s+e.pts,0));
  const max = Math.max(100, Math.ceil(Math.max(...vals)/50)*50);
  const L=30, R=312, T=10, B=124, bw=(R-L)/7;
  let s='';
  [0,max/2,max].forEach(v=>{
    const y=B-(v/max)*(B-T);
    s+=`<line x1="${L}" x2="${R}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="1"/><text x="${L-6}" y="${y+4}" text-anchor="end" font-size="10" fill="var(--muted)" font-family="JetBrains Mono, monospace">${v}</text>`;
  });
  vals.forEach((v,i)=>{
    const h=(v/max)*(B-T), x=L+i*bw+bw*.2, w=bw*.6, isT=i===6;
    s+=`<rect x="${x}" y="${B-h}" width="${w}" height="${Math.max(h,0)}" rx="5" fill="${isT?'var(--sun)':'var(--leaf)'}"/>`;
    if (v) s+=`<text x="${x+w/2}" y="${B-h-4}" text-anchor="middle" font-size="10" fill="var(--ink)" font-family="JetBrains Mono, monospace">${v}</text>`;
    s+=`<text x="${x+w/2}" y="${B+16}" text-anchor="middle" font-size="10" fill="var(--muted)">${isT?'hoje':days[i].toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','')}</text>`;
  });
  $('chart').innerHTML = s;
  $('weekSum').textContent = fmt(vals.reduce((a,b)=>a+b,0)) + ' pts';
}

let tTimer;
export function toast(html){
  const t = $('toast');
  t.innerHTML = html; t.classList.add('show');
  clearTimeout(tTimer); tTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}

// Animação do saldo no cabeçalho
export function bump(){
  const p = $('pill');
  p.classList.remove('pop'); void p.offsetWidth; p.classList.add('pop');
}

export function go(tab){
  ['inicio','missoes','recompensas','progresso'].forEach(t => $('v-'+t).hidden = t!==tab);
  document.querySelectorAll('nav.tabs button').forEach(b => {
    if (b.dataset.tab===tab) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
  window.scrollTo(0,0);
}
