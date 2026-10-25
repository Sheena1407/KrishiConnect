import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Heart, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer style={{ backgroundColor: '#0B2219', color: '#B5C4BA' }} className="pt-5 pb-4 mt-auto border-top border-success border-opacity-10">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="p-1 rounded bg-success bg-opacity-25 text-warning">
                <Sprout size={24} />
              </span>
              <span className="brand-font fs-4 text-white">Krishi<span style={{ color: '#E9C46A' }}>Connect</span></span>
            </div>
            <p className="small text-light text-opacity-75 mb-3" style={{ maxWidth: '320px', lineHeight: 1.6 }}>
              {t('tagline')} Empowering Indian farmers with data-driven agronomy, soil diagnostics, real-time market prices, and expert advisory.
            </p>
            <div className="d-flex align-items-center gap-2 small text-warning">
              <ShieldCheck size={16} />
              <span>Certified AgriTech Prototype &middot; ICAR & KVK Benchmarked</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-semibold mb-3">Platform</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/crops" className="text-decoration-none text-light text-opacity-75 hover-white">My Crops</Link></li>
              <li><Link to="/crop-advisor" className="text-decoration-none text-light text-opacity-75 hover-white">Crop Advisor</Link></li>
              <li><Link to="/soil-health" className="text-decoration-none text-light text-opacity-75 hover-white">Soil Health</Link></li>
              <li><Link to="/mandi-prices" className="text-decoration-none text-light text-opacity-75 hover-white">Mandi Prices</Link></li>
              <li><Link to="/weather" className="text-decoration-none text-light text-opacity-75 hover-white">Weather Intelligence</Link></li>
            </ul>
          </div>

          {/* Farmer Solutions */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-semibold mb-3">Farmer Care</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/crop-doctor" className="text-decoration-none text-light text-opacity-75 hover-white">Crop Doctor</Link></li>
              <li><Link to="/pest-alerts" className="text-decoration-none text-light text-opacity-75 hover-white">Pest Alerts</Link></li>
              <li><Link to="/experts" className="text-decoration-none text-light text-opacity-75 hover-white">Ask an Expert</Link></li>
              <li><Link to="/market" className="text-decoration-none text-light text-opacity-75 hover-white">Krishi Market</Link></li>
              <li><Link to="/assistant" className="text-decoration-none text-light text-opacity-75 hover-white">AI Assistant</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="col-lg-4 col-md-6">
            <h6 className="text-white fw-semibold mb-3">Kisan Helpline & Office</h6>
            <p className="small text-light text-opacity-75 mb-2 d-flex align-items-center gap-2">
              <Phone size={16} className="text-warning" />
              Toll-Free Kisan Call: 1800-180-1551
            </p>
            <p className="small text-light text-opacity-75 mb-2 d-flex align-items-center gap-2">
              <Mail size={16} className="text-warning" />
              support@krishiconnect.demo
            </p>
            <p className="small text-light text-opacity-75 mb-3 d-flex align-items-center gap-2">
              <MapPin size={16} className="text-warning" />
              Krishi Vigyan Bhavan, Bhopal, MP - 462001
            </p>
            <div className="p-2 rounded bg-success bg-opacity-10 border border-success border-opacity-25 small text-light text-opacity-75">
              💡 <strong>Demo Note:</strong> Built for college viva, presentation and hackathon showcase.
            </div>
          </div>
        </div>

        <hr className="border-secondary opacity-25 my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-light text-opacity-50">
          <div>
            &copy; {new Date().getFullYear()} KrishiConnect AgriTech. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-1">
            Developed with <Heart size={14} className="text-danger mx-1" fill="#E63946" /> for Indian Farmers
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
