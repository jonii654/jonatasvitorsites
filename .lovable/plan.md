# Aprimorar Notebook 3D

## Problemas atuais
1. Quadradinho emissivo no meio da tampa parece "card no nada" — remover.
2. Modelo ainda simples, sem acabamento premium (bordas, sombras internas, espessura da tela).
3. Tela usa `view-1.png` antiga — trocar pela imagem roxa "ONE DESIGN THREE LAYOUTS" enviada agora.
4. Fundo cinza genérico — trocar por algo mais coerente com a imagem da tela (roxo profundo).

## O que vou fazer

### 1. Trocar imagem da tela
- Copiar `user-uploads://4a4024215798159b37027b5b9d6d8103.jpg` para `src/assets/notebook/screen-poster.jpg`.
- Importar no `Notebook3DShowcase.tsx` substituindo `screenTexture`.
- Ajustar aspect ratio da tela (a imagem é 3:4 vertical, mas tela de laptop é 16:10) — usar `repeat`/`offset` na textura para centralizar e cortar nas laterais OU usar plano com proporção ajustada e padding lateral preto (mais elegante: padding lateral preto, imagem inteira visível).

### 2. Remover "card" do meio da tampa
- Deletar o `<mesh>` com `planeGeometry args={[0.4, 0.08]}` e emissivo `#aaccff`.
- Substituir por logo discreto gravado (mesh fino chanfrado, mesma cor do chassis com leve emissive) OU simplesmente nada — fica mais clean. Vou por **nada** (apenas chassi liso atrás).

### 3. Acabamento do notebook (libs já instaladas: three, R3F, drei, GSAP)
- **Bordas chanfradas reais**: aumentar `smoothness` para 6 e `radius` para 0.06 no `RoundedBox` da base e tampa.
- **Tela com profundidade**: adicionar `RoundedBox` fino como moldura da tela em vez de `boxGeometry` plano; bezel mais fino (3–4mm visuais).
- **Borda inferior da tampa (queixo)**: faixa levemente mais escura abaixo da tela.
- **Speakers**: 2 grelhas finas (planos com textura procedural de pontos) flanqueando o teclado.
- **Power button**: tecla extra no canto superior direito do teclado, levemente diferenciada.
- **Reflexo de tela**: aumentar `clearcoat` e adicionar gradiente sutil overlay (plano com `MeshPhysicalMaterial transmission`).
- **Logo**: pequeno triângulo/círculo gravado no canto inferior da moldura da tela (chin), bem discreto.

### 4. Fundo coerente
- Trocar gradiente cinza por gradiente roxo profundo → preto, casando com a tela:
  - Top `#2a1a4a` → meio `#1a0d2e` → base `#0a0512`.
- Atualizar `GradientBackdrop` (CanvasTexture) e o `background` do wrapper div.
- Manter `MeshReflectorMaterial` no piso com cor escura levemente arroxeada.
- Ajustar luzes: rim light com tom roxo (`#a78bfa`) para casar.

### 5. Performance
- Manter `useDeviceTier` e mesmos cortes do tier `light` (sem teclas individuais, sem reflector floor, sem physical material).

## Arquivos
- **Copiar**: `user-uploads://...jpg` → `src/assets/notebook/screen-poster.jpg`
- **Editar**: `src/components/effects/Notebook3DShowcase.tsx`

## Bibliotecas
Nada novo. Já temos three, @react-three/fiber, @react-three/drei, gsap.

## Pergunta
Posso seguir? Se quiser o notebook em cor diferente (ex.: prata em vez de preto-grafite atual) avise.
