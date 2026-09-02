import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const heroCanvasRef = useRef<HTMLDivElement | null>(null);

  // Trigger the hero construction to draw once it scrolls into view.
  useEffect(() => {
    const node = heroCanvasRef.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      node.classList.add('landing-page-in-view');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('landing-page-in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page-landing">
      <header className="landing-page-site">
        <nav className="landing-page-nav">
          <a href="#landing-page-top" className="landing-page-logo">
            <img
              src={`${import.meta.env.BASE_URL}favicon.svg`}
              alt=""
              aria-hidden="true"
              className="landing-page-logo-icon"
            />
            Aurea
          </a>
          <div className="landing-page-tabs">
            <a href="#landing-page-overview">Overview</a>
            <a href="#landing-page-instruments">Instruments</a>
            <a href="#landing-page-history">History</a>
            <a href="#landing-page-gallery">Gallery</a>
          </div>
            <Link to="/app" className="landing-page-btn landing-page-btn-ghost" style={{ padding: '9px 16px' }}>
            Open app
            </Link>
        </nav>
      </header>

      <main id="landing-page-top">
        {/* ============ HERO ============ */}
        <section
          className="landing-page-hero"
          id="landing-page-overview"
          style={{ borderTop: 'none', paddingTop: '76px' }}
        >
          <div className="landing-page-wrap landing-page-hero-grid">
            <div>
              <span className="landing-page-eyebrow">Compass · Straightedge · Snapping</span>
              <h1>Construct, don&apos;t sketch.</h1>
              <p className="landing-page-lede">
                Aurea is a digital sacred geometry construction engine, use it to rapidly prototype and explore geometric forms with precision.
              </p>
              <div className="landing-page-hero-ctas">
                <Link to="/app" className="landing-page-btn landing-page-btn-primary">
                  Open the app
                </Link>
                <a href="#landing-page-gallery" className="landing-page-btn landing-page-btn-ghost">
                  See constructions ↓
                </a>
              </div>
            </div>

            <div className="landing-page-hero-visual landing-page-panel">
              <div className="landing-page-hero-canvas" ref={heroCanvasRef}>
                <svg id="landing-page-hero-svg" viewBox="0 0 480 380" xmlns="http://www.w3.org/2000/svg">
                  {/* two equal circles, each centered on the other's radius — same relationship as the Vesica Piscis card */}
                  <circle
                    className="landing-page-draw"
                    cx="160"
                    cy="280"
                    r="160"
                    pathLength={100}
                    fill="none"
                    stroke="#017DD3"
                    strokeWidth="1.4"
                    style={{ animationDelay: '.1s' }}
                  />
                  <circle
                    className="landing-page-draw"
                    cx="320"
                    cy="280"
                    r="160"
                    pathLength={100}
                    fill="none"
                    stroke="#017DD3"
                    strokeWidth="1.4"
                    style={{ animationDelay: '.9s' }}
                  />

                  {/* final ink triangle, drawn from the two centers and the circles' intersection */}
                  <line
                    className="landing-page-draw"
                    x1="160"
                    y1="280"
                    x2="320"
                    y2="280"
                    pathLength={100}
                    stroke="#000000"
                    strokeWidth="2"
                    style={{ animationDelay: '1.8s' }}
                  />
                  <line
                    className="landing-page-draw"
                    x1="160"
                    y1="280"
                    x2="240"
                    y2="141"
                    pathLength={100}
                    stroke="#000000"
                    strokeWidth="2"
                    style={{ animationDelay: '2.1s' }}
                  />
                  <line
                    className="landing-page-draw"
                    x1="320"
                    y1="280"
                    x2="240"
                    y2="141"
                    pathLength={100}
                    stroke="#000000"
                    strokeWidth="2"
                    style={{ animationDelay: '2.1s' }}
                  />
                </svg>
              </div>
              <p className="landing-page-figure-caption">
                Euclid, Book I, Prop. 1: An equilateral triangle from two circles and a line.
              </p>
            </div>
          </div>
        </section>

        {/* ============ INSTRUMENTS ============ */}
        <section id="landing-page-instruments">
          <div className="landing-page-wrap">
            <div className="landing-page-section-head">
              <span className="landing-page-eyebrow">The Toolset</span>
              <h2>Traditional tools. No shortcuts.</h2>
              <p>
                Everything in a construction comes from a circle or a line. Aurea makes them exact, and remembers what you did  with them.
              </p>
            </div>

            <div className="landing-page-instruments">
              <div className="landing-page-panel landing-page-instrument-card">
                <svg className="landing-page-icon" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="10" r="3" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M20 13 L10 33 M20 13 L30 33" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M9 33 L11 33 M29 33 L31 33" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                <h3>Virtual Compass</h3>
                <p>
                  Construction tool that creates circles of a fixed radius via two points.
                </p>
              </div>
              <div className="landing-page-panel landing-page-instrument-card">
                <svg className="landing-page-icon" viewBox="0 0 40 40" fill="none">
                  <rect x="4" y="18" width="32" height="6" stroke="currentColor" strokeWidth="1.3" />
                  <path
                    d="M9 18 L9 24 M16 18 L16 22 M23 18 L23 24 M30 18 L30 22"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                </svg>
                <h3>Virtual Straightedge</h3>
                <p>
                  Anchors to any two points and extends into a true infinite line in both
                  directions.
                </p>
              </div>
              <div className="landing-page-panel landing-page-instrument-card">
                <svg className="landing-page-icon" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M20 6 V16 M20 24 V34 M6 20 H16 M24 20 H34"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <circle cx="20" cy="20" r="3.2" fill="currentColor" />
                </svg>
                <h3>Snapping Engine</h3>
                <p>
                  Intersections, centers, and endpoints pull your cursor in automatically, so a
                  construction lands exactly where the geometry dictates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/*/!* ============ HISTORY ============ *!/*/}
        {/*<section id="landing-page-history">*/}
        {/*  <div className="landing-page-wrap landing-page-history-layout">*/}
        {/*    <div className="landing-page-history-copy">*/}
        {/*      <span className="landing-page-eyebrow">Construction History</span>*/}
        {/*      <h2>Nothing is ever really erased.</h2>*/}
        {/*      <p>*/}
        {/*        Every arc and line you draw becomes a step in the construction&apos;s history — in*/}
        {/*        order, with its exact center, radius, and endpoints.*/}
        {/*      </p>*/}
        {/*      <p>*/}
        {/*        Scrub backward to see how a figure was built, branch a new attempt off any earlier*/}
        {/*        step, or export the sequence as a reproducible set of instructions.*/}
        {/*      </p>*/}
        {/*    </div>*/}

        {/*    <div className="landing-page-panel">*/}
        {/*      <div className="landing-page-history-log">*/}
        {/*        <div className="landing-page-row">*/}
        {/*          <span className="landing-page-n">01</span>*/}
        {/*          <span className="landing-page-op">circle</span>*/}
        {/*          <span>center A · r 120</span>*/}
        {/*        </div>*/}
        {/*        <div className="landing-page-row">*/}
        {/*          <span className="landing-page-n">02</span>*/}
        {/*          <span className="landing-page-op">circle</span>*/}
        {/*          <span>center B · r 120</span>*/}
        {/*        </div>*/}
        {/*        <div className="landing-page-row landing-page-active">*/}
        {/*          <span className="landing-page-n">03</span>*/}
        {/*          <span className="landing-page-op">line</span>*/}
        {/*          <span>A → B</span>*/}
        {/*        </div>*/}
        {/*        <div className="landing-page-row">*/}
        {/*          <span className="landing-page-n">04</span>*/}
        {/*          <span className="landing-page-op">point</span>*/}
        {/*          <span>intersection ×2</span>*/}
        {/*        </div>*/}
        {/*        <div className="landing-page-row">*/}
        {/*          <span className="landing-page-n">05</span>*/}
        {/*          <span className="landing-page-op">line</span>*/}
        {/*          <span>P1 → P2</span>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</section>*/}

        {/* ============ GALLERY ============ */}
        <section id="landing-page-gallery">
          <div className="landing-page-wrap">
            <div className="landing-page-section-head">
              <span className="landing-page-eyebrow">Reference Constructions</span>
              <h2>Six common constructions.</h2>
              <p>
                Hover any of them to see the work underneath it.
              </p>
            </div>

            <div className="landing-page-gallery">
              {/* Equilateral triangle */}
              <div className="landing-page-panel landing-page-g-tile" tabIndex={0}>
                <svg viewBox="0 0 200 200">
                  <circle className="landing-page-guide" cx="65" cy="140" r="70" strokeWidth="1" fill="none" />
                  <circle className="landing-page-guide" cx="135" cy="140" r="70" strokeWidth="1" fill="none" />
                  <path className="landing-page-g-final" d="M65,140 L135,140 L100,79.4 Z" strokeWidth="1.6" />
                  <circle cx="65" cy="140" r="2" fill="#000000" />
                  <circle cx="135" cy="140" r="2" fill="#000000" />
                  <circle cx="100" cy="79.4" r="2" fill="#000000" />
                </svg>
                <div className="landing-page-g-caption">
                  <span className="landing-page-name">Equilateral Triangle</span>
                  <span className="landing-page-meta">2 circles · 3 lines</span>
                </div>
              </div>

              {/* Square */}
              <div className="landing-page-panel landing-page-g-tile" tabIndex={0}>
                <svg viewBox="0 0 200 200">
                  <circle className="landing-page-guide" cx="100" cy="100" r="70" strokeWidth="1" fill="none" />
                  <line className="landing-page-guide" x1="100" y1="30" x2="100" y2="170" strokeWidth="1" />
                  <line className="landing-page-guide" x1="30" y1="100" x2="170" y2="100" strokeWidth="1" />
                  <path
                    className="landing-page-g-final"
                    d="M100,30 L170,100 L100,170 L30,100 Z"
                    strokeWidth="1.6"
                  />
                  <circle cx="100" cy="30" r="2" fill="#000000" />
                  <circle cx="170" cy="100" r="2" fill="#000000" />
                  <circle cx="100" cy="170" r="2" fill="#000000" />
                  <circle cx="30" cy="100" r="2" fill="#000000" />
                </svg>
                <div className="landing-page-g-caption">
                  <span className="landing-page-name">Square</span>
                  <span className="landing-page-meta">1 arc · 2 diameters</span>
                </div>
              </div>

              {/* Hexagon */}
              <div className="landing-page-panel landing-page-g-tile" tabIndex={0}>
                <svg viewBox="0 0 200 200">
                  <circle className="landing-page-guide" cx="100" cy="100" r="60" strokeWidth="1" fill="none" />
                  <path
                    className="landing-page-g-final"
                    d="M160,100 L130,151.96 L70,151.96 L40,100 L70,48.04 L130,48.04 Z"
                    strokeWidth="1.6"
                  />
                  <g fill="#000000">
                    <circle cx="160" cy="100" r="2" />
                    <circle cx="130" cy="151.96" r="2" />
                    <circle cx="70" cy="151.96" r="2" />
                    <circle cx="40" cy="100" r="2" />
                    <circle cx="70" cy="48.04" r="2" />
                    <circle cx="130" cy="48.04" r="2" />
                  </g>
                </svg>
                <div className="landing-page-g-caption">
                  <span className="landing-page-name">Regular Hexagon</span>
                  <span className="landing-page-meta">6 arcs · r constant</span>
                </div>
              </div>

              {/* Vesica Piscis */}
              <div className="landing-page-panel landing-page-g-tile" tabIndex={0}>
                <svg viewBox="0 0 200 200">
                  <circle className="landing-page-g-final" cx="80" cy="100" r="40" strokeWidth="1.6" />
                  <circle className="landing-page-g-final" cx="120" cy="100" r="40" strokeWidth="1.6" />
                  <line className="landing-page-guide" x1="80" y1="100" x2="120" y2="100" strokeWidth="1" />
                  <circle className="landing-page-guide" cx="80" cy="100" r="2.4" fill="#017DD3" stroke="none" />
                  <circle className="landing-page-guide" cx="120" cy="100" r="2.4" fill="#017DD3" stroke="none" />
                </svg>
                <div className="landing-page-g-caption">
                  <span className="landing-page-name">Vesica Piscis</span>
                  <span className="landing-page-meta">2 arcs, equal r</span>
                </div>
              </div>

              {/* Golden Rectangle */}
              <div className="landing-page-panel landing-page-g-tile" tabIndex={0}>
                <svg viewBox="0 0 200 200">
                  <path
                    className="landing-page-guide"
                    d="M114,65 A70,70 0 0,1 44,135"
                    strokeWidth="1"
                    fill="none"
                  />
                  <rect className="landing-page-g-final" x="44" y="65" width="112" height="70" strokeWidth="1.6" />
                  <line className="landing-page-guide" x1="114" y1="65" x2="114" y2="135" strokeWidth="1" />
                </svg>
                <div className="landing-page-g-caption">
                  <span className="landing-page-name">Golden Rectangle</span>
                  <span className="landing-page-meta">1 arc · ratio 1:1.618</span>
                </div>
              </div>

              {/* Seed of Life */}
              <div className="landing-page-panel landing-page-g-tile" tabIndex={0}>
                <svg viewBox="0 0 200 200">
                  <circle className="landing-page-g-final" cx="100" cy="100" r="30" strokeWidth="1.4" />
                  <circle className="landing-page-g-final" cx="130" cy="100" r="30" strokeWidth="1.4" />
                  <circle className="landing-page-g-final" cx="115" cy="125.98" r="30" strokeWidth="1.4" />
                  <circle className="landing-page-g-final" cx="85" cy="125.98" r="30" strokeWidth="1.4" />
                  <circle className="landing-page-g-final" cx="70" cy="100" r="30" strokeWidth="1.4" />
                  <circle className="landing-page-g-final" cx="85" cy="74.02" r="30" strokeWidth="1.4" />
                  <circle className="landing-page-g-final" cx="115" cy="74.02" r="30" strokeWidth="1.4" />
                  <line className="landing-page-guide" x1="100" y1="100" x2="130" y2="100" strokeWidth="1" />
                  <circle className="landing-page-guide" cx="100" cy="100" r="2.2" fill="#017DD3" stroke="none" />
                </svg>
                <div className="landing-page-g-caption">
                  <span className="landing-page-name">Seed of Life</span>
                  <span className="landing-page-meta">7 arcs · r constant</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="landing-page-cta-final">
          <div className="landing-page-wrap">
            <h2>Pick up the compass.</h2>
            <p>No install, no plugin — Landing Page runs in the browser.</p>
            <Link to="/app" className="landing-page-btn landing-page-btn-primary">
              Open the app
            </Link>
          </div>
        </section>
      </main>

      <footer>
        <div className="landing-page-wrap landing-page-footer-row">
          <span>© 2026 Aurea. Build with React.</span>
        </div>
      </footer>
    </div>
  );
}
