import { useState } from "react";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const navItems = [
    { id: "photo", label: "Photo" },
    { id: "video", label: "Video" },
    { id: "commercial", label: "Commercial Work" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className="flex justify-center py-6 border-b border-border">
      <ul className="flex gap-6 md:gap-10">
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
    </nav>
  );
};

export default Navigation;
