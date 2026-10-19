/**
 * WhatsAppFloat — Item 29
 * Fixed bottom-right FAB to quickly contact via WhatsApp.
 * Animates in (pop up), bounces subtly.
 * Configured from site_settings.
 */

import { useState, useEffect } from 'react';
import api from '../../lib/api';
import useReducedMotion from '../../hooks/useReducedMotion';
import './WhatsAppFloat.css';

export default function WhatsAppFloat() {
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.get('/api/site-settings');
        const number = (data?.whatsappNumber || '917607012896').replace(/\D/g, '');
        setWhatsappUrl(`https://wa.me/${number}?text=${encodeURIComponent("Hi Growthway! Let's talk.")}`);
        
        // Delay appearance slightly for a nice entrance
        setTimeout(() => {
          setVisible(true);
        }, 2000);
      } catch {
        setWhatsappUrl(`https://wa.me/917607012896?text=${encodeURIComponent("Hi Growthway! Let's talk.")}`);
        setTimeout(() => {
          setVisible(true);
        }, 2000);
      }
    };
    fetchSettings();
  }, []);

  if (!whatsappUrl || !visible) return null;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`wa-float ${reducedMotion ? 'wa-reduced' : ''}`}
      aria-label="Chat with us on WhatsApp"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        className="wa-icon"
      >
        <path d="M12.01 2.003c-5.522 0-9.998 4.475-9.998 9.997 0 1.968.511 3.844 1.486 5.518l-1.488 5.437 5.565-1.46c1.64.912 3.488 1.393 5.435 1.393 5.523 0 10.001-4.476 10.001-9.998s-4.478-9.997-10.001-9.997l.001.11zm-.001 18.232c-1.637 0-3.238-.426-4.646-1.233l-.333-.191-3.456.907.923-3.37-.21-.334c-.886-1.41-1.352-3.033-1.352-4.717 0-4.887 3.978-8.865 8.866-8.865s8.866 3.977 8.866 8.865-3.978 8.865-8.866 8.865l.008-.327zm4.862-6.657c-.267-.133-1.579-.779-1.823-.868-.244-.089-.422-.133-.6.133-.178.267-.689.868-.844 1.045-.156.178-.311.201-.578.067-.267-.133-1.127-.416-2.146-1.32-.792-.705-1.326-1.575-1.482-1.843-.156-.267-.017-.412.117-.545.12-.12.267-.311.4-.467.133-.156.178-.267.267-.444.089-.178.044-.334-.022-.467-.067-.133-.6-1.445-.822-1.979-.217-.521-.437-.45-.6-.457l-.511-.008c-.178 0-.467.067-.711.334-.244.267-.933.912-.933 2.223s.956 2.579 1.089 2.756c.133.178 1.88 2.868 4.551 4.022.636.273 1.131.436 1.518.558.638.201 1.218.173 1.674.105.513-.076 1.579-.645 1.801-1.267.222-.622.222-1.156.156-1.267-.067-.111-.244-.178-.511-.311z"/>
      </svg>
    </a>
  );
}
