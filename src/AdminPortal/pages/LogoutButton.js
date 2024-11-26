import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logoutbutton.css'

const LogoutButton = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleLogout = () => {
    // Remove token and user info from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="logout-container">
      <button onClick={() => setShowPopup(true)} className="logout-button">
        Logout
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p className="popup-message">Are you sure you want to log out?</p>
            <div className="popup-actions">
              <button onClick={handleLogout} className="confirm-button">
                Yes
              </button>
              <button onClick={() => setShowPopup(false)} className="cancel-button">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoutButton;
