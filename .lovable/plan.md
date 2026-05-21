## Ajuste na seção Trabalhos (Portfolio)

### Problema
O usuário quer remover as 4 fotos do mosaico que aparecem no topo da seção "Trabalhos". Em vez do mosaico com fotos + título grande, deve aparecer apenas o título "Trabalhos" (ou "Trabalho") e depois os cards do portfólio.

### O que vai ser feito

1. **Remover `PortfolioMosaicHero` de `Portfolio.tsx`**
   - Remover a importação do componente `PortfolioMosaicHero`
   - Remover a chamada `<PortfolioMosaicHero />` dentro da seção

2. **Adicionar título simples no lugar**
   - Inserir um título "Trabalhos" estilizado (gradiente, tipografia grande) no lugar do mosaico
   - Manter o subtítulo "Exemplos do que entrego: sites institucionais, landing pages e marcas pessoais."
   - Manter toda a funcionalidade dos cards horizontais (coverflow) e o overlay expandido ao clicar

### Arquivos modificados
- `src/components/Portfolio.tsx` — remover mosaico, adicionar título limpo

### O que NÃO muda
- O comportamento dos cards de portfólio (scroll horizontal, snap, clique para expandir)
- O overlay expandido com detalhes do projeto
- As imagens e dados dos 4 projetos