import { useState, useEffect } from 'react';
import API from '../api';

export default function Marquee() {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#D4AF37');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/settings').then(res => {
      if (res.data.marquee_text) setText(res.data.marquee_text);
      if (res.data.marquee_color) setColor(res.data.marquee_color);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !text) return null;

  return (
    <div 
      style={{ backgroundColor: color }} 
      className="w-full text-black overflow-hidden whitespace-nowrap py-2 relative z-50 flex items-center"
    >
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 15s linear infinite;
          }
        `}
      </style>
      <div className="animate-marquee inline-block font-bold uppercase tracking-widest text-[10px] md:text-sm">
        {text} &nbsp; &nbsp; ✦ &nbsp; &nbsp; {text} &nbsp; &nbsp; ✦ &nbsp; &nbsp; {text} &nbsp; &nbsp; ✦ &nbsp; &nbsp; {text}
      </div>
    </div>
  );
}