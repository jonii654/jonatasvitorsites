
# Plano: Corrigir Scroll-Lock das Seções "O que você ganha" e "Por que me escolher"

## Problema Identificado

As seções com scroll-lock estão apresentando problemas:
1. **"Por que me escolher" (Testimonials)**: O conteúdo dos cards está invisível/em branco - os cards não estão aparecendo conforme o usuário rola
2. O cálculo do `scrollYProgress` não está funcionando corretamente porque a seção está dentro de containers aninhados

## Causas Raiz

1. A seção `Testimonials` está dentro de múltiplos containers (`div.relative > div.relative.z-10`) que interferem no cálculo do scroll
2. O `offset: ["start start", "end end"]` não está calculando corretamente o progresso
3. Os cards usam `position: absolute` e dependem do `scrollYProgress` para controlar opacidade/posição

## Correções a Implementar

### 1. Arquivo: `src/components/Testimonials.tsx`
Corrigir o scroll behavior:
- Alterar o `offset` do `useScroll` para incluir margem de segurança
- Ajustar os ranges de transição dos cards para começar a aparecer mais cedo
- Garantir que pelo menos um card esteja visível em qualquer momento

**Mudanças específicas:**
```
Offset atual: ["start start", "end end"]
Offset corrigido: ["start end", "end start"]

Ranges de transição:
- Aumentar o tempo que cada card fica visível (peak range maior)
- Iniciar primeiro card já visível (opacity 1)
```

### 2. Arquivo: `src/components/Testimonials.tsx`
Melhorar a visibilidade inicial:
- Primeiro card deve começar com opacidade 1
- Ajustar os segmentSize para transições mais suaves
- Garantir que os cards se sobreponham corretamente

### 3. Validar `HorizontalNotebookScroll`
- Verificar se está funcionando corretamente (parece OK baseado no teste)
- Manter a estrutura atual que está funcionando

## Código da Correção

### Testimonials.tsx - ValueCard

```tsx
// Ranges atuais
const startRange = index * segmentSize;
const peakStart = startRange + segmentSize * 0.3;
const peakEnd = startRange + segmentSize * 0.7;
const endRange = (index + 1) * segmentSize;

// Ranges corrigidos para melhor visibilidade
const startRange = Math.max(0, (index - 0.2) * segmentSize);
const peakStart = index * segmentSize;
const peakEnd = (index + 0.8) * segmentSize;
const endRange = Math.min(1, (index + 1) * segmentSize);

// Opacity corrigida - primeiro card começa visível
const opacity = useTransform(
  scrollYProgress,
  index === 0 
    ? [0, 0, peakEnd, endRange]  // Primeiro card já visível
    : [startRange, peakStart, peakEnd, endRange],
  index === 0 
    ? [1, 1, 1, 0]  // Primeiro card visível desde o início
    : [0, 1, 1, 0]
);
```

### Testimonials.tsx - useScroll offset

```tsx
// Atual
offset: ["start start", "end end"]

// Corrigido - offset que funciona com containers aninhados
offset: ["start end", "end start"]
```

## Resultado Esperado

- Seção "O que você ganha" continua funcionando (já está OK)
- Seção "Por que me escolher" mostra os cards corretamente ao rolar
- Transições suaves entre cards
- Primeiro card visível quando a seção entra na viewport
- Card 3D mantido intacto sem alterações
