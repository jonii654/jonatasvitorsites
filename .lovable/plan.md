## Mudanças na Hero

### 1. Cards — formato quadrado (não X) e maiores

Atualmente os 4 cards têm rotação de ±14° formando X. Vou:
- **Remover toda rotação** (`rot: 0`, `hoverRot: 0`) — ficam retos, formando um quadrado: 2 em cima (esquerda/direita), 2 embaixo (esquerda/direita).
- **Aumentar tamanho** consideravelmente para ambos mobile e desktop:
  - Mobile: `w-36 h-44` (antes `w-28 h-36`)
  - Desktop: `w-64 h-80 md:w-72 md:h-96` (antes `w-52 h-72`)
- **Reposicionar** levemente nos cantos pra acomodar o tamanho maior sem cobrir a headline central: `top-[6%]` / `bottom-[6%]`, `left-[2%]` / `right-[2%]` no mobile, `md:left-[4%]` / `md:right-[4%]` no desktop.
- Manter borda colorida, sombra e overlay de gradiente existentes (mais peso visual de "vitrine de sites").
- No hover do CTA, em vez de inclinar/girar, fazem um leve `translateY` pra dentro (efeito sutil de "vida"), mantendo o formato reto.

### 2. Trocar as fotos pelas 4 referências enviadas

As 4 imagens de referência (Shopify Renaissance, Buttermax, Cleo, Igloo) que você enviou em mensagens anteriores. Como elas ainda não estão em `src/assets/`, no build mode eu vou:
- Copiar de `user-uploads://...` para `src/assets/hero-ref-1.jpg` ... `hero-ref-4.jpg` via `code--copy`.
- Atualizar os imports em `Hero.tsx` (remover `portfolioAdvocacia/Beatriz/Clinica/Vini`, adicionar os 4 novos).
- Atualizar os `alt` para descrições neutras tipo "Referência de design de site 1".

> ⚠️ Se as 4 imagens originais não estiverem mais acessíveis nos uploads, eu te aviso e peço pra reenviar antes de aplicar essa parte. O resto da mudança roda independente.

### 3. Headline "Crio sites que Vendem" — relevo 3D + "sites" maior

Manter exatamente a tipografia atual (`font-serif italic` + `font-display`). Só dar mais peso:

- **Sombras em camadas (faux 3D)** em `Crio` e `Vendem` via `text-shadow` inline:
  ```
  0 1px 0 hsl(220 50% 12%),
  0 2px 0 hsl(220 50% 10%),
  0 3px 0 hsl(220 50% 8%),
  0 6px 14px hsl(220 50% 2% / 0.6),
  0 0 32px hsl(195 100% 50% / 0.25)
  ```
- **"Vendem"** ganha glow verde extra (`0 0 40px hsl(155 100% 50% / 0.45)`) — é a palavra-âncora.
- **"que"** (ciano) ganha glow ciano sutil (`0 0 24px hsl(195 100% 55% / 0.4)`).
- **"sites"** fica maior: `text-3xl md:text-5xl lg:text-6xl` (antes `text-2xl md:text-4xl lg:text-5xl`) e opacidade do branco sobe de `text-white/40` → `text-white/60`.

Nada de filtros pesados — só `text-shadow`, performático no mobile.

### 4. Efeito no botão "Quero meu site"

O botão já tem `btn-ripple` e hover scale. Vou turbinar com um efeito mais perceptível ao tocar/clicar:
- **Pulse + glow ring**: ao clicar, dispara uma classe temporária (`onClick` + `setTimeout` 700ms) que aplica um keyframe `cta-burst`:
  - escala vai `1 → 1.08 → 1`
  - ring expansivo (pseudo-elemento `::after`) cresce de `inset:0` para `inset:-12px` com `border: 2px solid hsl(155 100% 50% / 0.6)` e fade-out
  - glow do `boxShadow` pulsa pra `0 0 48px hsl(155 100% 50% / 0.8), 0 0 96px hsl(195 100% 50% / 0.4)` e volta
- Keyframes `@keyframes cta-burst` e `@keyframes cta-ring` adicionados em `src/index.css`.
- No mobile, o efeito também dispara no `:active` via CSS (sem precisar de hover).

## Arquivos afetados
- `src/components/Hero.tsx` — array `cornerCards`, JSX dos cards, headline com `text-shadow`, handler de click no CTA.
- `src/index.css` — keyframes `cta-burst` + `cta-ring` e classe `.cta-burst`.
- `src/assets/hero-ref-{1..4}.jpg` — novos (copiados dos uploads).

## Não muda
- Estrutura geral da Hero (eyebrow, subhead, CTAs, partículas, gradient).
- Outros componentes da página.
- Tipografia (família e estilo continuam iguais).
