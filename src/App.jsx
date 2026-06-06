import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ui/ProtectedRoute'
import Navbar from './components/ui/Navbar'
import Footer from './components/ui/Footer'
import Accueil from './pages/Accueil'
import Annonces from './pages/Annonces'
import AnnonceDetail from './pages/AnnonceDetail'
import Agences from './pages/Agences'
import AgenceDetail from './pages/AgenceDetail'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Compte from './pages/Compte'
import Blog from './pages/Blog'
import BlogArticle from './pages/BlogArticle'
import MentionsLegales from './pages/MentionsLegales'
import CGU from './pages/CGU'
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite'
import NotFound from './pages/NotFound'
import DashboardCommercial from './pages/dashboard/DashboardCommercial'
import DashboardMarketing from './pages/dashboard/DashboardMarketing'
import DashboardRH from './pages/dashboard/DashboardRH'
import DashboardDirection from './pages/dashboard/DashboardDirection'
import DashboardIT from './pages/dashboard/DashboardIT'

export default function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/annonces" element={<Annonces />} />
            <Route path="/annonces/:id" element={<AnnonceDetail />} />
            <Route path="/agences" element={<Agences />} />
            <Route path="/agences/:id" element={<AgenceDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogArticle />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/compte" element={<ProtectedRoute><Compte /></ProtectedRoute>} />
            <Route path="/dashboard/commercial" element={<ProtectedRoute roles={['Commercial']}><DashboardCommercial /></ProtectedRoute>} />
            <Route path="/dashboard/marketing"  element={<ProtectedRoute roles={['Marketing']}><DashboardMarketing /></ProtectedRoute>} />
            <Route path="/dashboard/rh"         element={<ProtectedRoute roles={['RH_Juridique']}><DashboardRH /></ProtectedRoute>} />
            <Route path="/dashboard/direction"  element={<ProtectedRoute roles={['Direction']}><DashboardDirection /></ProtectedRoute>} />
            <Route path="/dashboard/it"         element={<ProtectedRoute roles={['IT_Support']}><DashboardIT /></ProtectedRoute>} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/cgu" element={<CGU />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
