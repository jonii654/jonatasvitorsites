import { KineticBlobsCTA } from './effects/KineticBlobsCTA';

const WHATSAPP_NUMBER = '551931990107';

export function CTASection() {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Quero agendar uma conversa sobre criação de sites.`;
  return <KineticBlobsCTA whatsappLink={whatsappLink} />;
}
