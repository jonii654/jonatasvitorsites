## Mudanças

### 1. Hero — cards maiores + flutuação + interação no mouse (`src/components/Hero.tsx`)
- **Tamanho maior**: `w-44 h-56 md:w-80 md:h-[26rem]`. Reposicionar `top/bottom-[4%]`, `left/right-[1%] md:[3%]`.
- **Flutuação suave (sempre)**: trocar `<div>` por `motion.div` com `animate={{ y: [0, ±8, 0] }}`, `duration: 6-8s`, `repeat: Infinity`, fases desencontradas por índice — leve, GPU-friendly em ambos.
- **Desktop (≥ md) — interação com mouse**:
  - Usar `useDeviceTier()` + `useIsMobile()` para condicionar.
  - Cada card recebe `useMotionValue(x,y)` + `useTransform` para `rotateX/rotateY` (tilt 3D ±10°) em resposta ao `onMouseMove` do container Hero (parallax sutil baseado na distância do cursor a cada card).
  - Cursor "spotlight": `motion.div` `pointer-events-none` posicionado em `cursorX/cursorY`, `radial-gradient` cyan→transparente, `mix-blend-mode: screen`, segue o mouse com `useSpring` (stiffness 200, damping 30).
  - Headline e CTA com leve parallax inverso ao cursor (`translate ±6px`).
- **Mobile / tier `light`**: pular o tilt, spotlight e parallax do cursor — manter só a flutuação `y` (já é leve), dots reduzidos (já em `slice(0,10)`).

### 2. Hero — mais "bolinhas de energia"
- Acrescentar ~10 dots ao array; aumentar `boxShadow` para `${size*3}px` + opacidade +0.1.
- Adicionar 3 `floating-orb` (cyan/green, blur 80px) atrás dos cards — desktop only (condicionar render por `!isLight`).

### 3. Hero — sombreamento mais forte no headline "Crio sites que Vendem"
- "Crio" e "Vendem": 7 camadas sólidas de `textShadow` + glow externo `0 0 60px` (cyan/green).
- "que" e "sites": reforçar glow.
- Sem mudar tipografia.

### 4. PortalTransition — bolinha centralizada + mãos com luvas (`src/components/PortalTransition.tsx`)
- **Substituir as 2 setas SVG por 2 mãos com luvas** (SVG inline de palma aberta):
  - Luva esquerda **azul** (`hsl(195 100% 50%)`), luva direita **verde** (`hsl(155 100% 50%)`).
  - Entram das laterais: `x: ['-45vw'→'0']` e `['45vw'→'0']` em `scrollYProgress` 0→0.45, ambas perfeitamente centradas verticalmente.
  - Impacto em 0.45-0.55: `scale: 1 → 1.18 → 1` + flash branco rápido (`div absolute inset-0`, `opacity 0→0.7→0`).
  - Mãos somem (`opacity → 0`) imediatamente após o impacto.
- **Núcleo nasce exatamente no centro do "puf"**: ajustar `coreOpacity` para `[0.45, 0.55, 0.9]` → `[0, 1, 1]`; `coreScale` para `[0.5, 0.6, 1]` → `[0, 1.8, finalScale]`. Wrapper já está em `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` — manter.
- **Desktop**: aceleração + glow extra (já condicional por `isLight`).
- **Mobile (`isLight`)**: mãos simples sem `drop-shadow`/blur, `finalScale: 35`, sem ping ring; já implementado parcialmente.

### 5. PortalTransition — abertura revela próxima seção (não preto)
- Hoje o stage fica `bg-background` puro → quando núcleo cobre tudo, aparece preto vazio.
- Trocar `bg-background` por **gradiente combinando com início de `Interactive3DCard`** (mesmo `hsl(220 50% 8%)` + radial cyan/green leve).
- Encurtar `height` da seção de `220vh` → `170vh` para emendar mais cedo.
- `stageOpacity` em `[0.92, 1] → [1, 0]` (some já bem no fim).
- `Index.tsx` já tem `Interactive3DCard` logo depois — sem mudança.

### 6. Timing — efeito começa ao sair da seção Hero
- Já funciona: `PortalTransition` usa `scrollYProgress` próprio com `offset: ['start start', 'end end']` e segue diretamente após a Hero. Sem mudanças.

## Performance / mobile-first
- Sem WebGL, Three.js, GSAP — apenas Framer Motion (já no projeto), CSS transforms e `will-change: transform`.
- Todos os efeitos pesados (cursor spotlight, tilt 3D, orbs blur, ping ring, drop-shadow nas mãos) são condicionados por `useDeviceTier() === 'light'` ou `useIsMobile()` → desativados no celular.
- Animações usam `transform/opacity` (GPU), `useSpring` com damping alto, sem layout thrashing.

## Arquivos afetados
- `src/components/Hero.tsx` — cards maiores + motion.div flutuante + tilt/spotlight desktop + headline com mais sombra + mais dots/orbs.
- `src/components/PortalTransition.tsx` — mãos com luvas, sincronização do "puf", centralização verificada, fundo emendando com próxima seção, altura ajustada.
- `src/index.css` — keyframe opcional para flash branco; ajustes mobile já cobertos pelas media queries existentes.

## Sem mudanças
- Estrutura geral, tipografia, demais seções, design system, `Index.tsx`.
