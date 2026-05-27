
## 1. Seção Trabalhos — vídeo de fundo + cards flutuando

**Arquivos:** `src/components/Portfolio.tsx`, novo `public/portfolio-bg.mp4`

- Copiar o vídeo enviado anteriormente (`Rustic_Party_Appetizers_on_a_Budget`) para `public/portfolio-bg.mp4`.
- Adicionar `<video>` absoluto cobrindo a seção inteira (`autoPlay`, `muted`, `playsInline`, `loop`, `preload="metadata"`).
- Overlay escuro por cima (gradient `bg-black/60` → `bg-black/40`) para contraste com o card sem matar o vídeo.
- No mobile (tier light): cair em gradiente CSS estático (regra de performance do projeto).
- Remover/atenuar o glow gigante atual de fundo — o vídeo já cumpre esse papel.

**Card flutuando (sem "base"):**
- Tirar o fundo opaco/bg do card atual e qualquer plataforma/sombra-base de baixo.
- Deixar a imagem do projeto com cantos arredondados, borda fina translúcida e sombra grande embaixo (`shadow-[0_40px_80px_rgba(0,0,0,0.6)]`) — sensação de flutuar sobre o vídeo.
- Animação `y: [0, -10, 0]` com `duration: 5s, easeInOut, repeat: Infinity` para o card "respirar".
- Manter o watermark do nome do projeto como camada acima do vídeo.

**Navegação:**
- Manter as setas laterais (desktop e mobile).
- Manter o swipe/drag touch.
- Manter os dots indicadores embaixo.

## 2. Preloader — mais lento, sem flash, uma linha só

**Arquivo:** `src/components/Preloader.tsx`

- Aumentar `DURATION` de `4200ms` → `7500ms` (mais tempo pra imersão do vídeo de fundo).
- Aumentar delays de saída: `400ms` → `700ms` e `onFinish` `1100ms` → `1500ms`.
- Trocar `bg-background` do container por `bg-black` puro + fallback escuro inline — elimina o flash do fundo antigo enquanto o vídeo carrega.
- Adicionar `poster` no `<video>` (frame escuro) pra zero flicker.
- Remover a barra duplicada de progresso: hoje existem duas (linhas 119-126 e 127-136). Manter apenas a barra única com glow neon + drop-shadow.

## Arquivos afetados
- `public/portfolio-bg.mp4` (novo)
- `src/components/Portfolio.tsx`
- `src/components/Preloader.tsx`
