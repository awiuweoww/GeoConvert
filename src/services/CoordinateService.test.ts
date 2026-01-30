import { dmsToDd, ddToDms, type DMS } from './CoordinateService';

describe('CoordinateService', () => {
    describe('dmsToDd', () => {
        it('should convert DMS to DD correctly for South', () => {
            const dms: DMS = { deg: 6, min: 12, sec: 31.68, dir: 'S' };
            const result = dmsToDd(dms);
            // 6 + 12/60 + 31.68/3600 = 6 + 0.2 + 0.0088 = 6.2088
            // South -> -6.2088
            expect(result).toBeCloseTo(-6.2088);
        });

        it('should convert DMS to DD correctly for North', () => {
            const dms: DMS = { deg: 6, min: 12, sec: 31.68, dir: 'N' };
            const result = dmsToDd(dms);
            expect(result).toBeCloseTo(6.2088);
        });

        it('should convert DMS to DD correctly for West', () => {
            const dms: DMS = { deg: 106, min: 50, sec: 44.16, dir: 'W' };
            const result = dmsToDd(dms);
            // 106 + 50/60 + 44.16/3600 = 106 + 0.8333... + 0.01226... = 106.8456
            // West -> -106.8456
            expect(result).toBeCloseTo(-106.8456);
        });
    });

    describe('ddToDms', () => {
        it('should convert DD to DMS correctly for Latitude (S)', () => {
            const dd = -6.2088;
            const result = ddToDms(dd, true);
            expect(result).toEqual({ deg: 6, min: 12, sec: 31.68, dir: 'S' });
        });

        it('should convert DD to DMS correctly for Longitude (E)', () => {
            const dd = 106.8456;
            const result = ddToDms(dd, false);
            expect(result).toEqual({ deg: 106, min: 50, sec: 44.16, dir: 'E' });
        });
    });
});
