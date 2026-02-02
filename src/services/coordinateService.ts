/**
 * Utiliti untuk konversi koordinat geografis.
 * Mendukung konversi antara Decimal Degrees (DD) dan Degrees Minutes Seconds (DMS).
 */

export interface DMS {
    deg: number;
    min: number;
    sec: number;
    dir: 'N' | 'S' | 'E' | 'W';
}

/**
 * Mengkonversi Degrees Minutes Seconds (DMS) ke Decimal Degrees (DD).
 * 
 * @param {DMS} dms - Objek koordinat DMS.
 * @returns {number} Nilai koordinat dalam format desimal.
 */
export const dmsToDd = (dms: DMS): number => {
    let dd = dms.deg + dms.min / 60 + dms.sec / 3600;
    if (dms.dir === 'S' || dms.dir === 'W') {
        dd = dd * -1;
    }
    return parseFloat(dd.toFixed(6));
};

/**
 * Mengkonversi Decimal Degrees (DD) ke Degrees Minutes Seconds (DMS).
 * 
 * @param {number} dd - Nilai koordinat dalam format desimal.
 * @param {boolean} isLat - Apakah koordinat ini adalah Latitude.
 * @returns {DMS} Objek koordinat dalam format DMS.
 */
export const ddToDms = (dd: number, isLat: boolean): DMS => {
    const absolute = Math.abs(dd);
    const deg = Math.floor(absolute);
    const minFloat = (absolute - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = parseFloat(((minFloat - min) * 60).toFixed(2));

    let dir: 'N' | 'S' | 'E' | 'W';
    if (isLat) {
        dir = dd >= 0 ? 'N' : 'S';
    } else {
        dir = dd >= 0 ? 'E' : 'W';
    }

    return { deg, min, sec, dir };
};

/**
 * Format DMS object menjadi string yang mudah dibaca.
 * Contoh: 6° 54' 53" S
 */
export const formatDmsString = (dms: DMS): string => {
    return `${dms.deg}° ${dms.min}' ${dms.sec}" ${dms.dir}`;
};
