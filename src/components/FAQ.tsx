import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Quanto tempo leva para criar meu site?',
    answer: 'Em média, entrego projetos de landing page em 5-7 dias úteis. Para sites mais complexos como e-commerces ou portfólios extensos, o prazo pode variar de 2-3 semanas. Sempre combinaremos um cronograma antes de iniciar.',
  },
  {
    question: 'O site será responsivo (funciona no celular)?',
    answer: 'Sim! Todos os sites são desenvolvidos com abordagem mobile-first, garantindo uma experiência perfeita em qualquer dispositivo - smartphones, tablets e desktops.',
  },
  {
    question: 'Vocês oferecem suporte após a entrega?',
    answer: 'Ofereço 30 dias de suporte gratuito após a entrega para ajustes e dúvidas. Também disponibilizo pacotes de manutenção mensal para quem precisa de atualizações contínuas.',
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceito PIX, transferência bancária e cartão de crédito (parcelado em até 12x). O pagamento é dividido: 50% para iniciar o projeto e 50% na entrega.',
  },
  {
    question: 'Preciso fornecer textos e imagens?',
    answer: 'Idealmente sim, pois você conhece melhor seu negócio. Mas posso ajudar com copywriting persuasivo e indicar bancos de imagens profissionais. Também trabalho com fotógrafos parceiros se necessário.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="section-label">Dúvidas frequentes</span>
          <h2 className="section-title">
            Perguntas & Respostas
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card border-none px-6 rounded-2xl overflow-hidden"
              >
                <AccordionTrigger className="text-left text-foreground hover:no-underline py-6 [&[data-state=open]>svg]:rotate-180">
                  <span className="pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
