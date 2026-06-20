import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import UseCases from './components/UseCases.jsx';
import Footer from './components/Footer.jsx';
import useScrollReveal from './hooks/useScrollReveal.js';

function App() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <UseCases />
      </main>
      <Footer />
    </div>
  );
}

export default App;
