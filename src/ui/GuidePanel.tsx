import "./GuidePanel.css";
import {generatePath} from 'react-router-dom';

export function GuidePanel() {

  // Handles opening a new route in a new tab
  const handleViewManual = () => {
    const basename = window.location.pathname.split('/').slice(0, -1).join('/');
    const manualPath = generatePath('/manual');
    const fullUrl = `${window.location.origin}${basename}${manualPath}`;

    // Step 3: Open in new tab
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

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

          <button className="guide-see-more" onClick={handleViewManual}>
            OPEN USER MANUAL
          </button>
        </div>
      </div>
    </div>
  );
}