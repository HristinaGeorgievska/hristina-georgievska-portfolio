import { useMemo } from "react";
import { Mail, Instagram, Phone } from "lucide-react";

/**
 * Obfuscates contact details to prevent automated scraping from the JS bundle.
 * Values are split and joined at runtime so they don't appear as plain strings in the build output.
 */
const useContactInfo = () =>
  useMemo(() => {
    const emailParts = ["hristina.georgievska1", "gmail.com"];
    const phoneParts = ["+420", "602", "367", "517"];
    return {
      email: emailParts.join("@"),
      emailDisplay: emailParts.join("@"),
      phone: phoneParts.join(""),
      phoneDisplay: phoneParts.join(" "),
    };
  }, []);

const ContactSection = () => {
  const { email, emailDisplay, phone, phoneDisplay } = useContactInfo();

  return (
    <section className="pt-8 pb-16 px-4 md:py-16 md:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-2xl md:text-3xl tracking-wider text-foreground mb-8">
          Get in Touch
        </h2>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          Professional make-up artist and hair stylist with 28+ years of experience in fashion, editorial, and commercial productions.
          Based in Prague.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail size={20} />
            <span className="text-sm tracking-wider">{emailDisplay}</span>
          </a>
          
          <a
            href="https://www.instagram.com/hristinageorgievska/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Instagram size={20} />
            <span className="text-sm tracking-wider">@hristinageorgievska</span>
          </a>
          
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone size={20} />
            <span className="text-sm tracking-wider whitespace-nowrap">{phoneDisplay}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
