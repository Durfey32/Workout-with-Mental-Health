import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Home
        </Link>
       
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav w-100 d-flex justify-content-between">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/workout-gen">
                Workout
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/nutrition">
                Nutrition
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/journal">
                Journal
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/settings">
                Settings
              </Link>
            </li>
          </ul>
        </div>
    <nav>
      
      <div className='navbar'>
        <h1>FitTrack</h1>
        <Link to="/Home">Home</Link>
        <Link to="/workout-gen">Workout</Link>
        <Link to="/nutrition">Nutrition</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/settings">Settings</Link>
      </div>
    </nav>
  );
};

export default Navbar;
