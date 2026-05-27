## Mudanças

### 1. `src/components/Hero.tsx` — cards em X + mais partículas

**Cards (formação em X com 4 no total):**
- Hoje existem 3 cards decorativos (top-left -12°, bottom-right +6°, top-right +12° desktop-only).
- Reorganizar para **4 cards** posicionados nas 4 pontas formando um **X**:
  - Top-left, rotação `-14°`
  - Top-right, rotação `+14°`
  - Bottom-left, rotação `+14°`
  - Bottom-right, rotação `-14°`
- Cada card passa a exibir um **screenshot real de site** do portfólio (já no projeto: `portfolio-advocacia.png`, `portfolio-beatriz.png`, `portfolio-clinicaiphone.png`, `portfolio-vinidigital.png`). Imagem com `object-cover`, leve overlay escuro + borda ciano/verde sutil para casar com o design system.
- Mantém o efeito de "reagir ao hover do CTA" — cada card se inclina/afasta um pouco a mais quando o usuário passa o mouse no botão "Quero meu site".
- No mobile: mostram os 4 (menores, `w-24 h-32`), nada de `hidden md:block`.

**Partículas (mais profundidade):**
- Aumentar o array `floatingDots` de 14 → ~26 pontos, com tamanhos variando 3–9px e mais distribuídos em z (alguns com `boxShadow` maior + `opacity 0.35–0.7` para criar parallax visual).
- Adicionar uma **segunda camada** de pontos bem pequenos (2–3px, `opacity 0.25`) com movimento mais lento — sensação de "poeira estelar" ao fundo.
- No mobile (`isLight`) cortar para ~10 pontos no total para preservar performance (regra do projeto).

### 2. `src/components/PortalTransition.tsx` — portal direto, sem texto duplicado

**Remover totalmente a Cena A** (eyebrow "PORTAL CRIATIVO" + headline "Atravesse a porta" + dica "role para baixo"). A transição começa direto.

**Núcleo nasce no meio:**
- A bolinha branca já aparece centralizada; manter `top-1/2 left-1/2`.
- Animação: `opacity 0→1` e `scale 0→1.8→ (35 mobile / 60 desktop)` começando **logo no início do scroll** (0→0.5→0.95) em vez de 0.3.
- Linhas convergentes ciano/verde entram nos primeiros 0–35% e somem em 50%, dando a sensação de "se concentrando no meio".

**Cena D (abertura) — sem conteúdo duplicado:**
- O `clipPath: circle(0% → 160%)` continua, mas a camada revelada fica **transparente** (sem `bg-background`, sem headline "O DESIGN QUEM FAZ É VOCÊ", sem subtítulo, sem seta).
- Visualmente: a bolinha cresce, "rasga" o fundo da seção do portal, e o usuário enxerga direto a próxima seção (o `Interactive3DCard` já vem logo abaixo na ordem do `Index.tsx`).
- Reduzir a altura do wrapper de `320vh` → `220vh` para a transição não arrastar demais agora que a Cena A saiu.

**Modo `prefers-reduced-motion`:**
- Em vez do bloco textual "Atravesse o portal", renderizar `null` (componente some) — o usuário cai direto no Hero → Interactive3DCard sem transição extra.

### 3. `src/pages/Index.tsx`
- Nenhuma mudança estrutural. Ordem segue:
  ```
  <Hero /> → <PortalTransition /> → <Interactive3DCard /> → ...
  ```

## Não muda
- Interactive3DCard (já tem o título "O DESIGN QUEM FAZ É VOCÊ" — é exatamente para onde o portal abre).
- Preloader, MaintenanceBanner, Header, Footer, todas as outras seções.
- Lógica do duplo-toque do card 3D.
- Tokens visuais, fontes, gradientes.

## Detalhes técnicos
- Cards usam `<img loading="eager" decoding="async">` com `srcset` natural do bundler (imports de `@/assets/portfolio-*.png`) — sem novo asset, sem download extra.
- Os 4 cards ficam atrás do conteúdo (`z-0`) e o texto da Hero por cima (`z-20`), igual hoje.
- Partículas continuam puro CSS `@keyframes floatDot0/1/2` já definidos no projeto — sem JS por frame.
- `PortalTransition` continua usando `useScroll` + `useTransform` + `useMotionTemplate` do framer-motion; nada novo de dependência.
