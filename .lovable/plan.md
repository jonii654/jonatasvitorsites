# Ajustes: idade, tela de carregamento, fotos da abertura, fontes e "Meu compromisso com você"

## 1. Idade
- Trocar "21 anos" por **22 anos** nos dois lugares onde aparece: o texto do "Quem sou eu" e a etiqueta junto da sua foto.

## 2. Tela de carregamento: cerca de 9 segundos
- A barra passa a encher devagar ao longo de 9 segundos, e a tela some depois disso.
- Continua sempre esperando o site estar pronto, então nunca abre antes de carregar.

## 3. Fotos de fundo da abertura mais claras
- As 4 fotos dos cantos ficam mais visíveis.
  - **No celular**, a força de exibição sobe de 40% para cerca de 75%.
  - **No computador**, continuam com força total.
- Em todas as telas, elas ganham um leve aumento de brilho e contraste.
- A escurecida que fica por cima delas também fica mais fraca.
- O título continua bem legível.

## 4. Fontes da seção preta (Conversa inicial / Design & Desenvolvimento / Lançamento)
- **Títulos**: saem da letra de lápis e passam a usar a fonte forte do site, a mesma de "Performance" em "Compromisso com qualidade".
- **Frases de baixo**: passam a usar a mesma fonte de "Sites rápidos e otimizados prontos para escalar".
- O efeito de escrever enquanto rola continua igual: o título é desenhado pelo contorno e depois preenchido, e a frase vai aparecendo da esquerda para a direita com a pontinha de luz.

## 5. "Meu compromisso com você": efeito igual ao do seu vídeo
O vídeo mostra uma **faixa de painéis dobrados como sanfona**, com as bordas de cima e de baixo curvadas para dentro. Ela anda para o lado enquanto você rola a tela, com um leve efeito de cores separadas (estilo glitch) durante o movimento.

O que você vai ver:
- **Abertura**: o título "Meu compromisso com você" aparece primeiro. Logo depois, a tela trava e a faixa de painéis começa a andar da direita para a esquerda conforme você rola.
- **Painéis**: as 3 fotos atuais (Design estratégico, Foco em resultados, Entrega rápida) viram painéis altos.
  - As fotos aparecem duas vezes na faixa, para ela ficar longa como no vídeo.
  - Cada painel dobra levemente para dentro e para fora, alternando, como uma sanfona.
- **Texto**: o título e a frase de cada compromisso ficam em cima do painel correspondente, sempre legíveis.
- **Movimento**: quanto mais rápido você rola, mais forte fica o efeito de cores separadas. Quando você para, a imagem fica nítida de novo.
- **Saída**: depois do último painel, a tela destrava e o site segue normal.
- **Cores**: mantenho o fundo e as cores do seu site, sem o rosa do vídeo.
- **Aparelhos mais fracos**: a mesma faixa com as dobras, mas sem o efeito de cores separadas.

## Detalhes técnicos
- `AboutMe.tsx` e `StickerAvatar.tsx`: trocar o texto da idade.
- `Preloader.tsx`: `MIN = 9000` e `MAX = 12000`; a barra avança até 90% em 9 s.
- `Hero.tsx`, nos cards de canto:
  - `opacity-40` vira `opacity-75`.
  - As imagens recebem `filter: brightness(1.15) contrast(1.05)`.
  - O overlay fica mais leve.
- `ExpandingBars.tsx`:
  - Remover `Caveat` e usar `font-black tracking-tight`, a mesma família do `Results.tsx`, no `<text>` do SVG.
  - Descrições com as classes `text-sm md:text-base text-muted-foreground leading-relaxed`.
  - Tirar o link da Caveat do `index.html`.
- `Coverflow3D.tsx` reescrito como "FoldStrip":
  - Seção sticky com cerca de `300vh` de altura e uma faixa movida por `x` com GSAP ScrollTrigger (`scrub`).
  - Cada painel com `rotateY` alternado de ±18°, `perspective`, e borda curva feita com `clip-path: path()` ou máscara SVG.
  - O glitch é uma sombra RGB ou uma camada duplicada deslocada, com a opacidade ligada à velocidade do ScrollTrigger (`self.getVelocity()`).
  - Só transform e opacity; no light tier, sem glitch.
