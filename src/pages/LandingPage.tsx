import "./LandingPage.css"

type LandingPageProps = {
    onEnter: () => void;
};

export default function LandingPage({onEnter,}: LandingPageProps) {
    return (
        <div className="landing">
            <p>uh guys</p>
            <button onClick={onEnter}>Enter Workspace</button>
        </div>
    );
}