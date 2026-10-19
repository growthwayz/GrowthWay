import { useEffect } from 'react';
import './CustomCursor.css';

/**
 * CustomCursor is disabled in favor of standard native operating system mouse pointers.
 */
export default function CustomCursor() {
  useEffect(() => {
    // Ensure any leftover cursor classes are completely removed from body
    document.body.classList.remove('custom-cursor-enabled');
    document.body.classList.remove('cursor-hover');
  }, []);

  return null;
}
