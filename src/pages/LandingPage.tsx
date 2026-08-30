import "./LandingPage.css"
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/aurea/app");
    }

    return (
        <div className="landing">
            <p>uh guys</p>
            <button onClick={handleClick}>Enter Workspace</button>
        </div>
    );
}