import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-3">
      <div className="container text-center">
        <p className="mb-2">
          Made by: Spencer Durfey, Tavin Sowell, Angel Fernandez, and Matthew Holmes
        </p>
        <Link to="/contact-us" className="text-info text-decoration-none">
          Contact Us
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
