
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import NavalQuote from '../components/NavalQuote';
import VillaLab from '../components/VillaLab';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <NavalQuote />
      <VillaLab />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
