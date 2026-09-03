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
          <h3 className={'guide-section-header'}>Tool usage</h3>
          <p>
            1: Select tool
            <br />
            2: Point tool
            <br />
            3: Compass tool
            <br />
            4: Line tool
          </p>
        </div>

        <div className="guide-section">
          <h3 className={'guide-section-header'}>Canvas controls</h3>
          <p>
            LMB or RMB: use tool
            <br />
            DEL: delete selected geometry
            <br />
            Ctrl+Z: undo construction
            <br />
            Use scroll wheel to zoom in/out
          </p>
        </div>
      </div>
    </div>
  );
}