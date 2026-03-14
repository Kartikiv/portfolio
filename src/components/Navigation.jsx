import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

const NAV_LINKS = [
  { href: '#about',      label: 'ABOUT' },
  { href: '#experience', label: 'EXPERIENCE' },
  { href: '#projects',   label: 'PROJECTS' },
  { href: '#contact',    label: 'CONTACT' },
];

const Navigation = () => {
  const [open, setOpen] = useState(false);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <motion.nav
        className="nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="logo">{'<Kartik Ivaturi />'}</div>

        {/* Desktop links */}
        <ul className="nav-links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}><a href={href} className="nav-link">{label}</a></li>
          ))}
        </ul>

        {/* Hamburger button — mobile only */}
        <button
          className={`nav-hamburger${open ? ' nav-hamburger--open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="nav-mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              className="nav-mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
            >
              <ul className="nav-mobile-links">
                {NAV_LINKS.map(({ href, label }, i) => (
                  <motion.li
                    key={href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <a href={href} className="nav-mobile-link" onClick={close}>{label}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
