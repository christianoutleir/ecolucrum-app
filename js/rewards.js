// Resgate de recompensas (simulado): confirmação e geração do cupom.
import { REWARDS } from './config.js';
import { dkey, fmt, $ } from './utils.js';
import { S, save, balance } from './state.js';
import { render, toast, bump } from './ui.js';

let pending = null;

export function askRedeem(id){
  const r = REWARDS.find(x => x.id===id);
  if (!r || balance() < r.cost) return;
  pending = r;
  $('mTitle').textContent = r.t;
  $('mBody').textContent = `Usar ${fmt(r.cost)} EcoPontos. Saldo após o resgate: ${fmt(balance()-r.cost)}.`;
  $('modal').hidden = false;
  $('mOk').focus();
}

export function closeModal(){ $('modal').hidden = true; pending = null; }

export function redeem(){
  const r = pending; if (!r) return closeModal();
  // código no formato ECO-XXXX-XXXX
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let c = 'ECO-';
  for (let i=0; i<8; i++){ if (i===4) c += '-'; c += chars[Math.floor(Math.random()*chars.length)]; }
  const now = new Date();
  S.spent += r.cost;
  S.coupons.push({id:r.id, code:c, ts:now.getTime()});
  S.log.push({type:'r', id:r.id, ts:now.getTime(), day:dkey(now), pts:-r.cost});
  save(); closeModal(); render(); bump(); toast('Cupom resgatado');
}
