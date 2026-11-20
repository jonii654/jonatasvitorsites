# "Meu compromisso com você": ficar igual ao vídeo e bem leve

## O que muda no visual
Olhando o vídeo quadro a quadro, o efeito é um **cilindro visto por dentro**, e não painéis soltos:
- **Bordas curvas:** a curva de cima e a de baixo fazem parte de uma moldura fixa que atravessa a tela inteira, não ficam em cada painel. No centro a faixa fica mais baixa e nas laterais fica mais alta, como um arco. As fotos passam por baixo dessa moldura, e é ela que dá a sensação de "sumir" nas pontas de cima e de baixo.
- **Rotação pela posição:** o painel no centro fica de frente (reto). Conforme vai para os lados, ele gira sozinho, como se dobrasse para dentro da curva. Essa rotação muda suave enquanto a faixa anda, e não fica fixa como está hoje.
- **Saída pelas laterais:** nas pontas da esquerda e da direita, os painéis ficam mais escuros e somem aos poucos.
- **Fotos encostadas:** os painéis ficam colados uns nos outros, sem espaço entre eles, igual ao vídeo.
- **Cores separadas:** o efeito de cores aparece só enquanto você rola e some sozinho ao parar. Ele fica bem mais leve do que agora.

## O que muda na fluidez
- O movimento passa a ter inércia: a faixa "desliza" e desacelera, em vez de seguir o dedo travado.
- Sai o efeito pesado que hoje é recalculado a cada pixel de rolagem e causa a sensação de travado.
- No celular e em aparelhos fracos, as fotos ficam em tamanho menor, sem o efeito de cores, e só com movimento e rotação, que são leves.

## Detalhes técnicos
- `Coverflow3D.tsx`:
  - Mantém a seção sticky com `h-[320vh]` e a trilha movida por GSAP ScrollTrigger com `scrub: 1.2`, que dá a inércia.
  - No `onUpdate`, cada painel recebe `rotateY = clamp(dist * 45°)`, `z` negativo leve e `opacity` com base na distância ao centro da tela. Tudo é aplicado com `gsap.quickSetter` (só transform e opacity) e com as posições em cache, sem medir o layout a cada frame.
  - Tirar o `clipPath` por painel e o `filter: drop-shadow` dinâmico.
  - Moldura: dois SVGs absolutos de largura total, um em cima e um embaixo, com path côncavo preenchido pela cor de fundo (`hsl(var(--background))`), mais um degradê de fade para as pontas sumirem suavemente.
  - Glitch apenas no desktop: uma camada duplicada da trilha com `mix-blend-mode: screen` e tom vermelho/ciano, com `x` deslocado e `opacity` ligada à velocidade via `gsap.quickTo`. Fica em 0 quando parado.
  - Imagens com `loading="eager"` e `decoding="async"`, e `will-change: transform` só na trilha.
