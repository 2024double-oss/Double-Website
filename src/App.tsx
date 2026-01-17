import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, Play, Mail, Twitter } from 'lucide-react';

type Page = 'home' | 'about' | 'experience' | 'contact';

/* =======================
   Cookie Helpers
======================= */
const setCookie = (name: string, value: string, days = 365) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const getCookie = (name: string) => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];
};

interface VideoWork {
  title: string;
  url: string;
  type: 'shortform' | 'longform' | 'highlights';
}

/* =======================
   Data
======================= */
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
    title: "Preview for @/FortniteCompetitive",
    url: "https://youtu.be/4EUAtuRWlPk",
    type: 'highlights'
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
      title: "Southside Roleplay Ad",
      embed: "https://youtube.com/shorts/RQhwNwBKOSM"
    }
  ],
  longform: [
    {
      title: "Valify Video - NOT POSTED YET",
      embed: ""
    },
    {
      title: "Skiourakic Bingo Challenge",
      embed: "https://www.youtube.com/watch?v=oVif9j-DyrQ"
    },
    {
      title: "Επαιξα 1V1 με τον @McpcmStavros...",
      embed: "https://www.youtube.com/watch?v=ceCb8VJQLz8"
    }
  ],
  highlights: [
    {
      title: "FN Preview (Seryx Style)",
      embed: "https://youtu.be/4EUAtuRWlPk"
    },
    {
      title: "FN Preview (Old Zerox Style)",
      embed: "https://www.youtube.com/watch?v=GmuX2Q4SbyU"
    }
  ]
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => getCookie('theme') === 'dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setCookie('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  /* =======================
     Video Embed (Hover Preview)
  ======================= */
  const VideoEmbed = ({ url, title }: { url: string; title: string }) => {
    const [hovered, setHovered] = useState(false);

    if (!url) {
      return (
        <div className="aspect-video rounded-xl flex items-center justify-center bg-gray-800 text-gray-400">
          <Play className="w-10 h-10 opacity-50" />
        </div>
      );
    }

    const videoId = url.includes('youtu.be')
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : url.includes('shorts/')
        ? url.split('shorts/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];

    return (
      <div
        className="aspect-video rounded-xl overflow-hidden shadow-lg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${hovered ? 1 : 0}&mute=1&controls=0&loop=1`}
          title={title}
          allow="autoplay; encrypted-media"
          className="w-full h-full"
        />
      </div>
    );
  };

  /* =======================
     Pages
  ======================= */
  const ExperiencePage = () => (
    <div className="pt-24 pb-16">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-center mb-24 text-white">
          My Work
        </h1>

        {(['shortform', 'longform', 'highlights'] as const).map(section => (
          <div key={section} className="mb-24">
            <h2 className="text-2xl font-bold mb-12 text-white capitalize">
              {section}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {experienceWorks[section].map((work, i) => (
                <div key={i} className="bg-gray-800 rounded-xl overflow-hidden">
                  <VideoEmbed url={work.embed} title={work.title} />
                  <div className="p-6">
                    <h3 className="text-white font-semibold">
                      {work.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );

const renderPage = () => {
  switch (currentPage) {
    case 'home':
      return <HomePage />;
    case 'about':
      return <AboutPage />;
    case 'experience':
      return <ExperiencePage />;
    case 'contact':
      return <ContactPage />;
    default:
      return <HomePage />;
  }
};
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <header className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            onClick={() => setCurrentPage('home')}
            className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent"
          >
            DoubleVisuals
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-gray-800 text-yellow-400"
          >
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
