# Plano — Seção "O que você ganha / Compromisso com qualidade" (`src/components/Results.tsx`)

## 1. Numeração (01, 02, 03, 04) fora do meio da linha

Hoje o `<span>` do número fica em `left-1/2 -translate-x-1/2` embaixo do nó — cai exatamente em cima da linha neon vertical.

Ajustar para deslocar o número para a esquerda do nó (fora da trilha), mantendo legibilidade:

- Trocar posicionamento para `left-[-22px]` (ou `-left-6`) e remover o `-translate-x-1/2`, ancorando o número à esquerda do círculo.
- Ajustar `bottom` ligeiramente (`-bottom-4`) para não colidir com o card abaixo.
- No mobile (nó já está em `left-6`), mesmo deslocamento à esquerda funciona porque a trilha fica à esquerda; o número passa a ficar levemente antes do círculo, fora da linha.

## 2. Animar os ícones: cada um se "desenha" conforme rola

Substituir os ícones do `lucide-react` (Zap, Clock, Smartphone, Shield) por SVGs inline com `stroke` animável, e desenhar cada um com a técnica `stroke-dasharray` + `stroke-dashoffset` dirigida pelo ScrollTrigger do GSAP (mesma lib já usada no arquivo).

- Criar 4 componentes SVG locais no arquivo:
  - `BoltIcon` — polyline do raio (path único), traço fino neon.
  - `ClockIcon` — círculo do mostrador + 2 ponteiros (3 sub-paths).
  - `PhoneIcon` — retângulo do celular + botão home + tela.
  - `ShieldIcon` — silhueta do escudo + check interno.
- Cada `<path>` recebe `strokeDasharray = length` e `strokeDashoffset = length` no init (invisível).
- Para o ícone atualmente na viewport, um `ScrollTrigger` com `scrub` anima `strokeDashoffset: 0` — o traço se desenha à medida que o item entra em foco (entre `top 85%` e `top 45%`). Ao final, um leve fill/glow neon aparece (`fill-opacity 0 → 0.15` e boost no `filter: drop-shadow`).
- Manter a animação atual de "node activation" (halo neon no círculo) — combina com o desenho terminando.
- Respeitar `prefers-reduced-motion`: se reduzido, renderiza o ícone já desenhado (offset = 0) sem scrub.

## 3. Reforçar leitura do parallax na abertura da seção

- Adicionar um leve parallax vertical no header (`headerRef`) via `useScroll` do GSAP: `y: -30 → 0` conforme `top bottom → top 60%`, para reforçar a sensação de "abrir" a seção junto com os ícones começando a se desenhar.
- Sem mexer no restante da timeline neon vertical (já existente).

## Arquivos afetados

- `src/components/Results.tsx` — reposicionar numeração, trocar `lucide-react` icons por SVGs inline animáveis e adicionar as timelines de `stroke-dashoffset` por item.

## Detalhes técnicos

- Medir comprimento de cada path via `path.getTotalLength()` em `useLayoutEffect` (dentro do `gsap.context`) e setar `strokeDasharray`/`strokeDashoffset` antes do ScrollTrigger.
- Cores: usar `hsl(195 100% 55%)` (ciano) para stroke inicial, transicionando para `hsl(155 100% 55%)` (verde) no final via `gsap.to({stroke: ...})`.
- `strokeWidth ~ 1.75`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `fill="none"` para o efeito de traço.
