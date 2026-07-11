# Plano — Portal, Compromisso com qualidade e fluidez geral

## 1. Mão realista (fim do "cara de Roblox")

Trocar o SVG cartunizado atual por **duas imagens PNG fotorrealistas** geradas com `imagegen` (modelo `premium`, fundo transparente), inspiradas em "A Criação de Adão" de Michelangelo:

- `src/assets/hand-left-realistic.png` — mão masculina/andrógina em perfil lateral, pele natural, indicador estendido apontando para a **direita**, demais dedos suavemente curvados, iluminação renascentista suave.
- `src/assets/hand-right-realistic.png` — espelho (indicador apontando para a **esquerda**).

No `PortalTransition.tsx`, o componente `HumanHand` passa a renderizar um `<img>` com aura em `drop-shadow` (azul na esquerda, verde na direita) via filtro CSS — mantém o glow neon sem deformar a mão.

## 2. Ordem correta da animação (tocar → explodir → abrir seção)

Hoje o scrub deixa flash/onda começarem cedo demais e as mãos parecem "abrir em vez de tocar". Reajustar a timeline do scroll (0 → 1):

```
0.00 – 0.55  Mãos entram das laterais e se aproximam suavemente
0.55         Pontas dos indicadores SE TOCAM (gap 0 no centro)
0.55 – 0.60  Flash branco curto + micro-shake
0.60 – 0.70  Onda de choque + sparks explodem para fora
0.60 – 0.72  Núcleo branco cresce até preencher a tela
0.68 – 0.75  Stage some (opacity → 0) — emenda direta no DesignStacking
```

Concretamente em `PortalTransition.tsx`:
- `handLeftX/RightX`: `[0, 0.55] → ['-60vw','0vw']` e `['60vw','0vw']` (sem gap final — realmente se tocam).
- `handOpacity`: some só em `[0.6, 0.66]` (depois do toque, não antes).
- `flashOpacity`: pico em `0.57`, zerado em `0.62`.
- `shockScale/shockOpacity` e `Sparks`: começam em `0.57` (após o toque, não durante a aproximação).
- `coreScale`: `[0.58, 0.68, 0.74] → [0, 10, finalScale]` — cresce rápido depois do flash.
- `stageOpacity`: `[0.66, 0.74] → [1, 0]`.
- Reduzir `height` da section de `80vh` para `70vh` no desktop e `60vh` no mobile (via `matchMedia`) — imersão mais rápida, menos scroll morto até chegar em "O design quem faz é você".

## 3. Fluidez geral do site

- **Spring do scroll no Portal**: `stiffness: 90, damping: 24, mass: 0.4` (hoje `120/28/0.35` está "duro") — movimento das mãos fica mais orgânico.
- **DesignStacking**: aumentar `scrub` de `1.1/1.2` para `1.4` (desktop) / `1.6` (mobile) — cards deslizam com mais inércia; reduzir `duration` de cada troca de card de `0.8` para `0.7` para compensar o scrub mais lento.
- **Índice `willChange`**: garantir `transform, opacity` em `pilotRef`, `stackRefs` e watermark (já parcial) — evita repaint.
- **Preload das 4 imagens de card** (`loading="eager"` no primeiro, `fetchPriority="high"` nos demais) — evita flash branco no meio da animação em conexões lentas.

## 4. Bugs da seção "Compromisso com qualidade" (Results.tsx)

Ajustes em `src/components/Results.tsx`:

- **Mobile — numeração `01/02/…` cortada**: hoje `-left-8` sai da tela quando o nó está em `left-6`. Mover a numeração para **dentro do card**, acima do valor (ex.: `<span className="block text-xs font-mono text-primary/70 mb-2">0{i+1}</span>`), removendo a `<span absolute -left-8>`.
- **Mobile — texto colando no nó**: aumentar `pl-20` para `pl-24` e adicionar `pt-1` para alinhar com o centro do nó.
- **Desktop — item da direita com texto encostando na linha central**: aumentar `md:pl-12` / `md:pr-12` para `md:pl-16` / `md:pr-16`.
- **Linha neon "pulando" no fim**: mudar `scrollTrigger.end` de `'bottom 70%'` para `'bottom 85%'` e `scrub` de `0.5` para `0.8` — preenchimento suave até o último item.
- **Ícones piscando ao entrar**: o `gsap.set` inicial deixa `strokeDashoffset = len` já visível como card em `opacity: 0`; adicionar `visibility: hidden` no set inicial dos paths e revelar no primeiro keyframe.
- **Header parallax exagerado no mobile**: envolver o `fromTo` de parallax em `gsap.matchMedia` apenas `(min-width: 768px)` — no mobile o header fica estático (evita "tremida" ao rolar).

## 5. Validação

Rodar Playwright em:
- Mobile 390×844: rolar do Hero até o começo do AboutMe, screenshot em 6 pontos (mãos aproximando, toque, flash, portal, DesignStacking cards 1/4, Results completo).
- Desktop 1280×900: mesmo roteiro.

Checar: (a) as duas pontas realmente se encostam antes do flash, (b) o núcleo cresce **depois** do toque, (c) DesignStacking abre imediatamente após o portal, (d) numeração de Results visível nos 4 itens em ambos os viewports, (e) nenhum erro no console.

## Escopo intencionalmente fora

Sitemap/SEO, Header/Footer, Hero, AboutMe, HowItWorks, Portfolio, FAQ, CTASection, libs (nenhuma adição/remoção além dos 2 PNGs em `src/assets`).
