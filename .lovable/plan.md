
# Plano: Restaurar Efeito de Scroll Horizontal Forçado nas 2 Seções

## Resumo

Vou restaurar o efeito de **rolagem horizontal forçada** (horizontal scroll section) nas duas seções:
1. **"O que você ganha"** (HorizontalNotebookScroll) - já tem a estrutura correta, só precisa remover o bloqueio do overflow
2. **"Por que me escolher"** (Testimonials) - converter de cards empilhados para carrossel horizontal igual ao notebook

## Problema Identificado

O `overflow-x-clip` no `<main>` do Index.tsx está **quebrando o `position: sticky`**. Isso faz com que as seções não "travem" na tela durante o scroll.

## Mudanças

### 1. Index.tsx
Remover `overflow-x-clip` do `<main>` para restaurar o comportamento sticky:
- Atual: `<main className="overflow-x-clip">`
- Corrigido: `<main>`

### 2. Testimonials.tsx
Converter de cards empilhados verticais para **carrossel horizontal** (igual ao notebook):

**Estrutura atual (errada para o efeito):**
- Cards empilhados com `position: absolute`
- Transição por `opacity` e `y` (vertical)
- Não tem movimento lateral

**Estrutura corrigida:**
- Cards em `flex` lado a lado (`min-w-[100vw]` cada)
- Movimento horizontal com `translateX` baseado no `scrollYProgress`
- Seção com altura `300vh` (3 cards x 100vh)
- Container `sticky top-0 h-screen`
- Indicadores de progresso embaixo

### 3. HorizontalNotebookScroll.tsx
Manter como está (estrutura já correta), apenas garantir que funcione após remover o overflow do Index.

## Detalhes Técnicos

### Testimonials - Nova Implementação

```text
┌─────────────────────────────────────────────────┐
│  Section (height: 300vh, position: relative)    │
│  ┌───────────────────────────────────────────┐  │
│  │  Sticky Container (h-screen, top-0)       │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Header (Por que me escolher)       │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  motion.div (flex, translateX)      │  │  │
│  │  │  ┌───────┬───────┬───────┐          │  │  │
│  │  │  │Card 1 │Card 2 │Card 3 │  ───→    │  │  │
│  │  │  │100vw  │100vw  │100vw  │          │  │  │
│  │  │  └───────┴───────┴───────┘          │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Progress Dots (● ○ ○)              │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Comportamento do Scroll

1. Usuário rola para baixo normalmente
2. Ao entrar na seção, ela "trava" (sticky) na viewport
3. Continuar rolando move os cards horizontalmente (da direita para esquerda)
4. Ao passar todos os cards, a seção "destrava" e continua o scroll normal

## Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `src/pages/Index.tsx` | Remover `overflow-x-clip` do `<main>` |
| `src/components/Testimonials.tsx` | Reescrever com carrossel horizontal |

## O que NÃO será alterado

- `Interactive3DCard.tsx` - permanece exatamente igual
- `HorizontalNotebookScroll.tsx` - estrutura já está correta

## Resultado Esperado

- Scroll trava quando entrar nas duas seções
- Conteúdo desliza horizontalmente (da direita para esquerda)
- Transições suaves sem "buracos"
- Card 3D funciona normalmente
- Comportamento idêntico ao vídeo 2
