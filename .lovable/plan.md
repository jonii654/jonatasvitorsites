
# Plano: Parallax na CTA + Correção de Overflow Mobile

## Resumo
Vou adicionar um efeito de parallax na CTA flutuante "O Design Quem Faz É Você!" que faz o texto subir mais rapidamente conforme o scroll, e corrigir o problema de overflow horizontal no mobile que permite puxar a página para o lado direito.

---

## Problema Identificado

### Overflow Horizontal no Mobile
Analisando o código, identifiquei **múltiplas fontes** que podem causar o espaço vazio ao puxar para a direita:

1. **`HorizontalNotebookScroll.tsx`** (linha 65): Usa `w-screen` que pode exceder a largura real quando há scrollbar ou diferenças de cálculo de viewport
2. **`Interactive3DCard.tsx`**: As partículas do efeito de giro (`SpinParticle`) podem expandir para fora do container
3. **Elementos com posição absoluta** podem extrapolar os limites da tela

### Solução para Overflow
- Trocar `w-screen` por `w-full` no `HorizontalNotebookScroll`
- Adicionar `overflow-x: hidden` no container principal da página (`Index.tsx`)
- Garantir que as partículas fiquem contidas dentro do container com `overflow: hidden`

---

## Novo Recurso: Parallax na CTA

O efeito de parallax fará a CTA "O Design Quem Faz É Você!" subir mais rápido que o scroll natural, criando uma sensação de profundidade.

### Implementação
- Usar `useScroll` e `useTransform` do Framer Motion
- A CTA se moverá para cima (-100px a -200px) conforme o scroll avança
- Adicionar leve opacidade fade-out para transição suave

---

## Mudanças Técnicas

### 1. `src/components/Interactive3DCard.tsx`
- Adicionar refs para o scroll tracking
- Implementar `useScroll` com target na section
- Usar `useTransform` para criar movimento parallax na CTA (a CTA sobe mais rápido)
- A transformação será: quando o scroll progride de 0 a 1, a CTA se move de 0 a -150px no eixo Y

### 2. `src/components/HorizontalNotebookScroll.tsx`
- Trocar `w-screen` por `w-full` no container dos slides (linha 65)
- Isso evita overflow causado por cálculos inconsistentes de `100vw`

### 3. `src/pages/Index.tsx`
- Adicionar `overflow-x-hidden` no container principal
- Isso funciona como "rede de segurança" para evitar qualquer elemento que escape

### 4. `src/index.css`
- Adicionar regras globais para prevenir overflow horizontal:
```css
html, body {
  overflow-x: hidden;
  max-width: 100vw;
}
```

---

## Visualização do Efeito Parallax

```text
┌─────────────────────────────────┐
│                                 │
│   "O Design Quem Faz É Você!"   │  ← CTA (sobe mais rápido)
│              ↑↑↑                │
│          [ Card 3D ]            │  ← Card (scroll normal)
│                                 │
└─────────────────────────────────┘

Scroll ↓ → CTA sobe 1.5x mais rápido que o card
```

---

## Resultado Esperado

1. **Parallax**: A CTA flutuante terá um efeito de profundidade elegante, subindo mais rápido que o card 3D durante o scroll
2. **Mobile sem overflow**: Não será mais possível puxar a página para o lado direito e ver espaço vazio
3. **Sticky sections funcionando**: As correções não afetarão o comportamento de `sticky` das seções de scroll-jacking
