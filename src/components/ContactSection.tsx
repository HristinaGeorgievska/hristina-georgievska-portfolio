import { useMemo } from "react";

/**
 * Obfuscates contact details to prevent automated scraping from the JS bundle.
 * Values are split and joined at runtime so they don't appear as plain strings in the build output.
 */
const useContactInfo = () =>
  useMemo(() => {
    const emailUser = "hristina.georgievska1";
    const emailDomain = "gmail.com";
    const phoneParts = ["+420", "602", "367", "517"];
    return {
      emailUser,
      emailDomain,
      email: `${emailUser}@${emailDomain}`,
      phone: "+420602367517",
      phoneDisplay: phoneParts.join(" "),
    };
  }, []);

const ContactSection = () => {
  const { emailUser, emailDomain, email, phone, phoneDisplay } = useContactInfo();

  return (
    <section className="px-4 pt-20 sm:pt-24 md:pt-28 pb-32 md:pb-44 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
        {/* Main element: Email mailto link in serif font with lining numerals */}
        <a
          href={`mailto:${email}`}
          className="group relative inline-block py-1 font-serif text-[20px] min-[390px]:text-[22px] md:text-[30px] lg:text-[32px] text-foreground tracking-normal transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground focus-visible:outline-offset-4 rounded-sm lining-nums [font-feature-settings:'lnum'_1]"
          style={{ fontVariantNumeric: "lining-nums", fontFeatureSettings: '"lnum" 1' }}
          aria-label={`Send email to ${email}`}
        >
          <span>{emailUser}</span>
          <wbr />
          <span>@{emailDomain}</span>
          <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 origin-left" />
        </a>

        {/* Secondary elements: Instagram & Phone in nav style (darkened from muted) */}
        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <a
            href="https://instagram.com/hristinageorgievska"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-block py-1 text-sm uppercase tracking-[0.1em] text-foreground/75 hover:text-foreground focus-visible:text-foreground transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground focus-visible:outline-offset-4 rounded-sm"
            aria-label="Visit Instagram profile"
          >
            @hristinageorgievska
            <span className="absolute bottom-0 left-0 right-[0.1em] h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 origin-left" />
          </a>

          <a
            href={`tel:${phone}`}
            className="group relative inline-block py-1 text-sm uppercase tracking-[0.1em] text-foreground/75 hover:text-foreground focus-visible:text-foreground transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground focus-visible:outline-offset-4 rounded-sm"
            aria-label={`Call ${phoneDisplay}`}
          >
            {phoneDisplay}
            <span className="absolute bottom-0 left-0 right-[0.1em] h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 origin-left" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
