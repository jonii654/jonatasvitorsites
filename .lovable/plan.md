## Objetivo
Alterar o formato dos cards de projeto na seção "Trabalhos" (Portfolio) de quadrado/retrato para retangular (paisagem), conforme referência enviada pelo usuário em vídeo anterior.

## Situação atual
- Os cards usam `aspect-[3/4]` (retrato — mais alto que largo)
- Largura: `w-[62vw] max-w-[340px] md:max-w-[380px]`

## Mudanças propostas
1. **Remover `aspect-[3/4]`** e aplicar proporção retangular (ex: `aspect-[16/10]` ou `aspect-[4/3]`)
2. **Aumentar a largura máxima** para que o card ocupe mais espaço horizontal (`max-w-[520px]` ou `max-w-[600px]`)
3. **Ajustar a altura do container** (`h-[55vh] md:h-[60vh] max-h-[560px]`) se necessário para acomodar o card mais largo
4. **Verificar responsividade** em mobile para garantir que o card não fique cortado ou com scroll indesejado

## Decisão pendente
Qual proporção exata o usuário prefere:
- **16:10** (mais panorâmico)
- **4:3** (retangular médio)
- **3:2** (retrato invertido leve)
- Ou sem `aspect-ratio`, deixando a imagem definir o formato natural

## Nota
O vídeo de fundo da seção Portfolio já está configurado e visível. Após a mudança de proporção, o card flutuante deve continuar posicionado corretamente sobre o vídeo.