import { NavProvider, useNav } from './nav';
import { Banner, Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIAssistant } from './components/AIAssistant';
import { HomePage } from './components/HomePage';
import { ProgramsPage } from './components/ProgramsPage';
import { SciencePage } from './components/SciencePage';
import { EnquiryPage } from './components/EnquiryPage';
import { BookingPage } from './components/BookingPage';
import { CheckoutPage } from './components/CheckoutPage';
import { HealthPage } from './components/HealthPage';
import { NeuroDashboardPage } from './components/NeuroDashboardPage';

function PageRouter() {
  const { page } = useNav();

  switch (page) {
    case 'home':
      return <HomePage />;
    case 'programs':
      return <ProgramsPage />;
    case 'science':
      return <SciencePage />;
    case 'enquiry':
      return <EnquiryPage />;
    case 'booking':
      return <BookingPage />;
    case 'enrol':
      return <CheckoutPage />;
    case 'health':
      return <HealthPage />;
    case 'dashboard':
      return <NeuroDashboardPage />;
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <NavProvider>
      <div className="min-h-screen flex flex-col bg-ivory-100">
        <Banner />
        <Navbar />
        <main className="flex-1">
          <PageRouter />
        </main>
        <Footer />
        <AIAssistant />
      </div>
    </NavProvider>
  );
}

export default App;
