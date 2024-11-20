import { Link } from 'react-router-dom';

const ContactUs = () => {
    // This is a simple page that displays a contact information
    return (
      <div className="contact-us">
        <h1>Contact Us</h1>
        <p>For any questions or concerns, please contact us at:</p>
<p>Github:</p>
<ul>
  <li><Link to="https://github.com/Durfey32">durfe32</Link></li>
  <li><Link to="https://github.com/Tavinsowell">Tavinsowell</Link></li>
  <li><Link to="https://github.com/b3hold23">b3hold23</Link></li>
  <li><Link to="https://github.com/SirMac006">SirMac006</Link></li>
</ul>
      </div>
    );
};

export default ContactUs;