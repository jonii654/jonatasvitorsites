import { defineTool } from "@lovable.dev/mcp-js";

const services = [
  {
    name: "Landing Page de alta conversão",
    description:
      "Página única focada em vendas, com copy persuasiva, design premium e CTA para WhatsApp.",
    prazo: "5 a 7 dias úteis",
  },
  {
    name: "Site institucional",
    description:
      "Site de apresentação para empresas e profissionais, com páginas de serviços, sobre e contato.",
    prazo: "2 a 3 semanas",
  },
  {
    name: "Site para portfólio / marca pessoal",
    description:
      "Vitrine digital para profissionais que precisam mostrar trabalhos, autoridade e captar clientes.",
    prazo: "2 a 3 semanas",
  },
  {
    name: "Manutenção e evolução",
    description:
      "30 dias de suporte gratuito após a entrega e pacotes mensais de manutenção e atualizações.",
    prazo: "Contínuo",
  },
];

export default defineTool({
  name: "list_services",
  title: "Listar serviços",
  description:
    "Lista os serviços de criação de sites oferecidos por Jônatas Vitor, com descrição e prazo médio.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(services, null, 2) }],
    structuredContent: { services },
  }),
});
