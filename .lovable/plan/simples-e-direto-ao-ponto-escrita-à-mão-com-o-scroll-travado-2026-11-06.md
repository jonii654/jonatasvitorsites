# "Simples e direto ao ponto": escrita à mão com o scroll travado

## O que você vai ver
- Quando a seção chega, a tela trava e fica com fundo preto. Nada de cards quadrados.
- Conforme você rola, o texto vai sendo "escrito a lápis", traço por traço, junto com a rolagem:
  1. **Conversa inicial**, e logo abaixo: "Entendo seu negócio, público-alvo e objetivos para criar uma estratégia personalizada."
  2. Mais abaixo: **Design & Desenvolvimento** e a descrição dele.
  3. Por último: **Lançamento**, e abaixo: "Entrego seu site pronto, otimizado para SEO e velocidade máxima."
- No fim de "velocidade máxima", aparece um guerreiro no estilo anime liberando energia: aura dourada, cabelo arrepiado e raios. Logo depois a tela destrava e a rolagem segue normal.
- Rolar para cima "apaga" a escrita na ordem contrária.

## Sobre o Goku
O Goku é um personagem com direitos autorais, então não posso desenhar o Goku em si. No lugar dele, vou criar um **guerreiro original no estilo anime "Super Saiyajin"**: cabelo dourado arrepiado, aura de ki dourada e pose de carregar energia. A ideia é passar a mesma sensação. Se você tiver uma imagem com licença, posso usar a sua.

## Celular e aparelhos mais fracos
- A mesma escrita com o scroll travado, mas usando um efeito mais leve.
- A aura do guerreiro vira um brilho simples, sem partículas.

## Detalhes técnicos
- Reescrever `src/components/effects/ExpandingBars.tsx` (mantendo `id="servicos"`) com GSAP ScrollTrigger: `pin: true`, `scrub`, `end` em torno de `+=300%` (no celular, `+=220%`).
- Efeito de lápis: títulos em SVG `<text>` com fonte manuscrita (Caveat, via Google Fonts), animando `stroke-dashoffset`, e depois `fill-opacity` para preencher. As descrições aparecem com `clip-path inset` da esquerda para a direita, com uma ponta de lápis (um pequeno ponto brilhante) seguindo a linha. Só uso transform, opacity e clip.
- Fundo da seção em preto puro, usando tokens semânticos (`--background` escuro local, por classe).
- Imagem do guerreiro gerada em `src/assets/ki-warrior.png` com fundo transparente, em WebP leve. Ela entra com escala e opacidade, e a aura pulsa em CSS.
- No light tier, o `scrub` fica mais curto e não há SVG stroke nas descrições.
- Atualizar `mem://features/how-it-works-vertical-timeline` com o novo comportamento.
