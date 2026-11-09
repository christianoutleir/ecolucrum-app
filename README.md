# Ecolucrum — App

> Hábitos sustentáveis que geram recompensas.

Plataforma gamificada que incentiva a adoção de hábitos sustentáveis por meio de missões, EcoPontos e recompensas.

Projeto da **Usina de Projetos Experimentais II (UPX II)** — Análise e Desenvolvimento de Sistemas, Centro Universitário Facens.

## Funcionalidades

- **Início:** saldo de EcoPontos, nível atual (com planta que cresce), dias seguidos, água poupada e CO₂e evitado.
- **Missões:** 9 missões em 5 categorias (Água, Resíduos, Mobilidade, Energia, Alimentação) e desafio da semana.
- **Comprovação por foto:** algumas missões só pontuam após foto aprovada. A validação checa se a foto é recente, tem resolução e iluminação suficientes e não foi usada antes (hash perceptual). A aprovação é simulada no MVP.
- **Recompensas:** troca de EcoPontos por cupons (resgate simulado, sem parcerias reais).
- **Progresso:** gráfico dos últimos 7 dias, fotos enviadas, níveis e histórico.

Níveis: Semente → Broto → Muda → Árvore → Floresta.

## Tecnologias

HTML, CSS e JavaScript puro (ES Modules). Sem dependências e sem build. Os dados ficam no `localStorage` do navegador.

## Estrutura

```
ecolucrum-app/
├── index.html            # Estrutura das 4 telas, navegação e modais
├── assets/img/           # Logos (tema claro e escuro)
├── css/
│   ├── variables.css     # Cores, fontes, tema claro/escuro
│   ├── base.css          # Reset, tipografia, animações
│   ├── layout.css        # Coluna do app, cabeçalho, navegação inferior
│   ├── inicio.css        # Tela Início
│   ├── missoes.css       # Tela Missões
│   ├── recompensas.css   # Tela Recompensas
│   ├── progresso.css     # Tela Progresso
│   └── componentes.css   # Toast, modais, envio de foto
└── js/
    ├── main.js           # Ponto de entrada e eventos
    ├── config.js         # Missões, recompensas, níveis e regras
    ├── utils.js          # Funções auxiliares
    ├── state.js          # Estado salvo e cálculos (saldo, nível, impacto)
    ├── ui.js             # Renderização das telas e gráfico
    ├── missions.js       # Conclusão de missões e pontuação
    ├── proof.js          # Comprovação por foto
    └── rewards.js        # Resgate de recompensas
```

## Como rodar

Por usar ES Modules, o app precisa ser aberto por um servidor (abrir o `index.html` direto com duplo clique não funciona).

- **VS Code:** extensão *Live Server* → botão direito no `index.html` → *Open with Live Server*.
- **Terminal:** `npx serve .` ou `python -m http.server` na pasta do projeto e abrir `http://localhost:8000`.
- **Online:** GitHub Pages (Settings → Pages → branch `main`, pasta `/root`).

## ODS relacionados

ODS 4 (Educação de qualidade), ODS 6 (Água potável e saneamento), ODS 12 (Consumo e produção responsáveis) e ODS 13 (Ação contra a mudança global do clima).

## Equipe

- Christian — banner e projeto MVP
- Isac — documentação
- Bruno — persona e Trello
- Gustavo — artigo e trilhas
