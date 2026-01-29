
# Plano: Kinetic Typography nos Blocos

## O que Vai Mudar

Em vez do efeito de palavras flutuantes aparecer como fundo da seção inteira, cada um dos 3 cards ("Conversa inicial", "Design & Desenvolvimento", "Lançamento") terá seu próprio efeito de tipografia cinética dentro dele.

## Estrutura Visual

```text
+------------------------------------------+
|           Como funciona                  |
|      Simples e direto ao ponto           |
+------------------------------------------+
|                                          |
|  +----------+  +----------+  +----------+|
|  |    01    |  |    02    |  |    03    ||
|  |  [icon]  |  |  [icon]  |  |  [icon]  ||
|  | LANDING  |  | DESIGN   |  | SEO      ||
|  | PAGE     |  | UI/UX    |  | RAPIDO   ||  <- Palavras flutuando
|  | Conversa |  | Design & |  | Lança-   ||     dentro de cada card
|  | inicial  |  | Desenvol |  | mento    ||
|  +----------+  +----------+  +----------+|
|                                          |
+------------------------------------------+
```

## Alteracoes Tecnicas

### Arquivo: `src/components/HowItWorks.tsx`

1. **Remover fundo global de KineticTypography**:
   - Remover o bloco das linhas 48-53 que aplica o efeito como fundo da seção
   - A seção ficará com fundo limpo/transparente

2. **Criar novo componente `CardKineticBackground`**:
   - Versão adaptada do KineticTypography que funciona dentro de um card pequeno
   - Menos palavras (4-6 por card em vez de 30-40)
   - Tamanho de fonte menor para caber no card
   - Velocidade mais suave
   - Cada card terá palavras relacionadas ao seu tema

3. **Aplicar efeito dentro de cada card**:
   - Adicionar o componente de background dentro do `glass-card-hover`
   - Posicionar com `absolute inset-0` atrás do conteúdo
   - Aplicar gradiente de fade nas bordas para melhor leitura do texto principal

### Palavras por Card (tematizadas)

- **Card 01 - Conversa**: "BRIEFING", "ESTRATEGIA", "OBJETIVOS", "PUBLICO", "NEGOCIO"
- **Card 02 - Design**: "DESIGN", "UI/UX", "LAYOUT", "RESPONSIVO", "MODERNO"
- **Card 03 - Lançamento**: "DEPLOY", "SEO", "RAPIDO", "OTIMIZADO", "PERFORMANCE"

## Resultado Final

- Fundo da seção limpo, sem distrações
- Cada card tem seu próprio efeito sutil de palavras flutuando
- Palavras tematizadas criam conexão visual com o conteúdo do passo
- Efeito mais contido e elegante
- Melhor legibilidade do texto principal
