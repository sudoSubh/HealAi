import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import CuratedHealthHub from './pages/CuratedHealthHub';
import SymptomChecker from './pages/SymptomChecker';
import MedicalBot from './pages/MedicalBot';
import Resources from './pages/Resources';
import EducationHub from './pages/EducationHub';
import Articles from './pages/education/Articles';
import Videos from './pages/education/Videos';
import Webinars from './pages/education/Webinars';
import Vaccinations from './pages/education/Vaccinations';
import Fitness from './pages/education/articles/Fitness';
import Nutrition from './pages/education/articles/Nutrition';
import MentalHealth from './pages/education/articles/MentalHealth';
import HeartHealth from './pages/education/articles/HeartHealth';
import GeminiMedicalBotPage from './pages/GeminiMedicalBot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/health-hub" element={<CuratedHealthHub />} />
        <Route path="/symptoms" element={<SymptomChecker />} />
        <Route path="/medical-bot" element={<MedicalBot />} />
        <Route path="/gemini-medical-bot" element={<GeminiMedicalBotPage />} />
        <Route path="/education" element={<EducationHub />} />
        <Route path="/education/articles" element={<Articles />} />
        <Route path="/education/videos" element={<Videos />} />
        <Route path="/education/webinars" element={<Webinars />} />
        <Route path="/education/vaccinations" element={<Vaccinations />} />
        <Route path="/education/articles/fitness" element={<Fitness />} />
        <Route path="/education/articles/nutrition" element={<Nutrition />} />
        <Route path="/education/articles/mental-health" element={<MentalHealth />} />
        <Route path="/education/articles/heart-health" element={<HeartHealth />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </Router>
  );
}

export default App;