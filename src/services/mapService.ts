import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

/**
 * Kelas MapService - Layanan utama untuk mengelola mesin peta OpenLayers.
 * Menggunakan pola singleton untuk manajemen state peta di seluruh komponen.
 * 
 * @class MapService
 */
export class MapService {
    private map: Map | null = null;
    private vectorSource: VectorSource;
    private vectorLayer: VectorLayer;

    constructor() {
        this.vectorSource = new VectorSource();
        this.vectorLayer = new VectorLayer({
            source: this.vectorSource,
            zIndex: 10,
        });
    }

    /**
     * Menginisialisasi mesin peta pada elemen HTML target.
     * 
     * @param {string} targetId - ID elemen tempat peta akan dirender.
     * @param {number[]} center - Koordinat awal dalam format [longitude, latitude].
     * @param {number} zoom - Tingkat zoom awal.
     * @returns {void}
     */
    public init(targetId: string, center: number[] = [107.6191, -6.9175], zoom: number = 13): void {
        if (this.map) return;

        this.map = new Map({
            target: targetId,
            layers: [
                new TileLayer({
                    source: new OSM(),
                    className: 'map-tiles-grayscale', // Filter kustom via CSS
                }),
                this.vectorLayer,
            ],
            view: new View({
                center: fromLonLat(center),
                zoom: zoom,
                smoothExtentConstraint: true,
                smoothResolutionConstraint: true,
            }),
            controls: [], // Kontrol kustom akan diimplementasikan secara terpisah
        });
    }

    /**
     * Melakukan animasi perpindahan tampilan peta ke koordinat tertentu.
     * 
     * @param {number[]} coords - Koordinat target [longitude, latitude].
     * @param {number} [zoom] - Tingkat zoom target (opsional).
     * @returns {void}
     */
    public flyTo(coords: number[], zoom?: number): void {
        if (!this.map) return;
        this.map.getView().animate({
            center: fromLonLat(coords),
            zoom: zoom || this.map.getView().getZoom(),
            duration: 1000,
        });
    }

    /**
     * Membersihkan resource peta untuk mencegah kebocoran memori.
     * 
     * @returns {void}
     */
    public destroy(): void {
        if (this.map) {
            this.map.setTarget(undefined);
            this.map = null;
        }
    }

    /**
     * Mendapatkan instance objek peta OpenLayers.
     * 
     * @returns {Map | null} Instance Map atau null jika belum diinisialisasi.
     */
    public getInstance(): Map | null {
        return this.map;
    }
}

/**
 * Export instance MapService sebagai singleton (mapEngine).
 */
export const mapEngine = new MapService();
export default mapEngine;
