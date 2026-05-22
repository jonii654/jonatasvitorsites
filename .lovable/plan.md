## Plano de ajustes

### 1. Notebook 3D — destravar scroll no mobile (`Notebook3DShowcase.tsx`)
Hoje o `touch-action: none` + OrbitControls capturam todo o gesto, prendendo a pessoa na seção.

Novo comportamento:
- **1 toque (single-finger swipe):** o canvas **NÃO** intercepta — o scroll da página passa normalmente sobre o notebook.
- **2 toques (two-finger):** ativa rotação/zoom no modelo 3D (`OrbitControls.touches = { ONE: null, TWO: DOLLY_PAN }` + `touchAction: 'pan-y'` no container).
- Mouse/desktop continua igual (drag para girar, scroll do mouse para zoom).
- Adicionar hint visual sutil ("Use 2 dedos para girar") apenas em mobile.

### 2. "O design quem faz é você!" (`Interactive3DCard.tsx`)
- **Card maior no desktop:** aumentar de `lg:w-[520px] h-[330px]` para `lg:w-[640px] h-[400px]` (e `xl:w-[720px] h-[450px]`). Mobile inalterado.
- **Fade-in rápido das fotos** (pilot-card.jpg e foto do Jônatas no AboutMe):
  - Trocar `transition: 'opacity 0.3s'` por entrada imediata (150 ms) com `opacity` controlado por `onLoad`.
  - Pré-carregar via `<link rel="preload" as="image">` no `index.html` para ambas imagens.
  - No `PhotoCarousel`, garantir `loading="eager"` + `fetchpriority="high"` na primeira foto e fade-in de 200 ms.

### 3. Adicionar projeto CSA Engenharia ao Portfólio
- URL: `https://www.csaengenharia.org`
- ⚠️ **Bloqueio:** ao tentar capturar a screenshot do site, ele retornou "Something went wrong" (erro de carregamento). Vou tentar novamente na implementação; se persistir, gero um mock visual com o nome "CSA Engenharia" usando o mesmo template gradient azul dos outros cards e adiciono nota para o usuário substituir depois.
- Adicionar 5º objeto em `projects[]` no `Portfolio.tsx` com título, link, categoria "Site Institucional - Engenharia".

### 4. Bugs do carrossel Portfólio (lag ao passar de lado)
Causas identificadas no código atual:
- `LayoutGroup` + `layoutId` em todos os cards faz Framer recalcular layout a cada click (lag visível).
- `animate={style}` com objetos novos a cada render causa re-trigger.
- Swipe touch usa apenas `touchstart`/`touchend` sem cancelar autoplay no toque.

Correções:
- Pausar autoplay durante interação (touchstart cancela o `setInterval`, retoma após 8s sem interação).
- Memoizar `getCardStyle` com `useMemo`.
- Substituir `transition duration: 0.8` por `0.5` com easing mais responsivo (`[0.32, 0.72, 0, 1]`).
- Adicionar `will-change: transform, flex` apenas no card ativo + vizinhos.
- Throttle do swipe (ignorar gestos < 100ms entre si).

### 5. Redesign visual da seção Trabalhos baseado no vídeo
⚠️ **Bloqueio:** o arquivo enviado é um vídeo `.mp4` (binário) e não consigo extrair frames diretamente nos meus tools para ver o estilo exato que você quer replicar.

**Preciso que você confirme uma das opções:**
- (a) Descrever em 2-3 frases o estilo do vídeo (ex: "cards horizontais com hover scale, fundo escuro com grão, tipografia editorial")
- (b) Enviar 1-2 screenshots (prints) dos momentos-chave do vídeo
- (c) Me dizer o nome do site/referência do Pinterest mostrado no vídeo

Sem isso, posso fazer um redesign genérico "leve e eclético" com:
- Layout em grid bento (1 card grande + 3 menores)
- Hover com escala + reveal do título
- Paleta azul existente preservada
- Transições suaves Framer Motion
- Tipografia maior, espaçamento mais arejado

### Arquivos afetados
- `src/components/effects/Notebook3DShowcase.tsx`
- `src/components/Interactive3DCard.tsx`
- `src/components/AboutMe.tsx` / `src/components/PhotoCarousel.tsx`
- `src/components/Portfolio.tsx`
- `index.html` (preload de imagens)

### 6. Tracking de conversões (implementado)
- Hook `useAnalytics` criado em `src/hooks/use-analytics.ts`
- Tabela `analytics_events` criada no backend para persistir cliques
- Tracking ativo nos CTAs:
  - `hero` — botão "Quero meu site"
  - `header` — botão "WhatsApp" no desktop
  - `fullscreen_menu` — botão "Falar no WhatsApp" no menu mobile
  - `cta_section` — botão final "Falar no WhatsApp"
  - `footer` — ícone WhatsApp no rodapé
- Eventos também enviados para GA4 (se `gtag` estiver disponível)

### Próximo passo
Me confirma sobre o **vídeo de referência (item 5)** e se posso seguir com mock para o CSA caso o site continue fora do ar.
