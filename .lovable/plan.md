# Correções: Menu, Botão CTA e Stacking de Cards

## 1. RippleMenu — abrir/fechar e mobile travado

**Problemas identificados:**
- O trigger do menu está só no mobile (`md:hidden`). No desktop não há botão pra abrir o ripple.
- `display:'none'` + `clipPath` se sobrepõem: em mobile o GSAP usa `autoAlpha` mas o container começa com `display:none`, então o `fromTo` de `autoAlpha` colide com o `gsap.set(display:'block')` disparado em `open=true`.
- A timeline é construída em `useLayoutEffect` dependente de `isMobile`, então no primeiro toggle `tlRef.current` pode ainda estar `null` (race).

**Mudanças em `src/components/Header.tsx`:**
- Adicionar trigger único (ícone hambúrguer animado) visível em desktop E mobile, posicionado no canto superior direito (origem do clip-path).
- Manter os links inline do desktop ou ocultá-los — usar só o trigger + RippleMenu fullscreen como solicitado no HTML de referência.

**Mudanças em `src/components/effects/RippleMenu.tsx`:**
- Remover `display:'none'` inline. Usar `visibility/pointer-events` controlados via `gsap.set` para evitar conflito com `autoAlpha`.
- Construir a timeline com `gsap.context` mas inicializar o estado fechado via `gsap.set` no mount (não depender de inline style).
- No mobile, simplificar: usar só `autoAlpha` + stagger dos links (sem clip-path, GPU leve).
- No desktop, manter clip-path circular (`circle(0% at ...) → circle(160% at ...)`) com `ease: power3.inOut`.
- Garantir cleanup: `tl.kill()` no revert; remover `setTimeout` frágil — usar `onReverseComplete` da própria timeline.
- Ajustar trigger position (`calc(100% - 36px) 36px`) pra bater com a posição real do botão no Header em ambos breakpoints.

## 2. Botão "Quero meu site" — efeito não pega

**Problema identificado:**
- `.btn-lemon::before` (círculo gradiente que cresce no hover) e `.cta-burst::before` (anel de burst no click) competem pelo MESMO pseudo-elemento `::before`. Quando `cta-burst` é aplicado, o círculo lemon desaparece.
- O efeito visual original (HTML de referência) era circular gradient azul→limão crescendo de dentro pra fora — está implementado mas mascarado pelo conflito.

**Mudanças em `src/index.css`:**
- Mover `.cta-burst` para usar `::after` em vez de `::before` (libera o `::before` para o lemon).
- Garantir que `.btn-lemon` tenha `position: relative` + `isolation: isolate` (já tem) e que o `::before` use `inset: 0` + `border-radius: inherit` em vez de `width: 120%; aspect-ratio: 1` — assim o círculo cobre o pill inteiro de forma confiável em qualquer largura.
- Ajustar `transform-origin` pra animar de scale(0) no centro pra scale(1) cobrindo todo o botão.
- Validar `.btn-gumroad` (sombra 3D offset) — já está correto, só conferir que `Ver portfólio` no Hero usa essa classe (já usa).
- Manter `var(--gradient-neon)` (azul→limão) como fill — cores neon corretas.

## 3. Stacking effect — mover pro Card 3D existente

**Problema identificado:**
O usuário quer que o efeito de cards subindo (atualmente na `DesignStacking`) seja aplicado **dentro** da seção do `Interactive3DCard` (pilot-card). O pilot-card original fica como card base e os 4 cards de referência (`design-ref-1..4`) sobem por cima conforme o scroll. O watermark "DESIGN" gigante e o título "O design quem faz é você" continuam onde estão na `DesignStacking`.

**Mudanças em `src/components/Interactive3DCard.tsx`:**
- Envolver a seção num wrapper `h-[400vh]` (desktop) / `h-[280vh]` (mobile) com `sticky top-0` interno.
- Manter o card 3D pilot-card como camada base (z-0), preservando rotateX/Y, drag e double-tap (lógica intacta).
- Adicionar acima dele um stack de 4 cards (`design-ref-1-hadi`, `2-kpr`, `3-ascend`, `4-oryzo`) usando GSAP + ScrollTrigger com `scrub`.
- Timeline: cada novo card sobe de `yPercent: 100 → 0` enquanto o anterior recua (`scale: 0.88, opacity: 0.35, yPercent: -10`). O pilot-card é o "card 0" — quando o card 1 sobe, ele recua também (vai pro fundo, como o usuário pediu).
- Mobile: scrub mais curto (`0.6`), animações com `force3D: true` + `will-change: transform, opacity`, sem mouse parallax.
- Desabilitar drag/rotate do pilot-card enquanto outros cards estiverem por cima (`pointer-events: none` no pilot quando `progress > 0.1`) pra evitar conflito de gesto com scroll.

**Mudanças em `src/components/DesignStacking.tsx`:**
- Remover o stack de cards interno. Manter apenas:
  - O título "Design / O design quem faz é você" no topo.
  - O watermark gigante "DESIGN" centralizado com leve scale/opacity tween via ScrollTrigger.
- Reduzir altura pra `h-[120vh]` (desktop) / `h-[100vh]` (mobile) — só hero text + watermark.
- Manter cor de fundo `hsl(220 50% 6%)` e o gradiente neon no "você".

**Mudanças em `src/pages/Index.tsx`:**
- Nenhuma reordenação — a ordem `Interactive3DCard → DesignStacking` continua. O efeito de stacking acontece dentro da primeira; a segunda vira só uma seção de "letreiro DESIGN" como transição visual.

## 4. Detalhes técnicos

**Performance mobile (mantido):**
- GSAP ScrollTrigger só carrega via lazy import (já é).
- `useIsMobile` controla `scrub` curto e desabilita parallax pesado.
- Todas animações usam `transform`/`opacity` (GPU), `will-change` declarado.
- Sem WebGL/Canvas adicionados.

**Cleanup:**
- `gsap.context()` em todos os componentes pra revert automático no unmount.
- `tlRef.current?.kill()` explícito antes de recriar timeline.

**Arquivos alterados:**
- `src/components/Header.tsx` — trigger desktop + mobile do RippleMenu
- `src/components/effects/RippleMenu.tsx` — fix abrir/fechar, mobile sem clip-path
- `src/index.css` — `.cta-burst` usar `::after`; `.btn-lemon::before` cobrir botão inteiro
- `src/components/Interactive3DCard.tsx` — adicionar stack de 4 cards sobre o pilot-card
- `src/components/DesignStacking.tsx` — remover cards, manter só watermark + título

**Fora de escopo:**
- AboutMe, VideoBackground, HorizontalNotebookScroll, HowItWorks, Portfolio, Testimonials, FAQ, CTASection, Footer — intactos.
- Paleta principal — mantida (azul/cyan). Gradiente neon azul→limão continua só como accent.
