# Melhorar Notebook 3D

## Problema atual
O notebook em `Notebook3DShowcase.tsx` é só 4 caixas (base, bezel, tela, trackpad). Sem teclas, sem dobradiça, sem logo, sem espessura realista, sem bordas chanfradas. Parece um bloco. Fundo transparente, sem ambientação.

## O que vou construir

### 1. Modelo 3D detalhado (Three.js + R3F + drei)
Reconstruir o laptop em `Notebook3DShowcase.tsx` baseado nas 7 fotos do Asus que você enviou (`src/assets/notebook/view-1..7.png`):

- **Base (chassis)**: `RoundedBox` (drei) com cantos arredondados, espessura real ~0.18, chanfros nas bordas — não mais cubo plano.
- **Teclado**: grid 6x15 de teclas individuais (`RoundedBox` pequenas) com leve elevação, gaps escuros entre elas, retroiluminação sutil (emissive baixo).
- **Trackpad**: rebaixado, borda chanfrada visível, material levemente mais claro.
- **Dobradiça (hinge)**: cilindro real conectando base e tampa, visível atrás.
- **Tampa (lid)**: `RoundedBox` fino com leve curvatura, logo Asus discreto (emissive) no centro das costas.
- **Tela**: bezel preto fino + tela com a textura `view-1.png`. Adicionar um plano frontal com `MeshPhysicalMaterial` (transmission/clearcoat) simulando o vidro reflexivo.
- **Pés de borracha**: 4 cilindros pequenos embaixo.
- **Portas USB/laterais**: pequenos recortes (BoxGeometry escura) nas laterais da base.
- **Material**: `MeshPhysicalMaterial` com `clearcoat: 1`, `clearcoatRoughness: 0.25`, `metalness: 0.85`, `roughness: 0.32` — alumínio escovado realista.

### 2. Fundo gradiente cinza (estilo Pinterest/studio)
Trocar fundo transparente por uma cena studio:

- Plano de fundo grande com gradiente vertical: cinza claro (#d4d4d4) no topo → cinza médio (#8a8a8a) no meio → cinza escuro (#3a3a3a) embaixo. Feito via `CanvasTexture` ou `shaderMaterial` simples.
- Piso refletivo sutil (`MeshReflectorMaterial` da drei) com blur alto e mixStrength baixa — só uma insinuação de reflexo embaixo do laptop, tipo foto de produto.
- `ContactShadows` mais densos.
- Vinheta sutil nas bordas (CSS overlay).

### 3. Iluminação cinematográfica
- Key light: `directionalLight` quente (#fff5e8) frontal-superior.
- Fill light: `directionalLight` azulado (#b8d4ff) lateral oposta, intensidade baixa.
- Rim light: `spotLight` por trás criando contorno luminoso na tampa.
- `Environment preset="studio"` (drei) para reflexões de alumínio.

### 4. Animações (GSAP + R3F)
- **Entrada**: tampa fecha → câmera afasta → tampa abre 110° com easing `power4.out` + leve "snap" no final. Já existe, vou refinar timing.
- **Idle**: rotação lenta contínua + float vertical sutil (`useFrame` com sin).
- **Hover/drag**: `OrbitControls` com damping, autoRotate desliga ao interagir e religa após 3s ocioso (GSAP timeout).
- **Tela ligando**: textura entra com fade de brilho (emissive 0 → 1) 0.5s depois da tampa abrir.

### 5. Performance (mobile)
Mantém `useDeviceTier`:
- **light**: sem teclas individuais (textura plana de teclado em vez de geometria), `MeshStandardMaterial` em vez de `Physical`, sem `MeshReflectorMaterial` (piso simples), DPR máx 1.3, sem autoRotate.
- **full**: tudo ligado.

## Bibliotecas
Já instaladas: `three`, `@react-three/fiber@^8.18`, `@react-three/drei@^9.122`, `gsap`. Não preciso adicionar nada novo.

## Arquivos afetados
- **Editar**: `src/components/effects/Notebook3DShowcase.tsx` (reescrever modelo, cena, iluminação, fundo).
- Nada mais muda.

## Confirmação
Posso seguir? Se preferir o laptop em cor diferente (prata/branco em vez do preto-grafite atual) me avisa antes.
