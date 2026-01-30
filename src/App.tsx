import { useState, useEffect } from 'react';
import SplashScreen from './components/UI/SplashScreen';
import Home from './components/Home/Home';

/**
 * Komponen Utama Aplikasi (App).
 * Mengelola transisi dari Splash Screen ke halaman utama GeoConvert.
 * 
 * @component
 * @returns {JSX.Element} Elemen root aplikasi.
 */
const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Durasi loading disesuaikan (4 detik sesuai permintaan sebelumnya di metadata)
    const totalDuration = 4000;
    const intervalTime = 16; // 60fps
    const step = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          // Transisi sedikit lebih lama untuk kehalusan visual
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-root w-full h-full min-h-screen bg-white">
      {/* Jika loading true, tampilkan SplashScreen */}
      {loading ? (
        <SplashScreen progress={progress} />
      ) : (
        /* Jika loading false, tampilkan Halaman Utama */
        <Home />
      )}
    </div>
  );
};

export default App;
