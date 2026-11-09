// Estado do usuário (salvo no localStorage) e cálculos derivados.
import { LEVELS, STORAGE_KEY } from './config.js';
import { dkey, daysAgo, byId, isOk } from './utils.js';

// Histórico de exemplo dos últimos 6 dias
export function seed(){
  const plan = [['garrafa','reciclar','banho'],['bike','garrafa'],['banho','standby','garrafa','luz'],['veg','reciclar'],['garrafa','bike','sacola'],['banho','louca']];
  const log = [];
  plan.forEach((ids,i) => {
    const d = daysAgo(6-i);
    ids.forEach((id,j) => {
      const t = new Date(d); t.setHours(8+j*3);
      log.push({type:'m', id, ts:t.getTime(), day:dkey(t), pts:byId(id).pts});
    });
  });
  return {log, coupons:[], spent:0, total:log.reduce((s,e) => s+e.pts, 0)};
}

// S = estado atual. log: type 'm' (missão), 'w' (desafio semanal), 'r' (resgate)
export let S;
try { S = JSON.parse(localStorage.getItem(STORAGE_KEY)) } catch(e) { S = null }
if (!S || !Array.isArray(S.log)) S = seed();

export function resetState(){ S = seed(); }

export function save(){
  for (let k=0; k<4; k++){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); return; }
    catch(e){
      if (!e || !/quota/i.test(e.name + e.message)) return;
      // sem espaço: remove miniaturas mais antigas (mantém o hash para detectar repetição)
      const withThumb = S.log.filter(x => x.proof && x.proof.thumb).sort((a,b) => a.ts-b.ts);
      if (!withThumb.length) return;
      withThumb.slice(0, Math.ceil(withThumb.length/2)).forEach(x => delete x.proof.thumb);
    }
  }
}

export const balance = () => S.total - S.spent;
export const today = () => dkey(new Date());
export const todayEntry = id => S.log.find(e => e.type==='m' && e.id===id && e.day===today());

export function level(){
  let i = 0;
  LEVELS.forEach((l,k) => { if (S.total >= l.min) i = k });
  return i;
}

export function streak(){
  const days = new Set(S.log.filter(e => e.type==='m' && isOk(e)).map(e => e.day));
  let n = 0;
  for (let k = days.has(dkey(daysAgo(0))) ? 0 : 1; days.has(dkey(daysAgo(k))); k++) n++;
  return n;
}

export function impact(){
  let w = 0, c = 0;
  S.log.forEach(e => {
    if (e.type==='m' && isOk(e)){ const m = byId(e.id); if (m){ w += m.water; c += m.co2 } }
  });
  return {w, c};
}

export function weekBottleDays(){
  const set = new Set(); for (let k=0; k<7; k++) set.add(dkey(daysAgo(k)));
  return new Set(S.log.filter(e => e.type==='m' && e.id==='garrafa' && isOk(e) && set.has(e.day)).map(e => e.day)).size;
}

export function weeklyClaimedRecently(){
  const lim = daysAgo(6).getTime() - 12*3600e3;
  return S.log.some(e => e.type==='w' && e.ts >= lim);
}
