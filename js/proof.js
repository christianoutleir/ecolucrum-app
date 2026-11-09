// Comprovação por foto: modal, validação da imagem e envio.
import { MAX_AGE_H, DUP_DIST } from './config.js';
import { dkey, byId, $ } from './utils.js';
import { S, save } from './state.js';
import { render, toast } from './ui.js';
import { scheduleReview } from './missions.js';

let proofFor = null, proofData = null;

export function openProof(id){
  const m = byId(id);
  proofFor = id; proofData = null;
  $('pTitle').textContent = m.t;
  $('pHint').textContent = m.proof;
  $('proofFile').value = '';
  $('pPreview').hidden = true; $('pPreview').removeAttribute('src');
  $('pEmpty').hidden = false;
  $('pChecks').hidden = true; $('pChecks').innerHTML = '';
  $('pSend').disabled = true;
  $('proofModal').hidden = false;
}

export function closeProof(){ $('proofModal').hidden = true; proofFor = null; proofData = null; }

const hamming = (a,b) => { let n=0; for (let i=0;i<a.length;i++) if (a[i]!==b[i]) n++; return n; };

function loadImage(file){
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('decode')); };
    img.src = url;
  });
}

// Regras: foto recente, resolução mínima, iluminação e foto inédita (hash perceptual)
async function analyze(file){
  if (!file.type || !file.type.startsWith('image/')) return {ok:false, checks:[[false,'O arquivo precisa ser uma imagem (JPG ou PNG).']]};
  const img = await loadImage(file);
  const W = img.naturalWidth, H = img.naturalHeight;

  // miniatura para guardar
  const s = Math.min(1, 360/Math.max(W,H));
  const c = document.createElement('canvas'); c.width = Math.max(1,Math.round(W*s)); c.height = Math.max(1,Math.round(H*s));
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  const thumb = c.toDataURL('image/jpeg', 0.72);

  // hash perceptual 8x8 (aHash) + brilho/contraste
  const h = document.createElement('canvas'); h.width = h.height = 8;
  const hx = h.getContext('2d', {willReadFrequently:true}); hx.drawImage(img, 0, 0, 8, 8);
  const px = hx.getImageData(0,0,8,8).data, g = [];
  for (let i=0;i<px.length;i+=4) g.push(.299*px[i] + .587*px[i+1] + .114*px[i+2]);
  const avg = g.reduce((a,b)=>a+b,0)/64;
  const sd = Math.sqrt(g.reduce((a,v)=>a+(v-avg)**2,0)/64);
  const hash = g.map(v => v>avg ? '1' : '0').join('');

  const ageH = file.lastModified ? (Date.now()-file.lastModified)/36e5 : 0;
  const recent = ageH <= MAX_AGE_H;
  const sizeOk = Math.min(W,H) >= 240;
  const quality = sd >= 10 && avg >= 25;
  const dup = S.log.some(e => e.proof && e.proof.hash && hamming(e.proof.hash, hash) <= DUP_DIST);
  const checks = [
    [recent, recent ? 'Foto recente (últimas 24 h)' : 'Foto com mais de 24 h. Tire uma foto agora.'],
    [sizeOk, sizeOk ? 'Resolução suficiente' : 'Imagem muito pequena. Use a câmera do celular.'],
    [quality, quality ? 'Imagem iluminada e com detalhes' : 'Imagem escura ou sem detalhes. Tente com mais luz.'],
    [!dup, !dup ? 'Foto inédita' : 'Esta foto já foi usada em outra comprovação.']
  ];
  return {ok: checks.every(x => x[0]), checks, thumb, hash};
}

export function initProof(){
  $('proofFile').addEventListener('change', async ev => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    proofData = null; $('pSend').disabled = true;
    $('pChecks').hidden = false; $('pChecks').innerHTML = '<li><span class="mk">…</span>Analisando foto</li>';
    try {
      const r = await analyze(f);
      if (r.thumb){ $('pPreview').src = r.thumb; $('pPreview').hidden = false; $('pEmpty').hidden = true; }
      $('pChecks').innerHTML = r.checks.map(([ok,t]) => `<li class="${ok?'ok':'bad'}"><span class="mk">${ok?'✓':'✕'}</span>${t}</li>`).join('');
      if (r.ok){ proofData = {thumb:r.thumb, hash:r.hash}; $('pSend').disabled = false; }
    } catch(err){
      $('pChecks').innerHTML = '<li class="bad"><span class="mk">✕</span>Não foi possível abrir a imagem. Tente outra foto (JPG ou PNG).</li>';
    }
  });
}

export function sendProof(){
  if (!proofFor || !proofData) return;
  const m = byId(proofFor), now = new Date();
  const e = {type:'m', id:m.id, ts:now.getTime(), day:dkey(now), pts:m.pts, status:'pending', proof:proofData};
  S.log.push(e);
  closeProof(); save(); render();
  toast('Foto enviada · em análise');
  scheduleReview(e.ts);
}
