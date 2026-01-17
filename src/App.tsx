import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sun, Moon, Menu, X, Play, Mail, Twitter } from 'lucide-react';

type Page = 'home' | 'about' | 'experience' | 'contact';

interface VideoWork {
  title: string;
  url: string;
  type: 'shortform' | 'longform' | 'highlight';
}

const works: VideoWork[] = [
  {
    title: "iiisAndmaniii Short Form Reel",
    url: "https://www.youtube.com/shorts/s97VTmWW8uU",
    type: 'shortform'
  },
  {
    title: "Skiourakic Bingo Challenge",
    url: "https://www.youtube.com/watch?v=oVif9j-DyrQ",
    type: 'longform'
  },
  {
    title: "Preview for @/FortniteCompetitive (Seryx Style Practice)",
    url: "https://youtu.be/watch?v=4EUAtuRWlPk",
    type: 'highlight'
  }
];

const experienceWorks = {
  shortform: [
    {
      title: "ThriveEsports - Loadout Video",
      embed: "https://www.youtube.com/shorts/hXNxZlzDl7c"
    },
    {
      title: "iiisAndmaniii Short Form Reel",
      embed: "https://www.youtube.com/shorts/s97VTmWW8uU"
    },
    {
      title: "Southside Roleplay - Minecraft RP Ad",
      embed: "https://youtube.com/shorts/RQhwNwBKOSM"
    }
  ],
  longform: [
    {
      title: "Valify Video - NOT POSTED",
      embed: ""
    },
    {
      title: "Skiourakic Bingo Challenge",
      embed: "https://www.youtube.com/watch?v=oVif9j-DyrQ"
    },
    {
      title: "1v1 με McpcmStavros",
      embed: "https://www.youtube.com/watch?v=ceCb8VJQLz8"
    }
  ],
  highlights: [
    {
      title: "Fortnite Competitive Preview (Seryx)",
      embed: "https://youtu.be/4EUAtuRWlPk"
    },
    {
      title: "Fortnite Competitive Preview (Old Zerox)",
      embed: "https://www.youtube.com/watch?v=GmuX2Q4SbyU"
    },
    {
      title: "Scoutfnr / FruityINC Preview",
      embed: "https://x.com/VisualsByDouble/status/1912659231485964470"
    }
  ]
};

/* =========================
   COOKIE BANNER (FINAL)
========================= */
const CookieBanner = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);

  const DELAY = 900;

  useEffect(() => {
    const accepted =
      localStorage.getItem('cookiesAccepted') === 'true' ||
      document.cookie.includes('dv_cookies=true');

    if (accepted) return;

    const t = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => setEntered(true));
    }, DELAY);

    return () => clearTimeout(t);
  }, []);

  const accept = () => {
    setClosing(true);
    setEntered(false);

    setTimeout(() => {
      localStorage.setItem('cookiesAccepted', 'true');
      document.cookie = 'dv_cookies=true; max-age=31536000; path=/; SameSite=Lax';
      setVisible(false);
    }, 260);
  };

  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="fixed bottom-6 right-6 pointer-events-auto w-[360px] max-w-[calc(100vw-3rem)]">
        <div
          className={`p-4 rounded-xl border shadow-xl backdrop-blur-md
          transition-all duration-300 ease-out
          ${isDarkMode
            ? 'bg-gray-800/95 text-gray-200 border-gray-700'
            : 'bg-white/95 text-gray-800 border-gray-200'}
          ${closing
            ? 'opacity-0 scale-95 translate-y-3'
            : entered
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 translate-y-2'}
        `}
        >
          <p className="text-sm mb-3">
            This website uses cookies to improve your experience.
          </p>
          <button
            onClick={accept}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const VideoEmbed = ({ url }: { url: string }) => {
    if (!url)
      return (
        <div className="aspect-video rounded-xl bg-gray-700 flex items-center justify-center text-white/50">
          Coming Soon
        </div>
      );

    if (url.includes('youtube') || url.includes('youtu.be')) {
      const id =
        url.includes('youtu.be')
          ? url.split('youtu.be/')[1]
          : url.split('v=')[1]?.split('&')[0];

      return (
        <iframe
          className="aspect-video w-full rounded-xl"
          src={`https://www.youtube.com/embed/${id}`}
          allowFullScreen
        />
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        className="aspect-video rounded-xl bg-black flex items-center justify-center text-blue-400"
      >
        View on X
      </a>
    );
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} min-h-screen`}>
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-black/40 text-white">
        <div className="max-w-7xl mx-auto p-4 flex justify-between">
          <span className="font-bold cursor-pointer" onClick={() => setCurrentPage('home')}>
            DoubleVisuals
          </span>
          <div className="flex gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun /> : <Moon />}
            </button>
            {['home', 'about', 'experience', 'contact'].map(p => (
              <button key={p} onClick={() => setCurrentPage(p as Page)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="pt-24 max-w-7xl mx-auto px-6">
        {currentPage === 'home' && (
          <div className="grid md:grid-cols-3 gap-6">
            {works.map(w => (
              <div key={w.title}>
                <VideoEmbed url={w.url} />
                <h3 className="mt-2 text-white">{w.title}</h3>
              </div>
            ))}
          </div>
        )}

        {currentPage === 'experience' && (
          <>
            <h2 className="text-white text-xl mb-4">Shortform</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {experienceWorks.shortform.map(w => (
                <VideoEmbed key={w.title} url={w.embed} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* COOKIE POPUP */}
      <CookieBanner isDarkMode={isDarkMode} />
    </div>
  );
}

export default App;
