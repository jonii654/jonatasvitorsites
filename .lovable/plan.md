Plano de implementação:

1. Hero mobile
- Diminuir os 4 cards flutuantes da Hero no mobile.
- Reposicionar os cards mais nos cantos, com menor opacidade e camada visual de fundo.
- Reforçar a leitura do texto principal com z-index/contraste para os cards parecerem um fundo 3D intocável, não elementos competindo com o título.

2. Preload com vídeo de fundo
- Copiar o vídeo enviado para `src/assets` e importar no `Preloader`.
- Trocar o fundo atual de gradiente/pulsos por vídeo full-screen com `autoPlay`, `muted`, `playsInline`, `loop` e overlay escuro para leitura.
- Manter nome, porcentagem e barra de progresso, mas com visual mais próximo da referência: fundo em movimento, tipografia limpa e saída suave.

3. Efeito do botão
- Corrigir `.btn-lemon` para imitar a referência: círculo limão pequeno à direita com seta visível; no hover/touch o círculo expande preenchendo o botão sem “sumir” estranho, com texto por cima e seta comportada.
- Aplicar o mesmo estilo nos CTAs principais já existentes: Hero, Header/Menu e botão final “Falar no WhatsApp”.

4. Seção Trabalhos
- Refazer a seção `Portfolio` para uma experiência mais imersiva.
- Usar um projeto em destaque por vez, imagem grande, nome forte, contador/categoria e navegação por scroll/drag/toque.
- Fazer o brilho/fundo mudar de cor conforme o trabalho ativo, dando a sensação de vitrine premium como no vídeo.
- Preservar os projetos e links atuais.

5. Compromisso com qualidade
- Substituir os cards atuais por uma conexão vertical de setores.
- Criar linha central neon com nós numerados `01`, `02`, `03`, `04`, acendendo conforme o scroll.
- Cada item revela valor, título e descrição com animação GSAP, inspirado no terceiro vídeo.

6. Validação
- Conferir visual no viewport mobile atual e checar erros de console/runtime depois da implementação.