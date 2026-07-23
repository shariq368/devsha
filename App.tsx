import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import CustomCursor from './components/ui/CustomCursor';
import ScrollToTop from './components/ScrollToTop';
import SmoothScroll from './components/ui/SmoothScroll';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <SmoothScroll>
        <CustomCursor />
        <div className="relative min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </Router>
  );
};

export default App;