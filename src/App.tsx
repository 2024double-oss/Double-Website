import React, { useState, useEffect } from 'react';
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
    }
  ],
  longform: [
    {
      title: "Skiourakic Bingo Challenge",
      embed: "https://www.youtube.com/watch?v=oVif9j-DyrQ"
    }
  ],
  highlights: [
    {
      title: "Preview for @/FortniteCompetitive",
      embed: "https://youtu.be/4EUAtuRWlPk"
    }
  ]
};

/* ================= COOKIE BANNER ================= */

const CookieBanner = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookiesAccepted');
    if (!accepted) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[9999]
      p-4 rounded-xl shadow-lg ${
        isDarkMode
          ? 'bg-gray-800 text-gray-200 border border-gray-700'
          : 'bg-white text-gray-800 border border-gray-200'
      }`}
    >
      <p className="text-sm mb-3">
        This website uses cookies to improve your experience.
      </p>
      <button
        onClick={acceptCookies}
        className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
      >
        Accept
      </button>
    </div>
  );
};

/* ================= APP ================= */

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const Header = () => (
    <header className={`fixed top-0 left-0 right-0 z-50 ${
      isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
    } border-b`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div
          onClick={() => setCurrentPage('home')}
          className="cursor-pointer text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent"
        >
          DoubleVisuals
        </div>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg ${
            isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {isDarkMode ? <Sun /> : <Moon />}
        </button>
      </div>
    </header>
  );

  const VideoEmbed = ({ url, title }: { url: string; title: string }) => {
    const videoId = url.includes('youtu.be')
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0];

    return (
      <div className="aspect-video rounded-xl overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          className="w-full h-full"
          allowFullScreen
        />
      </div>
    );
  };

  const HomePage = () => (
    <div className="pt-24 max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
      {works.map((work, i) => (
        <div
          key={i}
          className={`rounded-xl p-4 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
          }`}
        >
          <VideoEmbed url={work.url} title={work.title} />
          <h3 className="mt-2 font-semibold">{work.title}</h3>
          <p className="text-sm opacity-70 capitalize">{work.type}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen`}>
      <Header />

      <main>
        <HomePage />
      </main>

      {/* COOKIE POPUP */}
      <CookieBanner isDarkMode={isDarkMode} />

      <footer className="text-center py-6 text-sm opacity-60">
        © DoubleVisuals
      </footer>
    </div>
  );
}

export default App;
