// Conclusão de missões, crédito de EcoPontos e análise simulada da foto.
import { LEVELS, WEEKLY, REVIEW_MS } from './config.js';
import { dkey, byId } from './utils.js';
import { S, save, today, todayEntry, level, weekBottleDays, weeklyClaimedRecently } from './state.js';
import { render, toast, bump } from './ui.js';
import { openProof } from './proof.js';

export function complete(id){
  if (todayEntry(id)) return;           // só uma vez por dia
  const m = byId(id);
  if (m.proof) return openProof(id);    // missão com foto abre o modal
  const now = new Date();
  const e = {type:'m', id, ts:now.getTime(), day:dkey(now), pts:m.pts};
  S.log.push(e);
  credit(e, 'Missão concluída');
}

// Soma os pontos e verifica o desafio da semana e a troca de nível
export function credit(e, label){
  const lvBefore = level();
  S.total += e.pts;
  let extra = '';
  if (e.id==='garrafa' && !weeklyClaimedRecently() && weekBottleDays()>=WEEKLY.need){
    S.log.push({type:'w', id:WEEKLY.id, ts:Date.now()+1, day:today(), pts:WEEKLY.pts});
    S.total += WEEKLY.pts;
    extra = ` · desafio <em>+${WEEKLY.pts}</em>`;
  }
  save(); render(); bump();
  const lv = level();
  toast(lv>lvBefore ? `Novo nível: ${LEVELS[lv].n}!` : `${label} <em>+${e.pts}</em>${extra}`);
}

// Análise simulada: aprova a foto após REVIEW_MS
export function scheduleReview(ts, delay=REVIEW_MS){
  setTimeout(() => {
    const e = S.log.find(x => x.ts===ts && x.status==='pending');
    if (!e) return;
    e.status = 'approved';
    credit(e, 'Foto aprovada');
  }, delay);
}
