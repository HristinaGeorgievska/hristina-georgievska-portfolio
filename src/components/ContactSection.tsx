import { Mail, Instagram, Phone } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-2xl md:text-3xl tracking-wider text-foreground mb-8">
          Get in Touch
        </h2>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          Available for editorial, commercial, bridal, and special occasion makeup. 
          Based in Skopje, available for travel worldwide.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <a
            href="mailto:hello@hristina.com"
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail size={20} />
            <span className="text-sm tracking-wider">hello@hristina.com</span>
          </a>
          
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Instagram size={20} />
            <span className="text-sm tracking-wider">@hristina.makeup</span>
          </a>
          
          <a
            href="tel:+38970123456"
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone size={20} />
            <span className="text-sm tracking-wider">+389 70 123 456</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
