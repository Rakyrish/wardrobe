'use client';
import { useEffect } from 'react';

const TawkWidget = () => {
  useEffect(() => {
    if (document.getElementById('tawk-script')) return;

    const s1 = document.createElement('script');
    s1.id = 'tawk-script';
    s1.src = 'https://embed.tawk.to/683ad526646464190ff82499/default';
    s1.async = true;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    document.body.appendChild(s1);

    return () => {
      document.getElementById('tawk-script')?.remove();
    };
  }, []);

  return null;
};

export default TawkWidget;
