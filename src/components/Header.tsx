import { Link, useLocation } from "react-router-dom";

export interface HeaderProps {
  asH1?: boolean;
}

const Header = ({ asH1 }: HeaderProps) => {
  let isSubpage = false;
  try {
    const location = useLocation();
    isSubpage = location.pathname.startsWith("/collection/");
  } catch {
    isSubpage = false;
  }

  const renderAsH1 = asH1 ?? !isSubpage;

  return (
    <header className="pt-8 pb-3 md:pt-12 md:pb-6 text-center">
      {renderAsH1 ? (
        <h1 className="font-serif text-3xl md:text-4xl tracking-widest text-foreground min-h-[1.25em] leading-tight">
          HRISTINA <span className="font-bold">GEORGIEVSKA</span>
        </h1>
      ) : (
        <div className="font-serif text-3xl md:text-4xl tracking-widest text-foreground min-h-[1.25em] leading-tight">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            HRISTINA <span className="font-bold">GEORGIEVSKA</span>
          </Link>
        </div>
      )}
      <p className="mt-2 text-sm tracking-[0.3em] text-muted-foreground uppercase">
        Makeup Artist
      </p>
    </header>
  );
};

export default Header;
