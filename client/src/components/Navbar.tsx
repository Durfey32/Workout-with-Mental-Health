import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
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