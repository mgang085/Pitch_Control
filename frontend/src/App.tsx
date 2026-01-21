import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Leagues } from './pages/Leagues';
import { Teams } from './pages/Teams';
import { Matches } from './pages/Matches';
import { Standings } from './pages/Standings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes - no auth required */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/leagues"
            element={
              <Layout>
                <Leagues />
              </Layout>
            }
          />
          <Route
            path="/teams"
            element={
              <Layout>
                <Teams />
              </Layout>
            }
          />
          <Route
            path="/matches"
            element={
              <Layout>
                <Matches />
              </Layout>
            }
          />
          <Route
            path="/standings"
            element={
              <Layout>
                <Standings />
              </Layout>
            }
          />

          {/* Private routes - auth required */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Catch all - redirect to leagues for public access */}
          <Route path="*" element={<Navigate to="/leagues" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
