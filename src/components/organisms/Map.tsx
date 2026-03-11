import {
  memo,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MapMarker {
  id?: string;
  lat: number;
  lng: number;
  /** Popup label shown on click */
  popup?: string;
  /** Tooltip shown on hover */
  title?: string;
}

export interface MapProps extends HTMLAttributes<HTMLDivElement> {
  /** Initial map center [lat, lng] */
  center?: [number, number];
  /** Initial zoom level */
  zoom?: number;
  /** Height of the map container (CSS value or number → px) */
  height?: string | number;
  /** Markers to place on the map */
  markers?: MapMarker[];
  /** Allow zoom/pan interaction (default: true) */
  interactive?: boolean;
  /** Fit the viewport to marker bounds whenever markers change */
  fitMarkers?: boolean;
  /** Accessible label for the map region */
  ariaLabel?: string;
}

// ─── Tile layers ──────────────────────────────────────────────────────────────

const TILES = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
  },
} as const;

// ─── Custom marker icon ───────────────────────────────────────────────────────

function makeIcon(color: string): L.DivIcon {
  return L.divIcon({
    html: `<div role="img" aria-label="Map marker">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="28" viewBox="0 0 22 28">
        <polygon points="11,2 20,9 20,18 11,26 2,18 2,9" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.5"/>
        <circle cx="11" cy="13" r="3" fill="${color}"/>
      </svg>
    </div>`,
    className: '',
    iconSize: [22, 28],
    iconAnchor: [11, 26],
    popupAnchor: [0, -30],
    tooltipAnchor: [14, -14],
  });
}

function makeMarkerLabel(marker: MapMarker): string {
  return marker.title ?? marker.popup ?? `Marker ${marker.lat.toFixed(3)}, ${marker.lng.toFixed(3)}`;
}

