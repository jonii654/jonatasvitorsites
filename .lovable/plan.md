## Reorganizar e centralizar o menu

### Novos itens (em ordem)
1. Início → `#` (topo)
2. Design → `#design` (seção "O design quem faz é você")
3. Quem Sou Eu → `#sobre`
4. Como Funciona → `#servicos`
5. Trabalhos → `#portfolio`
6. Contato → `#contato` (rodapé)

### Mudanças
- `Header.tsx`: substituir `navItems` pela lista acima.
- `DesignStacking.tsx`: adicionar `id="design"` na seção.
- `Footer.tsx`: garantir `id="contato"` no elemento `<footer>` (adicionar se faltar).
- `RippleMenu.tsx`:
  - Centralizar os links: trocar `pl-6 md:pl-20 max-w-[60vw]` por layout centralizado (`items-center text-center mx-auto`) e remover `w-fit` dos `<a>`.
  - Manter numeração `01..06`, mesma tipografia gigante e efeito de risco verde.
  - No desktop, deslocar a foto lateral para não brigar com o texto centralizado (ou esconder no mobile como já está).
- Botão "Falar no WhatsApp" do menu permanece no canto inferior.

### Verificação
- Conferir no preview mobile que cada link rola para a seção correta e que o texto fica perfeitamente centralizado vertical e horizontalmente.