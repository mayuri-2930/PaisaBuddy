// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white/50 border-t border-emerald-100 py-4 px-6 text-center text-xs text-gray-400">
      <div className="flex flex-wrap justify-center gap-4">
        <span>© 2025 PAISABUDDY V1.0.2</span>
        <span>•</span>
        <a href="#" className="hover:text-emerald-600">Privacy</a>
        <a href="#" className="hover:text-emerald-600">Terms</a>
        <a href="#" className="hover:text-emerald-600">Support</a>
      </div>
    </footer>
  );
};

export default Footer;