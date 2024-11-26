import React, { useEffect, useState } from "react";
import axios from "axios";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [error, setError] = useState(null);
  const [readStatus, setReadStatus] = useState(() => {
    const savedStatus = localStorage.getItem("readStatus");
    return savedStatus ? JSON.parse(savedStatus) : {};
  });

  useEffect(() => {
    axios
      .get("https://pumpsbackend.onrender.com/api/enqueries")
      .then((response) => {
        setEnquiries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching enqueries:", error);
        setError("Error fetching enqueries.");
      });
  }, []);

  // Toggle read/unread status for each enquiry
  const toggleReadStatus = (id) => {
    const updatedStatus = { ...readStatus, [id]: !readStatus[id] };
    setReadStatus(updatedStatus);
    localStorage.setItem("readStatus", JSON.stringify(updatedStatus));
  };

  const handleDeleteEnquiry = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this enquiry?');
    
    if (confirmDelete) {
      try {
        await axios.delete(`https://pumpsbackend.onrender.com/api/enqueries/${id}`);
        setEnquiries(prev => prev.filter(enquiry => enquiry._id !== id));
        alert('Enquiry deleted successfully!');
      } catch (error) {
        console.error('Error deleting enquiry:', error);
        setError('Error deleting enquiry.');
      }
    } else {
      console.log('Enquiry deletion was canceled.');
    }
  };

  const styles = {
    container: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "20px",
      padding: "20px",
      backgroundColor: "#f5f5f5",
    },
    card: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      textAlign: "left",
    },
    checkboxContainer: {
      marginTop: "10px",
    },
    deleteButton: {
      backgroundColor: "#ff4d4d",
      color: "#fff",
      border: "none",
      padding: "5px 10px",
      cursor: "pointer",
      marginLeft: "10px",
      borderRadius: "4px",
    },
    error: {
      color: "red",
      fontSize: "16px",
      marginBottom: "20px",
    },
    // Media queries for responsiveness
    "@media (max-width: 1024px)": {
      container: {
        gridTemplateColumns: "repeat(2, 1fr)",
      },
    },
    "@media (max-width: 600px)": {
      container: {
        gridTemplateColumns: "1fr",
      },
    },
  };

  return (
    <div style={styles.container}>
      
      {error && <p style={styles.error}>{error}</p>} {/* Display error message if there is any */}

      {enquiries.length > 0 ? (
        enquiries.map((enquiry) => (
          <div key={enquiry._id} style={styles.card} className="enquiry">
            <h3>{enquiry.title}</h3>
            <p>Email: {enquiry.email}</p>
            <p>Mobile: {enquiry.mobile}</p>
            <p>City: {enquiry.city}</p>
            <p>Pincode: {enquiry.pincode}</p>
            <p>Country: {enquiry.country}</p>
            <p>Product Code: {enquiry.productCode}</p>
            <p>Product Name: {enquiry.productName}</p>
            <p>Company: {enquiry.company}</p>
            <p>State: {enquiry.state}</p>
            <p>Landline: {enquiry.landline}</p>
            <p>Description: {enquiry.description}</p>

            {/* Checkbox to mark as read/unread */}
            <div style={styles.checkboxContainer}>
              <label>
                Mark as Read:
                <input
                  type="checkbox"
                  checked={readStatus[enquiry._id] || false}
                  onChange={() => toggleReadStatus(enquiry._id)}
                />
              </label>
            </div>

            {/* Button to delete enquiry */}
            <button
              style={styles.deleteButton}
              onClick={() => handleDeleteEnquiry(enquiry._id)}
            >
              Delete Enquiry
            </button>
          </div>
        ))
      ) : (
        <p>No enquiries found.</p>
      )}
    </div>
  );
};

export default Enquiries;
