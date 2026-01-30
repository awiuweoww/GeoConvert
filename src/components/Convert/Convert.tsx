import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Crosshair, X, RefreshCw, ArrowDownUp, AlertCircle, History, Trash2, MousePointer2 } from 'lucide-react';
import { dmsToDd, ddToDms, formatDmsString, type DMS } from '../../services/CoordinateService';

interface SavedPoint {
    id: string;
    lat: number;
    lon: number;
    timestamp: number;
    type: 'DMS' | 'DD';
}

const translations = {
    ID: {
        helper: "Klik 3x pada peta untuk mengambil lokasi",
        savedPoints: "Titik Tersimpan",
        clearConfirm: "Hapus semua titik tersimpan?",
        modalTitle: "Konversi Koordinat",
        from: "DARI",
        to: "KE",
        btnSave: "Simpan & Tambahkan ke Peta",
        confirmTitle: "Simpan Koordinat",
        confirmDesc: "Simpan titik ini ke memori aplikasi Anda?",
        btnCancel: "Batal",
        btnConfirm: "Simpan & Pin",
        placeholderLat: "Lat",
        placeholderLon: "Lon",
    },
    EN: {
        helper: "Triple click on map to pick location",
        savedPoints: "Points Saved",
        clearConfirm: "Clear all saved points?",
        modalTitle: "Convert Coordinates",
        from: "FROM",
        to: "TO",
        btnSave: "Save & Add to Map",
        confirmTitle: "Save Coordinate",
        confirmDesc: "Save this point to your application memory?",
        btnCancel: "Cancel",
        btnConfirm: "Save & Pin",
        placeholderLat: "Lat",
        placeholderLon: "Lon",
    }
};

/**
 * Komponen Convert - Menampilkan peta interaktif dengan fitur konversi, penyimpanan lokal,
 * dan fitur interaksi klik peta untuk mendapatkan koordinat.
 */
