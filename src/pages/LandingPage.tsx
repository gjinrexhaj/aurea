import "./LandingPage.css"

type LandingPageProps = {
    onEnter: () => void;
};

export default function LandingPage({onEnter,}: LandingPageProps) {
    return (
        <div className="landing">
            <div className="landing-card">
                <h1 className="landing-title">
                    Aurea
                </h1>

                <p className="landing-subtitle">
                    Quickly prototype sacred geometric forms using
                    a virtual compass and straightedge.
                </p>

                {/*<div className="landing-info">*/}
                {/*    <span>Delete/Backspace: Delete selected geometry</span>*/}
                {/*    <span>Middle Mouse Btn: Pan canvas</span>*/}
                {/*    <span>Scroll Wheel:     Zoom canvas</span>*/}
                {/*    <span>Left Mouse Btn:   Use tool</span>*/}
                {/*    <span>Right Mouse Btn:  Cancel tool usage</span>*/}
                {/*</div>*/}

                <div className="landing-actions">
                    <button
                        className="landing-button"
                        onClick={onEnter}
                    >
                        Enter Workspace
                    </button>
                </div>
            </div>
        </div>
    );
}