function makeMarkerIcon(color: string, label: string): L.DivIcon {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="28" viewBox="0 0 22 28">
    <polygon points="11,2 20,9 20,18 11,26 2,18 2,9" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.5"/>
    <circle cx="11" cy="13" r="3" fill="${color}"/>
  </svg>`;

  return L.divIcon({
    html: `<div role="img" aria-label="${label} marker">${svg}</div>`,
    className: '',
    iconSize: [22, 28],
    iconAnchor: [11, 26],
    popupAnchor: [0, -30],
    tooltipAnchor: [14, -14],
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function cssVar(name: string): string {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function cssRgb(name: string, alpha = 1): string {
  const val = cssVar(name);
  if (!val) return 'transparent';
  return alpha < 1 ? `rgba(${val.replace(/ /g, ',')},${alpha})` : `rgb(${val.replace(/ /g, ',')})`;
}

// ─── CSS overrides – injected once, reference CSS vars so they live-update ───
// z-index reference: Leaflet tiles=200, overlays=400, shadows=500, controls=1000

const LEAFLET_CSS_ID = 'aegis-leaflet-overrides';

function injectLeafletOverrides() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(LEAFLET_CSS_ID)) return;
  const style = document.createElement('style');
  style.id = LEAFLET_CSS_ID;
  style.textContent = `
    /* ── Map container background (visible while tiles load) ──── */
    .leaflet-container {
      background: rgb(var(--color-bg-dark)) !important;
      font-family: 'JetBrains Mono', monospace !important;
      outline: none !important;
    }

    /* ── Zoom bar ────────────────────────────────────────────── */
    .leaflet-bar {
      border: 1px solid rgb(var(--color-border-dark)) !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }
    .leaflet-bar a,
    .leaflet-bar a:link,
    .leaflet-bar a:visited {
      background-color: rgb(var(--color-panel-dark)) !important;
      color: rgb(var(--color-primary)) !important;
      border-bottom-color: rgb(var(--color-border-dark)) !important;
      border-radius: 0 !important;
      font-family: monospace !important;
      font-weight: 700 !important;
      line-height: 26px !important;
      width: 26px !important;
      height: 26px !important;
    }
    .leaflet-bar a:hover,
    .leaflet-bar a:focus {
      background-color: rgba(var(--color-primary), 0.08) !important;
      color: rgb(var(--color-primary)) !important;
      outline: none !important;
    }
    .leaflet-bar a.leaflet-disabled {
      background-color: rgb(var(--color-panel-dark)) !important;
      color: rgb(var(--color-border-dark)) !important;
      cursor: not-allowed !important;
    }
    .leaflet-touch .leaflet-bar a {
      border-radius: 0 !important;
    }

    /* ── Attribution ─────────────────────────────────────────── */
    .leaflet-control-attribution,
    .leaflet-control-attribution.leaflet-control {
      background-color: rgba(var(--color-panel-dark), 0.88) !important;
      color: rgb(var(--text-muted)) !important;
      font-family: monospace !important;
      font-size: 9px !important;
      letter-spacing: 0.04em !important;
      border-radius: 0 !important;
      border: 1px solid rgb(var(--color-border-dark)) !important;
      box-shadow: none !important;
      padding: 2px 6px !important;
    }
    .leaflet-control-attribution a {
      color: rgb(var(--color-primary)) !important;
    }

    /* ── Popup wrapper ───────────────────────────────────────── */
    .leaflet-popup-content-wrapper {
      background: rgb(var(--color-panel-dark)) !important;
      color: rgb(var(--text-base)) !important;
      border: 1px solid rgba(var(--color-primary), 0.3) !important;
      border-radius: 0 !important;
      box-shadow: 0 0 20px rgba(var(--color-primary), 0.08) !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 11px !important;
      padding: 10px 32px 10px 14px !important;
    }
    .leaflet-popup-content {
      margin: 0 !important;
      line-height: 1.5 !important;
    }
    .leaflet-popup-tip-container {
      /* keep default size */
    }
    .leaflet-popup-tip {
      background: rgb(var(--color-panel-dark)) !important;
      box-shadow: none !important;
    }
    .leaflet-popup-close-button,
    .leaflet-popup-close-button:hover {
      color: rgb(var(--color-primary)) !important;
      background: none !important;
      font-size: 18px !important;
      line-height: 1 !important;
      width: 24px !important;
      height: 24px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      top: 4px !important;
      right: 4px !important;
      padding: 0 !important;
      text-indent: 0 !important;
    }
    .leaflet-popup-close-button:hover {
      color: rgb(var(--text-base)) !important;
    }

    /* ── Tooltip ─────────────────────────────────────────────── */
    .leaflet-tooltip {
      background: rgb(var(--color-panel-dark)) !important;
      color: rgb(var(--color-primary)) !important;
      border: 1px solid rgb(var(--color-border-dark)) !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      font-family: monospace !important;
      font-size: 9px !important;
      font-weight: 700 !important;
      letter-spacing: 0.1em !important;
      text-transform: uppercase !important;
      padding: 3px 8px !important;
    }
    /* Arrow colors — all four directions */
    .leaflet-tooltip-top::before {
      border-top-color: rgb(var(--color-border-dark)) !important;
    }
    .leaflet-tooltip-bottom::before {
      border-bottom-color: rgb(var(--color-border-dark)) !important;
    }
    .leaflet-tooltip-left::before {
      border-left-color: rgb(var(--color-border-dark)) !important;
    }
    .leaflet-tooltip-right::before {
      border-right-color: rgb(var(--color-border-dark)) !important;
    }

    /* ── Tile pane — tweak opacity for AEGIS aesthetic ───────── */
    .leaflet-tile-pane {
      opacity: 0.95;
    }

    /* ── Zoom animation duration ─────────────────────────────── */
    /* Leaflet defaults to 0.25s; 0.18s feels snappier for wheel zoom */
    .leaflet-zoom-anim .leaflet-zoom-animated {
      transition: transform 0.18s cubic-bezier(0, 0, 0.25, 1) !important;
    }
  `;
  document.head.appendChild(style);
}

// ─── Hook: read theme from DOM attribute ─────────────────────────────────────
// Works with both ThemeProvider (sets data-theme via applyTheme) and the
// Storybook global decorator (sets data-theme directly on <html>).

function useDocTheme(): 'dark' | 'light' {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document === 'undefined') return 'dark';
    const attr = document.documentElement.getAttribute('data-theme');
    return attr === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const observer = new MutationObserver(() => {
      const attr = document.documentElement.getAttribute('data-theme');
      setTheme(attr === 'light' ? 'light' : 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Map = memo(({
  center = [51.505, -0.09],
  zoom = 13,
  height = 400,
  markers = [],
  interactive = true,
  fitMarkers = false,
  ariaLabel = 'Mission map',
  className = '',
  style,
  ...rest
}: MapProps) => {
  const theme = useDocTheme();
  const containerRef   = useRef<HTMLDivElement>(null);
  const mapRef         = useRef<L.Map | null>(null);
  const zoomControlRef = useRef<L.Control.Zoom | null>(null);
  const tileLayerRef   = useRef<L.TileLayer | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const interactiveRef = useRef(interactive);

  interactiveRef.current = interactive;

  // ── Init map once on mount ────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    injectLeafletOverrides();

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: false,
      dragging: true,
      // Native scroll-wheel zoom is disabled; replaced by smooth handler below
      scrollWheelZoom: false,
      doubleClickZoom: true,
      touchZoom: true,
      keyboard: true,
      attributionControl: true,
      // Snap to 0.5-level intervals — smooth mid-animation, clean at rest
      zoomSnap: 0.5,
      zoomDelta: 0.5,
    });

    mapRef.current = map;
    zoomControlRef.current = L.control.zoom();
    markerLayerRef.current = L.layerGroup().addTo(map);

    // ── Smooth scroll-wheel zoom ──────────────────────────────────────────
    // Uses Leaflet's native CSS zoom animation (GPU composited, single
    // transition per step) instead of a RAF loop. This avoids the blink
    // caused by firing zoomend / _resetGrid 60× per second with animate:false.
    //
    // getZoom() returns the TARGET zoom while an animation is running, so
    // rapid scrolling correctly accumulates from the in-flight target rather
    // than snapping back to the last committed integer level.
    const STEP = 0.5;
    const onWheel = (e: WheelEvent) => {
      if (!interactiveRef.current || !containerRef.current) return;

      e.preventDefault();

      const rect = containerRef.current.getBoundingClientRect();
      const pos = new L.Point(e.clientX - rect.left, e.clientY - rect.top);
      const delta = e.deltaY < 0 ? STEP : -STEP;
      const newZoom = Math.min(
        Math.max(map.getZoom() + delta, map.getMinZoom()),
        map.getMaxZoom(),
      );

      map.setZoomAround(pos, newZoom, { animate: true });
    };

    const el = containerRef.current!;
    el.addEventListener('wheel', onWheel, { passive: false });

    (map as L.Map & { _aegisSmoothCleanup?: () => void })._aegisSmoothCleanup = () => {
      el.removeEventListener('wheel', onWheel);
    };

    return () => {
      const m = map as L.Map & { _aegisSmoothCleanup?: () => void };
      m._aegisSmoothCleanup?.();
      map.stop();
      markerLayerRef.current?.clearLayers();
      zoomControlRef.current?.remove();
      tileLayerRef.current = null;
      markerLayerRef.current = null;
      zoomControlRef.current = null;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (interactive) {
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.keyboard.enable();
    zoomControlRef.current?.addTo(map);
    return;
  }

    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.keyboard.disable();
    zoomControlRef.current?.remove();
  }, [interactive]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || fitMarkers || markers.length > 0) return;

    map.setView(center, zoom, { animate: false });
  }, [center, fitMarkers, markers.length, zoom]);

  // ── Swap tile layer when theme changes ────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const cfg = TILES[theme];
    tileLayerRef.current = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);
  }, [theme]);

  // ── Refresh markers when markers prop or theme changes ────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!map || !layer) return;

    map.stop();
    layer.clearLayers();

    const primaryColor = cssRgb('--color-primary');
    const fallbackIcon = makeIcon(primaryColor);

    markers.forEach(({ lat, lng, popup, title }) => {
      const label = makeMarkerLabel({ lat, lng, popup, title });
      const marker = L.marker([lat, lng], { icon: makeMarkerIcon(primaryColor, label) || fallbackIcon });
      if (title) marker.bindTooltip(title, { direction: 'top' });
      if (popup) marker.bindPopup(popup);
      layer.addLayer(marker);
    });

    if (markers.length === 0) {
      map.setView(center, zoom, { animate: false });
      return;
    }

    if (!fitMarkers) {
      map.setView(center, zoom, { animate: false });
      return;
    }

    const bounds = L.latLngBounds(markers.map(({ lat, lng }) => [lat, lng] as [number, number]));
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: zoom, animate: false });
  }, [center, fitMarkers, markers, theme, zoom]);

  const heightValue = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      {...rest}
      role="region"
      aria-label={ariaLabel}
      className={['relative border border-border-dark overflow-hidden', className].filter(Boolean).join(' ')}
      style={{ height: heightValue, ...style }}
    >
      {/* Leaflet mount point */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Scanline — above tiles (z 201) but below markers/controls */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 201,
          opacity: 0.035,
          background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* HUD corner brackets — above everything (pointer-events-none) */}
      <div aria-hidden="true" style={{ zIndex: 1001 }} className="absolute top-0 left-0  w-3 h-3 border-t-2 border-l-2 border-primary pointer-events-none" />
      <div aria-hidden="true" style={{ zIndex: 1001 }} className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary pointer-events-none" />
      <div aria-hidden="true" style={{ zIndex: 1001 }} className="absolute bottom-0 left-0  w-3 h-3 border-b-2 border-l-2 border-primary pointer-events-none" />
      <div aria-hidden="true" style={{ zIndex: 1001 }} className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary pointer-events-none" />
    </div>
  );
});

Map.displayName = 'Map';

export default Map;
