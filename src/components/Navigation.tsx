import { useState } from "react";
import { Link } from "react-router-dom";

interface NavigationProps {
  activeSection: string;
}

const Navigation = ({ activeSection }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "fashion", label: "Fashion", path: "/" },
    { id: "beauty", label: "Beauty", path: "/beauty" },
    // Temporarily hidden until advertising items are available:
    // { id: "advertising", label: "Advertising", path: "/advertising" },
    { id: "video", label: "Video", path: "/video" },
    { id: "contact", label: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className="flex justify-center py-3 md:py-6">
        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-10">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`group relative inline-block py-1 text-sm uppercase tracking-[0.1em] transition-colors duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 rounded-xs ${
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 right-[0.1em] h-[1px] bg-foreground transition-all duration-300 ease-out origin-left ${
                      isActive
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-foreground relative z-[60] transition-transform duration-200 active:scale-90 hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground rounded-sm"
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
          {navItems.map((item, index) => {
            const isActive = activeSection === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`group relative inline-block py-1 text-2xl uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 ${
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{
                  transform: isOpen ? "translateY(0)" : "translateY(20px)",
                  opacity: isOpen ? 1 : 0,
                  transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08 + 0.15}s`,
                }}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 right-[0.15em] h-[1.5px] bg-foreground transition-all duration-300 ease-out origin-left ${
                    isActive
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navigation;
