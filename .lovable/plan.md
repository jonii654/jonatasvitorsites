# Banner de manutenção no topo + preload mais lento

## 1. Preload mais lento (`src/components/Preloader.tsx`)
- Aumentar `DURATION` de `1600ms` → `4200ms` para dar tempo da pessoa ver as animações (rings concêntricos, badge amarelo, contador subindo devagar).
- Aumentar o delay de fade-out final: `setTimeout(setVisible(false), 400)` e `setTimeout(onFinish, 1100)` para a transição não cortar abrupta.
- Manter ease-out cubic e todo o restante do visual.

## 2. Banner de manutenção no topo da página (após o preloader)
Novo componente `src/components/MaintenanceBanner.tsx`:
- Faixa fina sticky no topo (`sticky top-0 z-[100]`), full-width.
- Fundo amarelo translúcido com borda inferior (`border-yellow-400/30 bg-yellow-400/10 backdrop-blur-md`), mesma linguagem do badge do preloader.
- Conteúdo centralizado: dot pulsante (`animate-ping`) + texto "🛠️ Site em manutenção — pode apresentar pequenos bugs enquanto melhoramos a experiência."
- Botão "✕" à direita para fechar; estado dismissível em memória (sem persistência — volta a aparecer no próximo carregamento, já que a mensagem é importante).
- Altura compacta (~36–40px) para não brigar com o Header.
- Animação de entrada: `motion.div` deslizando de cima com fade, delay leve para entrar depois do preloader sumir.

Integração em `src/pages/Index.tsx`:
- Importar `MaintenanceBanner` e renderizar como **primeiro** filho do wrapper principal, antes do `Header`, dentro da árvore que aparece após o preloader.
- Como o `Header` provavelmente já é sticky/fixed, garantir que o banner fique acima dele (ou logo no topo do fluxo) sem sobrepor a navegação. Se o Header for `fixed`, ajustar o `top` dele com um pequeno offset (ex.: variável CSS `--banner-h: 40px`) — fazer essa verificação ao implementar lendo `Header.tsx` e `Index.tsx`.

## Não muda
- Visual do preloader (apenas timing).
- Conteúdo do badge amarelo dentro do preloader (continua lá).
- Restante das seções, animações e lógica do site.
