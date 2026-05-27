## Objetivo
Tornar o preload mais lento e garantir que o vídeo de fundo apareça desde o início.

## Mudanças em `src/components/Preloader.tsx`

1. **Aumentar duração** de `7500ms` → `12000ms` para o progresso 0→100 ficar visivelmente mais lento.
2. **Trocar easing** de `easeOutCubic` (rápido no começo, lento no fim) para `easeInOutCubic` ou linear suave, evitando saltar de 11 → 60 instantaneamente.
3. **Garantir vídeo carregado antes do preload começar**:
   - Adicionar `<link rel="preload" as="video" href="/preloader-bg.mp4" />` em `index.html` para iniciar o download imediatamente quando o site abre.
   - No componente, definir `poster` ou frame inicial e ouvir `onLoadedData` para opcionalmente esperar um quadro antes de iniciar a contagem (mantendo fallback: começa de qualquer forma após 800ms).

## Resultado esperado
- Preload dura ~12s com progresso linear/suave.
- Vídeo de fundo já aparece nos primeiros frames porque o `<link rel="preload">` no `index.html` antecipa o download.
- Site continua carregando em paralelo durante o preload (comportamento já existente).