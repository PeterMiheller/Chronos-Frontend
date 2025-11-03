import { useNavigate } from 'react-router-dom';
import './ChronosLandingPage.css';

const ChronosLandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <main className="main">
                <div className="hero">
                    <h1 className="title">Time tracking for teams</h1>
                    <p className="subtitle">
                        Track time, manage projects, and understand where your team's hours go.
                    </p>
                    <button onClick={() => navigate('/auth')} className="cta-btn">
                        Get Started
                    </button>
                </div>

                <div className="features">
                    <div className="feature">
                        <h3>Track Time</h3>
                        <p>Start and stop timers for tasks and projects.</p>
                    </div>
                    <div className="feature">
                        <h3>View Reports</h3>
                        <p>See detailed breakdowns of time spent.</p>
                    </div>
                    <div className="feature">
                        <h3>Manage Teams</h3>
                        <p>Organize projects and team members.</p>
                    </div>
                </div>
            </main>

            <footer className="footer">
                <p>© 2024 Chronos</p>
            </footer>
        </div>
    );
};

export default ChronosLandingPage;
