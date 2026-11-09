// Funções auxiliares (datas, formatação, DOM).
import { MISSIONS } from './config.js';

export const pad = n => String(n).padStart(2,'0');
export const dkey = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
export const daysAgo = n => { const d = new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate()-n); return d; };
export const byId = id => MISSIONS.find(m => m.id === id);
export const fmt = n => n.toLocaleString('pt-BR');
export const $ = id => document.getElementById(id);
export const isOk = e => e.status !== 'pending';
export const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
