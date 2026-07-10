## Ajustes — Portal (mãos) + Design Stacking

### 1) Portal: mãos "Criação de Adão" + imersão instantânea
Arquivo: `src/components/PortalTransition.tsx`

- Substituir o gesto atual (palmas se batendo) por **dedos indicadores se tocando**, inspirado em *A Criação de Adão*:
  - Trocar o SVG `HumanHand` por uma versão nova mostrando **mão de perfil com o indicador estendido** (demais dedos recolhidos). Mão esquerda vem da esquerda com indicador apontando pra direita; mão direita espelhada.
  - Manter as auras (azul e verde) e o `Hand3D` só como fallback visual — mas passar novas props para `Hand3D` renderizar também o indicador estendido (ajuste rápido de `rotation` dos dedos em `Hand3D.tsx`).
  - Ajustar `handLeftX` / `handRightX` para pararem com um pequeno gap (dedos quase tocando), não sobrepostas. Remover a rotação final que "fecha a palma".
- Fazer o "toque" disparar imersão instantânea:
  - Encurtar bastante o flash (`flashOpacity` pico em ~0.48 e já em 0 em ~0.52).
  - `stageOpacity` cai para 0 em `[0.5, 0.6]` (era `[0.6, 0.82]`), levando direto pro `DesignStacking`.
  - Reduzir a duração da seção (`height: '80vh'`) para o portal terminar mais rápido e emendar no próximo bloco.
  - Núcleo/onda de choque: acelerar o crescimento (`coreScale` completo em ~0.6) para dar sensação de "sugado para dentro".

### 2) DesignStacking: watermark DESIGN encolhe no scroll
Arquivo: `src/components/DesignStacking.tsx`

- Inverter a animação do `bgTextRef`: começa **grande** (`scale: 1`) e **encolhe** ao longo do scroll até `scale: 0.45` (mobile) / `0.6` (desktop), com opacidade caindo para ~0.35 no final — assim a palavra "DESIGN" fica legível conforme os cards aparecem.
- Ajustar `fontSize` inicial para caber na tela sem clip: `clamp(6rem, 42vw, 60rem)` no desktop e menor no mobile via matchMedia (evita cortar em telas estreitas).

### 3) Bug do card "Artesanal" cortado no mobile
Arquivo: `src/components/DesignStacking.tsx`

- O último keyframe segura `stackRefs.current[3]` até o fim da timeline, mas a altura total da seção (`340vh` mobile) e o offset da `ScrollTrigger` fazem o card 4 não completar a entrada antes do unpin. Correções:
  - Aumentar altura mobile de `340vh` para `420vh` (dá scroll suficiente para o card 4 chegar a `yPercent: 0`).
  - Antecipar a entrada do card 4 no timeline mobile: mover o keyframe de `3.6` para `3.2` e o "hold" para `4.0` com duração maior.
  - Garantir que o container do stack no mobile use `max-w-[240px]` e `mx-auto` sem overflow lateral, e que o pai (`sticky`) tenha `overflow: hidden` (já tem) — validar via Playwright screenshot mobile 390x844 depois da mudança.

### Validação
- Rodar Playwright em viewport mobile (390x844) e desktop (1280x900):
  1. Screenshot do PortalTransition em 3 pontos do scroll (indicadores se aproximando, toque, imersão).
  2. Screenshot do DesignStacking em 5 pontos (heading, card 1, 2, 3, 4 completo).
- Conferir que o card "Artesanal" aparece inteiro no mobile e que a palavra DESIGN encolhe suavemente.

### Fora do escopo
- Não mexer em SEO, sitemap, Header, Footer, ou qualquer outra seção.
- Não trocar bibliotecas (mantém GSAP + Framer Motion + R3F já instalados).
