import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <div>
        <h1>Workout with Mental Health</h1>
        <Link to="/">Home</Link>
      </div>
    </nav>
  );
};

export default Navbar;