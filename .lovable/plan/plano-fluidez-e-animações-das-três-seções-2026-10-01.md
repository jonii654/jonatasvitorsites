# Plano — Fluidez e animações das três seções

## 1. “O design quem faz é você”

- Remover dos quatro cards a numeração `01/04`, `02/04`, `03/04` e `04/04`.
- Manter somente as imagens e os nomes Performance, Bold, Editorial e Artesanal.
- Refinar a sequência de subida para que cada card entre, estabilize e saia sem cortes, saltos ou sobreposição quebrada.
- Preservar as imagens comprimidas, o carregamento antecipado e as otimizações já aplicadas para celular e desktop.

## 2. Faixa “Design Premium”

- Substituir os conectores discretos por setas maiores e mais visíveis.
- No desktop, desenhar progressivamente a ligação horizontal:
  `Design Premium → Entrega em até 7 dias → Suporte incluído`.
- No celular, usar a mesma conexão em sentido vertical para manter boa leitura e evitar cortes.
- Fazer cada seta se formar conforme o scroll, com brilho suave e sem efeito pesado contínuo.

## 3. “Simples e direto ao ponto”

- `01 — Conversa inicial`: entrar pela esquerda, avançar além da posição final, recuar e frear no lugar.
- `02 — Design & Desenvolvimento`: entrar pela direita, ultrapassar a posição final, voltar e frear no lugar.
- `03 — Lançamento`: surgir de baixo com elevação, escala suave e parada firme.
- Aplicar a sequência no desktop e no celular, mantendo os blocos, textos e linguagem visual existentes.

## Detalhes técnicos

- Manter GSAP + ScrollTrigger e reutilizar transformações aceleradas (`x`, `y`, `scale`, `opacity`) para evitar travamentos.
- Usar uma curva de desaceleração com pequeno overshoot nos passos 01 e 02, sem animar propriedades caras de layout.
- Respeitar preferência por movimento reduzido e manter uma versão simplificada para aparelhos mais fracos.
- Garantir limpeza correta dos gatilhos ao redimensionar e sincronizar o início das animações com a entrada real de cada seção.

## Validação

- Conferir em celular e desktop que nenhum card do Design fica cortado e que a última foto permanece inteira.
- Confirmar que as numerações desapareceram, mas todos os nomes continuam legíveis.
- Verificar que as setas se conectam na ordem correta durante o scroll.
- Testar as três entradas direcionais, rolagem reversa, ausência de travamentos e console sem erros.

## Fora deste ajuste

- Portal das mãos, Hero, Trabalhos, menu, conteúdo e identidade visual não serão alterados.