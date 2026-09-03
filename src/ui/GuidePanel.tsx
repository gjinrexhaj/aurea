import "./GuidePanel.css";

export function GuidePanel() {
  return (
    <div className="guide-panel-wrapper">
      <div className="guide-panel">
        <div className="guide-intro">
          <h2>Usage Guide</h2>
          <button className="guide-see-more">VIEW USER MANUAL</button>
        </div>

        <div className="guide-section">
          <h3>Tool usage</h3>
          <p>1: Select tool</p>
          <p>2: Point tool</p>
          <p>3: Compass tool</p>
          <p>4: Line tool</p>
        </div>

        <div className="guide-section">
          <h3>Canvas controls</h3>
          <p>LMB or RMB: use tool</p>
          <p>DEL: delete selected geometry</p>
          <p>Use scroll wheel to zoom in/out</p>
        </div>
      </div>
    </div>
  );
}