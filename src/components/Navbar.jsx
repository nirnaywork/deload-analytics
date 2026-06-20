import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'About', href: '#about' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="nav-surface sticky top-0 z-50 border-b border-grey-light backdrop-blur">
      <nav className="section-shell flex min-h-20 items-center justify-between gap-6">
        <a
          href="#top"
          className="font-serif text-2xl font-semibold text-black hover:text-taupe"
          onClick={closeMenu}
        >
          Deload Analytics
        </a>

        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-black hover:text-taupe"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <a href="#login" className="text-sm font-medium text-black hover:text-taupe">
            Login
          </a>
          <a href="#signup" className="primary-button min-h-10 px-5 py-2">
            Sign Up
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[4px] border border-grey-light text-black hover:bg-grey-light md:hidden"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-grey-light bg-white md:hidden">
          <div className="section-shell flex min-h-[calc(100vh-80px)] flex-col justify-between py-8">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-serif text-4xl font-medium text-black hover:text-taupe"
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="grid gap-3">
              <a
                href="#login"
                className="secondary-button w-full"
                onClick={closeMenu}
              >
                Login
              </a>
              <a
                href="#signup"
                className="primary-button w-full"
                onClick={closeMenu}
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
