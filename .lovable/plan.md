
# Plano: Restaurar Scroll-Jacking nas Seções

## Problema Identificado

As duas seções com scroll-jacking ("O que você ganha" e "Por que me escolher") pararam de travar o scroll corretamente. Analisando o código, identifiquei possíveis causas:

1. **VideoBackground com position: sticky** - O vídeo de fundo tem `position: sticky` que pode conflitar com o sticky das seções
2. **Overflow settings** - As alterações recentes de `overflow-x-hidden` podem afetar o comportamento do sticky em alguns navegadores
3. **Estrutura de containers** - A forma como as seções estão aninhadas pode interferir

---

## Solução

### 1. Remover sticky do VideoBackground
O vídeo de fundo não precisa de `position: sticky` - ele é decorativo e deve usar apenas `position: absolute` ou `fixed`.

**Arquivo**: `src/components/VideoBackground.tsx`
- Remover `position: 'sticky'` e `top: 0` do elemento video
- Manter apenas `position: absolute`

### 2. Garantir isolamento das seções de scroll-jacking
Cada seção de scroll-jacking precisa ter seu próprio contexto de stacking sem interferência.

**Arquivo**: `src/pages/Index.tsx`
- Adicionar `position: relative` explícito nas seções de scroll-jacking
- Garantir que os containers com VideoBackground não quebrem o fluxo do scroll

### 3. Revisar overflow nos containers pai
O `overflow-x-hidden` não deve afetar o `overflow-y`, mas alguns navegadores têm bugs.

**Arquivo**: `src/index.css`
- Adicionar `overflow-y: visible` explícito para garantir que o scroll vertical não seja afetado
- Usar `clip` ao invés de `hidden` para overflow-x em casos específicos

---

## Mudanças Técnicas

### `src/components/VideoBackground.tsx`
```tsx
// ANTES: position: 'sticky', top: 0
// DEPOIS: remover essas propriedades
style={{
  opacity: 0.12,
  filter: 'blur(1px) saturate(1.3)',
  // SEM position sticky
}}
```

### `src/pages/Index.tsx`
```tsx
// Adicionar wrapper isolado para seções de scroll-jacking
<div className="relative">
  <HorizontalNotebookScroll />
</div>

// E para Testimonials:
<div className="relative">
  <Testimonials />
</div>
```

### `src/index.css`
```css
html {
  overflow-x: clip; /* Melhor que hidden para não afetar sticky */
  overflow-y: auto;
}

body {
  overflow-x: clip;
  overflow-y: auto;
}
```

---

## Resultado Esperado

1. Scroll trava corretamente na seção "O que você ganha" (HorizontalNotebookScroll) enquanto o conteúdo desliza horizontalmente
2. Scroll trava corretamente na seção "Por que me escolher" (Testimonials) enquanto os cards surgem verticalmente
3. Transições suaves entre as seções
4. Sem conflitos com outros elementos sticky ou vídeos de fundo
