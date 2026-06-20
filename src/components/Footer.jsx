import { Instagram, Linkedin, Twitter } from 'lucide-react';

const footerColumns = [
  {
    title: 'Product',
    links: ['Features', 'Solutions', 'Pricing'],
  },
  {
    title: 'Company',
    links: ['About', 'Contact', 'Careers'],
  },
  {
    title: 'Resources',
    links: ['Blog', 'Docs', 'Support'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms'],
  },
];

const socialLinks = [
  { label: 'LinkedIn', icon: Linkedin },
  { label: 'Twitter', icon: Twitter },
  { label: 'Instagram', icon: Instagram },
];

function Footer() {
  return (
    <footer id="about" className="bg-black text-white">
      <div className="section-shell py-20 sm:py-24 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1.85fr]">
          <div className="max-w-lg">
            <a href="#top" className="font-serif text-4xl font-semibold text-white hover:text-blush">
              Deload Analytics
            </a>
            <p className="mt-6 text-lg leading-8 text-grey-light">
              A virtual data analyst for teams that need clarity from their numbers without adding
              another reporting workflow.
            </p>
            <div className="mt-8 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href="#social"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-taupe text-grey-light hover:border-blush hover:text-blush"
                    aria-label={social.label}
                  >
                    <Icon size={19} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-semibold uppercase text-blush">{column.title}</h2>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#footer" className="text-sm text-grey-light hover:text-blush">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-taupe pt-8">
          <p className="text-sm text-taupe">
            © 2026 Deload Analytics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
