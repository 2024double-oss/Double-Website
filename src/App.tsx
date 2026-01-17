import React, { useState, useEffect, useRef } from 'react';
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
    type: 'shortform',
  },
  {
    title: "Skiourakic Bingo Challenge",
    url: "https://www.youtube.com/watch?v=oVif9j-DyrQ",
    type: 'longform',
  },
  {
    title: "Preview for @/FortniteCompetitive (Seryx Style Practice)",
    url: "https://youtu.be/watch?v=4EUAtuRWlPk",
    type: 'highlight',
  },
];

const experienceWorks = {
  shortform: [
    {
      title: "ThriveEsports - Loadout Video",
      url: "https://www.youtube.com/shorts/hXNxZlzDl7c",
      embed: "https://www.youtube.com/shorts/hXNxZlzDl7c",
    },
    {
      title: "iiisAndmaniii Short Form Reel",
      url: "https://www.youtube.com/shorts/s97VTmWW8uU",
      embed: "https://www.youtube.com/shorts/s97VTmWW8uU",
    },
    {
      title: "Southside Roleplay - Minecraft Roleplay Advertisement",
      url: "https://youtube.com/shorts/RQhwNwBKOSM?si=M3wUb75I2WY77OuA",
      embed: "https://youtube.com/shorts/RQhwNwBKOSM?si=M3wUb75I2WY77OuA",
    },
  ],

  longform: [
    {
      title: "Valify Video - NOT POSTED YET",
      url: "https://www.youtube.com/",
      embed: "https://www.youtube.com/",
    },
    {
      title: "Skiourakic Bingo Challenge",
      url: "https://www.youtube.com/watch?v=oVif9j-DyrQ",
      embed: "https://www.youtube.com/watch?v=oVif9j-DyrQ",
    },
    {
      title: "Επαιξα 1V1 με τον @McpcmStavros...",
      url: "https://www.youtube.com/watch?v=ceCb8VJQLz8",
      embed: "https://www.youtube.com/watch?v=ceCb8VJQLz8",
    },
  ],

  highlights: [
    {
      title: "Preview for @/FortniteCompetitive (Seryx Style Practice)",
      url: "https://youtu.be/watch?v=4EUAtuRWlPk",
      embed: "https://youtu.be/watch?v=4EUAtuRWlPk",
    },
    {
      title: "Preview for @/FortniteCompetitive (Old-Zerox Style Practice)",
      url: "https://www.youtube.com/watch?v=GmuX2Q4SbyU",
      embed: "https://www.youtube.com/watch?v=GmuX2Q4SbyU",
    },
    {
      title: "Preview for @scoutfnr / @FruityINC (Seryx Style)",
      url: "https://x.com/VisualsByDouble/status/1912659231485964470",
      embed: "https://x.com/VisualsByDouble/status/1912659231485964470",
    },
  ],
};

