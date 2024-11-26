
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import './read.css'; 
import axios from 'axios';

const PumpDetail = () => {
    const { pumpId } = useParams(); // Extract pumpId from URL
    const navigate = useNavigate();

    const [pump, setPump] = useState(null); // State to hold current pump details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [pumps, setPumps] = useState([]); // State to store the list of pumps

    // Fetch the list of all pumps only once when the component mounts
    useEffect(() => {
        axios.get('http://localhost:5001/api/pumps')
            .then(response => setPumps(response.data)) // Store the fetched pumps in state
            .catch(error => console.error('Error fetching pumps:', error));
    }, []); // Empty dependency array ensures this runs only once

    // Fetch pump details based on the pumpId
    const fetchPumpDetails = useCallback(async () => {
        try {
            setLoading(true); // Set loading to true when fetching data

            // Fetch the current pump details
            const response = await fetch(`http://localhost:5001/api/pumps/${pumpId}`);
            if (!response.ok) {
                throw new Error('Pump not found');
            }

            const data = await response.json();
            setPump(data); // Set the fetched pump data
            setError(null); // Reset any previous errors
        } catch (err) {
            setError(err.message); // Set error if fetch fails
        } finally {
            setLoading(false); // Stop loading after data is fetched or error occurs
        }
    }, [pumpId]); // Dependency ensures this function updates when pumpId changes

    // Call fetchPumpDetails when pumpId changes
    useEffect(() => {
        fetchPumpDetails();
    }, [fetchPumpDetails]);

    // Create an array of pump IDs in the order they appear
    const pumpIds = pumps.map(pump => pump.id);

    // Find the index of the current pump
    const currentIndex = pumpIds.indexOf(pumpId);

    // Handle navigation to the previous or next pump
    const handleNavigation = useCallback(
        (id) => {
            const sanitizedId = encodeURIComponent(id.trim());
            navigate(`/pumpDetail/${sanitizedId}`);
        },
        [navigate]
    );

    // Get the previous and next pump IDs
    const prevPump = pumpIds[currentIndex - 1] || pumpIds[pumpIds.length - 1]; // Wrap around to the last pump
    const nextPump = pumpIds[currentIndex + 1] || pumpIds[0]; // Wrap around to the first pump

    // Conditional rendering for loading and error
    if (loading) {
        return <div>Loading...</div>; // Show loading message
    }

    if (error) {
        return <div>{error}. Please go back to the <a href="/home">Home page</a>.</div>; // Show error message
    }

    if (!pump) {
        return <div>Pump not found. Please go back to the <a href="/home">Home page</a>.</div>; // Fallback if no pump data
    }

    return (
        <div className="body">
              <Link to={`/dashboard`}className='back-button' >&#8592;</Link>
            {/* Product Description */}
            <div className='upper'>
            <h1>{pump.name}</h1>
            </div>
            <div className="product-description">
                {/* Ensure image URL is correct */}
                <img 
                    src={`http://localhost:5001/uploads/${pump.image}`} 
                    className="product-image" 
                    alt={pump.name} 
                />
                <div>
                    <h2><strong>MRP:</strong> {pump.price} (Inclusive of all taxes)</h2>

                    <div className="features">
                        <h2>Features</h2>
                        <ul>
                            {Array.isArray(pump.features) && pump.features.length > 0 ? (
                                pump.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))
                            ) : (
                                <li>No features available.</li>
                            )}
                        </ul>
                    </div>

                    <Link to={`/Enquiry`} className="buy-button">Send Enquiry</Link>
                           
                    
                </div>
            </div>

            {/* Image for right view of the pump */}
            <div className="chart">
                <img 
                    src={`http://localhost:5001/uploads/${pump.rightImage}`} 
                    alt="Right view of pump" 
                />
            </div>

            {/* Navigation Buttons */}
            <div className="navigation-buttons">
                <button 
                    className="nav-btn left-btn"
                    onClick={() => handleNavigation(prevPump)}
                >
                    &#8592; {/* Left Arrow (back) */}
                </button>
                <button 
                    className="nav-btn right-btn"
                    onClick={() => handleNavigation(nextPump)}
                >
                    &#8594; {/* Right Arrow (forward) */}
                </button>
            </div>
        </div>
    );
};

export default PumpDetail;
