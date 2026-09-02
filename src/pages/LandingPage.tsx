import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const heroCanvasRef = useRef<HTMLDivElement | null>(null);

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
            <a href="#landing-page-gallery">Gallery</a>
          </div>
          <Link
            to="/app"
            className="landing-page-btn landing-page-btn-ghost"
            style={{ padding: '9px 16px' }}
          >
            Open app
          </Link>
        </nav>
      </header>

      <main id="landing-page-top">
        <section
          className="landing-page-hero"
          id="landing-page-overview"
          style={{ borderTop: 'none', paddingTop: '76px' }}
        >
          <div className="landing-page-wrap landing-page-hero-grid">
            <div>
              <span className="landing-page-eyebrow">
                Compass · Straightedge · Snapping
              </span>
              <h1>Construct, don&apos;t sketch.</h1>
              <p className="landing-page-lede">
                Aurea is a digital drafting table for classical geometric
                construction. It ships with a minimal toolset that adheres to
                traditional compass-and-straightedge construction.
              </p>
              <div className="landing-page-hero-ctas">
                <Link
                  to="/app"
                  className="landing-page-btn landing-page-btn-primary"
                >
                  Open the app
                </Link>
                <a
                  href="#landing-page-gallery"
                  className="landing-page-btn landing-page-btn-ghost"
                >
                  View common constructions ↓
                </a>
              </div>
            </div>

            <div className="landing-page-hero-visual landing-page-panel">
              <div className="landing-page-hero-canvas" ref={heroCanvasRef}>
                <svg
                  id="landing-page-hero-svg"
                  viewBox="0 0 480 380"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
                Euclid, Book I, Prop. 1: An equilateral triangle from two
                circles and a line.
              </p>
            </div>
          </div>
        </section>

        <section id="landing-page-instruments">
          <div className="landing-page-wrap">
            <div className="landing-page-section-head">
              <span className="landing-page-eyebrow">The Toolset</span>
              <h2>Three fundamental tools.</h2>
              <p>
                Everything in a construction comes from circles, lines, and
                the intersections between them, with the only true degree of freedom
                being the placement of points, for which the snapping engine enables precise placement.
              </p>
            </div>

            <div className="landing-page-instruments">
              <div className="landing-page-panel landing-page-instrument-card">
                <svg
                  className="landing-page-icon"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <circle
                    cx="20"
                    cy="10"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M20 13 L10 33 M20 13 L30 33"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M9 33 L11 33 M29 33 L31 33"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>
                <h3>Compass</h3>
                <p>
                  Constructs a circle from any two points, a foundational unit
                  of measurement from which all other geometric forms derive from.
                </p>
              </div>
              <div className="landing-page-panel landing-page-instrument-card">
                <svg
                  className="landing-page-icon"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <rect
                    x="4"
                    y="18"
                    width="32"
                    height="6"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M9 18 L9 24 M16 18 L16 22 M23 18 L23 24 M30 18 L30 22"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                </svg>
                <h3>Straightedge</h3>
                <p>
                  Anchors to any two points and extends into a true infinite
                  line in both directions.
                </p>
              </div>
              <div className="landing-page-panel landing-page-instrument-card">
                <svg
                  className="landing-page-icon"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M20 6 V16 M20 24 V34 M6 20 H16 M24 20 H34"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <circle cx="20" cy="20" r="3.2" fill="currentColor" />
                </svg>
                <h3>Snapping</h3>
                <p>
                  Intersections pull your cursor in automatically,
                  ensuring that a construction lands exactly where the
                  geometry says it should.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="landing-page-gallery">
          <div className="landing-page-wrap">
            <div className="landing-page-section-head">
              <span className="landing-page-eyebrow">
                Reference Constructions
              </span>
              <h2>Four classical constructions.</h2>
              <p>
                Hover any of them to reveal the construction geometry that
                composes the final shape.
              </p>
            </div>

            <div className="landing-page-gallery">
              <div
                className="landing-page-panel landing-page-g-tile"
                tabIndex={0}
              >
                <svg viewBox="0 0 200 200">
                  <circle
                    className="landing-page-guide"
                    cx="80"
                    cy="100"
                    r="40"
                    strokeWidth="1"
                    fill="none"
                  />
                  <circle
                    className="landing-page-guide"
                    cx="120"
                    cy="100"
                    r="40"
                    strokeWidth="1"
                    fill="none"
                  />
                  <line
                    className="landing-page-guide"
                    x1="80"
                    y1="100"
                    x2="120"
                    y2="100"
                    strokeWidth="1"
                  />
                  <path
                    className="landing-page-g-final"
                    d="M80,100 L120,100 L100,65.36 Z"
                    strokeWidth="1.6"
                  />
                  <circle cx="80" cy="100" r="2" fill="#000000" />
                  <circle cx="120" cy="100" r="2" fill="#000000" />
                  <circle cx="100" cy="65.36" r="2" fill="#000000" />
                </svg>
                <div className="landing-page-g-caption">
                  <span className="landing-page-name">
                    Equilateral Triangle
                  </span>
                  <span className="landing-page-meta">from vesica piscis</span>
                </div>
              </div>

              <div
                className="landing-page-panel landing-page-g-tile"
                tabIndex={0}
              >
                <svg viewBox="0 0 200 200">
                  <circle
                    className="landing-page-guide"
                    cx="100"
                    cy="52"
                    r="48"
                    strokeWidth="1"
                    fill="none"
                  />
                  <circle
                    className="landing-page-guide"
                    cx="148"
                    cy="100"
                    r="48"
                    strokeWidth="1"
                    fill="none"
                  />
                  <circle
                    className="landing-page-guide"
                    cx="100"
                    cy="148"
                    r="48"
                    strokeWidth="1"
                    fill="none"
                  />
                  <circle
                    className="landing-page-guide"
                    cx="52"
                    cy="100"
                    r="48"
                    strokeWidth="1"
                    fill="none"
                  />
                  <path
                    className="landing-page-g-final"
                    d="M148,52 L148,148 L52,148 L52,52 Z"
                    strokeWidth="1.6"
                  />
                  <circle cx="148" cy="52" r="2" fill="#000000" />
                  <circle cx="148" cy="148" r="2" fill="#000000" />
                  <circle cx="52" cy="148" r="2" fill="#000000" />
                  <circle cx="52" cy="52" r="2" fill="#000000" />
                </svg>
                <div className="landing-page-g-caption">
                  <span className="landing-page-name">Perfect Square</span>
                  <span className="landing-page-meta">
                    from four circles
                  </span>
                </div>
              </div>

              <div
                className="landing-page-panel landing-page-g-tile"
                tabIndex={0}
              >
                <svg viewBox="0 0 200 200">
                  <circle
                    className="landing-page-guide"
                    cx="100"
                    cy="98.61"
                    r="46.61"
                    strokeWidth="1"
                    fill="none"
                  />
                  <line
                    className="landing-page-guide"
                    x1="100"
                    y1="98.61"
                    x2="100"
                    y2="52"
                    strokeWidth="1"
                  />
                  <line
                    className="landing-page-guide"
                    x1="53.39"
                    y1="98.61"
                    x2="146.61"
                    y2="98.61"
                    strokeWidth="1"
                  />
                  <circle
                    className="landing-page-guide"
                    cx="76.70"
                    cy="98.61"
                    r="52.11"
                    strokeWidth="1"
                    fill="none"
                  />
                  <circle
                    className="landing-page-guide"
                    cx="123.30"
                    cy="98.61"
                    r="52.11"
                    strokeWidth="1"
                    fill="none"
                  />
                  <circle
                    className="landing-page-guide"
                    cx="100"
                    cy="52"
                    r="54.79"
                    strokeWidth="1"
                    fill="none"
                  />
                  <path
                    className="landing-page-g-final"
                    d="M100,52 L144.25,84.14 L127.35,136.36 L72.65,136.36 L55.75,84.14 Z"
                    strokeWidth="1.6"
                    fill="none"
                  />
                  <g fill="#000000">
                    <circle cx="100" cy="52" r="2" />
                    <circle cx="144.25" cy="84.14" r="2" />
                    <circle cx="127.35" cy="136.36" r="2" />
                    <circle cx="72.65" cy="136.36" r="2" />
                    <circle cx="55.75" cy="84.14" r="2" />
                  </g>
                </svg>
                <div className="landing-page-g-caption">
                  <span className="landing-page-name">Pentagon</span>
                  <span className="landing-page-meta">also from vesica piscis</span>
                </div>
              </div>

              <div
                className="landing-page-panel landing-page-g-tile"
                tabIndex={0}
              >
                <svg viewBox="0 0 200 200">
                  <circle
                    className="landing-page-guide"
                    cx="100"
                    cy="100"
                    r="30"
                    strokeWidth="1"
                    fill="none"
                  />
                  <circle
                    className="landing-page-guide"
                    cx="130"
                    cy="100"
                    r="30"
                    strokeWidth="1"
                    fill="none"
                  />
                  <circle
                    className="landing-page-guide"
                    cx="115"
                    cy="125.98"
                    r="30"
                    strokeWidth="1"
                    fill="none"
                  />
                  <circle
                    className="landing-page-guide"
                    cx="85"
                    cy="125.98"
                    r="30"
                    strokeWidth="1"
                    fill="none"
                  />
                  <circle
                    className="landing-page-guide"
                    cx="70"
                    cy="100"
                    r="30"
                    strokeWidth="1"
                    fill="none"
                  />
                  <circle
                    className="landing-page-guide"
                    cx="85"
                    cy="74.02"
                    r="30"
                    strokeWidth="1"
                    fill="none"
                  />
                  <circle
                    className="landing-page-guide"
                    cx="115"
                    cy="74.02"
                    r="30"
                    strokeWidth="1"
                    fill="none"
                  />
                  <line
                    className="landing-page-guide"
                    x1="100"
                    y1="100"
                    x2="130"
                    y2="100"
                    strokeWidth="1"
                  />
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
                  <span className="landing-page-name">Hexagon</span>
                  <span className="landing-page-meta">from seed of life</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-page-cta-final">
          <div className="landing-page-wrap">
            <h2>Pick up the compass.</h2>
            <p>No install needed, Aurea runs in the browser.</p>
            <Link
              to="/app"
              className="landing-page-btn landing-page-btn-primary"
            >
              Open the app
            </Link>
          </div>
        </section>
      </main>

      <footer>
        <div className="landing-page-wrap landing-page-footer-row">
          <span>© 2026 Aurea. Built with React.</span>
        </div>
      </footer>
    </div>
  );
}
