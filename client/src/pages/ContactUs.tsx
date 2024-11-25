import React from 'react';
import { useNavigate } from 'react-router-dom'

const ContactUs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="contact-us container my-5">
      <h1 className="text-center text-primary mb-4">Contact Us</h1>
      <p className="text-center text-secondary">
        For any questions or concerns, please contact us at:
      </p>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h3 className="text-success mb-3">GitHub Profiles</h3>
          <ul className="list-group">
            <li className="list-group-item">
              <a
                href="https://github.com/Durfey32"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-dark"
              >
                Spencer durfey: durfey32
              </a>
            </li>
            <li className="list-group-item">
              <a
                href="https://github.com/Tavinsowell"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-dark"
              >
                Tavin Sowell: Tavinsowell
              </a>
            </li>
            <li className="list-group-item">
              <a
                href="https://github.com/b3hold23"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-dark"
              >
                Angel Fernandez: b3hold23
              </a>
            </li>
            <li className="list-group-item">
              <a
                href="https://github.com/SirMac006"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-dark"
              >
                Matthew Holmes: SirMac006
              </a>
            </li>
          </ul>
          <button
            className="btn btn-outline-primary mt-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
