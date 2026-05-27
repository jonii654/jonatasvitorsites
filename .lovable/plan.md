# Portar efeitos do HTML de referência para o site React

Vou mapear cada efeito do HTML/vídeo enviado para o componente React correspondente, mantendo a stack atual (React + GSAP + Tailwind + tokens semânticos do `index.css`).

## 1. Menu Ripple "Estúdio Namma" — `RippleMenu.tsx` + `Header.tsx`

- Overlay com `clip-path: circle(0% at 93% 6%) → circle(150% at 93% 6%)` (já existe parcialmente, vou alinhar à referência).
- Coluna esquerda com **foto vertical rotacionada -2°** que troca via opacity ao passar o mouse em cada link (`data-preview` → `m-img-home / work / showcase / brands`).
- Links gigantes (`text-7xl font-display font-black`) com número `01..04` à esquerda e **risco neon verde-limão** central no hover (pseudo `::after` com `scaleX 0→1`).
- Caption inferior (`CONCEITO PREMIUM`) que muda conforme link com `data-caption`.
- Trigger único (hamburger neon `bg-brand-accent`) que troca para "X" via tween de `path d`.

## 2. Botão Lemon — novo utilitário em `index.css` + aplicar em Header CTA e Footer CTA

- Estrutura: pílula com borda, texto à esquerda, círculo pequeno (`32×32`) à direita.
- No hover: círculo escala `scale(8)` e migra para o centro, texto vira preto.
- Substitui o atual `.btn-lemon`/`.cta-burst` por implementação fiel da referência (sem conflito de pseudo-elementos).

## 3. Botão Gumroad 3D — `Hero.tsx`

- CTA principal do Hero: fundo `brand-accent`, borda preta, `shadow [4px 4px 0 white]`, no hover translada `+3px,+3px` e sombra colapsa para `[1px 1px 0]` (efeito de clique tátil).

## 4. Stacking "WORK" — `DesignStacking.tsx` (reescrita)

- Wrapper `h-[350vh]` + `sticky top-0 h-screen`.
- Texto gigante `WORK` (`text-[30vw] font-black opacity-10`) atrás, **z-0**.
- 3 cards compactos (`max-w-sm`) passando **por cima** do texto (z-10): tons moss-green e terra como na referência.
- Timeline GSAP com `scrub` ligando: card1 recua (`scale 0.88, y -12vh, opacity 0.35`) enquanto card2 sobe (`y 100vh → 0`), depois mesma transição entre card2 → card3.
- Mantém a integração já existente em `Interactive3DCard` (pilot-card continua sendo a base 3D em outra seção).

## 5. Portfolio Premium Drag — `Portfolio.tsx` (refinado)

- Box central com **watermark gigante** (`text-[18vw]` da palavra-chave do projeto) ao fundo.
- Coluna esquerda: tag piscante, título `text-6xl`, descrição, specs (Performance / Conversão).
- Coluna direita: mockup aspect-video que **inclina com o arraste** (`x: diff*0.3, rotate: diff*0.05`) e volta com `power2.out`.
- Swipe tátil + drag de mouse com threshold de 80px para avançar/voltar.
- Cor de fundo do box e do `body` muda suavemente por projeto (`ambientColor`), só enquanto a seção está visível (`ScrollTrigger onEnter/onLeave`).
- Setas inferiores + contador `0X / 05`.

## 6. Marquee Infinito — novo componente `BrandsMarquee.tsx` (substitui parte do Footer/Testimonials area, ou insere antes do CTA)

- Duas faixas de texto gigante (`text-8xl font-display opacity-5`) com nomes de marcas, uma rolando para a esquerda e outra para a direita (`@keyframes marquee` 30s linear).
- Card central aspect-video com gradient moss + imagem em `mix-blend-overlay` e título "Marcas e Projetos".

## Onde encaixar no `Index.tsx`

Sem mexer na lógica, só na camada visual:

```text
Hero (botão Gumroad) 
 → PortalTransition 
 → Interactive3DCard (mantém pilot-card 3D)
 → DesignStacking (agora = stacking WORK)
 → BenefitsBar / AboutMe / HorizontalNotebookScroll / HowItWorks
 → Portfolio (refeito com drag + watermark + ambient color)
 → BrandsMarquee (novo, antes de Testimonials)
 → Testimonials / FAQ / CTASection (CTA com botão Lemon novo)
```

## Detalhes técnicos

- Tudo via **GSAP + ScrollTrigger** (já no projeto), nada de `<script src>` CDN.
- Cores adicionadas como tokens em `index.css` (`--brand-accent: 75 100% 60%`, `--brand-moss: 138 17% 12%`, `--brand-sand: 36 35% 87%`) e expostas em `tailwind.config.ts` para uso semântico.
- Mobile: `scrub` mais curto (`0.7`), stacking permanece, drag usa `touchstart/move/end` com `{ passive: true }`.
- Respeitar memória do projeto: `overflow-x: clip` só em `Index.tsx`, nunca em `html/body`.
- Sem alterações de backend, dados ou rotas — puramente front-end/UI.

## Arquivos afetados

- `src/index.css` — tokens + `.btn-lemon` reescrito + `.btn-gumroad` + keyframes marquee + `.namma-link`
- `tailwind.config.ts` — cores `brand.accent/moss/sand`
- `src/components/Header.tsx` — CTA esquerdo vira botão Lemon
- `src/components/effects/RippleMenu.tsx` — layout Namma (foto + links numerados + risco verde)
- `src/components/Hero.tsx` — CTA Gumroad 3D
- `src/components/DesignStacking.tsx` — reescrito como stacking "WORK"
- `src/components/Portfolio.tsx` — refeito com drag/swipe + watermark + ambient color
- `src/components/BrandsMarquee.tsx` — novo
- `src/components/CTASection.tsx` / `src/components/Footer.tsx` — CTA final usa botão Lemon
- `src/pages/Index.tsx` — insere `BrandsMarquee`

Confirmar e eu executo todas as mudanças de uma vez.
