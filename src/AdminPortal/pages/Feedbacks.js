import React, { useEffect, useState } from "react";
import axios from "axios";

const Feedback = () => {
  const [Feedback, setFeedback] = useState([]);
  const [error, setError] = useState(null);
  const [readStatus, setReadStatus] = useState(() => {
    const savedStatus = localStorage.getItem("readStatus");
    return savedStatus ? JSON.parse(savedStatus) : {};
  });

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/feedbacks")
      .then((response) => {
        setFeedback(response.data);
      })
      .catch((error) => console.error("Error fetching feedbacks:", error));
  }, []);

  const toggleReadStatus = (id) => {
    const updatedStatus = { ...readStatus, [id]: !readStatus[id] };
    setReadStatus(updatedStatus);
    localStorage.setItem("readStatus", JSON.stringify(updatedStatus));
  };

  const handleDeleteFeedback = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this feedback?');
    
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5001/api/feedbacks/${id}`);
        setFeedback(prev => prev.filter(Feedback => Feedback._id !== id));
        alert('Feedback deleted successfully!');
      } catch (error) {
        console.error('Error deleting Feedback:', error);
        setError('Error deleting Feedback.');
      }
    } else {
      console.log('Feedback deletion was canceled.');
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
       <>
            <h2>Feedback</h2>
            {Feedback.length > 0 ? (
              Feedback.map((Feedback) => (
                <div key={Feedback._id} className="Feedback">
                  <h3>{Feedback.name}</h3>
                  <p>Email: {Feedback.email}</p>
                  <p>Message: {Feedback.message}</p>
                  
                  
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteFeedback(Feedback._id)}
                  >
                    Delete Feedback
                  </button>
                </div>
              ))
            ) : (
              <p>No feedbacks found.</p>
            )}
          </>
    </div>
  );
};

export default Feedback;