const Convert: React.FC<{ isDark: boolean; hideUI?: boolean; lang: 'ID' | 'EN' }> = ({ isDark, hideUI = false, lang }) => {
    const mapElement = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map | null>(null);
    const vectorSourceRef = useRef<VectorSource>(new VectorSource());
    const tileLayerRef = useRef<TileLayer<OSM> | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'DMS2DD' | 'DD2DMS'>('DMS2DD');
    const [showConfirm, setShowConfirm] = useState(false);
    const [savedPoints, setSavedPoints] = useState<SavedPoint[]>([]);

    const t = translations[lang];

    // State untuk menghitung klik (Combo Click)
    const [clickCount, setClickCount] = useState(0);
    const lastClickTime = useRef<number>(0);

    // State Input
    const [latDms, setLatDms] = useState<DMS>({ deg: 0, min: 0, sec: 0, dir: 'S' });
    const [lonDms, setLonDms] = useState<DMS>({ deg: 0, min: 0, sec: 0, dir: 'E' });
    const [latDd, setLatDd] = useState<string>('');
    const [lonDd, setLonDd] = useState<string>('');

    // State Hasil
    const [resultDd, setResultDd] = useState<{ lat: number, lon: number } | null>(null);
    const [resultDms, setResultDms] = useState<{ lat: DMS, lon: DMS } | null>(null);

    // Inisialisasi Peta & Muat Data Tersimpan
    useEffect(() => {
        if (!mapElement.current) return;

        const stored = localStorage.getItem('geo_saved_points');
        const initialPoints: SavedPoint[] = stored ? JSON.parse(stored) : [];
        setSavedPoints(initialPoints);

        const tileLayer = new TileLayer({ source: new OSM() });
        tileLayerRef.current = tileLayer;

        const vectorLayer = new VectorLayer({
            source: vectorSourceRef.current,
            style: new Style({
                image: new Icon({
                    anchor: [0.5, 1],
                    src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                    scale: 0.1
                })
            })
        });

        initialPoints.forEach(p => {
            const feature = new Feature({ geometry: new Point(fromLonLat([p.lon, p.lat])) });
            vectorSourceRef.current.addFeature(feature);
        });

        const initialMap = new Map({
            target: mapElement.current,
            layers: [tileLayer, vectorLayer],
            view: new View({
                center: fromLonLat([106.8456, -6.2088]),
                zoom: 12,
            }),
            controls: []
        });

        // Logika Klik Peta (Single Click Listener untuk Deteksi Combo)
        initialMap.on('click', (event) => {
            const now = Date.now();
            const timeDiff = now - lastClickTime.current;

            // Jika jeda antar klik < 500ms, anggap sebagai bagian dari rangkaian klik
            setClickCount(prev => {
                const newCount = (timeDiff < 500) ? prev + 1 : 1;

                // Jika mencapai 3 klik (Triple Click)
                if (newCount === 3) {
                    const coords = toLonLat(event.coordinate);
                    const lon = coords[0];
                    const lat = coords[1];

                    // Set input DD secara otomatis
                    setLatDd(lat.toFixed(6));
                    setLonDd(lon.toFixed(6));

                    // Set input DMS secara otomatis (untuk tab DMS)
                    setLatDms(ddToDms(lat, true));
                    setLonDms(ddToDms(lon, false));

                    // Buka modal dan pindah ke tab DD untuk kemudahan
                    setActiveTab('DD2DMS');
                    setIsModalOpen(true);

                    return 0; // Reset count
                }
                return newCount;
            });

            lastClickTime.current = now;
        });

        mapRef.current = initialMap;
        setTimeout(() => initialMap.updateSize(), 500);
        return () => initialMap.setTarget(undefined);
    }, []);

    // Efek Dark Mode Peta
    useEffect(() => {
        const tileLayer = tileLayerRef.current;
        if (!tileLayer) return;
        const onPrerender = (event: any) => {
            const ctx = event.context as CanvasRenderingContext2D;
            if (!ctx) return;
            ctx.save();
            if (isDark) ctx.filter = 'grayscale(100%) invert(90%) brightness(100%) contrast(90%)';
        };
        const onPostrender = (event: any) => {
            const ctx = event.context as CanvasRenderingContext2D;
            if (!ctx) return;
            ctx.restore();
        };
        tileLayer.on('prerender', onPrerender);
        tileLayer.on('postrender', onPostrender);
        mapRef.current?.render();
        return () => {
            tileLayer.un('prerender', onPrerender);
            tileLayer.un('postrender', onPostrender);
        };
    }, [isDark]);

    // Real-time Calculation
    useEffect(() => {
        if (activeTab === 'DMS2DD') {
            setResultDd({ lat: dmsToDd(latDms), lon: dmsToDd(lonDms) });
        } else {
            const numLat = parseFloat(latDd);
            const numLon = parseFloat(lonDd);
            if (!isNaN(numLat) && !isNaN(numLon)) {
                setResultDms({ lat: ddToDms(numLat, true), lon: ddToDms(numLon, false) });
            } else {
                setResultDms(null);
            }
        }
    }, [latDms, lonDms, latDd, lonDd, activeTab]);

    const handleConfirmPin = () => {
        let lat, lon;
        if (activeTab === 'DMS2DD' && resultDd) {
            lat = resultDd.lat; lon = resultDd.lon;
        } else if (activeTab === 'DD2DMS') {
            lat = parseFloat(latDd); lon = parseFloat(lonDd);
        }

        if (lat !== undefined && lon !== undefined && !isNaN(lat) && !isNaN(lon)) {
            const newPoint: SavedPoint = {
                id: Date.now().toString(),
                lat,
                lon,
                timestamp: Date.now(),
                type: activeTab === 'DMS2DD' ? 'DMS' : 'DD'
            };

            const newPoints = [...savedPoints, newPoint];
            setSavedPoints(newPoints);
            localStorage.setItem('geo_saved_points', JSON.stringify(newPoints));

            const feature = new Feature({ geometry: new Point(fromLonLat([lon, lat])) });
            vectorSourceRef.current.addFeature(feature);
            mapRef.current?.getView().animate({ center: fromLonLat([lon, lat]), zoom: 16, duration: 1000 });

            setShowConfirm(false);
            setIsModalOpen(false);
        }
    };

    const clearAllPoints = () => {
        if (window.confirm(t.clearConfirm)) {
            vectorSourceRef.current.clear();
            setSavedPoints([]);
            localStorage.removeItem('geo_saved_points');
        }
    };

    return (
        <div className={`relative w-full h-full overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-100'}`}>
            {/* Peta dengan efek Blur saat di Home/Tutorial - Blur dihapus agar dihandle oleh Home */}
            <div
                ref={mapElement}
                className={`absolute inset-0 z-0 w-full h-full cursor-crosshair transition-all duration-700 scale-100`}
            />

            {/* Overlay Full-Screen dihapus agar peta tetap terlihat di Home */}

            {!hideUI && (
                <>
                    {/* Floating Controls */}
                    <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute right-6 bottom-32 flex flex-col gap-3 z-10">
                        <button onClick={() => mapRef.current?.getView().animate({ zoom: (mapRef.current?.getView().getZoom() || 0) + 1, duration: 250 })} className={`p-3 rounded-xl border shadow-lg ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-100'}`}><Plus size={20} /></button>
                        <button onClick={() => mapRef.current?.getView().animate({ zoom: (mapRef.current?.getView().getZoom() || 0) - 1, duration: 250 })} className={`p-3 rounded-xl border shadow-lg ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-100'}`}><Minus size={20} /></button>
                        <button onClick={() => mapRef.current?.getView().animate({ center: fromLonLat([106.8456, -6.2088]), zoom: 12, duration: 1000 })} className={`p-3 rounded-xl border shadow-lg ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-100'}`}><Crosshair size={20} /></button>
                        <button onClick={clearAllPoints} className={`p-3 rounded-xl border shadow-lg ${isDark ? 'bg-zinc-900 border-zinc-800 text-rose-500' : 'bg-white border-gray-100 text-rose-500'}`} title="Hapus Semua Titik"><Trash2 size={20} /></button>
                    </motion.div>

                    {/* FAB Convert */}
                    <motion.button initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={() => setIsModalOpen(true)} className="absolute right-6 bottom-10 h-14 px-8 bg-[#E11D48] text-white font-bold rounded-2xl flex items-center gap-3 shadow-2xl z-20"><RefreshCw size={20} />Convert</motion.button>

                    {/* Info Helper: Click 3x */}
                    <div className={`absolute top-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border flex items-center gap-3 shadow-xl z-10 backdrop-blur-md transition-all ${isDark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400' : 'bg-white/60 border-gray-100 text-gray-500'}`}>
                        <MousePointer2 size={14} className="text-rose-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.helper}</span>
                        {clickCount > 0 && (
                            <div className="flex gap-1 ml-1">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i < clickCount ? 'bg-rose-500' : 'bg-zinc-700'}`} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Badge Jumlah Titik */}
                    {savedPoints.length > 0 && (
                        <div className={`absolute left-6 bottom-10 px-4 py-2 rounded-full border flex items-center gap-2 shadow-lg z-10 ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-gray-100 text-gray-500'}`}>
                            <History size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{savedPoints.length} {t.savedPoints}</span>
                        </div>
                    )}
                </>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-[110] p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className={`relative w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border ${isDark ? 'bg-[#0a0a0a] border-zinc-800 shadow-black' : 'bg-white border-gray-100'}`}>

                            {/* Konfirmasi Overlay */}
                            <AnimatePresence>
                                {showConfirm && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center p-8">
                                        <div className={`absolute inset-0 ${isDark ? 'bg-[#0a0a0a]/95' : 'bg-white/95'}`} />
                                        <div className="relative text-center space-y-6">
                                            <div className="flex justify-center"><div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center"><AlertCircle className="text-rose-500" size={32} /></div></div>
                                            <div className="space-y-2">
                                                <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>{t.confirmTitle}</h3>
                                                <p className={`text-sm font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.confirmDesc}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => setShowConfirm(false)} className={`flex-1 h-12 rounded-xl font-bold text-xs uppercase tracking-widest border ${isDark ? 'border-zinc-800 text-zinc-500' : 'border-gray-100 text-gray-400'}`}>{t.btnCancel}</button>
                                                <button onClick={handleConfirmPin} className="flex-1 h-12 bg-rose-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-rose-500/30">{t.btnConfirm}</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="px-8 pt-8 pb-2 flex justify-between items-center">
                                <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>{t.modalTitle}</h2>
                                <button onClick={() => setIsModalOpen(false)} className={`p-1.5 rounded-full hover:bg-rose-50 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}><X size={22} /></button>
                            </div>

                            <div className="px-8 py-4">
                                <div className={`flex p-1 rounded-full ${isDark ? 'bg-zinc-900' : 'bg-gray-100'}`}>
                                    <button onClick={() => setActiveTab('DMS2DD')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'DMS2DD' ? (isDark ? 'bg-zinc-800 text-white shadow-lg' : 'bg-white text-zinc-900 shadow-sm') : 'text-zinc-500'}`}>DMS to DD</button>
                                    <button onClick={() => setActiveTab('DD2DMS')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'DD2DMS' ? (isDark ? 'bg-zinc-800 text-white shadow-lg' : 'bg-white text-zinc-900 shadow-sm') : 'text-zinc-500'}`}>DD to DMS</button>
                                </div>
                            </div>

                            <div className="px-8 pb-10 space-y-5">
                                {/* From Panel */}
                                <div>
                                    <div className="flex justify-between items-center mb-1.5 px-1"><span className={`text-[10px] font-black uppercase tracking-[0.15em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.from} ({activeTab === 'DMS2DD' ? 'DMS' : 'DD'})</span></div>
                                    <div className="space-y-3">
                                        {activeTab === 'DMS2DD' ? (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 text-[11px] font-bold text-zinc-500">{t.placeholderLat}</span>
                                                    <div className="flex-1 flex gap-2">
                                                        <input type="number" placeholder="Deg" className={`w-full p-3 text-center rounded-full border text-sm focus:ring-1 focus:ring-[#E11D48] outline-none transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-white' : 'bg-gray-50'}`} value={latDms.deg || ''} onChange={(e) => setLatDms({ ...latDms, deg: Number(e.target.value) })} />
                                                        <input type="number" placeholder="Min" className={`w-full p-3 text-center rounded-full border text-sm focus:ring-1 focus:ring-[#E11D48] outline-none transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-white' : 'bg-gray-50'}`} value={latDms.min || ''} onChange={(e) => setLatDms({ ...latDms, min: Number(e.target.value) })} />
                                                        <input type="number" placeholder="Sec" className={`w-full p-3 text-center rounded-full border text-sm focus:ring-1 focus:ring-[#E11D48] outline-none transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-white' : 'bg-gray-50'}`} value={latDms.sec || ''} onChange={(e) => setLatDms({ ...latDms, sec: Number(e.target.value) })} />
                                                        <button
                                                            onClick={() => setLatDms({ ...latDms, dir: latDms.dir === 'N' ? 'S' : 'N' })}
                                                            className={`w-14 p-3 rounded-full border text-xs font-bold transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-white hover:bg-zinc-800' : 'bg-gray-50 hover:bg-gray-100'} hover:text-[#E11D48] active:scale-95`}
                                                        >
                                                            {latDms.dir}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 text-[11px] font-bold text-zinc-500">{t.placeholderLon}</span>
                                                    <div className="flex-1 flex gap-2">
                                                        <input type="number" placeholder="Deg" className={`w-full p-3 text-center rounded-full border text-sm focus:ring-1 focus:ring-[#E11D48] outline-none transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-white' : 'bg-gray-50'}`} value={lonDms.deg || ''} onChange={(e) => setLonDms({ ...lonDms, deg: Number(e.target.value) })} />
                                                        <input type="number" placeholder="Min" className={`w-full p-3 text-center rounded-full border text-sm focus:ring-1 focus:ring-[#E11D48] outline-none transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-white' : 'bg-gray-50'}`} value={lonDms.min || ''} onChange={(e) => setLonDms({ ...lonDms, min: Number(e.target.value) })} />
                                                        <input type="number" placeholder="Sec" className={`w-full p-3 text-center rounded-full border text-sm focus:ring-1 focus:ring-[#E11D48] outline-none transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-white' : 'bg-gray-50'}`} value={lonDms.sec || ''} onChange={(e) => setLonDms({ ...lonDms, sec: Number(e.target.value) })} />
                                                        <button
                                                            onClick={() => setLonDms({ ...lonDms, dir: lonDms.dir === 'E' ? 'W' : 'E' })}
                                                            className={`w-14 p-3 rounded-full border text-xs font-bold transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-white hover:bg-zinc-800' : 'bg-gray-50 hover:bg-gray-100'} hover:text-[#E11D48] active:scale-95`}
                                                        >
                                                            {lonDms.dir}
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-3"><span className="w-8 text-[11px] font-bold text-zinc-500">{t.placeholderLat}</span><input type="number" step="any" placeholder="-6.2088" className={`flex-1 p-3.5 rounded-full border text-sm focus:ring-1 focus:ring-[#E11D48] outline-none transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-white' : 'bg-gray-50'}`} value={latDd} onChange={(e) => setLatDd(e.target.value)} /></div>
                                                <div className="flex items-center gap-3"><span className="w-8 text-[11px] font-bold text-zinc-500">{t.placeholderLon}</span><input type="number" step="any" placeholder="106.8456" className={`flex-1 p-3.5 rounded-full border text-sm focus:ring-1 focus:ring-[#E11D48] outline-none transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-white' : 'bg-gray-50'}`} value={lonDd} onChange={(e) => setLonDd(e.target.value)} /></div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="relative flex justify-center py-6 h-4">
                                    <div className={`absolute top-1/2 left-0 right-0 h-[1px] ${isDark ? 'bg-zinc-900' : 'bg-gray-100'}`} />
                                    <div className={`relative z-10 w-8 h-8 rounded-full border flex items-center justify-center ${isDark ? 'bg-[#0a0a0a] border-zinc-800 text-rose-500' : 'bg-white text-rose-500'}`}><ArrowDownUp size={14} strokeWidth={3} /></div>
                                </div>

                                {/* To Panel */}
                                <div>
                                    <div className="mb-1.5 px-1"><span className={`text-[10px] font-black uppercase tracking-[0.15em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.to} ({activeTab === 'DMS2DD' ? 'DD' : 'DMS'})</span></div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3"><span className="w-20 text-[11px] font-bold text-zinc-500">Latitude</span><div className={`flex-1 p-3.5 rounded-full border font-mono text-sm ${isDark ? 'bg-zinc-900/30 border-zinc-900 text-white' : 'bg-zinc-50 text-zinc-900'}`}>{activeTab === 'DMS2DD' ? (resultDd?.lat || '-') : (resultDms ? formatDmsString(resultDms.lat) : '-')}</div></div>
                                        <div className="flex items-center gap-3"><span className="w-20 text-[11px] font-bold text-zinc-500">Longitude</span><div className={`flex-1 p-3.5 rounded-full border font-mono text-sm ${isDark ? 'bg-zinc-900/30 border-zinc-900 text-white' : 'bg-zinc-50 text-zinc-900'}`}>{activeTab === 'DMS2DD' ? (resultDd?.lon || '-') : (resultDms ? formatDmsString(resultDms.lon) : '-')}</div></div>
                                    </div>
                                </div>

                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowConfirm(true)} className="w-full h-14 bg-[#E11D48] text-white text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-rose-500/20 active:brightness-90 transition-all mt-4">{t.btnSave}</motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Convert;
