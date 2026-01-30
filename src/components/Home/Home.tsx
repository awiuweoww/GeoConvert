import React, { useState, useEffect } from 'react';
import { Moon, Sun, MoveRight, BookOpen, Globe, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Convert from '../Convert/Convert';
import Tutorial from '../Tutorial/Tutorial';

/**
 * Komponen Navbar - Bilah navigasi melayang berbentuk kapsul.
 * 
 * @param {Object} props - Properti komponen.
 * @param {boolean} props.isDark - Status mode gelap.
 * @param {Function} props.toggleDark - Fungsi untuk mengubah mode gelap.
 * @param {string} props.lang - Bahasa yang aktif (ID/EN).
 * @param {Function} props.toggleLang - Fungsi untuk mengubah bahasa.
 * @param {string} props.activeTab - Tab yang sedang aktif.
 * @param {Function} props.setActiveTab - Fungsi untuk mengubah tab.
 * @returns {JSX.Element} Elemen Navbar.
 */
const Navbar: React.FC<{
    isDark: boolean;
    toggleDark: () => void;
    lang: 'ID' | 'EN';
    toggleLang: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    navItems: { id: string; label: string }[];
}> = ({ isDark, toggleDark, lang, toggleLang, activeTab, setActiveTab, navItems }) => {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-5xl"
        >
            <div className={`backdrop-blur-xl border transition-colors duration-200 ease-in-out rounded-full py-3 px-8 flex justify-between items-center shadow-2xl ${isDark ? 'bg-[#0a0a0a]/40 border-white/10 shadow-black' : 'bg-white/80 border-gray-100 shadow-gray-200/50'}`}>
                {/* Sisi Kiri: Logo brand */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('Home')}
                    className="flex items-center gap-2 group cursor-pointer"
                >
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                        className={`w-8 h-8 bg-[#E11D48] rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-200 ${isDark ? 'shadow-rose-950/30' : 'shadow-rose-200 group-hover:shadow-rose-300'}`}
                    >
                        <Globe size={18} />
                    </motion.div>
                    <span className={`text-xl font-bold tracking-tight transition-colors duration-200 ease-in-out ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Geo<span className="text-[#E11D48] text-glow-red group-hover:brightness-110 transition-colors duration-200 ease-in-out">Convert</span>
                    </span>
                </motion.div>

                {/* Tengah: Menu Navigasi Utama */}
                <div className="hidden md:flex items-center gap-10">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`text-sm font-bold transition-colors duration-200 relative ${activeTab === item.id ? 'text-[#E11D48]' : (isDark ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-gray-800')}`}
                        >
                            {item.label}
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="nav-underline"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#E11D48]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Sisi Kanan: Bahasa dan Toggle Mode */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={toggleLang}
                        className={`flex items-center gap-2 transition-colors duration-200 group ${isDark ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        <Languages size={18} className="text-zinc-500 group-hover:text-[#E11D48] transition-colors" />
                        <span className="text-sm font-bold tracking-tight">{lang}</span>
                    </button>

                    <button
                        onClick={toggleDark}
                        className={`${isDark ? 'text-white' : 'text-gray-400'} hover:text-[#E11D48] transition-colors duration-200`}
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </div>
        </motion.nav>
    );
};

const translations = {
    ID: {
        nav: {
            home: "Beranda",
            convert: "Konversi",
            tutorial: "Tutorial"
        },
        headline: "Geospatial Intelligence",
        subtitle: "Konversi Koordinat Geografis dengan Mudah.",
        description: "Transformasi mulus antara format Desimal Derajat (DD) dan Derajat Menit Detik (DMS). Ditingkatkan dengan pemetaan presisi untuk aplikasi pertahanan dan industri PT LEN.",
        ctaStart: "Mulai Konversi",
        ctaTutorial: "Tutorial"
    },
    EN: {
        nav: {
            home: "Home",
            convert: "Convert",
            tutorial: "Tutorial"
        },
        headline: "Geospatial Intelligence",
        subtitle: "Convert Geographic Coordinates with Ease.",
        description: "Seamlessly transform between Decimal Degrees (DD) and Degrees Minutes Seconds (DMS) formats. Enhanced with precision mapping for PT LEN's defense and industrial applications.",
        ctaStart: "Start Converting",
        ctaTutorial: "Tutorial"
    }
};

/**
 * Komponen Home - Halaman utama aplikasi GeoConvert.
 * Peta OpenLayers sekarang menjadi latar belakang tetap yang menyatu di seluruh aplikasi.
 */
const Home: React.FC = () => {
    const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
    const [lang, setLang] = useState<'ID' | 'EN'>(() => (localStorage.getItem('lang') as any) || 'ID');
    const [activeTab, setActiveTab] = useState('Home');

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    useEffect(() => { localStorage.setItem('lang', lang); }, [lang]);

    const t = translations[lang];

    // Mapping tab internal ke label yang diterjemahkan
    const navItems = [
        { id: 'Home', label: t.nav.home },
        { id: 'Convert', label: t.nav.convert },
        { id: 'Tutorial', label: t.nav.tutorial }
    ];

    return (
        <div className={`relative min-h-screen w-full flex flex-col transition-colors duration-200 ease-in-out ${isDark ? 'bg-[#0a0a0a] text-zinc-100' : 'bg-white text-gray-900'} selection:bg-rose-100 selection:text-[#E11D48]`}>
            {/* Latar Belakang Peta Interaktif Permanen */}
            <div className="fixed inset-0 z-0">
                <Convert isDark={isDark} hideUI={activeTab !== 'Convert'} lang={lang} />
            </div>

            <Navbar
                isDark={isDark}
                toggleDark={() => setIsDark(!isDark)}
                lang={lang}
                toggleLang={() => setLang(lang === 'ID' ? 'EN' : 'ID')}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                navItems={navItems}
            />

            {/* Overlays Grid Pattern hanya saat di Home agar kontras lebih estetik */}
            <AnimatePresence>
                {activeTab === 'Home' && (
                    <>
                        <motion.div
                            key="blur-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className={`fixed inset-0 pointer-events-none z-[0] ${isDark ? 'bg-black/90' : 'bg-white/60'}`}
                            style={{
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                                maskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 90%)",
                                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 90%)"
                            }}
                        />
                        <motion.div
                            key="grid-pattern"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`fixed inset-0 pointer-events-none z-[1] grid-pattern transition-opacity duration-200 ease-in-out ${isDark ? 'opacity-[0.05]' : 'opacity-[0.08]'}`}
                        />
                    </>
                )}

                {/* Overlay Background Solid Khusus Tutorial (Menutup Peta) */}
                {activeTab === 'Tutorial' && (
                    <motion.div
                        key="tutorial-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`fixed inset-0 pointer-events-none z-[0] ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}
                    />
                )}
            </AnimatePresence>

            {/* Konten Utama Overlay */}
            <AnimatePresence mode="wait">
                {activeTab === 'Home' ? (
                    <motion.main
                        key="home-hero"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="relative flex-1 w-full max-w-6xl mx-auto px-6 lg:px-10 flex flex-col justify-center py-20 z-10 pointer-events-none"
                    >
                        <div className="max-w-xl space-y-8 pointer-events-auto">
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors duration-200 ${isDark ? 'bg-[#0a0a0a]/60 border-white/10' : 'bg-white/60 border-[#E11D48]/20'}`}>
                                <div className="w-1.5 h-1.5 bg-[#E11D48] rounded-full animate-pulse shadow-[0_0_8px_rgba(225,29,72,0.8)]" />
                                <span className="text-[10px] font-bold text-[#E11D48] uppercase tracking-[0.2em]">{t.headline}</span>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.02, x: 15 }} transition={{ duration: 1, delay: 0.2 }} className="space-y-4 cursor-default group">
                                <h1 className={`text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] transition-colors duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Geo<span className="text-[#E11D48] text-glow-red group-hover:brightness-125 transition-colors duration-200">Convert</span>
                                </h1>
                                <p className={`text-2xl md:text-3xl font-medium tracking-tight leading-snug transition-colors duration-200 ${isDark ? 'text-zinc-500 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>
                                    {t.subtitle}
                                </p>
                            </motion.div>

                            <div className={`font-medium leading-relaxed text-sm md:text-base max-w-lg flex flex-wrap transition-colors duration-200 ${isDark ? 'text-zinc-600' : 'text-gray-500'}`}>
                                {t.description.split(" ").map((word, i) => (
                                    <motion.span
                                        key={i}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            color: [
                                                isDark ? "#3f3f46" : "#6B7280",
                                                "#E11D48",
                                                isDark ? "#3f3f46" : "#6B7280",
                                                isDark ? "#3f3f46" : "#6B7280"
                                            ]
                                        }}
                                        transition={{
                                            delay: 0.5 + (i * 0.05),
                                            color: {
                                                duration: 4,
                                                repeat: Infinity,
                                                delay: i * 0.15,
                                                times: [0, 0.1, 0.2, 1],
                                                ease: "easeInOut"
                                            }
                                        }}
                                        className="inline-block mr-[0.35em]"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </div>

                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-wrap items-center gap-4 pt-4">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 1.15 }} onClick={() => setActiveTab('Convert')} className={`relative h-14 px-8 bg-[#E11D48] text-white font-bold rounded-2xl flex items-center gap-2 overflow-hidden transition-colors duration-200 group shadow-xl ${isDark ? 'shadow-black/60' : 'shadow-rose-200/50'}`}>
                                    <span className="relative z-10 flex items-center gap-2">{t.ctaStart} <MoveRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
                                </motion.button>
                                <motion.button onClick={() => setActiveTab('Tutorial')} whileHover={{ scale: 1.05 }} className={`h-14 px-8 border font-bold rounded-2xl flex items-center gap-2 shadow-lg transition-colors duration-200 ${isDark ? 'bg-[#0a0a0a]/40 border-white/10 text-zinc-500 shadow-black/40' : 'bg-white/40 border-gray-100 text-gray-600 shadow-gray-100'}`}>
                                    <BookOpen size={20} className={`${isDark ? 'text-zinc-600' : 'text-gray-400'} group-hover:text-[#E11D48]`} /> {t.ctaTutorial}
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.main>
                ) : activeTab === 'Convert' ? (
                    /* Content saat di Convert ditangani oleh komponen Convert yang ada di background */
                    <motion.div key="convert-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 pointer-events-none" />
                ) : activeTab === 'Tutorial' ? (
                    <motion.div
                        key="tutorial-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 overflow-y-auto"
                    >
                        <Tutorial isDark={isDark} lang={lang} />
                    </motion.div>
                ) : (
                    <div className="flex-1" />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
