import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const faqs = [
  {
    question: "Quanto tempo leva para criar meu site?",
    answer:
      "Em média, entrego projetos de landing page em 5-7 dias úteis. Para sites mais complexos como e-commerces ou portfólios extensos, o prazo pode variar de 2-3 semanas. Sempre combinaremos um cronograma antes de iniciar.",
  },
  {
    question: "O site será responsivo (funciona no celular)?",
    answer:
      "Sim! Todos os sites são desenvolvidos com abordagem mobile-first, garantindo uma experiência perfeita em qualquer dispositivo - smartphones, tablets e desktops.",
  },
  {
    question: "Vocês oferecem suporte após a entrega?",
    answer:
      "Ofereço 30 dias de suporte gratuito após a entrega para ajustes e dúvidas. Também disponibilizo pacotes de manutenção mensal para quem precisa de atualizações contínuas.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceito PIX, transferência bancária e cartão de crédito (parcelado em até 12x). O pagamento é dividido: 50% para iniciar o projeto e 50% na entrega.",
  },
  {
    question: "Preciso fornecer textos e imagens?",
    answer:
      "Idealmente sim, pois você conhece melhor seu negócio. Mas posso ajudar com copywriting persuasivo e indicar bancos de imagens profissionais. Também trabalho com fotógrafos parceiros se necessário.",
  },
];

export default defineTool({
  name: "search_faq",
  title: "Buscar no FAQ",
  description:
    "Retorna as perguntas frequentes sobre prazos, pagamento, suporte e responsividade. Use 'query' para filtrar.",
  inputSchema: {
    query: z
      .string()
      .trim()
      .optional()
      .describe("Termo de busca opcional para filtrar perguntas e respostas."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }) => {
    const q = query?.toLowerCase();
    const items = q
      ? faqs.filter(
          (f) =>
            f.question.toLowerCase().includes(q) ||
            f.answer.toLowerCase().includes(q)
        )
      : faqs;
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { faqs: items },
    };
  },
});
