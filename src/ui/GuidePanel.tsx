import "./GuidePanel.css";

export function GuidePanel() {
  return (
    <div className="guide-panel-wrapper">
      <div className="guide-panel">
        <div className="guide-section">
          <h3 className={'guide-section-header'}>Tool usage</h3>
          <p>
            <strong>1:</strong> Select tool
            <br />
            <strong>2:</strong> Point tool
            <br />
            <strong>3:</strong> Compass tool
            <br />
            <strong>4:</strong> Line tool
          </p>
        </div>

        <div className="guide-section">
          <h3 className={'guide-section-header'}>Canvas controls</h3>
          <p>
            <strong>LMB or RMB:</strong> use tool
            <br />
            <strong>DEL:</strong> delete selected geometry
            <br />
            <strong>Ctrl+Z:</strong> undo construction
            <br />
            <strong>Scroll wheel:</strong> zoom in/out
          </p>
        </div>

        <div className="guide-footer">
          <br/>
          <p className={'guide-footer-text'}>
            Additional information available in the user manual.
          </p>

          <button className="guide-see-more">OPEN USER MANUAL</button>
        </div>
      </div>
    </div>
  );
}