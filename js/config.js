// Dados fixos do app: ícones, missões, recompensas, níveis e regras.

export const ICON = {
  drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>',
  bottle:'<path d="M10 2h4v3l1.5 2.5V21a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V7.5L10 5Z"/><path d="M8.5 12h7"/>',
  recycle:'<path d="M7 19H4.8a1.8 1.8 0 0 1-1.6-2.7L7 10"/><path d="M11 19h8.2a1.8 1.8 0 0 0 1.6-2.7L17 10"/><path d="M14 16l-3 3 3 3"/><path d="M8.3 6.5 10.4 3a1.8 1.8 0 0 1 3.1 0L17 9"/><path d="M13 9h4V5"/>',
  bike:'<circle cx="5.5" cy="17" r="3.5"/><circle cx="18.5" cy="17" r="3.5"/><path d="M15 6h2l1.5 11M5.5 17 9 9h6l-3 8"/>',
  plug:'<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0Z"/><path d="M12 17v5"/>',
  bag:'<path d="M5 8h14l-1 13H6Z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
  bulb:'<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z"/>',
  leaf:'<path d="M11 20A7 7 0 0 1 4 13c0-6 7-10 16-10 0 9-4 16-9 17Z"/><path d="M4 21c4-4 7-7 10-9"/>',
  cam:'<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13.5" r="3.5"/>'
};

// water = litros de água, co2 = kg CO2e (estimativas médias). proof = exige foto.
export const MISSIONS = [
  {id:'banho', cat:'Água', ico:'drop', w:1, t:'Banho de até 5 minutos', pts:30, water:45, co2:0.05},
  {id:'garrafa', cat:'Resíduos', ico:'bottle', t:'Usei garrafa reutilizável', pts:20, water:0, co2:0.08,
    proof:'Sua garrafa ou copo reutilizável em uso: na mesa da faculdade, do trabalho ou no bebedouro.'},
  {id:'reciclar', cat:'Resíduos', ico:'recycle', t:'Separei os recicláveis', pts:25, water:0, co2:0.3,
    proof:'Os recicláveis separados por tipo (plástico, papel, vidro, metal) ou sendo descartados na lixeira seletiva / ponto de coleta. Os itens precisam aparecer com clareza.'},
  {id:'bike', cat:'Mobilidade', ico:'bike', t:'Fui a pé, de bike ou transporte público', pts:40, water:0, co2:0.9},
  {id:'standby', cat:'Energia', ico:'plug', t:'Tirei aparelhos da tomada', pts:15, water:0, co2:0.04},
  {id:'sacola', cat:'Resíduos', ico:'bag', t:'Levei sacola própria às compras', pts:15, water:0, co2:0.03,
    proof:'Sua sacola retornável com as compras dentro, no caixa ou logo depois.'},
  {id:'luz', cat:'Energia', ico:'bulb', t:'Apaguei luzes de cômodos vazios', pts:10, water:0, co2:0.02},
  {id:'louca', cat:'Água', ico:'drop', w:1, t:'Lavei a louça com a torneira fechada', pts:20, water:60, co2:0.02},
  {id:'veg', cat:'Alimentação', ico:'leaf', t:'Fiz uma refeição sem carne', pts:30, water:500, co2:1.5}
];

// Missões que aparecem na tela Início
export const HOME_IDS = ['reciclar','garrafa','banho','bike'];

export const REWARDS = [
  {id:'ifood10', tag:'Delivery', t:'R$ 10 off no iFood', d:'Pedido mínimo de R$ 30', cost:500},
  {id:'ml-frete', tag:'Compras', t:'Frete grátis no Mercado Livre', d:'Uma compra acima de R$ 49', cost:800},
  {id:'ecobag', tag:'Produto', t:'Ecobag EcoHabitus', d:'Retirada no campus', cost:300},
  {id:'muda', tag:'Impacto', t:'Plantio de uma muda nativa', d:'Em seu nome, com certificado', cost:1000},
  {id:'ifood25', tag:'Delivery', t:'R$ 25 off no iFood', d:'Pedido mínimo de R$ 60', cost:1200}
];

export const LEVELS = [
  {n:'Semente', min:0},
  {n:'Broto', min:200},
  {n:'Muda', min:600},
  {n:'Árvore', min:1200},
  {n:'Floresta', min:2500}
];

export const WEEKLY = {id:'semana-garrafa', need:5, pts:150};

export const REVIEW_MS = 4000;   // tempo da análise simulada da foto
export const MAX_AGE_H = 24;     // foto precisa ser recente
export const DUP_DIST = 5;       // distância máxima de hash p/ considerar foto repetida
export const STORAGE_KEY = 'ecohabitus.v1';
