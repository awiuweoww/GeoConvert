# Sequence Diagram: PT LEN Geospatial System

## 1. App Initialization & Map Loading Flow
Proses ini menggambarkan bagaimana aplikasi dimuat pertama kali hingga peta siap digunakan.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App
    participant Home
    participant Convert
    participant MapService
    participant OpenLayers

    User->>App: Buka Aplikasi
    activate App
    App->>App: Check Theme & Lang Preference
    
    note right of App: Render SplashScreen sementara

    App->>Home: Mount Component
    activate Home
    
    Home->>Convert: Render (Background Mode)
    activate Convert
    
    Convert->>MapService: Initialize Map (Target DIV)
    activate MapService
    MapService->>OpenLayers: Create Map & View
    MapService->>OpenLayers: Add Tile Layer (OSM)
    MapService->>OpenLayers: Add Vector Layer (Pins)
    deactivate MapService
    
    Convert->>LocalStorage: Load Saved Points
    Convert->>MapService: Add Existing Points to Map
    
    Home-->>User: Tampilkan UI (Navbar, Hero Text)
    deactivate App
```

## 2. Coordinate Conversion & Pinning Process
Proses inti dimana pengguna melakukan konversi koordinat dan menyimpannya ke peta.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Convert UI
    participant CoordinateService
    participant LocalStorage
    participant Map (OpenLayers)

    note over User, Convert UI: User berada di Tab "Convert"

    %% Real-time Conversion Flow
    User->>Convert UI: Input Koordinat (misal: DMS)
    activate Convert UI
    Convert UI->>CoordinateService: dmsToDd(input)
    activate CoordinateService
    CoordinateService-->>Convert UI: Return Decimal Degrees
    deactivate CoordinateService
    Convert UI-->>User: Update Result Panel (Real-time)
    deactivate Convert UI

    %% Save Flow
    User->>Convert UI: Click "Save & Add to Map"
    activate Convert UI
    Convert UI->>Convert UI: Show Confirmation Modal
    
    User->>Convert UI: Click "Confirm"
    
    Convert UI->>LocalStorage: Save New Point Data
    
    Convert UI->>Map (OpenLayers): Add Vector Feature (Point)
    Convert UI->>Map (OpenLayers): Animate View (FlyTo/Zoom)
    
    Convert UI-->>User: Close Modal & Show Map
    deactivate Convert UI
```
