## Objetivo

Criar uma transição imersiva tipo "portal cósmico" (estilo Shopify Editions) entre a Hero e a seção "O DESIGN QUEM FAZ É VOCÊ", e remover o efeito 3D do notebook que fica logo após a Hero.

## Mudanças

### 1. Remover o notebook 3D (`src/pages/Index.tsx`)
- Remover o `<ModelViewer3D />` (e seu `Suspense` + import lazy) que aparece logo após a `<Hero />`. O `Interactive3DCard` permanece, pois ele contém o título "O DESIGN QUEM FAZ É VOCÊ" — é exatamente a seção que o portal vai "revelar".

### 2. Criar `src/components/PortalTransition.tsx`
Componente novo, inserido **entre `<Hero />` e `<Interactive3DCard />`**.

**Estrutura:**
- Wrapper `<section>` com `height: 320vh` para dar pista de scroll.
- Filho `sticky top-0 h-screen` que trava a tela durante a animação.
- Fundo: `bg-background` + grid radial sutil (`radial-gradient` de pontos) já no padrão do projeto.

**Cenas (controladas via `useScroll` + `useTransform` do framer-motion, sem GSAP):**

1. **Cena A — Texto guia (0–25%)**
   - Eyebrow "PORTAL CRIATIVO" + headline curta "Atravesse a porta" + dica "role para baixo".
   - Sai com `opacity 1→0`, `y 0→-30`, `scale 1→0.96`.

2. **Cena B — Linhas cibernéticas convergentes (0–50%)**
   - Duas SVGs (linhas tracejadas com glow ciano/verde, usando tokens `--primary` / `--accent` do design system) entram das laterais (`left/right: -25vw → 14vw`), `opacity 0→0.8`.
   - Substituem as "mãos" do HTML de referência, mantendo o gesto de convergência.

3. **Cena C — Núcleo de explosão (35–60%)**
   - Disco central: bolinha branca com `box-shadow` ciano/verde + anel `animate-ping` + halo radial (gradiente `--primary`/`--accent`).
   - `opacity 0→1`, `scale 0.5→1.8→ (mobile 35 / desktop 60)`, `rotate 0→180`.
   - Linhas convergentes saem (`opacity →0`, voltam para fora) entre 50–70%.

4. **Cena D — Abertura do portal (55–95%)**
   - Camada `absolute inset-0 z-40` com `clipPath: circle(0% at 50% 50%) → circle(155% at 50% 50%)` revelando uma "antecâmara" com:
     - Eyebrow "PRÓXIMO CAPÍTULO"
     - Headline "O DESIGN QUEM FAZ É VOCÊ" (mesma tipografia/gradiente da seção real para emendar visualmente)
     - Subtítulo curto + seta animada apontando para baixo
   - O `Interactive3DCard` real continua logo abaixo, então o usuário "atravessa" o portal e cai direto nele.

**Performance / mobile (regras do projeto):**
- `useDeviceTier()` — em `light` reduz a escala final do núcleo (35 vs 60) e desliga o anel `animate-ping` extra.
- `useReducedMotion()` do framer-motion — se ativo, mostra só o conteúdo da Cena D estático, sem pinning longo (altura cai para `100vh`).
- Todos os elementos animados recebem `will-change: transform, opacity` e `transform: translate3d(0,0,0)` (classe utilitária inline) para GPU.
- Nada de `backdrop-blur` pesado nem `filter: blur` no mobile.
- Sem canvas/WebGL — só SVG + divs + gradientes CSS.

**Tokens visuais (design system):**
- Glow ciano: `hsl(195 100% 50%)` (`--cyan-glow`)
- Glow verde: `hsl(155 100% 50%)` (`--neon-green`)
- Fundo: `hsl(var(--background))`
- Reaproveita `bg-neon-gradient`, `shadow-glow`, `shadow-glow-intense` já no `tailwind.config.ts`.

### 3. `src/pages/Index.tsx`
Ordem final do `<main>`:
```
<Hero />
<PortalTransition />        ← novo, substitui o ModelViewer3D
<Interactive3DCard />
<BenefitsBar />
...
```
Importação lazy via `Suspense` igual aos outros.

## Não muda
- Hero, Interactive3DCard, BenefitsBar, AboutMe, HorizontalNotebookScroll, demais seções.
- Lógica do duplo-toque do `Interactive3DCard`.
- Preloader e MaintenanceBanner.
- Sem alteração em rotas, dados ou backend.

## Detalhes técnicos
- `useScroll({ target: sectionRef, offset: ["start start", "end end"] })` para `scrollYProgress`.
- Cada elemento usa `useTransform(scrollYProgress, [a,b], [from,to])` — zero `requestAnimationFrame` manual.
- `clipPath` animado via `motion.div style={{ clipPath }}` (string interpolada com `useMotionTemplate`).
- Memória de layout: aplicar `overflow-x: clip` permanece só no wrapper raiz de `Index.tsx`, conforme regra do projeto (nada em `html/body`).
