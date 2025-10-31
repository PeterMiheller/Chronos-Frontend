import './App.css'
import ChronosAuth from "./pages/ChronosAuth.tsx";
import {  Routes, Route } from 'react-router-dom';
import ChronosDashboard from './pages/ChronosDashboard';
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {useState} from "react";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <div className="App">
            <Routes>
                <Route
                    path="/"
                    element={
                        <ChronosAuth
                            setIsAuthenticated={setIsAuthenticated}
                        />
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <ChronosDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;