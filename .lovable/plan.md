# Corrigir 3 pontos do site

## 1. Fundir o efeito de empilhamento na seção "O design quem faz é você"

Hoje temos duas seções separadas:
- `Interactive3DCard` (pilot-card + 4 cards subindo)
- `DesignStacking` (palavra gigante WORK que eu fiz por engano)

Vou consolidar em **uma única seção** dentro de `DesignStacking.tsx`, replicando o efeito do vídeo MOSS:

- Heading "O design quem faz é você" + subtítulo aparecem no topo
- Pilot card (CSS card da Landing Knowledge) fica centralizado como camada base
- Palavra gigante **DESIGN** vive atrás como watermark
- Ao rolar:
  1. Heading e subtítulo fazem fade-out (`opacity 1→0, y 0→-20`) bem no início (`progress 0→0.1`)
  2. DESIGN ganha leve scale + opacidade
  3. Pilot card recua (`scale 0.88, opacity 0.35, yPercent -10`)
  4. Os 4 design-ref cards sobem um a um (`yPercent 100 → 0`) passando POR CIMA da palavra DESIGN, cada um empurrando o anterior pra trás
- Wrapper `h-[500vh]` desktop / `h-[320vh]` mobile com `sticky top-0 h-screen` (mesma altura do Interactive3DCard atual)

Remover `Interactive3DCard` do `Index.tsx` (componente fica no repo mas não é renderizado). Remover o conteúdo "WORK" da DesignStacking — substituído pelo conteúdo consolidado.

## 2. Botão Lemon — seta dentro do círculo que migra do canto direito até preencher o botão

A versão atual escala o círculo no lugar (canto direito), o que não tem o movimento característico da referência HTML. Vou ajustar `.btn-lemon` em `index.css`:

- `.lemon-circle` passa a ser `position: absolute; right: 6px; top: 50%; transform: translateY(-50%)`
- No hover: `transform: translate(50%, -50%) scale(8); right: 50%; top: 50%` — círculo migra para o centro e escala, fazendo a cor neon "engolir" o botão da direita pra esquerda com a seta ainda visível
- Padding direito aumentado para reservar espaço do círculo (`padding-right: 3rem`)

## 3. Botão "Falar no WhatsApp" do CTASection no mesmo estilo do Hero

Em `src/components/effects/KineticBlobsCTA.tsx`, substituir o `<Button className="btn-cta">` atual por:

```tsx
<a href={whatsappLink} className="btn-lemon font-display text-base md:text-lg">
  <span className="uppercase tracking-widest">Falar no WhatsApp</span>
  <span className="lemon-circle"><ArrowRight /></span>
</a>
```

Mantém ícone, tracking e tracking de analytics. Botões do site (hero + footer CTA + header WhatsApp + menu) ficam todos no mesmo padrão Lemon.

## Arquivos afetados

- `src/index.css` — `.btn-lemon` reescrito com círculo absolute que migra
- `src/components/DesignStacking.tsx` — consolidação do efeito completo (heading + DESIGN + pilot + 4 cards)
- `src/pages/Index.tsx` — remove `Interactive3DCard` da árvore
- `src/components/effects/KineticBlobsCTA.tsx` — CTA final vira `btn-lemon`

Confirma e executo.
