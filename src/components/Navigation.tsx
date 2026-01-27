import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "photo", label: "Photo" },
    { id: "video", label: "Video" },
    { id: "commercial", label: "Commercial Work" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (id: string) => {
    onSectionChange(id);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="flex justify-center py-6">
        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-10">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`text-sm tracking-wider transition-all duration-300 hover:text-foreground ${
                  activeSection === item.id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-foreground relative z-[60]"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <div className="relative w-6 h-6">
            <span
              className={`absolute left-0 block h-0.5 w-6 bg-foreground transition-all duration-300 ease-out ${
                isOpen ? "top-3 rotate-45" : "top-1"
              }`}
            />
            <span
              className={`absolute left-0 top-3 block h-0.5 w-6 bg-foreground transition-all duration-300 ease-out ${
                isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-6 bg-foreground transition-all duration-300 ease-out ${
                isOpen ? "top-3 -rotate-45" : "top-5"
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Full Screen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ease-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop with opacity */}
        <div
          className={`absolute inset-0 bg-background/95 backdrop-blur-sm transition-all duration-500 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Centered Menu Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-2xl tracking-widest transition-all duration-300 hover:text-foreground ${
                activeSection === item.id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
              style={{
                transform: isOpen ? "translateY(0)" : "translateY(20px)",
                opacity: isOpen ? 1 : 0,
                transition: `all 0.4s ease-out ${index * 0.1 + 0.2}s`,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
