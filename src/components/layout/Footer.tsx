const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/AlejoBI",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/alejandrobi/",
    external: true,
  },
  {
    label: "Contacto",
    href: "mailto:alejandrobravoisajar1@gmail.com",
    external: false,
  },
] as const;

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {year} Alejandro Bravo Isajar. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
