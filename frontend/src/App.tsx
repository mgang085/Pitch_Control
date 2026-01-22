import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Leagues } from './pages/Leagues';
import { CreateLeague } from './pages/CreateLeague';
import { ViewUnion } from './pages/ViewUnion';
import { EditUnion } from './pages/EditUnion';
import { CreateDivision } from './pages/CreateDivision';
import { Teams } from './pages/Teams';
import { CreateTeam } from './pages/CreateTeam';
import { EditTeam } from './pages/EditTeam';
import { Matches } from './pages/Matches';
import { CreateMatch } from './pages/CreateMatch';
import { Standings } from './pages/Standings';
import { UserManagement } from './pages/UserManagement';
import { Scoreboard } from './pages/Scoreboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes - no auth required */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/unions"
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

            {/* Scoreboard - Public, no layout */}
            <Route path="/scoreboard/:matchId" element={<Scoreboard />} />

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

            <Route
              path="/unions/:id"
              element={
                <Layout>
                  <ViewUnion />
                </Layout>
              }
            />

            <Route
              path="/unions/new"
              element={
                <PrivateRoute>
                  <Layout>
                    <CreateLeague />
                  </Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/unions/:id/edit"
              element={
                <PrivateRoute>
                  <Layout>
                    <EditUnion />
                  </Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/divisions/new"
              element={
                <PrivateRoute>
                  <Layout>
                    <CreateDivision />
                  </Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/teams/new"
              element={
                <PrivateRoute>
                  <Layout>
                    <CreateTeam />
                  </Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/teams/:id/edit"
              element={
                <PrivateRoute>
                  <Layout>
                    <EditTeam />
                  </Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/matches/new"
              element={
                <PrivateRoute>
                  <Layout>
                    <CreateMatch />
                  </Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <Layout>
                    <UserManagement />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Catch all - redirect to unions for public access */}
            <Route path="*" element={<Navigate to="/unions" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
