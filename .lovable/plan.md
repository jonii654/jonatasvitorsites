## Objetivo
Portar **os efeitos** do HTML enviado para o site React existente — usando **GSAP + ScrollTrigger** (instalar) junto com o Framer Motion já presente. Mantenho conteúdo, identidade ("Jônatas Vitor") e paleta atual (azul/cyan). O "verde-limão" do código original vira um **gradiente neon azul→limão** (`hsl(200 100% 55%)` → `hsl(75 100% 60%)`) usado só nos acentos novos.

## 0. Setup
- `bun add gsap` (já vem com ScrollTrigger).
- Novo token CSS em `src/index.css`:
  - `--accent-lime: 75 100% 60%;`
  - `--gradient-neon: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent-lime)));`

## 1. Botões — Lemon Hover + Gumroad 3D (CSS puro, sem GSAP)
**`src/index.css`** — adicionar:
- `.btn-lemon` — pill com `<span class="lemon-circle">` que expande no hover (`transform: scale(8)`, `cubic-bezier(0.16,1,0.3,1)`). Círculo usa `background: var(--gradient-neon)`; texto vira `hsl(var(--background))` no hover.
- `.btn-gumroad` — fundo `var(--gradient-neon)`, borda preta, `box-shadow: 4px 4px 0 hsl(var(--foreground))` que colapsa para `1px 1px` com `translate(3px,3px)` no hover.
- `.namma-link::after` — risco central com `background: var(--gradient-neon)`, `scale-x 0→1`, transform-origin center, `cubic-bezier(0.16,1,0.3,1)`.

**Aplicação:**
- `Hero.tsx`: CTA "Quero meu site" → `.btn-lemon`; CTA "Explorar Portfólio" → `.btn-gumroad`.
- `CTASection.tsx`: CTA final → `.btn-lemon` grande.
- `Header.tsx`: pill WhatsApp → `.btn-lemon` compacto.

## 2. Hero — gradiente neon em "Vendem"
**`src/components/Hero.tsx`** — "Vendem" recebe `bg-clip-text text-transparent` com `background: var(--gradient-neon)` + `drop-shadow` neon. "Crio" mantém as 7 camadas de sombra atuais (efeito 3D aprovado).

## 3. Menu Ripple com foto lateral (GSAP)
**Novo `src/components/effects/RippleMenu.tsx`** — substitui `FullscreenMenu` no `Header.tsx`.

Portar **literalmente** a lógica do código enviado, em React+TS:
- `gsap.timeline({ paused: true })` com:
  - `clip-path: circle(0% at 93% 6%)` → `circle(150% at 93% 6%)`, `power3.inOut`, 0.75s.
  - Hambúrguer → X via `gsap.to(path, { attr: { d: ... } })`.
  - Links `fromTo({ y:30, opacity:0 }, { y:0, opacity:1, stagger:0.08 })` em 0.3s.
- Refs em vez de querySelectors; timeline criada num `useLayoutEffect` com `gsap.context()` para cleanup.
- Foto lateral 3/4 com 4 imagens absolutas; troca por opacidade no `onMouseEnter` de cada link.
- Links gigantes (`text-5xl md:text-7xl font-display`) numerados `01..05`: **Home / Sobre / Design / Portfólio / Contato**, com `.namma-link` (risco neon central).
- Body scroll lock quando aberto.
- Mobile: detecta `useIsMobile()` — se mobile, animação simplificada (`opacity` + `y`) sem clip-path nem foto lateral.

## 4. Nova seção "O design quem faz é você" — Scroll Stacking Cards (GSAP ScrollTrigger)
**Novo `src/components/DesignStacking.tsx`**, inserido em `Index.tsx` logo após `Interactive3DCard`.

Porte direto do bloco "MOSS VIBE" do HTML:
- Wrapper `h-[300vh]` (mobile `h-[220vh]`); interno `sticky top-0 h-screen`.
- Palavra de fundo gigante `DESIGN` (`text-[28vw] font-display`, opacidade 0.08→0.18 via scrub).
- 3 cards absolutos (placeholder com assets atuais — usuário enviará as fotos finais; código preparado para troca rápida via array).
- `gsap.timeline({ paused: true })` idêntica:
  - Card 1: `scale 0.88, opacity 0.35, y -12vh`.
  - Card 2: `y 100vh → 0vh`, depois `scale 0.9, opacity 0.35, y -8vh`.
  - Card 3: `y 100vh → 0vh`.
- `ScrollTrigger.create({ trigger, start:"top top", end:"bottom bottom", scrub: isMobile?0.7:1.1, onUpdate: self => tl.progress(self.progress) })`.
- Mobile: 2 cards, palavra com opacidade fixa.

## 5. Portfolio — watermark gigante + transição de cor por projeto
**`src/components/Portfolio.tsx`** — mantém estrutura/swipe/modal atuais. Adições:
- Cada projeto recebe `bgColor` no objeto.
- Container do card ativo: `transition: background-color 0.7s ease`.
- Texto d'água absoluto atrás do card: `text-[18vw] font-display opacity-[0.025]` com nome curto do projeto, troca via `transition-opacity 0.5s` ao mudar slide.
- Não altero `document.body` (evita conflito com `VideoBackground`).

## 6. Preloader — risco neon final
**`src/components/Preloader.tsx`** — linha embaixo da barra de progresso que cresce com `scale-x` (CSS, sem GSAP). Usa `var(--gradient-neon)`.

## 7. Performance / mobile
- GSAP + ScrollTrigger só no desktop para timelines pesadas; em mobile uso `scrub` curto e desativo a palavra gigante (mantém estabilidade).
- Todas as animações com `force3D: true` / `will-change: transform`.
- `gsap.context()` em cada componente para cleanup limpo no unmount.
- Mantenho a regra do mem: `overflow-x: clip` só no wrapper de `Index.tsx`, nunca em `html/body` (sticky do stacking depende disso).

## Arquivos afetados
- `package.json` — `gsap`.
- `src/index.css` — tokens neon + classes `.btn-lemon`, `.btn-gumroad`, `.namma-link`.
- `src/components/Hero.tsx` — gradiente neon + classes nos CTAs.
- `src/components/Header.tsx` — troca `FullscreenMenu` por `RippleMenu`; WhatsApp btn-lemon.
- `src/components/effects/RippleMenu.tsx` — novo (GSAP).
- `src/components/DesignStacking.tsx` — novo (GSAP ScrollTrigger).
- `src/pages/Index.tsx` — importa `DesignStacking`.
- `src/components/Portfolio.tsx` — watermark + bgColor por projeto.
- `src/components/CTASection.tsx` — botão lemon.
- `src/components/Preloader.tsx` — risco neon.

## Fora do escopo
- AboutMe ("Prazer, sou o Jonas"), VideoBackground, HowItWorks, Testimonials, FAQ, BenefitsBar, Footer, paleta principal — intactos.

## Pendente do usuário
- Fotos finais dos cards de "O design quem faz é você". Começo com placeholders e troco quando enviar.
