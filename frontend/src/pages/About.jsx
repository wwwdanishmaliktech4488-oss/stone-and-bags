import { useState, useEffect } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  const [page, setPage] = useState({ title: '', content: '' });

  useEffect(() => {
    API.get('/pages/about').then(res => setPage(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <div className="flex-grow max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-serif text-[#D4AF37] tracking-widest mb-8">{page.title}</h1>
        <p className="text-gray-400 font-light text-base md:text-lg leading-relaxed whitespace-pre-wrap">{page.content}</p>
      </div>
      <Footer />
    </div>
  );
}