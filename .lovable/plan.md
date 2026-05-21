## Recriar seção Portfolio no estilo D.FM Interactive

### Objetivo
Substituir o carrossel atual da seção "Trabalhos" pelo efeito do HTML enviado: cards finos (fatias) na galeria → ao clicar, entra em "Modo Foco" com o card central grande tipo poster e os laterais reduzidos, com player inferior estilo música.

### O que vai ser construído

**1. Reescrever `src/components/Portfolio.tsx`** com dois modos:

- **Modo Galeria** (inicial): 4 cards lado a lado como fatias verticais finas. O ativo fica mais largo (`flex-[2.5]`), os outros estreitos (`flex-1`). Linha decorativa fina no topo com brilho que se move conforme o ativo.
- **Modo Foco** (após clique): card central grande tipo cartaz (300-350px), laterais reduzidos e desfocados, demais escondidos. Mostra "poster elements" (tag de categoria, número, badge).

**2. Player inferior fixo dentro da seção** (não global):
- Thumb com gradiente do projeto ativo
- Título + tag + índice (01/04)
- Botões prev / play-pause / next
- Vinil girando + status "Auto-Play Ativo / Pausado"
- Auto-play a cada 6s (pausável)

**3. Manter os 4 projetos reais** já existentes em `Portfolio.tsx`:
- Vivendo Poderosamente (Landing Page)
- ViniDigital (Site Institucional)
- Clínica do iPhone (Site Modelo)
- Beatriz (Marca Pessoal)

Cada projeto receberá um gradiente próprio para o "poster" de fundo do card (substituindo o disco/portal/orbe/cápsula do HTML original — vamos usar a **foto real do site** dentro do card com overlay gradiente, mantendo a estética premium).

**4. Comportamento de clique**:
- Modo Galeria: clicar em qualquer card → vai pra Modo Foco com ele ativo
- Modo Foco: clicar no central → abre overlay expandido (já existente, com botão "Ver projeto"); clicar nos laterais → troca o ativo
- Botão "Voltar à Lista" volta pra Modo Galeria
- Teclado: ← → navega, Esc volta

**5. Adaptações técnicas**:
- Tudo em React + Framer Motion (substituir CSS animations brutas por `motion.div` com transitions)
- Usar tokens semânticos do design system (`hsl(var(--brand-accent))`, `hsl(var(--muted))` etc.) em vez de cores hardcoded
- Manter o `LayoutGroup` + `layoutId` para a transição suave para o overlay expandido (clicar no central)
- Manter "Trabalhos" como título da seção (já está limpo, sem o mosaico)
- Suporte a swipe touch (mobile) para navegar entre projetos
- Lazy-load das imagens (`loading="lazy"`)

### Arquivos modificados
- `src/components/Portfolio.tsx` — reescrita completa do conteúdo dos cards e do modo de exibição, mantendo dados, título e overlay de detalhes

### O que NÃO muda
- Imagens reais dos 4 projetos
- Overlay expandido (modal) com descrição + botão "Ver projeto"
- Título "Trabalhos" e subtítulo
- Posição da seção dentro do Index
