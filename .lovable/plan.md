## 1. Seção "O design quem faz é você" (`DesignStacking.tsx`)

- Remover o subtítulo "Role para revelar as direções de design — cada card é uma linguagem visual possível."
- No desktop, fazer a palavra **DESIGN** ocupar o fundo bem maior (clamp ~60vw → 95vw, próximo de `clamp(8rem, 70vw, 90rem)`), em branco puro `text-white` com opacidade mais forte (`opacity 0.85` no início, mantendo levemente translúcido para os cards passarem por cima).
- Diminuir o tamanho dos cards no desktop (de `max-w-[420px]` → `max-w-[300px]`) para que pareçam menores deslizando sobre a palavra DESIGN gigante.
- Corrigir mobile: altura atual `280vh` está cortando o último card (Artesanal) na metade. Aumentar para `340vh` e ajustar o `end` do ScrollTrigger / tempos da timeline para que o último card complete o movimento antes da seção sair.

## 2. BenefitsBar (`BenefitsBar.tsx`)

- Implementar a mesma conexão de luz progressiva que existe na seção "Compromisso com Qualidade" (sticky benefits): ao rolar, uma luz desce/atravessa **conectando os três ícones** (azul → verde → azul), não os textos.
- A linha conectora atual existe mas é estática (anima uma vez `whileInView`). Substituir por uma linha cuja luz (gradiente + glow) avança em função do `scrollYProgress` da seção, ligando os check-circles.
- Desktop: a luz percorre horizontalmente entre os ícones.
- Mobile: a luz desce verticalmente entre os ícones.
- O brilho da luz fica posicionado ligando ícone-a-ícone (e não nome-a-nome).

## 3. Foto do "Sobre mim" — efeito baralho (`PhotoCarousel.tsx`)

- Mostrar as **duas fotos juntas** desde o início, sobrepostas em forma de "X" (baralho aberto na mão):
  - Foto 1 rotacionada ~ -8° à esquerda, levemente atrás.
  - Foto 2 rotacionada ~ +8° à direita, na frente, deslocada um pouco.
- Hover/tap: as fotos se abrem mais (rotação aumenta, deslocamento maior), reforçando o efeito de "espremer o baralho".
- Manter swipe / dots para alternar qual foto fica na frente (a da frente troca, mas as duas continuam visíveis em X).
- Manter o efeito atual de emergir do escuro no scroll.

## 4. Portfólio (`Portfolio.tsx`)

No card em destaque do projeto ativo:
- Remover o título do projeto (`active.title` no h3).
- Remover o subtítulo (`active.subtitle`).
- Remover a label de categoria (`Landing Page`, `Site Institucional`, etc).
- Remover o badge do tipo no canto superior direito (`active.type` — "Projeto Real" / "Site Modelo").
- Remover a numeração no canto superior esquerdo (`01 / 05`).
- Remover também o contador inferior `01 — 05`.
- Manter apenas: imagem do projeto + botão/link **"Ver projeto"** discreto na base do card, abrindo `active.link`.
- Manter setas de navegação e dots.
- Manter o texto gigante de fundo (nome do projeto) ou removê-lo também? → **Remover** o "giant brand text" atrás do card, já que o usuário quer remover as informações textuais do projeto.

## Arquivos afetados

- `src/components/DesignStacking.tsx`
- `src/components/BenefitsBar.tsx`
- `src/components/PhotoCarousel.tsx`
- `src/components/Portfolio.tsx`
