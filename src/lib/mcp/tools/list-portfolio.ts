import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const projects = [
  {
    title: "Vivendo Poderosamente",
    category: "Landing Page",
    subtitle: "Curso de transformação pessoal",
    description:
      "Página de vendas com design impactante para curso de transformação pessoal.",
    type: "Projeto Real",
    link: "https://www.vivendopoderosamente.com.br/",
  },
  {
    title: "ViniDigital",
    category: "Site Institucional",
    subtitle: "CFTV, Elétrica e Automação",
    description:
      "Site institucional para empresa de CFTV, Elétrica e Automação com design moderno.",
    type: "Projeto Real",
    link: null,
  },
  {
    title: "Clínica do iPhone",
    category: "Site Institucional",
    subtitle: "Assistência técnica",
    description:
      "Site modelo para assistência técnica de iPhones com design moderno e profissional.",
    type: "Protótipo",
    link: null,
  },
  {
    title: "Beatriz",
    category: "Marca pessoal",
    subtitle: "Estrategista digital",
    description:
      "Site modelo para estrategista digital e mentora com design elegante e sofisticado.",
    type: "Protótipo",
    link: null,
  },
  {
    title: "CSA Engenharia",
    category: "Site Institucional",
    subtitle: "Engenharia Civil",
    description:
      "Site institucional para empresa de engenharia civil, com identidade sóbria e foco em credibilidade.",
    type: "Protótipo",
    link: null,
  },
];

export default defineTool({
  name: "list_portfolio",
  title: "Listar portfólio",
  description:
    "Lista os projetos e protótipos de sites já criados por Jônatas Vitor. Filtre por categoria se necessário.",
  inputSchema: {
    category: z
      .string()
      .trim()
      .optional()
      .describe("Filtro opcional por categoria, ex.: 'Landing Page'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const items = category
      ? projects.filter((p) =>
          p.category.toLowerCase().includes(category.toLowerCase())
        )
      : projects;
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { projects: items },
    };
  },
});
