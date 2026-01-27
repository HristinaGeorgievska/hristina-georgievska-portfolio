const Footer = () => {
  return (
    <footer className="py-8 text-center border-t border-border">
      <p className="text-sm text-muted-foreground tracking-wider">
        © {new Date().getFullYear()} Hristina Georgievska. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
