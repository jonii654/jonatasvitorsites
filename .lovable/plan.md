# Plano de ajustes

## 1. Reduzir excesso de efeitos
Manter só os 3 mais elegantes e remover o resto:
- **MANTER**: reveal palavra-por-palavra no Sobre Mim (v5), tipografia gigante "TRABALHOS" no Portfólio (v8), blobs orgânicos no CTA final (v1) — sem exagero.
- **REMOVER e voltar versão simples**:
  - `StickerAvatar` (adesivos flutuando na foto) → substituir por carrossel suave de fotos (ver item 5).
  - `HorizontalCards` (Compromisso sticky) → voltar para o layout vertical anterior do "Meu Compromisso com Você" com fade simples no scroll.
  - `ExpandingBars` (Como Funciona) → voltar para a timeline vertical original.
  - `Coverflow3D` nos Depoimentos → voltar pro carrossel horizontal simples com snap.

Resultado: site mais limpo, foco no conteúdo, só 3 momentos "uau".

## 2. Hero mais leve no mobile
Causa do peso atual no celular:
- Canvas de pontos de luz animados rodando em `requestAnimationFrame` mesmo no mobile.
- Filtros `blur(100px)` em múltiplas camadas (custosos no GPU).
- Animações de gradiente em loop.

Correção:
- No mobile (`useDeviceTier === 'light'`): desligar o canvas de pontos, substituir por 2-3 pontos de luz CSS estáticos com `box-shadow` glow.
- Trocar `blur(100px)` por `blur(40px)` no mobile.
- Remover animação de gradient infinito no headline mobile; manter só o gradiente estático.
- Manter o efeito "puf clareia CTA" no load (já está leve).
- Hierarquia: título mais respirável, espaçamentos consistentes com o resto do site.

## 3. Novo menu (estilo dos vídeos enviados)
Substituir o drawer lateral atual por um **menu fullscreen** com:
- Botão hambúrguer no canto → ao clicar, overlay escuro cobre a tela com transição (clip-path circular do canto).
- Links GIGANTES centralizados (texto 6-8vw), um abaixo do outro.
- Cada link com hover: contorno luminoso + leve translação X.
- WhatsApp como CTA destacado no rodapé do overlay.
- Versão desktop: mantém a navbar horizontal atual (não muda nada lá).
- Versão mobile: usa o novo fullscreen no lugar do drawer lateral.

## 4. Notebook 3D próprio (sem Sketchfab)
Remover o iframe externo. Construir showcase 3D usando as **7 fotos do notebook** que você enviou (ângulos diferentes do mesmo Asus).

Abordagem: **rotating image sequence** (carrossel 3D suave estilo "sprite turntable"):
- Container com perspectiva CSS.
- As 7 fotos pré-carregadas, mostradas uma por vez com crossfade rápido conforme o scroll/drag rotaciona o notebook.
- No desktop: usuário pode arrastar pra girar; também roda sozinho devagar.
- No mobile: rotação automática só (sem drag pra economizar processamento).
- Sem WebGL/Three.js — puro CSS + JS leve. Performance ótima em qualquer celular.
- Mantém o título "Explore em 3D".

Arquivos das fotos copiados pra `src/assets/notebook/`.

## 5. Voltar 2ª foto + carrossel com efeito de surgir do escuro
Restaurar a foto que foi excluída (vou verificar `src/assets` qual era — provavelmente `jonatas-photo-2.jpg`).

Novo componente `PhotoCarousel`:
- 2 fotos lado a lado com swipe (mobile) e setas (desktop) + dots embaixo.
- Cada foto entra com efeito **"emergir do escuro"**: começa com `opacity: 0` + `filter: brightness(0)` + `scale: 1.15`, e conforme o scroll entra na viewport vai clareando até `brightness(1)` e `scale: 1`. Usa `useScroll` do framer-motion.
- Sem adesivos flutuando, sem halo neon excessivo — só um glow sutil atrás.

## 6. Corte do "TRABALHOS" no Portfólio
O `PortfolioMosaicHero` usa `font-size: clamp(...)` com `letter-spacing` que estoura no mobile, cortando o "S" final.

Correção:
- Reduzir `font-size` máximo no mobile (de ~18vw pra ~14vw).
- `letter-spacing: -0.04em` (mais apertado).
- Garantir `padding-inline` no container e `overflow: visible` no texto.
- Testar com viewport 360px-768px.

## 7. Compromisso com Você — efeito "morrer no fundo"
Você mencionou antes que o efeito tá passando POR CIMA do título. Como vou remover o `HorizontalCards` e voltar pro layout vertical (item 1), o problema some naturalmente. Vou adicionar no lugar uma animação suave: cards aparecem com fade+translateY ao entrar, e ao sair pra cima fazem fade pro fundo escuro (opacity → 0 + blur leve + scale 0.95), dando essa sensação de "ir pra dentro do site".

---

## Arquivos afetados

**Criar:**
- `src/components/effects/FullscreenMenu.tsx` — novo menu fullscreen
- `src/components/effects/Notebook3DShowcase.tsx` — showcase do notebook com as 7 fotos
- `src/components/PhotoCarousel.tsx` — carrossel das 2 fotos com efeito de emergir
- `src/assets/notebook/*.png` — copiar as 7 imagens enviadas

**Editar:**
- `src/components/Hero.tsx` — desligar canvas/blur pesado no mobile
- `src/components/Header.tsx` — trocar drawer mobile pelo FullscreenMenu
- `src/components/AboutMe.tsx` — trocar `StickerAvatar` por `PhotoCarousel`
- `src/components/ModelViewer3D.tsx` — trocar iframe Sketchfab pelo `Notebook3DShowcase`
- `src/components/HorizontalNotebookScroll.tsx` — voltar pro layout vertical do "Compromisso" com fade-out no scroll
- `src/components/HowItWorks.tsx` — voltar pra timeline vertical
- `src/components/Testimonials.tsx` — voltar pro carrossel simples
- `src/components/effects/PortfolioMosaicHero.tsx` — corrigir corte do "TRABALHOS"

**Excluir:**
- `src/components/effects/StickerAvatar.tsx`
- `src/components/effects/HorizontalCards.tsx`
- `src/components/effects/ExpandingBars.tsx`
- `src/components/effects/Coverflow3D.tsx`

## Dúvida única antes de implementar
Confirma esses 3 efeitos pra manter (Sobre Mim reveal + TRABALHOS gigante + blobs no CTA)? Se quiser remover algum desses 3 também, me fala antes que eu começo.