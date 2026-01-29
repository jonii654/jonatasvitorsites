
# Plano: Mover Explicações para Baixo do Notebook

## Problema Identificado
O texto (título e descrição) está atualmente posicionado **dentro da tela do notebook** com um overlay gradient, o que mistura o texto com o conteúdo do site mockup, prejudicando a legibilidade.

## Solucao Proposta
Reorganizar o layout para que:
1. O notebook fique na parte superior/central da tela
2. O texto (título + descrição) apareça no espaço livre **abaixo do notebook**
3. Manter tudo dentro da mesma seção

## Estrutura do Novo Layout

```text
+------------------------------------------+
|     O que você ganha                     |  <- Header (topo)
|     Compromisso com qualidade            |
+------------------------------------------+
|                                          |
|     +----------------------------+       |
|     |     NOTEBOOK MOCKUP        |       |  <- Notebook (centro-superior)
|     |     (tela limpa, sem       |       |
|     |      texto sobreposto)     |       |
|     +----------------------------+       |
|                                          |
|         Design Estratégico               |  <- Título (abaixo do notebook)
|     Cada elemento pensado para           |  <- Descrição
|     converter visitantes em clientes.    |
|                                          |
|              o o o o                     |  <- Indicadores de progresso
+------------------------------------------+
```

## Alteracoes Tecnicas

### Arquivo: `src/components/HorizontalNotebookScroll.tsx`

1. **Componente `NotebookFrame`** - Reestruturar layout:
   - Alterar de `items-center justify-center` para `flex-col` com distribuição vertical
   - Mover o notebook para ocupar a parte superior com margem adequada
   - Adicionar uma área de texto separada **abaixo** do notebook

2. **Remover overlay de texto da tela do notebook**:
   - Remover linhas 137-161 (gradient overlay + content overlay dentro da tela)
   - A tela do notebook ficará limpa, mostrando apenas o mockup do site

3. **Criar nova seção de texto abaixo do notebook**:
   - Adicionar um novo `div` após o frame do notebook
   - Posicionar título (h3) e descrição (p) centralizados
   - Aplicar as mesmas animações de fade-in baseadas em `isActive`
   - Usar espaçamento adequado (`mt-8` ou similar)

4. **Ajustar distribuição vertical**:
   - O notebook deve ocupar aproximadamente 50-60% da altura
   - O texto deve ocupar o espaço restante antes dos indicadores
   - Manter os indicadores de progresso e "Role para explorar" na posição atual (bottom)

## Beneficios da Mudanca

- Legibilidade clara do texto sem sobreposição
- Mockup do notebook mostra o site completo sem interferência
- Visual mais limpo e profissional
- Melhor hierarquia visual entre elementos
