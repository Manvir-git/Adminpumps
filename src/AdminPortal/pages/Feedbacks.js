import React, { useEffect, useState } from "react";
import axios from "axios";

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState(null);
  const [readStatus, setReadStatus] = useState(() => {
    const savedStatus = localStorage.getItem("readStatus");
    return savedStatus ? JSON.parse(savedStatus) : {};
  });

  // Fetch feedbacks
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/feedbacks")
      .then((response) => {
        setFeedback(response.data);
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
        setError("Error fetching feedbacks.");
      });
  }, []);

  // Toggle the read/unread status of feedback
  const toggleReadStatus = (id) => {
    const updatedStatus = { ...readStatus, [id]: !readStatus[id] };
    setReadStatus(updatedStatus);
    localStorage.setItem("readStatus", JSON.stringify(updatedStatus));
  };

  // Handle feedback deletion
  const handleDeleteFeedback = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this feedback?');
    
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5001/api/feedbacks/${id}`);
        setFeedback((prev) => prev.filter((item) => item._id !== id));
        alert('Feedback deleted successfully!');
      } catch (error) {
        console.error('Error deleting feedback:', error);
        setError('Error deleting feedback.');
      }
    } else {
      console.log('Feedback deletion was canceled.');
    }
  };

  // Inline styles for layout and responsiveness
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
      <h2>Feedback</h2>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Show error message if there's an error */}
      
      {feedback.length > 0 ? (
        feedback.map((item) => (
          <div key={item._id} style={styles.card}>
            <h3>{item.name}</h3>
            <p>Email: {item.email}</p>
            <p>Message: {item.message}</p>
            <div style={styles.checkboxContainer}>
              <label>
                Mark as Read:
                <input
                  type="checkbox"
                  checked={readStatus[item._id] || false}
                  onChange={() => toggleReadStatus(item._id)}
                />
              </label>
            </div>
            <button
              style={styles.deleteButton}
              onClick={() => handleDeleteFeedback(item._id)}
            >
              Delete Feedback
            </button>
          </div>
        ))
      ) : (
        <p>No feedbacks found.</p>
      )}
    </div>
  );
};

export default Feedback;
