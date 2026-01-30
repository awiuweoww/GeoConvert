import React from 'react';

/**
 * Interface untuk properti SplashScreen.
 * 
 * @interface SplashScreenProps
 * @property {number} progress - Persentase pemuatan.
 */
interface SplashScreenProps {
    progress: number;
}

/**
 * Komponen SplashScreen utama untuk sistem geospasial PT LEN.
 */
const SplashScreen: React.FC<SplashScreenProps> = ({ progress }) => {
    return (
        <div className="fixed inset-0 z-[9999] bg-[#FF0000] flex flex-col items-center justify-center text-white font-montserrat select-none w-screen h-screen">

            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-15"
                style={{
                    backgroundImage: `radial-gradient(circle, white 1.5px, transparent 1.5px)`,
                    backgroundSize: '28px 28px',
                    backgroundPosition: 'center'
                }}
            />

            <div className="relative z-10 flex flex-col items-center w-full max-w-[480px] px-10">

                {/* Logo Container */}
                <div className="mb-10 opacity-0 animate-zoom-in">
                    <div className="w-28 h-28 bg-white rounded-3xl p-5 shadow-2xl flex items-center justify-center">
                        <img src="/logo-len.png" alt="Logo PT LEN" className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Brand Group */}
                <div className="text-center mb-16 flex flex-col items-center">
                    <div className="relative h-12 inline-block">
                        <h1 className="text-4xl font-black uppercase typewriter overflow-hidden whitespace-nowrap">
                            PT LEN
                        </h1>
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-0 animate-fade-in-up delay-1000">
                        Geospatial Systems
                    </p>
                </div>

                {/* Loading Progress */}
                <div className="w-full space-y-4 opacity-0 animate-fade-in-up delay-1000">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-lg font-bold italic">Memuat...</span>
                        <span className="text-2xl font-black tabular-nums">
                            {Math.round(progress)}%
                        </span>
                    </div>

                    <div className="h-2.5 w-full bg-black/30 rounded-full border border-white/30 overflow-hidden relative">
                        <div
                            className="h-full bg-white transition-all duration-200 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="absolute bottom-10 left-0 right-0 text-center space-y-2 opacity-0 animate-fade-in-up delay-1000">
                <p className="text-[10px] tracking-[0.3em] opacity-40 uppercase font-bold">
                    v1.0.1 - Geographic Converter
                </p>
                <p className="text-[9px] tracking-[0.6em] opacity-25 uppercase font-black">
                    by chndr.sprtn
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;
