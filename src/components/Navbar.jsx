import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'About', href: '#about' },
];

function Navbar({ onOpenAuth, onGoToDashboard }) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  const { currentUser, isAuthenticated, isAuthReady, logOut } = useAuth();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);
  const accountLabel = currentUser?.displayName || currentUser?.email || 'Account';

  const handleOpenAuth = (mode) => {
    onOpenAuth(mode);
    closeMenu();
  };

  const handleLogOut = async () => {
    await logOut();
    closeMenu();
  };

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

        {isAuthReady && isAuthenticated ? (
          <div className="hidden items-center gap-4 md:flex">
            <span className="max-w-44 truncate text-sm font-medium text-taupe">
              {accountLabel}
            </span>
            <button type="button" onClick={toggleTheme} className="text-black hover:text-taupe transition-colors p-2" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button type="button" className="secondary-button min-h-10 px-5 py-2" onClick={onGoToDashboard}>
              Dashboard
            </button>
            <button type="button" className="text-sm font-medium text-black hover:text-taupe" onClick={handleLogOut}>
              Log Out
            </button>
          </div>
        ) : (
          <div className="hidden items-center gap-5 md:flex">
            <button type="button" onClick={toggleTheme} className="text-black hover:text-taupe transition-colors p-2" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              type="button"
              className="text-sm font-medium text-black hover:text-taupe"
              onClick={() => handleOpenAuth('login')}
            >
              Login
            </button>
            <button
              type="button"
              className="primary-button min-h-10 px-5 py-2"
              onClick={() => handleOpenAuth('signup')}
            >
              Sign Up
            </button>
          </div>
        )}

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

            {isAuthReady && isAuthenticated ? (
              <div className="grid gap-3">
                <button type="button" className="flex items-center justify-center space-x-2 secondary-button w-full" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <p className="truncate text-sm font-medium text-taupe">{accountLabel}</p>
                <button type="button" className="secondary-button w-full" onClick={() => { onGoToDashboard(); closeMenu(); }}>
                  Dashboard
                </button>
                <button type="button" className="text-sm font-medium text-black hover:text-taupe w-full py-2" onClick={handleLogOut}>
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                <button type="button" className="flex items-center justify-center space-x-2 secondary-button w-full" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button
                  type="button"
                  className="secondary-button w-full"
                  onClick={() => handleOpenAuth('login')}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="primary-button w-full"
                  onClick={() => handleOpenAuth('signup')}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
