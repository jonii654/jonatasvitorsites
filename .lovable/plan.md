
## 1. DesignStacking — cards "correndo de baixo pra cima" (igual vídeo)

**Arquivo:** `src/components/DesignStacking.tsx`

- Trocar a animação atual (fade + scale) por uma de **slide vertical**: cada card entra de baixo (`yPercent: 100`) deslizando até o centro (`yPercent: 0`), e ao sair continua subindo (`yPercent: -100`) — efeito de "correndo pra cima" como no vídeo.
- Manter a regra de "um por vez": quando o próximo card começa a subir, o anterior já está saindo por cima — só um card visível por vez no quadro central, sem stack acumulado atrás.
- Adicionar leve ease (`power2.inOut`) para o movimento ficar fluido nos dois sentidos.

## 2. DesignStacking — corrigir bug do scroll reverso

**Arquivo:** `src/components/DesignStacking.tsx`

- Causa do bug: hoje uso `tl.progress(self.progress)` no `onUpdate` com `scrub`, e o `gsap.set` inicial dos cards (`opacity: 0`) só roda uma vez. Quando o usuário volta ao topo, o estado inicial não é reconstruído corretamente porque a timeline já passou e os elementos ficaram em estado intermediário.
- Solução: usar `scrub` direto na timeline (em vez de `onUpdate` manual) — assim o GSAP reverte automaticamente quando o scroll volta. Trocar o `ScrollTrigger.create({ onUpdate })` por `gsap.timeline({ scrollTrigger: { trigger, start, end, scrub, ... } })`.
- Adicionar `invalidateOnRefresh: true` para recalcular ao redimensionar.
- Garantir que o heading e o pilot card também voltem ao estado inicial visível quando se rola pra cima.

## 3. PortalTransition — animação 100% bidirecional sem travas

**Arquivo:** `src/components/PortalTransition.tsx`

- Já usa `useScroll` + `useTransform` do framer-motion (que é reversível por natureza), então o problema deve ser apenas de **curvas**: hoje uso `scale` com pico em `[1, 1.12, 0.92, 1]` que cria um "salto" no meio. Trocar por curvas monotônicas/lineares onde possível.
- Substituir as curvas de squash por uma única passagem linear: mãos entram → tocam → saem, sem picos intermediários que travam ao reverter.
- Reduzir o número de `useTransform` por elemento — combinar em menos animações para evitar conflitos de timing ao reverter.
- Garantir que o flash, onda de choque e esfera nasçam/sumam linearmente para que ao rolar pra cima o efeito desfaça igualzinho ao revés do filme.

## 4. Watermark "DESIGN" — visível no mobile mas grande, gigante no desktop

**Arquivo:** `src/components/DesignStacking.tsx`

- Hoje: `fontSize: clamp(16rem, 55vw, 44rem)` — no mobile (≈566px) isso dá ~310px de altura e estoura a tela.
- Trocar por `clamp(7rem, 38vw, 56rem)`:
  - Mobile (~566px): ~215px (cabe na tela e ainda parece "gigante" pela proporção).
  - Desktop (1920px): ~56rem (≈896px) — toma a tela inteira como o vídeo pede.

## Arquivos afetados
- `src/components/DesignStacking.tsx`
- `src/components/PortalTransition.tsx`
