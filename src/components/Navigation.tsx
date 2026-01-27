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
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2 text-foreground"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Full Screen Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop with opacity */}
          <div 
            className="absolute inset-0 bg-background/95 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 text-foreground z-50"
            aria-label="Close menu"
          >
            <X size={28} />
          </button>

          {/* Centered Menu Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-2xl tracking-widest transition-all duration-300 hover:text-foreground ${
                  activeSection === item.id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
