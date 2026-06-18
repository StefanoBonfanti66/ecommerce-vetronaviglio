import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-bone">
      <ScrollToTop />
      <Header />
      <main className="flex-grow pt-24 md:pt-32">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
