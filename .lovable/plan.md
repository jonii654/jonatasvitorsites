Ajustes no `src/components/effects/Notebook3DShowcase.tsx`:

1. Remover o "retângulo/disco" no meio
- O elemento estranho que aparece no centro é o trackpad mal posicionado (z=0.85 com altura acima da base) somado à dobradiça (cylinder) que está aparecendo na frente do chassi.
- Reposicionar o trackpad para ficar rente à base (y levemente acima de baseH/2) e centralizá-lo corretamente entre o teclado e a borda frontal.
- Remover a moldura preta extra ao redor do trackpad (segundo box) que está criando o efeito de "card flutuante".
- Mover a dobradiça para trás da tampa (z negativo dentro do recuo da base) e reduzir o raio para que não apareça acima da base.

2. Refazer o teclado corretamente
- Reorganizar as teclas em layout realista de notebook: 
  - 1 linha de função (teclas menores no topo)
  - 4 linhas alfanuméricas
  - 1 linha inferior com spacebar largo, modificadores (Ctrl, Alt, Cmd) e setas
- Recalcular dimensões para caber dentro de uma "deck area" delimitada acima do trackpad (não sobrepor).
- Ajustar `keyW`, `keyH`, `gap` e posições para manter proporção realista; spacebar com ~6x a largura de uma tecla normal.
- Adicionar leve recesso (deck inset) sob as teclas para dar profundidade.
- Manter o modo `light` (mobile) com plano simples para performance.

3. Layout do deck (base)
- Dividir visualmente a base em duas zonas: teclado (atrás) e trackpad (frente).
- Garantir que nenhum mesh ultrapasse a altura da base de forma a criar "ilhas flutuantes".

4. Sem mudanças em câmera, iluminação, tampa ou textura da tela — já aprovadas.

Detalhes técnicos:
- Editar apenas `src/components/effects/Notebook3DShowcase.tsx`.
- Usar `RoundedBox` do drei (já importado) para as teclas e trackpad com bordas suaves.
- Nenhuma dependência nova.
