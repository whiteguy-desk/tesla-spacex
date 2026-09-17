import { Navbar } from './components/Navbar';
import { Homepage } from './components/Homepage';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="relative w-full max-w-[100vw] overflow-x-hidden flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      <Homepage />
      <Footer />
    </div>
  );
}

export default App;
