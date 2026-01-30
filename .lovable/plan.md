

# Plano: Corrigir Layout Mobile - Centralizar e Remover Espaços Invisíveis

## Problema Identificado

O site no mobile está com elementos saindo da tela, causando espaço invisível na lateral e aparência "tronxa" (não centralizada). Isso acontece por causa de elementos com posicionamento absoluto que ultrapassam os limites da tela.

## Causas Encontradas

1. **Overflow horizontal não controlado** - O body/html permite scroll horizontal
2. **Floating dots na Hero** posicionados muito nas bordas (95%, 92%)
3. **HorizontalNotebookScroll** usa `w-screen` que pode causar overflow
4. **Elementos de glow/background** com tamanhos fixos grandes em pixels
5. **Elementos absolutos** sem contenção adequada

## Correções a Fazer

### 1. Arquivo: `src/index.css`
- Adicionar `overflow-x: hidden` no `html` e `body` para impedir scroll horizontal
- Isso é a correção principal que resolve o problema de espaço invisível

### 2. Arquivo: `src/components/Hero.tsx`
- Ajustar posições dos floating dots que estão nas bordas extremas
- Reduzir `x: 95%` para `x: 90%`, `x: 92%` para `x: 88%`, etc.
- Garantir que nenhum elemento ultrapasse os limites visíveis

### 3. Arquivo: `src/components/HorizontalNotebookScroll.tsx`
- Trocar `w-screen` por `w-full min-w-full` nos slides
- Isso evita problemas com cálculo de scrollbar no mobile
- Adicionar `overflow-hidden` no container pai

### 4. Arquivo: `src/components/AboutMe.tsx`
- Reduzir tamanho do background glow de 500px para valores responsivos
- Usar max-width ou dimensões menores no mobile

### 5. Arquivo: `src/pages/Index.tsx`
- Adicionar `overflow-x-hidden` no container principal

### 6. Arquivo: `src/components/CTASection.tsx`
- Os elementos de mosaic nas bordas já estão `hidden sm:block` (correto)
- Verificar se as waves animadas estão contidas

## Mudanças Específicas

```text
index.css:
  html, body {
    overflow-x: hidden;
    width: 100%;
  }

Hero.tsx:
  - x: '95%' → x: '88%'
  - x: '92%' → x: '86%'
  - Manter dots dentro de 90% da largura

HorizontalNotebookScroll.tsx:
  - w-screen → w-full min-w-[100vw]
  - Adicionar overflow-hidden no sticky container

Index.tsx:
  - className="min-h-screen bg-background overflow-x-hidden"
```

## Resultado Esperado

- Site perfeitamente centralizado no mobile
- Sem scroll horizontal acidental
- Sem espaços invisíveis nas laterais
- Todos os elementos contidos dentro da viewport

