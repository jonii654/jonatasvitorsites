## Objetivo
Substituir o notebook 3D atual (react-three-fiber) pelo modelo do código vanilla three.js que você enviou (ASUS cinza com teclado completo, trackpad, portas, tampa abrindo). Remover os textos sobrepostos do HTML enviado e aumentar o título "Explore em 3D".

## Mudanças

### 1. `src/components/effects/Notebook3DShowcase.tsx` (reescrita)
- Trocar implementação react-three-fiber por **three.js vanilla** dentro de um `useEffect`, montando o canvas em um `ref`. Usar o pacote `three` já instalado e `OrbitControls` de `three/examples/jsm/controls/OrbitControls`.
- Portar 1:1 a cena do código enviado:
  - Texturas procedurais: `createScreenTexture`, `createLidTexture` (ASUS gravado no metal cinza), `createBezelTexture`, `getKeyTexture`, `createBottomTexture`.
  - Materiais cinza (`#8a8d91`), plástico preto das teclas, bezel, tela, portas.
  - Base, pés, portas laterais, teclado completo (função + alfanumérico + numpad + linha inferior com Space), trackpad com borda destacada, tampa com dobradiça, bezel e display.
  - Iluminação ambiente + direcional + environment map procedural.
  - Animação de abertura da tampa + auto-rotate até o usuário interagir.
  - OrbitControls com damping, zoom por pinça, `maxPolarAngle` limitando para não passar do chão.
- **Remover do HTML enviado**: loader branco com spinner, header "ASUS PRO / Acabamento em Cinza Espacial" e a caixa de instruções "Explore o Design / Arraste para girar". Manter apenas o canvas.
- Manter o wrapper externo (container arredondado roxo) que já existe, só com o canvas vanilla por dentro — sem os textos sobrepostos do HTML.
- Manter `useDeviceTier` para reduzir `pixelRatio` e desligar sombras em mobile.
- Cleanup correto no `useEffect` (dispose de geometrias/materiais/texturas, remoção do canvas, `controls.dispose()`, cancelamento do `requestAnimationFrame`, remoção do listener de resize).
- Texto "Arraste para girar · 3D Real" abaixo do canvas: pode manter ou remover — vou **remover** para ficar limpo como você pediu (sem textos sobrepostos do exemplo).

### 2. `src/components/ModelViewer3D.tsx`
- Aumentar o título "Explore em 3D":
  - De `text-lg md:text-xl` para `text-3xl md:text-5xl`.
  - Manter o tracking/uppercase para preservar o estilo da identidade visual.

## Detalhes técnicos
- Sem novas dependências: `three` já está no projeto; `OrbitControls` vem de `three/examples/jsm/controls/OrbitControls.js`.
- Não usar o CDN do exemplo (three r128 antigo) — usar a versão do projeto via `import * as THREE from 'three'`. APIs usadas (`MeshStandardMaterial`, `BoxGeometry`, `PlaneGeometry`, `CylinderGeometry`, `CanvasTexture`, `EquirectangularReflectionMapping`, `PCFSoftShadowMap`, `TOUCH.ROTATE/DOLLY_PAN`) são compatíveis.
- Sem alterações em outros componentes, rotas ou estado global.

## Arquivos
- `src/components/effects/Notebook3DShowcase.tsx` — reescrito (vanilla three).
- `src/components/ModelViewer3D.tsx` — só aumenta o título.
