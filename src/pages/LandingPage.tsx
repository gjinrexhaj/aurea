import "./LandingPage.css"

type LandingPageProps = {
    onEnter: () => void;
};

export default function LandingPage({onEnter,}: LandingPageProps) {
    return (
        <div className="landing">
            <h1>Aurea</h1>

            <p>
                Construct sacred geometry digitally using a virtual compass and straightedge.
            </p>

            <button onClick={onEnter}>
                Enter Workspace
            </button>
        </div>
    );
}