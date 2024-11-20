import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <div className='navbar'>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/workout-gen">Workout</Link>
        <Link to="/nutrition">Nutrition</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/comms-chat">Chat</Link>
        <Link to="/settings">Settings</Link>
      </div>
    </nav>
  );
};

export default Navbar;