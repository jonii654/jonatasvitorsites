## Resumo
Três entregas:
1. **Velocidade** — aplicar otimizações de carregamento agressivas para abrir tão rápido quanto o vídeo 1.
2. **Preloader** — tela de carregamento estilo FXIFY (logo + porcentagem animada 0→100%) antes do "Crie um Site que Vende".
3. **Cards do Portfolio** — redesenhar a seção de Trabalhos no estilo do vídeo 3 (cards verticais altos em fileira horizontal, título acima, item central destacado, clique abre/expande).

---

## 1. Velocidade (carregamento instantâneo)

Sem mudar o conteúdo:
- **Code-splitting por rota e seções pesadas**: `React.lazy` + `Suspense` para `ModelViewer3D`, `Interactive3DCard`, `HorizontalNotebookScroll`, `VideoBackground`, `Portfolio`, `Testimonials`, `FAQ`, `CTASection`. Hero fica eager (above-the-fold).
- **Preload da imagem do Hero / LCP** via `<link rel="preload" as="image">` em `index.html`.
- **Lazy loading de imagens**: adicionar `loading="lazy"` e `decoding="async"` em todas as `<img>` fora do Hero (Portfolio, AboutMe, etc.).
- **Defer do vídeo de fundo**: só monta `VideoBackground` quando o usuário rolar até `AboutMe` (IntersectionObserver), com fallback CSS estático em mobile (já é regra do projeto).
- **manualChunks** no `vite.config.ts`: separar `react`, `framer-motion`, `three`, `gsap` em chunks dedicados para melhor cache.
- **Fonts**: já tem `display=swap` provavelmente — garantir e preconnect ao Google Fonts.
- **Three.js só monta quando visível**: envolver `Notebook3DShowcase` em IntersectionObserver e só iniciar o `useEffect` quando entra na viewport.

## 2. Preloader (estilo FXIFY)

Novo componente `src/components/Preloader.tsx`:
- Tela cheia (`fixed inset-0 z-[100]`) sobre tudo, fundo `#0a0512` (mesmo do projeto).
- Layout:
  - Topo-esquerdo: "Loading" + "your experience…" em texto pequeno claro.
  - Topo-direito: porcentagem grande (`0%` → `100%`), fonte fina translúcida.
  - Centro: logo "JV" / "Jônatas Vitor" (mesma identidade do site, sem trocar nome).
  - Rodapé: 3 labels distribuídos: "Sites que vendem", "Design premium", "Entrega rápida".
  - Barra de progresso fininha embaixo.
- Animação: contador animado de 0 a 100 em ~1.6s (`requestAnimationFrame` ou `motion`), pulse sutil no logo (anéis concêntricos como no FXIFY).
- Ao chegar em 100%: fade-out de 500ms e desmonta.
- Lógica de exibição: aparece **uma vez por sessão** (`sessionStorage` flag) para não atrapalhar navegação interna; sempre aparece em load fresco/refresh.
- Integração: renderizado no topo do `Index.tsx` antes do `<Header />`, controlado por estado local `isLoading`.
- Acessibilidade: `role="status"`, `aria-live="polite"`, respeita `prefers-reduced-motion` (sem pulse, transição simples).

## 3. Cards do Portfolio (estilo música/Pinterest)

Reescrever `src/components/Portfolio.tsx` mantendo os 4 projetos e o mesmo background/título atual, mas mudando o carrossel:

### Estado fechado (default)
- Linha horizontal com **todos os cards verticais** lado a lado, formato `aspect-[3/5]` (alto e estreito como capas de álbum).
- Acima de cada card: título pequeno em uppercase claro (ex: "Landing Page", "ViniDigital"…).
- Card central destacado: levemente maior + texto sobreposto "Deep Disco"-style com nome + autor no canto inferior (ex: nome do projeto + categoria).
- Cards laterais menores e parcialmente visíveis nas extremidades (efeito coverflow horizontal, como no vídeo 3 frame 4).
- Scroll/drag horizontal navega entre eles; em mobile, swipe natural.

### Estado expandido (ao clicar)
- O card clicado faz `layoutId` (Framer Motion shared layout) e expande para um overlay grande tipo "now playing":
  - Imagem grande à esquerda/centro com o nome do projeto + categoria embaixo.
  - Descrição + botão "Ver projeto" (abre o link real existente).
  - Botão fechar (X) no canto, ou clicar fora fecha.
- Backdrop escuro com blur por trás.
- Animação spring suave (~300ms), respeitando `prefers-reduced-motion`.

### Indicadores
- Setas e dots inferiores podem permanecer (versão mais discreta) ou serem removidos — vou manter dots discretos só pra desktop.

### Mobile
- 1.5 cards visíveis por vez, swipe horizontal nativo (`overflow-x-auto snap-x`).
- Mesmo comportamento de expansão ao tocar.

---

## Detalhes técnicos
- Arquivos novos: `src/components/Preloader.tsx`.
- Arquivos editados: `src/pages/Index.tsx` (lazy + preloader), `src/components/Portfolio.tsx` (reescrita visual), `src/components/effects/Notebook3DShowcase.tsx` (mount sob viewport), `vite.config.ts` (manualChunks), `index.html` (preload + preconnect).
- Sem novas dependências (Framer Motion + Tailwind já cobrem tudo).
- Sem mudanças em backend/dados/projetos — só apresentação e performance.
