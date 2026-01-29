
# Plano: Scroll Reveal Exclusivo na Seção "Por que me Escolher"

## O que Vai Mudar

Cada um dos 3 blocos vai aparecer **sozinho na tela** enquanto o usuário faz scroll. Quando termina de ver um bloco, ele sai e o próximo entra. O usuário não vê múltiplos blocos ao mesmo tempo.

## Estrutura Visual

```text
+------------------------------------------+
|        Por que me escolher               |
|      Meu compromisso com você            |
+------------------------------------------+
|                                          |
|         +------------------+             |
|         |   Design         |             |
|         |   estratégico    |  <- Bloco 1 |
|         |   [imagem/icon]  |     sozinho |
|         +------------------+             |
|                                          |
+------------------------------------------+
         [scroll down]
+------------------------------------------+
|                                          |
|         +------------------+             |
|         |   Foco em        |             |
|         |   resultados     |  <- Bloco 2 |
|         |   [imagem/icon]  |     sozinho |
|         +------------------+             |
|                                          |
+------------------------------------------+
         [scroll down]
+------------------------------------------+
|                                          |
|         +------------------+             |
|         |   Entrega        |             |
|         |   rápida         |  <- Bloco 3 |
|         |   [imagem/icon]  |     sozinho |
|         +------------------+             |
|                                          |
+------------------------------------------+
```

## Comportamento do Scroll

1. O titulo da secao fica fixo no topo enquanto os cards passam
2. Cada card entra com animacao de fade + scale quando chega sua vez
3. Enquanto um card esta visivel, os outros ficam escondidos
4. Transicao suave entre cards conforme o scroll
5. Depois do ultimo card, a secao termina e o scroll continua normal

## Alteracoes Tecnicas

### Arquivo: `src/components/Testimonials.tsx`

1. **Usar scroll-based animation com posicao fixa**:
   - Container da secao tera `position: sticky` ou altura aumentada para "travar" o scroll
   - Usar `useScroll` e `useTransform` do Framer Motion para controlar visibilidade dos cards

2. **Container com altura controlada**:
   - Secao tera altura de `300vh` (3 vezes a tela) para criar espaco de scroll
   - Conteudo visivel fica `sticky` no centro enquanto rola

3. **Logica de visibilidade por card**:
   - Card 1: visivel de 0% a 33% do scroll da secao
   - Card 2: visivel de 33% a 66% do scroll da secao
   - Card 3: visivel de 66% a 100% do scroll da secao

4. **Animacoes de entrada/saida**:
   - Cada card entra com `opacity: 0 -> 1`, `y: 60 -> 0`, `scale: 0.9 -> 1`
   - Cada card sai com `opacity: 1 -> 0`, `y: 0 -> -60`, `scale: 1 -> 0.9`

5. **Manter responsividade**:
   - Em mobile, comportamento similar mas com cards menores
   - Altura da secao ajustada para mobile (`250vh`)

## Implementacao Detalhada

```text
Estrutura do componente:
- ref para container da secao
- useScroll({ target: ref }) para obter progresso
- useTransform para calcular opacidade/posicao de cada card
- Cards posicionados com position: absolute dentro de container sticky
```

## Resultado Final

- Experiencia cinematica e imersiva
- Foco total em cada beneficio, um por vez
- Transicoes suaves controladas pelo scroll do usuario
- Visual moderno e diferenciado
