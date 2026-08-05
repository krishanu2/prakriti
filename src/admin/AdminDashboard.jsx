import { useState } from 'react';
import { api } from './api.js';
import LeadsTab from './LeadsTab.jsx';
import GalleryTab from './GalleryTab.jsx';
import TestimonialsTab from './TestimonialsTab.jsx';
import FaqsTab from './FaqsTab.jsx';

const TABS = [
  { key: 'leads', label: 'Enquiries', hint: 'People who filled the form' },
  { key: 'gallery', label: 'Gallery', hint: 'Photos on the site' },
  { key: 'testimonials', label: 'Testimonials', hint: 'Client reviews' },
  { key: 'faqs', label: 'FAQs', hint: 'Questions & answers' },
];

export default function AdminDashboard({ username, onLoggedOut }) {
  const [tab, setTab] = useState('leads');
  const [navOpen, setNavOpen] = useState(false);

  async function handleLogout() {
    try {
      await api.logout();
    } catch {
      // ignore — clear client state regardless
    }
    onLoggedOut();
  }

  const activeTab = TABS.find((t) => t.key === tab);

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-black/[0.1] bg-white sticky top-0 z-20">
        <p className="font-archivo font-extrabold text-sm text-ink">STAYSTRONGSTAYWILD</p>
        <button onClick={() => setNavOpen(!navOpen)} className="text-xl leading-none">☰</button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-black/[0.1] w-full md:w-[240px] shrink-0 md:min-h-screen ${
          navOpen ? 'block' : 'hidden'
        } md:block`}
      >
        <div className="hidden md:block px-6 py-7 border-b border-black/[0.08]">
          <p className="font-archivo font-extrabold text-sm text-ink tracking-wide">STAYSTRONGSTAYWILD</p>
          <p className="text-caption text-black/40 mt-1">Admin Panel</p>
        </div>

        <nav className="px-3 py-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setNavOpen(false);
              }}
              className="w-full text-left px-3.5 py-3 rounded-md mb-1 transition-colors"
              style={{
                background: tab === t.key ? 'var(--blush)' : 'transparent',
              }}
            >
              <span className="block font-inter font-semibold text-[14px] text-ink">{t.label}</span>
              <span className="block text-[11.5px] text-black/45 mt-0.5">{t.hint}</span>
            </button>
          ))}
        </nav>

        <div className="px-6 py-4 mt-2 border-t border-black/[0.08] md:absolute md:bottom-0 md:w-[240px]">
          <p className="text-[12px] text-black/45 mb-2">Logged in as <span className="text-ink font-medium">{username}</span></p>
          <button onClick={handleLogout} className="text-caption underline decoration-1 underline-offset-2 text-black/60">
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-5 md:px-10 py-8 md:py-10 max-w-[1100px]">
        <div className="mb-7">
          <h1 className="text-h2 text-ink">{activeTab.label}</h1>
        </div>

        {tab === 'leads' && <LeadsTab />}
        {tab === 'gallery' && <GalleryTab />}
        {tab === 'testimonials' && <TestimonialsTab />}
        {tab === 'faqs' && <FaqsTab />}
      </main>
    </div>
  );
}
