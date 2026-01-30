# Class Diagram: PT LEN Geospatial System

## Overview
Diagram ini merepresentasikan struktur class dan relasi antar komponen dalam aplikasi **GeoConvert**.

```mermaid
classDiagram
    %% --- SERVICES ---
    class MapService {
        -Map map
        -VectorSource vectorSource
        -VectorLayer vectorLayer
        +constructor()
        +init(targetId: string, center: number[], zoom: number): void
        +flyTo(coords: number[], zoom?: number): void
        +destroy(): void
        +getInstance(): Map | null
    }

    class CoordinateService {
        <<Module>>
        +dmsToDd(dms: DMS): number
        +ddToDms(dd: number, isLat: boolean): DMS
        +formatDmsString(dms: DMS): string
    }

    class DMS {
        <<Interface>>
        +number deg
        +number min
        +number sec
        +string dir
    }

    %% --- COMPONENTS ---
    class Home {
        <<ReactComponent>>
        -isDark: boolean
        -lang: 'ID' | 'EN'
        -activeTab: string
        +toggleDark()
        +toggleLang()
        +setActiveTab()
        +render()
    }

    class Convert {
        <<ReactComponent>>
        -isDark: boolean
        -hideUI: boolean
        -lang: 'ID' | 'EN'
        -latDms: DMS
        -latDd: string
        +handleConfirmPin()
        +clearAllPoints()
        +render()
    }

    class Tutorial {
        <<ReactComponent>>
        -isDark: boolean
        -lang: 'ID' | 'EN'
        +render()
    }

    class Navbar {
        <<ReactComponent>>
        -Properties...
        +render()
    }

    %% --- RELATIONSHIPS ---
    
    %% Dependency Relationships
    Convert ..> MapService : uses (via props or internally)
    Convert ..> CoordinateService : uses
    Home --> Navbar : renders
    Home --> Convert : renders (as background)
    Home --> Tutorial : renders
    
    %% Implementation/Usage
    CoordinateService ..> DMS : uses
```

## Penjelasan Komponen

1.  **MapService**: Kelas pengendali utama untuk OpenLayers. Menangani inisialisasi peta, layer vektor, dan animasi kamera (`flyTo`). Menggunakan pola Singleton.
2.  **CoordinateService**: Himpunan fungsi utilitas murni untuk mentransformasi data koordinat (DMS <-> DD). Tidak menyimpan state.
3.  **Home**: Komponen halaman utama (Container). Mengelola state global aplikasi seperti tema (`isDark`) dan bahasa (`lang`). Mengatur navigasi antar tab (`Convert` vs `Tutorial`).
4.  **Convert**: Komponen inti aplikasi. Menampilkan peta (bisa dalam mode full UI atau background-only) dan form input untuk konversi.
5.  **Tutorial**: Komponen statis/interaktif untuk panduan pengguna.
