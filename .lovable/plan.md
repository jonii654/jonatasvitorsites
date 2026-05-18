## Visão geral

Aplicar **9 efeitos cinematográficos** distribuídos pelas seções, com **detecção automática de mobile/dispositivo fraco** que troca cada efeito pesado por uma versão leve equivalente. Resultado: desktop com experiência Awwwards-level, celular com performance fluida e visual ainda diferenciado.

## Distribuição final dos efeitos

| Seção | Efeito (desktop) | Versão mobile leve |
|---|---|---|
| **Hero** | mantém atual + brilho extra no CTA | igual (já é otimizado) |
| **Sobre Mim — foto** | v6 Lando Norris: retrato grande + adesivos tipográficos flutuando + halo neon | foto + 2 stickers estáticos, sem float |
| **Sobre Mim — parágrafo** | v5 reveal palavra-por-palavra (cinza→branco no scroll) | reveal por bloco (fade-in simples) |
| **Meu Compromisso com Você** | v2 Jeton: título sticky + cards horizontais passando por cima | título fixo + cards verticais com fade |
| **Como Funciona** | v3: barras finas verticais que expandem em cards no scroll | cards já abertos com stagger fade-in |
| **Explore em 3D** | v7 Beeyond: páginas dos sites flutuando em 3D WebGL (Three.js) | grid 2D estático das mesmas screenshots |
| **Portfólio — abertura** | v8 Moss: tipografia GIGANTE "TRABALHOS" + mosaico de fotos | título grande + grid 2x2 estático |
| **Portfólio — cards** | v4 Shoes Float: nome gigante atrás + tela flutuando + ciclo automático | carrossel atual (já funciona bem) |
| **Depoimentos** | v9 VK Fest: coverflow 3D em arco curvo rotacionando | carrossel horizontal flat com snap |
| **CTA final** | v1 Sonneto: tipo gigante "BORA COMEÇAR?" + blobs orgânicos animados | tipo grande + blobs estáticos com gradiente |

## Sistema de detecção de dispositivo (mobile-light mode)

Hook único `useDeviceTier()` que retorna `'light' | 'full'`:

```text
- Detecta: largura < 768px OU
- navigator.hardwareConcurrency < 4 OU
- navigator.deviceMemory < 4 OU
- prefers-reduced-motion: reduce OU
- Conexão 'slow-2g'/'2g'/'3g' (Network Information API)
→ Retorna 'light'
```

Cada componente pesado consulta o hook e renderiza a variante apropriada. Componentes WebGL são **code-splitted** (`React.lazy`) — só baixam o bundle do Three.js quando o dispositivo é `full`. Em `light`, nem o JS do Three.js é carregado.

## Detalhes técnicos por efeito

### v6 — AboutMe foto (sticker hero)
- Foto principal grande, centralizada
- 4-5 SVGs/badges flutuando (nome, "Web Designer", estrelas) usando `motion` com `animate={y: [0, -8, 0]}` em loop
- Halo neon ciano/verde atrás via `box-shadow` animado
- Mobile-light: foto + 2 badges estáticos

### v5 — AboutMe parágrafo (word-by-word reveal)
- Divide texto em `<span>` por palavra
- `useScroll` + `useTransform` mapeia progresso para opacidade/cor de cada palavra (transição cinza→branco)
- Mobile-light: parágrafo inteiro com `whileInView` fade-in

### v2 — Compromisso (sticky horizontal scroll)
- Reescreve `HorizontalNotebookScroll` no padrão Jeton:
- Container alto (300vh). Dentro, `sticky top-0` com título à esquerda + track horizontal à direita
- Track translateX baseado em `scrollYProgress`
- 4 cards passam por cima do título
- Mobile-light: título normal + cards empilhados verticais com fade-in

### v3 — Como Funciona (barras que expandem)
- 4-5 barras finas verticais (40px de largura cada) lado a lado
- `useTransform` por barra: largura cresce de 40px → 280px conforme entra na viewport
- Texto da etapa aparece dentro da barra quando expandida (`opacity` ligado ao mesmo progresso)
- Mobile-light: timeline vertical atual com fade-in stagger

### v7 — Explore em 3D (páginas flutuando)
- Substitui iframe Sketchfab por cena **Three.js** com `@react-three/fiber@^8.18` + `@react-three/drei@^9.122.0`
- 4-5 planos 3D com textura de cada screenshot do portfólio
- Posicionados em profundidade aleatória, com flutuação senoidal contínua + leve rotação
- `OrbitControls` (sem zoom) para drag suave
- Iluminação: 2 spotlights coloridos (ciano + verde) + ambient
- `Suspense` com fallback skeleton
- `Canvas` em `React.lazy` → bundle separado
- Mobile-light: grid 2x2 estático das mesmas screenshots com leve `hover:scale`

