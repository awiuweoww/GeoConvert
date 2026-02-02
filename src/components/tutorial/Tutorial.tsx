import React from 'react';
import { motion } from 'framer-motion';
import { Type, RefreshCw, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface StepProps {
    index: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    isDark: boolean;
    side: 'left' | 'right';
    illustration: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ index, title, description, icon, isDark, side, illustration }) => {
    const isLeft = side === 'left';

    return (
        <div className={`relative flex items-center justify-between mb-32 last:mb-0 w-full`}>
            {/* Center Line Marker */}
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center h-full">
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className={`w-12 h-12 rounded-full border-4 flex items-center justify-center z-10 shadow-xl transition-colors duration-300 ${isDark ? 'bg-[#0a0a0a] border-zinc-900 text-[#E11D48] shadow-black' : 'bg-white border-gray-100 text-[#E11D48] shadow-rose-100'}`}
                >
                    {icon}
                </motion.div>
            </div>

            {/* Content Side */}
            <motion.div
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ x: isLeft ? 15 : -15 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`w-[42%] ${isLeft ? 'text-right' : 'order-last text-left'} space-y-4 cursor-default`}
            >
                <div>
                    <span className="inline-block px-3 py-1 rounded-md bg-[#E11D48]/10 text-[#E11D48] text-[10px] font-black uppercase tracking-widest mb-2">
                        Step 0{index}
                    </span>
                    <h3 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        {title}
                    </h3>
                </div>
                <p className={`text-sm md:text-base font-medium leading-relaxed ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                    {description}
                </p>
            </motion.div>

            {/* Illustration Side */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, x: isLeft ? 50 : -50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`w-[42%] flex justify-center ${isLeft ? '' : 'order-first'}`}
            >
                <motion.div
                    whileHover={{ scale: 1.05, rotate: isLeft ? 2 : -2, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className={`relative p-6 rounded-3xl border shadow-2xl cursor-pointer ${isDark ? 'bg-zinc-900/30 border-white/5 shadow-black' : 'bg-white border-gray-200 shadow-2xl shadow-gray-300/70'}`}
                >
                    {illustration}
                </motion.div>
            </motion.div>
        </div>
    );
};

const translations = {
    ID: {
        title: "Quick",
        titleAccent: "Guide",
        description: "Pelajari cara menggunakan GeoConvert untuk mentransformasi koordinat geografis Anda dalam tiga langkah sederhana.",
        steps: [
            {
                title: "Input Koordinat",
                desc: "Masukkan koordinat Anda dalam format DMS atau Decimal Degrees. Sistem kami akan mengenali tipe data secara otomatis untuk menghemat waktu Anda."
            },
            {
                title: "Konversi Instan",
                desc: "Lihat hasil transformasi secara real-time pada panel 'Result'. Format akan berubah otomatis dari DMS ke DD (atau sebaliknya) saat Anda mengetik."
            },
            {
                title: "Simpan & Lihat Peta",
                desc: "Tekan tombol 'Add to Map' dan konfirmasi. Titik akan tersimpan di riwayat lokal dan ditampilkan secara visual pada peta interaktif GeoConvert."
            }
        ],
        footer: "Anda siap menjelajahi dunia dengan presisi."
    },
    EN: {
        title: "Quick",
        titleAccent: "Guide",
        description: "Learn how to use GeoConvert to transform your geographic coordinates in three simple steps.",
        steps: [
            {
                title: "Input Coordinates",
                desc: "Enter your coordinates in DMS or Decimal Degrees format. Our system automatically recognizes the data type to save you time."
            },
            {
                title: "Instant Conversion",
                desc: "View transformation results in real-time on the 'Result' panel. The format changes automatically from DMS to DD (or vice versa) as you type."
            },
            {
                title: "Save & Add to Map",
                desc: "Press the 'Add to Map' button and confirm. Points will be saved in local history and visually displayed on the interactive GeoConvert map."
            }
        ],
        footer: "You're ready to explore the world with precision."
    }
};

const Tutorial: React.FC<{ isDark: boolean; lang: 'ID' | 'EN' }> = ({ isDark, lang }) => {
    const t = translations[lang];

    return (
        <div className="relative w-full max-w-6xl mx-auto px-6 py-32 z-10">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-[#E11D48]/20 to-transparent pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-24 cursor-default"
            >
                <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t.title} <span className="text-[#E11D48]">{t.titleAccent}</span>
                </h2>
                <p className={`text-lg font-medium max-w-2xl mx-auto ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                    {t.description}
                </p>
            </motion.div>

            <div className="space-y-10">
                <Step
                    index={1}
                    side="left"
                    isDark={isDark}
                    icon={<Type size={20} />}
                    title={t.steps[0].title}
                    description={t.steps[0].desc}
                    illustration={
                        <div className="w-56 space-y-3">
                            <div className="h-2 w-20 bg-[#E11D48]/20 rounded-full" />
                            <div className="h-8 w-full border border-current opacity-20 rounded-full" />
                            <div className="h-8 w-full border border-[#E11D48]/40 rounded-full bg-[#E11D48]/5 flex items-center px-4">
                                <span className="text-[10px] font-bold text-[#E11D48]">-6.2088</span>
                            </div>
                        </div>
                    }
                />

                <Step
                    index={2}
                    side="right"
                    isDark={isDark}
                    icon={<RefreshCw size={20} />}
                    title={t.steps[1].title}
                    description={t.steps[1].desc}
                    illustration={
                        <div className="w-56 flex items-center justify-between">
                            <div className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-100'} text-[10px] font-bold`}>DMS</div>
                            <ArrowRight size={16} className="text-[#E11D48]" />
                            <div className="p-3 rounded-xl bg-[#E11D48] text-white text-[10px] font-bold">DD</div>
                        </div>
                    }
                />

                <Step
                    index={3}
                    side="left"
                    isDark={isDark}
                    icon={<MapPin size={20} />}
                    title={t.steps[2].title}
                    description={t.steps[2].desc}
                    illustration={
                        <div className="w-56 h-32 rounded-xl bg-grid-pattern opacity-40 flex items-center justify-center">
                            <div className="relative">
                                <MapPin size={32} className="text-[#E11D48] animate-bounce" />
                                <div className="absolute -bottom-1 left-1.5 w-5 h-2 bg-black/20 rounded-full blur-sm" />
                            </div>
                        </div>
                    }
                />
            </div>

            {/* Call to action ending */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-32 text-center"
            >
                <div className={`inline-flex items-center gap-2 p-4 rounded-3xl border ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-rose-50 border-rose-100'}`}>
                    <CheckCircle2 size={24} className="text-[#E11D48]" />
                    <span className={`text-sm font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{t.footer}</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Tutorial;
