import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/Home">
          Home
        </Link>
          <ul className="navbar-nav">
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

    </nav>
  );
};

export default Navbar;
