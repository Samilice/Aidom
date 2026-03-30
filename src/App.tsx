import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './lib/store';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ui/ProtectedRoute';

// Public pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Simulator } from './pages/Simulator';
import { Pricing } from './pages/Pricing';
import { HowItWorks } from './pages/HowItWorks';
import { CombienCaCoute } from './pages/CombienCaCoute';
import { Guides } from './pages/Guides';
import { FAQ } from './pages/FAQ';
import { About } from './pages/About';
import { Mission } from './pages/Mission';
import { Contact } from './pages/Contact';

// Legal pages
import { MentionsLegales } from './pages/legal/MentionsLegales';
import { CGV } from './pages/legal/CGV';
import { Privacy } from './pages/legal/Privacy';
import { Sources } from './pages/legal/Sources';

// Protected pages
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { AddEmployee } from './pages/AddEmployee';
import { EmployeeDetail } from './pages/EmployeeDetail';
import { Checklist } from './pages/Checklist';

export function App() {
  const { loadUser } = useStore();

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/simulateur" element={<Simulator />} />
          <Route path="/tarifs" element={<Pricing />} />
          <Route path="/comment-ca-marche" element={<HowItWorks />} />
          <Route path="/combien-ca-coute" element={<CombienCaCoute />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/contact" element={<Contact />} />

          {/* Legal */}
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="/sources" element={<Sources />} />

          {/* Protected */}
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employees/add" element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
          <Route path="/employees/:id" element={<ProtectedRoute><EmployeeDetail /></ProtectedRoute>} />
          <Route path="/checklist" element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
