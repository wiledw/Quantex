import MarketWebSocket from './components/MarketWebSocket';
import Navbar from './components/Navbar';
import WelcomeSection from './components/Welcome';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar /> 
      
      {/* Hero Section */}
      <section>
        <WelcomeSection />
      </section>
      
      {/* Divider */}
      <div className="max-w-[1400px] mx-auto px-10">
        <div 
          className="h-px w-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), rgba(168, 85, 247, 0.3), transparent)',
          }}
        />
      </div>
      
      {/* Markets Section */}
      <section>
        <MarketWebSocket />
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-10 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <p className="text-[var(--text-muted)] text-sm">
            © 2024 Quantex. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Support'].map((item) => (
              <a 
                key={item}
                href="#" 
                className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