### v8 — Portfolio abertura (mosaic + giant type)
- Antes dos cards de projeto, adicionar bloco hero:
- Tipografia "TRABALHOS" em `text-[20vw]` com `letter-spacing: -0.05em` e gradiente
- 6-8 thumbnails de projetos em mosaico bento ao redor, com paralaxe leve no scroll
- Mobile-light: título 8vw + grid 2x2 sem paralaxe

### v4 — Portfolio cards (nome atrás + tela flutuando)
- Mantém carrossel infinito atual, mas reformula cada card:
- Camada de fundo: nome do projeto em `text-8xl` opacidade 15%, posição absoluta
- Camada da frente: screenshot do site com `transform: translateZ(60px) rotate(-2deg)`, sombra elevada
- Auto-rotação a cada 4s troca o card central com `AnimatePresence`
- Mobile-light: carrossel atual sem profundidade 3D

### v9 — Depoimentos (coverflow 3D)
- Substitui carrossel atual por coverflow:
- 5 cards em arco curvo, card central em foco (escala 1, frente)
- Cards laterais com `rotateY` ±35°, `translateZ -100`, escala 0.8, opacidade 0.5
- Setas e auto-rotação a cada 5s
- CSS pure: `transform-style: preserve-3d` no container + `perspective: 1200px`
- Mobile-light: carrossel horizontal flat com `scroll-snap`

### v1 — CTA final (kinetic type + blobs)
- Headline "BORA COMEÇAR?" em `text-[15vw]` com font weight 900
- 3-4 blobs SVG orgânicos verdes/cianos absolutamente posicionados, `animate` com morph de `borderRadius` em loop
- Blobs com `mix-blend-mode: screen` por cima do título
- Mobile-light: título menor (text-6xl) + blobs estáticos com gradiente

## Performance

- Todos os WebGL/Canvas (`v7`) em `React.lazy()` + `Suspense`
- Animações pesadas só registram listeners se `useDeviceTier() === 'full'`
- Imagens dos efeitos com `loading="lazy"` exceto LCP
- Three.js scene: `dpr={[1, 2]}` desktop, `frameloop="demand"` em pause quando fora da viewport (IntersectionObserver)
- Total de novos pacotes: `three`, `@react-three/fiber@^8.18`, `@react-three/drei@^9.122.0`

## Arquivos

**Novos:**
- `src/hooks/use-device-tier.ts` — detecção light/full
- `src/components/effects/StickerAvatar.tsx` (v6)
- `src/components/effects/WordRevealText.tsx` (v5)
- `src/components/effects/HorizontalCards.tsx` (v2, substitui Compromisso)
- `src/components/effects/ExpandingBars.tsx` (v3)
- `src/components/effects/FloatingPages3D.tsx` (v7, lazy)
- `src/components/effects/PortfolioMosaicHero.tsx` (v8)
- `src/components/effects/Coverflow3D.tsx` (v9)
- `src/components/effects/KineticBlobsCTA.tsx` (v1)

**Editados:**
- `src/components/AboutMe.tsx` (usa StickerAvatar + WordRevealText)
- `src/components/HorizontalNotebookScroll.tsx` (vira wrapper que escolhe HorizontalCards)
- `src/components/HowItWorks.tsx` (usa ExpandingBars no desktop)
- `src/components/ModelViewer3D.tsx` (usa FloatingPages3D)
- `src/components/Portfolio.tsx` (adiciona PortfolioMosaicHero + cards reformulados)
- `src/components/Testimonials.tsx` (usa Coverflow3D no desktop)
- `src/components/CTASection.tsx` (usa KineticBlobsCTA)

**Sem mudança:** Hero, BenefitsBar, FAQ, Header, Footer

## Ordem de implementação

1. Hook `useDeviceTier` (base de tudo)
2. Efeitos leves primeiro (v5, v6, v1) — sem dependências novas
3. Efeitos médios (v2, v3, v8, v9) — só CSS/Framer Motion
4. Efeitos pesados (v4) — refactor do Portfolio
5. WebGL (v7) — instalar three + lazy load

## Limitação honesta

O efeito v7 (páginas 3D flutuando) usa **planos com textura**, não modelos 3D completos dos sites. Reconstruir 3D real de cada site daria 10x mais trabalho e mataria a performance — a solução com planos é o padrão usado por Beeyond e similares e visualmente fica idêntico.