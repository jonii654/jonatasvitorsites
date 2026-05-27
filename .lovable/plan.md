
## 1. PortalTransition — mãos humanas + portal dimensional

Substituir as luvas atuais (que parecem "sinal de rock") por mãos humanas 2D estilizadas, com aura colorida ao redor, apertando no centro e gerando uma explosão branca que funciona como portal.

**Arquivo:** `src/components/PortalTransition.tsx`

- Trocar o componente `GloveHand` por um novo `HumanHand` em SVG 2D bem desenhado: silhueta realista de mão aberta (palma + 5 dedos com proporções humanas), traço limpo, preenchimento em tom de pele neutro escuro pra combinar com o dark theme.
- Mão esquerda: aura/glow azul (`hsl(195 100% 50%)`) ao redor via `filter: drop-shadow` em camadas + halo radial atrás.
- Mão direita: mesma silhueta espelhada, aura verde (`hsl(155 100% 50%)`).
- Animação de entrada: mãos vêm das laterais (igual hoje) mas com leve rotação e "respiração" antes do impacto.
- No impacto (~progress 0.45-0.50): mãos se tocam palma-com-palma no centro, micro-recuo (squash) + flash branco intenso + onda de choque (anel expandindo) + partículas curtas saindo do ponto de contato.
- Após o impacto: nasce a esfera branca que cresce em escala até preencher a tela (já existe, mas refinar com bloom mais forte e leve aberração cromática azul/verde nas bordas).
- Reduzir a altura da seção de `170vh` para `~120vh` para que o portal termine mais rápido e a próxima seção apareça "instantaneamente" depois da explosão (sensação de teletransporte).
- Ajustar curvas de scroll para o fade-out do stage acontecer logo após a expansão da esfera (0.85→1.0), revelando direto a próxima seção.

## 2. DesignStacking aparecer "teletransportado"

**Arquivo:** `src/pages/Index.tsx`

- Garantir que `DesignStacking` venha imediatamente depois do `PortalTransition` sem espaço/gap intermediário (já está, mas verificar margens).
- Remover qualquer padding/margin top do `DesignStacking` para o início da seção coincidir com o final da explosão.

**Arquivo:** `src/components/DesignStacking.tsx`

- Fazer o heading "O DESIGN QUEM FAZ É VOCÊ" e os cards já aparecerem visíveis no primeiro frame da seção (sem precisar rolar pra revelar), com animação de entrada rápida no `onEnter` em vez de depender do scrub.

## 3. Watermark "DESIGN" maior

**Arquivo:** `src/components/DesignStacking.tsx`

- Aumentar `fontSize` do watermark de `clamp(12rem, 32vw, 28rem)` para algo como `clamp(16rem, 55vw, 44rem)` — bem maior no desktop e ainda legível no mobile.
- Aumentar opacidade base para 0.12 e manter o crescimento sutil no scroll.

## 4. Cards menores na seção Design

**Arquivo:** `src/components/DesignStacking.tsx`

- Reduzir o `max-w` do stack container: de `max-w-md md:max-w-2xl` para `max-w-xs md:max-w-lg`.
- Ajustar `aspect-ratio` de `16/10` para `4/5` (mais vertical, estilo card de portfólio compacto como no vídeo de referência).
- Manter o pilot card como base e os 4 cards subindo, mas em escala menor para dar destaque ao watermark "DESIGN" gigante atrás.

## 5. Otimização de performance (GSAP/ScrollTrigger no mobile)

**Arquivo:** `src/components/DesignStacking.tsx`

- Reduzir altura total no mobile de `380vh` para `~280vh` (menos scroll = menos jank).
- Aumentar `scrub` no mobile de `0.6` para `1.2` (suaviza mas custa menos).
- Adicionar `fastScrollEnd: true` e `preventOverlaps: true` no ScrollTrigger.
- Usar `gsap.set` com `force3D: true` (já tem) e adicionar `transformOrigin: 'center center'` explícito.
- Trocar animações de `opacity` em elementos grandes por `autoAlpha` (combina opacity + visibility, melhor pro compositor).
- Adicionar `will-change` apenas durante a animação ativa (via `onEnter`/`onLeave`) em vez de permanente.
- No mobile: desabilitar o glow radial blur de fundo (`filter: blur(50px)` é custoso) ou trocar por gradiente CSS estático.
- Usar `matchMedia` do GSAP para criar timelines separadas mobile/desktop em vez de um único `isMobile` no React.

## Detalhes técnicos

- Mãos humanas: SVG inline com `viewBox="0 0 240 280"`, path único com curvas Bezier formando palma e 5 dedos, `stroke` fino para contorno e `fill` em tom de pele (`hsl(28 35% 75%)` ou neutro escuro pra dark theme).
- Aura: `<filter>` SVG com `feGaussianBlur` + `feColorMatrix` para tingir de azul/verde, OU mais barato: `drop-shadow(0 0 30px <cor>) drop-shadow(0 0 60px <cor>)` em camadas.
- Onda de choque: novo elemento `motion.div` rounded-full com border colorida, animado de `scale 0 → 8` e `opacity 1 → 0` no impacto.
- Performance: nenhuma alteração em lógica de negócio, só visual + tuning de GSAP.

## Arquivos afetados
- `src/components/PortalTransition.tsx`
- `src/components/DesignStacking.tsx`
- `src/pages/Index.tsx` (verificação de espaçamento)
