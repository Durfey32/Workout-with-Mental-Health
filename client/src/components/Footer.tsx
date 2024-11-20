import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
        <div className = "footer">
            <p>Made by: Spencer Durfey, Tavin Sowell, Angel Fernandez, and Matthew Holmes</p>
            <Link to="/contact-us" style={{ color: '#61dafb', textDecoration: 'none' }}>Contact us</Link>
            </div>
        </footer>
    );
};

export default Footer;