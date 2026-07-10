# Plano

## 1. Hero — palavras entrando em sequência (`Hero.tsx`)

Substituir o `motion.h1` atual por 4 palavras animadas individualmente, cada uma com o próprio timing e direção:

1. **"Crio"** — entra deslizando da esquerda (`x: -200 → 0`, `opacity: 0 → 1`) — delay `0.2s`, duração `0.7s`, ease `power3.out`.
2. **"sites"** — brota do fundo (blur + scale): `opacity: 0 → 1`, `filter: blur(24px) → blur(0)`, `scale: 0.6 → 1` — delay `1.0s`, duração `0.8s`.
3. **"que"** — entra deslizando da direita (`x: 200 → 0`) — delay `1.7s`, duração `0.7s`.
4. **"Vendem"** — entra deslizando da esquerda (`x: -220 → 0`, leve `rotate: -4 → 0`) — delay `2.4s`, duração `0.8s`.

Usar Framer Motion com `initial`/`animate` e `transition.delay` (já é a lib padrão do projeto — sem GSAP extra aqui). Manter estilos/tipografia atuais (serif itálica, neon, text-shadow 3D). Preservar eyebrow, subhead e CTAs, apenas empurrando o delay do subhead/CTAs para depois da última palavra (`~3.2s / 3.5s`) para respeitar a sequência.

## 2. Portal / Mãos — mãos 3D realistas + transição correta (`PortalTransition.tsx`, `Index.tsx`)

### 2.1 Mãos realistas
Trocar o `HumanHand` SVG 2D atual por mãos 3D reais usando `@react-three/fiber` + `@react-three/drei`:

- Adicionar dependências (versões fixadas pelo ambiente): `@react-three/fiber@^8.18`, `@react-three/drei@^9.122.0`, `three@^0.160`.
- Novo componente `Hand3D` renderiza um `<Canvas>` transparente com:
  - Modelo de mão realista via `useGLTF` a partir de um GLB público estável de mão humana (ex.: modelo Poly Haven / KhronosGroup sample "hand" — carregado por URL absoluta e cacheado por Drei).
  - Fallback (se o GLB falhar em carregar) para uma mão low-poly esculpida com primitivos (`MeshStandardMaterial` cor pele `#d9a488`, `roughness: 0.55`, `metalness: 0`), garantindo que a cena nunca fique vazia.
  - Iluminação: `ambientLight 0.4` + `directionalLight` cor da aura (azul à esquerda, verde à direita) para "pintar" a mão com energia sem descaracterizar a pele.
  - `Environment preset="studio"` do drei para reflexos realistas.
  - Aura/glow por `pointLight` colorido + `<mesh>` esfera com material `emissive` translúcido atrás da mão (substitui o `drop-shadow` do SVG).
- Mobile / `useDeviceTier() === 'light'`: **não** montar o Canvas — cair no SVG atual (já existente) para manter a performance mobile (regra do projeto: nada de WebGL pesado no mobile).

### 2.2 Animação de aproximação e faísca
Manter o driver por `useScroll` já existente, mas:
- Aumentar densidade de partículas no impacto: adicionar 12–18 sparks (divs pequenas) irradiando do centro entre progress `0.46–0.6`, com trajetórias radiais via `useTransform`.
- Onda de choque em duas camadas (branca + ciano) para leitura mais "energética".
- Manter flash branco atual.

### 2.3 Corrigir "abre a seção errada"
Hoje, quando a energia dispara, a próxima seção visível é o `BenefitsBar` (a seção `PortalTransition` termina antes de `DesignStacking` entrar na viewport, então o usuário vê vazio/errado).

Alterações:
- Em `Index.tsx`, **mover `BenefitsBar` para depois de `DesignStacking`** para que, ao sair do portal, a próxima seção seja `DesignStacking`.
- Reduzir a "cauda" do portal: `height: '120vh' → '100vh'` e ajustar `stageOpacity` para completar o fade em `[0.7, 0.9]`, de modo que assim que a energia dispara (progress `~0.5`) o portal já esteja terminando e o `DesignStacking` (sticky) aparece imediatamente.
- No `DesignStacking`, garantir que o `bgTextRef` inicie com opacidade já visível (já está `0.85`) para o "flash → DESIGN" ficar contínuo.

## Arquivos afetados

- `src/components/Hero.tsx` — sequência de palavras.
- `src/components/PortalTransition.tsx` — Hand3D + partículas + timing.
- `src/components/effects/Hand3D.tsx` — **novo** componente WebGL.
- `src/pages/Index.tsx` — reordenar `BenefitsBar` para depois de `DesignStacking`.
- `package.json` — adicionar three / fiber / drei.

## Detalhes técnicos

- Palavras da Hero: `motion.span` com `initial={{ opacity:0, x:-200 }}` etc. Estilos inline atuais (text-shadow neon) preservados.
- `Hand3D` usa `Suspense` interno com fallback null; `<Canvas dpr={[1, 1.6]} gl={{ alpha:true, antialias:true }} camera={{ position:[0,0,3], fov:35 }}`.
- GLB: se o carregamento remoto for bloqueado, o fallback low-poly (palma cilíndrica achatada + 5 dedos cápsula) mantém a experiência 3D real.
- `useDeviceTier()` decide entre `Hand3D` (mid/high) e `HumanHand` SVG (light).
