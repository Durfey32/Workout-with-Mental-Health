import { Outlet } from 'react-router-dom';
// import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css'; 

function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;