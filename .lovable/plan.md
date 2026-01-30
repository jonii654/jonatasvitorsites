

# Plano: Corrigir Layout Mobile - Centralizar e Remover Espaços Invisíveis

## Problema
O site no mobile está com elementos saindo da tela, causando espaço invisível nas laterais e aparência "tronxa" (não centralizada).

## Correções a Implementar

### 1. Global CSS (`src/index.css`)
Adicionar controle de overflow no html e body:
- `overflow-x: hidden` para impedir scroll horizontal
- `width: 100%` para garantir largura correta
- `position: relative` no body para contenção

### 2. Hero (`src/components/Hero.tsx`)
Ajustar posições dos floating dots nas bordas extremas:
- `x: 95%` → `x: 88%`
- `x: 92%` → `x: 86%`
- `x: 3%` → `x: 5%`
- `x: 90%` → `x: 88%`

### 3. Horizontal Scroll (`src/components/HorizontalNotebookScroll.tsx`)
- Trocar `w-screen` por `w-full min-w-[100vw]` nos slides
- Adicionar `overflow-x-hidden` no sticky container

### 4. About Me (`src/components/AboutMe.tsx`)
Glow responsivo:
- Mobile: `w-[280px] h-[280px]`
- Tablet: `md:w-[400px] md:h-[400px]`
- Desktop: `lg:w-[500px] lg:h-[500px]`

### 5. Index (`src/pages/Index.tsx`)
- Adicionar `overflow-x-hidden w-full` no container principal

## Resultado
- Site perfeitamente centralizado no mobile
- Sem scroll horizontal acidental
- Sem espaços invisíveis nas laterais

