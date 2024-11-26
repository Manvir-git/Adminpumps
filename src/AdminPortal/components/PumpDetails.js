
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import './read.css'; // Add custom CSS file for styling

const PumpDetails = () => {
    const { pumpId } = useParams();
    const navigate = useNavigate();
    const [pump, setPump] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pumps, setPumps] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5001/api/agpumps')
            .then(response => setPumps(response.data))
            .catch(error => console.error('Error fetching agricultural pumps:', error));
    }, []);

    useEffect(() => {
        const fetchPumpDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/agpumps/${pumpId}`);
                if (!response.ok) {
                    throw new Error('Agricultural pump not found');
                }
                const data = await response.json();
                setPump(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchPumpDetails();
    }, [pumpId]);

    if (loading) return (
        <div className="loading-container">
            <div className="loading-message">Loading...</div>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div>{error}. Please go back to the <a href="/products" className="link">Products page</a></div>
        </div>
    );

    if (!pump) return (
        <div className="error-container">
            <div>Agricultural pump not found. Please go back to the <a href="/products" className="link">Products page</a></div>
        </div>
    );

    const pumpIds = pumps.map(pump => pump.id);
    const currentIndex = pumpIds.indexOf(pumpId);
    const prevPump = pumpIds[currentIndex - 1] || pumpIds[pumpIds.length - 1];
    const nextPump = pumpIds[currentIndex + 1] || pumpIds[0];

   const handleNavigation = (id) => {
    const sanitizedId = encodeURIComponent(id.trim());
    navigate(`/pumpDetails/${sanitizedId}`);
};

    return (

        <div className="body">

            <Link to={`/dashboard`}className='back-button' >&#8592;</Link>
            
            {/* Product Description */}
            <div className='upper'><h1>{pump.name}</h1></div>
            <div className="product-description">
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
                    &#8592; {/* Left Arrow */}
                </button>
                <button 
                    className="nav-btn right-btn"
                    onClick={() => handleNavigation(nextPump)}
                >
                    &#8594; {/* Right Arrow */}
                </button>
            </div>
        </div>
    );
};

export default PumpDetails;
