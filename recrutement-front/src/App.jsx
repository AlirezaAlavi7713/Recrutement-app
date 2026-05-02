import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Offres from "./pages/Offres";
import OffreDetail from "./pages/OffreDetail";
import DashboardCandidat from "./pages/DashboardCandidat";
import DashboardRecruteur from "./pages/DashboardRecruteur";
import Messages from "./pages/Messages";
import Profil from "./pages/Profil";
import DashboardAdmin from "./pages/DashboardAdmin";
import NotFound from "./pages/NotFound";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role === "admin" && user.role !== "admin") return <Navigate to="/" />;
  if (role && role !== "admin" && user.role !== role && user.role !== "admin") return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/offres" element={<Offres />} />
        <Route path="/offres/:id" element={<OffreDetail />} />
        <Route path="/dashboard/candidat" element={<ProtectedRoute role="candidat"><DashboardCandidat /></ProtectedRoute>} />
        <Route path="/dashboard/recruteur" element={<ProtectedRoute role="recruteur"><DashboardRecruteur /></ProtectedRoute>} />
        <Route path="/dashboard/admin" element={<ProtectedRoute role="admin"><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer position="top-right" theme="dark" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  );
}
