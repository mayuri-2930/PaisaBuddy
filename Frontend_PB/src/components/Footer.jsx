// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-emerald-100/80 bg-white/45 px-6 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/45 dark:text-slate-400">
      <div className="flex flex-wrap justify-center gap-4">
        <span>© 2025 PAISABUDDY V1.0.2</span>
        <span>•</span>
        <a href="#" className="hover:text-emerald-600 dark:hover:text-teal-300">Privacy</a>
        <a href="#" className="hover:text-emerald-600 dark:hover:text-teal-300">Terms</a>
        <a href="#" className="hover:text-emerald-600 dark:hover:text-teal-300">Support</a>
      </div>
    </footer>
  );
};

export default Footer;
