import { defineTool } from "@lovable.dev/mcp-js";

const contact = {
  nome: "Jônatas Vitor",
  atuacao: "Criador de sites de alta conversão",
  site: "https://joniisites.com.br",
  whatsapp: "+55 19 3199-0107",
  whatsapp_link:
    "https://wa.me/551931990107?text=Ol%C3%A1!%20Quero%20agendar%20uma%20conversa%20sobre%20cria%C3%A7%C3%A3o%20de%20sites.",
  instagram: "https://instagram.com/jonii.sites",
  observacao: "Primeira consulta gratuita. Atendimento pelo WhatsApp.",
};

export default defineTool({
  name: "get_contact_info",
  title: "Obter contato",
  description:
    "Retorna os canais de contato públicos de Jônatas Vitor (WhatsApp, Instagram e site) para orçamentos.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(contact, null, 2) }],
    structuredContent: contact,
  }),
});
