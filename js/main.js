// Ponto de entrada: liga os eventos e desenha a tela inicial.
import { $ } from './utils.js';
import { S, save, resetState } from './state.js';
import { render, toast, go, setFilter } from './ui.js';
import { complete, scheduleReview } from './missions.js';
import { initProof, closeProof, sendProof } from './proof.js';
import { askRedeem, closeModal, redeem } from './rewards.js';

// Um único listener para todos os botões (delegação de eventos)
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.do) complete(b.dataset.do);
  else if (b.dataset.tab) go(b.dataset.tab);
  else if (b.dataset.go) go(b.dataset.go);
  else if (b.dataset.f) { setFilter(b.dataset.f); render(); }
  else if (b.dataset.r) askRedeem(b.dataset.r);
  else if (b.dataset.copy) {
    const code = b.dataset.copy;
    try { navigator.clipboard.writeText(code).then(()=>toast('Código copiado'), ()=>toast(code)); } catch(err){ toast(code); }
  }
  else if (b.id==='mOk') redeem();
  else if (b.id==='mCancel') closeModal();
  else if (b.id==='pSend') sendProof();
  else if (b.id==='pCancel') closeProof();
  else if (b.id==='reset') { resetState(); save(); render(); toast('Demonstração reiniciada'); }
});

// Fechar modais clicando fora ou com Esc
$('modal').addEventListener('click', e => { if (e.target.id==='modal') closeModal(); });
$('proofModal').addEventListener('click', e => { if (e.target.id==='proofModal') closeProof(); });
document.addEventListener('keydown', e => { if (e.key==='Escape'){ closeModal(); closeProof(); } });

initProof();

// Fotos que ficaram em análise quando o app foi fechado
S.log.filter(e => e.status==='pending').forEach((e,i) => scheduleReview(e.ts, 1500 + i*600));

render();
