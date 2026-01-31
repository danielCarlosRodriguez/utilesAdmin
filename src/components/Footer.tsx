
import React from 'react';

const Footer = () => {
  const handleShareSite = () => {
    const url = window.location.origin;
    const message = `Mira este sitio: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsApp = () => {
    const url = window.location.origin;
    const message = `Hola! Tengo una consulta. ${url}`;
    window.open(`https://wa.me/59897098751?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1">
            <div className="flex items-center gap-2 text-primary font-extrabold text-xl mb-6">
              <span className="material-symbols-outlined">school</span>
              ÚtilesYa
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Proyecto personal
            </p>
          </div>
          <div>
            {/* <h4 className="font-bold text-slate-900 mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Best Sellers</a></li>
            </ul> */}
          </div>
          <div>
            {/*  <h4 className="font-bold text-slate-900 mb-6">Support</h4>
           <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Return Policy</a></li>
            </ul> */}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Connect</h4>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleShareSite}
                className="w-8 h-8 rounded-full bg-[#f0f2f4] flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                aria-label="Compartir sitio"
              >
                <i className="bi bi-share text-[18px]" />
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-8 h-8 rounded-full bg-[#f0f2f4] flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <i className="bi bi-whatsapp text-[18px]" />
              </button>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 text-center text-xs text-slate-400">
          © 2026 ÚtilesYa Tienda de útiles escolares.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
