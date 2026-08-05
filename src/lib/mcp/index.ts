import { defineMcp } from "@lovable.dev/mcp-js";
import listServicesTool from "./tools/list-services";
import listPortfolioTool from "./tools/list-portfolio";
import searchFaqTool from "./tools/list-faq";
import getContactTool from "./tools/get-contact";

export default defineMcp({
  name: "jonatas-vitor-sites-that-convert",
  title: "Jonatas Vitor: Sites That Convert",
  version: "0.1.0",
  instructions:
    "Ferramentas públicas do site de Jônatas Vitor, criador de sites de alta conversão. Use `list_services` para os serviços e prazos, `list_portfolio` para projetos já entregues, `search_faq` para dúvidas sobre prazo, pagamento e suporte, e `get_contact_info` para os canais de contato (WhatsApp/Instagram).",
  tools: [listServicesTool, listPortfolioTool, searchFaqTool, getContactTool],
});
