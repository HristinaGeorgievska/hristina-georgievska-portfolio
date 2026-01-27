import portrait1 from "@/assets/gallery/portrait-1.jpg";
import portrait2 from "@/assets/gallery/portrait-2.jpg";
import portrait5 from "@/assets/gallery/portrait-5.jpg";

const commercialProjects = [
  {
    title: "Harper's Bazaar",
    category: "Editorial",
    image: portrait2,
  },
  {
    title: "Vogue Beauty",
    category: "Campaign",
    image: portrait1,
  },
  {
    title: "L'Oréal Paris",
    category: "Commercial",
    image: portrait5,
  },
];

const CommercialSection = () => {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl tracking-wider text-foreground mb-10 text-center">
          Commercial Work
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {commercialProjects.map((project, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full aspect-[3/4] object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-500" />
              </div>
              <h3 className="font-serif text-lg text-foreground tracking-wide">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground tracking-wider uppercase mt-1">
                {project.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommercialSection;
