# Corrigir interação do card 3D (mobile)

## Problema atual
No `Interactive3DCard`, qualquer toque captura o pointer (`setPointerCapture` + `touch-none`), então o scroll vertical do site trava em cima do card. No mobile só dá pra "girar" usando dois dedos por acidente, o que confunde o usuário.

## Comportamento desejado
- **1 toque / swipe simples** sobre o card → o site faz scroll normal (card não captura o gesto).
- **Duplo toque** no card → ativa "modo girar" (badge visual aparece tipo "Modo 3D ativo — arraste pra girar").
- Enquanto em modo girar: arrastar com 1 dedo gira o card, com inércia (mantém comportamento atual de spin).
- Sair do modo girar automaticamente: ao tirar o dedo + 2s sem interação, OU ao tocar fora do card, OU com botão "✕ sair" no badge.
- **Desktop (mouse)**: mantém arrastar com clique como hoje (não precisa de duplo clique, já que não há conflito com scroll).

## Mudanças

### `src/components/Interactive3DCard.tsx`
1. Novo estado `isUnlocked` (boolean). Inicia `false` no mobile, `true` no desktop (detectar via `matchMedia('(hover: none) and (pointer: coarse)')` ou `useDeviceTier`).
2. Handler de duplo-toque: detectar 2 `pointerdown` do tipo `touch` em <300ms no mesmo card → `setIsUnlocked(true)`.
3. Em `handleDragStart`:
   - Se `pointerType === 'touch'` e `!isUnlocked` → **não** chama `setPointerCapture`, **não** chama `preventDefault`, retorna cedo. Scroll nativo flui.
   - Se `isUnlocked` (ou mouse) → comportamento atual (captura + drag + inércia).
4. Trocar `touch-none` por classe condicional: `isUnlocked ? 'touch-none' : 'touch-pan-y'` (libera pan vertical quando travado).
5. Timer de auto-lock: 2s após `pointerup` sem nova interação → `setIsUnlocked(false)`.
6. Listener global `pointerdown` fora do card → desativa o modo.
7. **Badge visual** sobre o card:
   - Travado (mobile): hint sutil "Toque 2x para girar" (substitui o atual "Arraste para girar").
   - Destravado: badge animado com `framer-motion` "🎯 Modo 3D ativo" + botão "✕" pra sair, borda do card ganha brilho ciano pulsante.
8. Feedback tátil opcional: `navigator.vibrate?.(15)` ao destravar (se disponível).

### Melhorias no efeito 3D (bonus pedido "melhora o efeito 3D")
- Aumentar `perspective` de `1000` → `1200` para profundidade mais natural.
- Adicionar `transformStyle: 'preserve-3d'` e uma leve sombra dinâmica que segue a rotação (`boxShadow` reativo via `useTransform` em `springRotateY`).
- Brilho especular sutil: gradient overlay com `mix-blend-overlay` que se move conforme `rotateY` (efeito "reflexo de luz" no card).
- Suavizar `springConfig` apenas em modo girar; em idle deixa parado.

## Não muda
- Lógica de spin/inércia, imagem `pilot-card.jpg`, layout, copy do título, scroll-trigger do CTA, analytics.
- Comportamento desktop (continua arrastar direto com mouse).