/* =========================
   UI SOUND (hover/click/tab/popup)
   - Audio unlock after first user interaction (browser policy)
========================= */
function useUISound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const unlockedRef = useRef(false);

  useEffect(() => {
    const unlock = () => {
      unlockedRef.current = true;
      try {
        const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
        if (AudioCtx && !ctxRef.current) ctxRef.current = new AudioCtx();
      } catch {}
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const play = (freq: number, durMs: number, peak = 0.1) => {
    try {
      if (!unlockedRef.current) return;
      const ctx = ctxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const t0 = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t0);
      osc.stop(t0 + durMs / 1000 + 0.02);
    } catch {}
  };

  return {
    hover: () => play(880, 60, 0.05),
    click: () => play(660, 140, 0.11),
    tab: () => play(740, 90, 0.08),
    pop: () => play(600, 140, 0.11),
  };
}

/* =========================
   COOKIE BANNER
   - Overlay bottom-right
   - No delay
   - Sound on show
   - Works in StrictMode (no double popup)
   - Color ALWAYS updates on dark mode toggle (inline styles)
========================= */
const CookieBanner = ({
  isDarkMode,
  onPop,
}: {
  isDarkMode: boolean;
  onPop: () => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);

  const startedRef = useRef(false);
  const LS_KEY = 'dv_cookies_accepted';
  const ANIM_MS = 260;

  useEffect(() => {
  try {
    localStorage.setItem('dv_dark_mode', String(isDarkMode));
  } catch {}
}, [isDarkMode]);

  const hasAccepted = () => {
    try {
      if (localStorage.getItem(LS_KEY) === 'true') return true;
    } catch {}
    if (typeof document !== 'undefined') {
      return document.cookie.split('; ').some((c) => c.startsWith(`${LS_KEY}=true`));
    }
    return false;
  };

  const saveAccepted = () => {
    try {
      localStorage.setItem(LS_KEY, 'true');
    } catch {}
    if (typeof document !== 'undefined') {
      document.cookie = `${LS_KEY}=true; max-age=31536000; path=/; SameSite=Lax`;
    }
  };

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (hasAccepted()) return;

    setVisible(true);
    requestAnimationFrame(() => setEntered(true));
    onPop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accept = () => {
    setClosing(true);
    setEntered(false);

    window.setTimeout(() => {
      saveAccepted();
      setVisible(false);
    }, ANIM_MS);
  };

  if (!visible) return null;

  const animClass = closing
    ? 'opacity-0 translate-y-3 scale-95'
    : entered
      ? 'opacity-100 translate-y-0 scale-100'
      : 'opacity-0 translate-y-2 scale-95';

  const panelStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    color: isDarkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)',
    borderColor: isDarkMode ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)',
    transition: 'background-color 200ms ease, color 200ms ease, border-color 200ms ease',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundImage: 'linear-gradient(90deg, #3b82f6, #14b8a6)',
    color: 'white',
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="pointer-events-auto fixed right-6 bottom-6 w-[calc(100%-3rem)] sm:w-[380px]">
        <div
          className={`p-4 rounded-xl shadow-xl backdrop-blur-md border transition-all duration-300 ease-out ${animClass}`}
          style={panelStyle}
        >
          <p className="text-sm mb-3">This website uses cookies to improve your experience.</p>

          <button
            onClick={accept}
            className="w-full py-2 rounded-lg font-medium hover:opacity-90 transition"
            style={buttonStyle}
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
  try {
    const saved = localStorage.getItem('dv_dark_mode');
    if (saved === 'true') return true;
    if (saved === 'false') return false;
  } catch {}
  return false;
});

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const uiSound = useUISound();

  useEffect(() => {
    const timer = setTimeout(() => setHasLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => setIsDarkMode((v) => !v);

  const navigation = [
    { id: 'home' as Page, label: 'Home' },
    { id: 'about' as Page, label: 'About Me' },
    { id: 'experience' as Page, label: 'Experience' },
    { id: 'contact' as Page, label: 'Hire Me' },
  ];

  const Header = () => (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDarkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
      } backdrop-blur-md border-b`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div
            onClick={() => {
              uiSound.tab();
              setCurrentPage('home');
            }}
            className="cursor-pointer text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            DoubleVisuals
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const isHire = item.id === 'contact';
              return (
                <button
                  key={item.id}
                  onMouseEnter={() => {
                    if (isHire) uiSound.hover();
                  }}
                  onClick={() => {
                    uiSound.tab();
                    if (isHire) uiSound.click();
                    setCurrentPage(item.id);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === item.id
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                uiSound.click();
                toggleTheme();
              }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => {
                uiSound.click();
                setIsMenuOpen((v) => !v);
              }}
              className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
                isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="pt-4 space-y-2">
              {navigation.map((item) => {
                const isHire = item.id === 'contact';
                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => {
                      if (isHire) uiSound.hover();
                    }}
                    onClick={() => {
                      uiSound.tab();
                      if (isHire) uiSound.click();
                      setCurrentPage(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === item.id
                        ? isDarkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : isDarkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );

  const Footer = () => (
    <footer
      className={`border-t transition-all duration-300 ${
        isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent mb-4">
              DoubleVisuals
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Professional video editing and visual effects services
            </p>
          </div>

          <div>
            <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Navigation</h3>
            <div className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    uiSound.tab();
                    setCurrentPage(item.id);
                  }}
                  className={`block text-sm transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/VisualsByDouble"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode ? 'bg-gray-800 text-blue-400 hover:bg-gray-700' : 'bg-gray-100 text-blue-500 hover:bg-gray-200'
                }`}
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:doublemanagementgr@gmail.com"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode ? 'bg-gray-800 text-teal-400 hover:bg-gray-700' : 'bg-gray-100 text-teal-500 hover:bg-gray-200'
                }`}
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div
          className={`mt-8 pt-8 border-t text-center text-sm ${
            isDarkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-500'
          }`}
        >
          Copyright Double© All rights reserved.
        </div>
      </div>
    </footer>
  );

  const VideoEmbed = ({
    url,
    title,
    className = '',
  }: {
    url: string;
    title: string;
    className?: string;
  }) => {
    if (!url) {
      return (
        <div
          className={`aspect-video rounded-xl border-2 border-dashed flex items-center justify-center ${
            isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-300 bg-gray-100 text-gray-500'
          } ${className}`}
        >
          <div className="text-center">
            <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Coming Soon</p>
          </div>
        </div>
      );
    }

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.includes('youtube.com/shorts/')
          ? url.split('shorts/')[1]?.split('?')[0]
          : url.split('v=')[1]?.split('&')[0];

      return (
        <div className={`aspect-video rounded-xl overflow-hidden shadow-lg ${className}`}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      );
    }

    if (url.includes('x.com') || url.includes('twitter.com')) {
      return (
        <div className={`aspect-video rounded-xl overflow-hidden shadow-lg bg-black flex items-center justify-center ${className}`}>
          <div className="text-center text-white">
            <Play className="w-12 h-12 mx-auto mb-2" />
            <p className="font-medium mb-2">{title}</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              View on X
            </a>
          </div>
        </div>
      );
    }

    return null;
  };

  const HomePage = () => (
    <div className="pt-24 pb-16">
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Turn your ideas into{' '}
          <span className="bg-gradient-to-r from-blue-500 via-teal-500 to-orange-500 bg-clip-text text-transparent">
            life
          </span>
        </h1>
        <p className={`text-xl md:text-2xl mb-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          with DoubleVisuals
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {works.map((work, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}
            >
              <VideoEmbed url={work.url} title={work.title} />
              <div className="p-4">
                <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{work.title}</h3>
                <p className={`text-sm capitalize ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {work.type.replace('form', ' Form')}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={`max-w-3xl mx-auto mb-12 p-8 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Meet Double, a passionate teen editor with years of experience crafting stunning visuals.
            Specializing in affordable, high-quality video editing services, Double is available for
            both short-term quick projects and long-term collaborations. Every project is handled
            with dedication and creativity to bring your vision to life.
          </p>
        </div>

        <button
          onMouseEnter={() => uiSound.hover()}
          onClick={() => {
            uiSound.click();
            uiSound.tab();
            setCurrentPage('contact');
          }}
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          Hire Me
        </button>
      </section>
    </div>
  );

  const AboutPage = () => (
    <div className="pt-24 pb-16">
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h1 className={`text-4xl md:text-5xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          About Me
        </h1>

        <div
          className={`prose prose-lg max-w-none p-8 rounded-2xl ${
            isDarkMode
              ? 'bg-gray-800 text-gray-300 prose-headings:text-white prose-strong:text-white'
              : 'bg-gray-50 text-gray-700 prose-headings:text-gray-900'
          }`}
        >
          <p className="text-xl leading-relaxed mb-6">
            Hi, I'm Double, a passionate teenage video editor who lives and breathes visual storytelling.
            What started as a hobby quickly evolved into a genuine expertise in transforming raw footage
            into compelling narratives that captivate audiences.
          </p>

          <p className="text-lg leading-relaxed mb-6">
            My journey in video editing began years ago, and since then, I've honed my skills across
            multiple formats, from punchy shortform content that grabs attention in seconds, to
            cinematic longform pieces that tell complete stories, to high-energy gaming highlights
            that showcase the best moments.
          </p>

          <p className="text-lg leading-relaxed mb-6">
            What sets me apart is my commitment to making professional-quality editing accessible.
            I believe that great visual content shouldn't break the bank, which is why I offer
            competitive rates without compromising on quality. Whether you need a quick turnaround
            for a single project or want to establish a long-term creative partnership, I'm here
            to help bring your vision to life.
          </p>

          <p className="text-lg leading-relaxed">
            Every project I take on receives the same level of dedication and creative attention.
            I don't just edit videos, I craft experiences that resonate with your audience and
            elevate your content above the noise. Let's work together to turn your ideas into
            stunning visual reality.
          </p>
        </div>
      </section>
    </div>
  );

  const ExperiencePage = () => (
    <div className="pt-24 pb-16">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h1 className={`text-4xl md:text-5xl font-bold mb-16 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          My Work
        </h1>

        <div className="mb-16">
          <h2 className={`text-2xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Shortform Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experienceWorks.shortform.map((work, index) => (
              <div key={index} className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <VideoEmbed url={work.embed} title={work.title} />
                <div className="p-4">
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{work.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className={`text-2xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Longform Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experienceWorks.longform.map((work, index) => (
              <div key={index} className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <VideoEmbed url={work.embed} title={work.title} />
                <div className="p-4">
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{work.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className={`text-2xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>FN Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experienceWorks.highlights.map((work, index) => (
              <div key={index} className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <VideoEmbed url={work.embed} title={work.title} />
                <div className="p-4">
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{work.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const ContactPage = () => (
    <div className="pt-24 pb-16">
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className={`text-4xl md:text-5xl font-bold mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Contact Me
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div
            className={`p-8 rounded-2xl bg-gradient-to-br transition-all duration-300 hover:scale-105 ${
              isDarkMode ? 'from-blue-900 to-gray-900 border border-blue-800' : 'from-blue-50 to-white border border-blue-200'
            }`}
          >
            <Twitter className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Twitter</h3>
            <a
              href="https://twitter.com/VisualsByDouble"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-lg font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              @VisualsByDouble
            </a>
          </div>

          <div
            className={`p-8 rounded-2xl bg-gradient-to-br transition-all duration-300 hover:scale-105 ${
              isDarkMode ? 'from-teal-900 to-gray-900 border border-teal-800' : 'from-teal-50 to-white border border-teal-200'
            }`}
          >
            <Mail className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-teal-400' : 'text-teal-500'}`} />
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Email</h3>
            <a
              href="mailto:doublemanagementgr@gmail.com"
              className={`text-lg font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'
              }`}
            >
              doublemanagementgr@gmail.com
            </a>
          </div>
        </div>

        <p className={`text-lg italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          "Turning dreams into reality..."
        </p>
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
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      } ${hasLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <Header />
      <main className="transition-all duration-300">{renderPage()}</main>

      {/* Cookie popup overlay */}
      <CookieBanner isDarkMode={isDarkMode} onPop={uiSound.pop} />

      <Footer />
    </div>
  );
}

export default App;
