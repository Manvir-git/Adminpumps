import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Admin.css';
import Enquiries from './PumpInquiries';
import LogoutButton from './LogoutButton';
import Feedbacks from './Feedbacks';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const AdminPortal = () => {
  const [residentialPumps, setResidentialPumps] = useState([]);
  const [agriculturalPumps, setAgriculturalPumps] = useState([]);
  const [enquiries, setEnquiries] = useState([]);  // Add state for enquiries
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('residential');
  const [showAddForm, setShowAddForm] = useState(false);
  const [pumpType, setPumpType] = useState('residential');
  const [newPumpData, setNewPumpData] = useState({
    id: '',
    name: '',
    price: '',
    features: '',
    image: null,
    rightImage: null
  });
  const activityEvents = [
    'mousemove', 
    'keydown', 
    'scroll', 
    'click'
  ];

  useEffect(() => {
    // Track user activity
    const trackActivity = () => {
      localStorage.setItem('lastActivity', Date.now());
    };
  activityEvents.forEach(event => {
    window.addEventListener(event, trackActivity);
  });

  // Periodic token validation
  const tokenValidationInterval = setInterval(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Validate token with server
      const response = await axiosInstance.get('/admin/verify');
      
      // Check if server sent a new token
      const refreshToken = response.headers['x-refresh-token'];
      if (refreshToken) {
        localStorage.setItem('token', refreshToken);
      }
    } catch (error) {
      // Handle logout if token is invalid
      if (error.response?.data?.reason === 'inactivity') {
        alert('Session expired due to inactivity');
      }
      
      // Logout logic
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }, 5 * 60 * 1000); // Check every 5 minutes

  // Cleanup
  return () => {
    activityEvents.forEach(event => {
      window.removeEventListener(event, trackActivity);
    });
    clearInterval(tokenValidationInterval);
  };
}, []);

  // Fetch residential pumps data
  useEffect(() => {
    axios
      .get('http://localhost:5001/api/pumps')
      .then((response) => setResidentialPumps(response.data))
      .catch((error) => console.error('Error fetching residential pumps:', error));
  }, []);

  // Fetch agricultural pumps data
  useEffect(() => {
    axios
      .get('http://localhost:5001/api/agpumps')
      .then((response) => setAgriculturalPumps(response.data))
      .catch((error) => console.error('Error fetching agricultural pumps:', error));
  }, []);

  // Fetch enquiries data
  useEffect(() => {
    if (currentView === 'enquiries') {
      axios
        .get('http://localhost:5001/api/enqueries')
        .then((response) => setEnquiries(response.data))
        .catch((error) => console.error('Error fetching enqueries:', error));
    }
  }, [currentView]);


//fetch feedbacks
  useEffect(() => {
    if (currentView === 'Feedbacks') {
      axios
        .get('http://localhost:5001/api/feedbacks')
        .then((response) => setEnquiries(response.data))
        .catch((error) => console.error('Error fetching feedbacks:', error));
    }
  }, [currentView]);


  // Handle multiple image upload
  const handleMultipleImageUpload = (e) => {
    setNewPumpData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  // Handle right image upload
  const handleRightImageUpload = (e) => {
    setNewPumpData(prev => ({
      ...prev,
      rightImage: e.target.files[0]
    }));
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPumpData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle pump type change
  const handlePumpTypeChange = (e) => {
    setPumpType(e.target.value);
  };

  // Handle form submission
  const handleAddPump = async (e) => {
    e.preventDefault();
    
    if (!newPumpData.id || !newPumpData.name || !newPumpData.price) {
      setError('Please fill in all required fields');
      return;
    }
  
    const formData = new FormData();
    
    // Handle features array properly
    if (typeof newPumpData.features === 'string') {
      const featuresArray = newPumpData.features
        .split(',')
        .map(feature => feature.trim())
        .filter(feature => feature.length > 0);
      formData.append('features', JSON.stringify(featuresArray));
    } else if (Array.isArray(newPumpData.features)) {
      formData.append('features', JSON.stringify(newPumpData.features));
    } else {
      formData.append('features', JSON.stringify([]));
    }
  
    formData.append('id', newPumpData.id);
    formData.append('name', newPumpData.name);
    formData.append('price', newPumpData.price);
  
    if (newPumpData.image) {
      formData.append('image', newPumpData.image);
    }
    if (newPumpData.rightImage) {
      formData.append('rightImage', newPumpData.rightImage);
    }
  
    try {
      const endpoint = pumpType === 'residential' 
        ? 'http://localhost:5001/api/pumps' 
        : 'http://localhost:5001/api/agpumps';
  
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server responded with status ${response.status}: ${JSON.stringify(response.data)}`);
      }
  
      const newPump = response.data.pump || response.data;
  
      const processedPump = {
        ...newPump,
        image: newPump.image?.startsWith('http') 
          ? newPump.image 
          : `http://localhost:5001${newPump.image}`,
        rightImage: newPump.rightImage?.startsWith('http') 
          ? newPump.rightImage 
          : `http://localhost:5001${newPump.rightImage}`
      };
  
      if (pumpType === 'residential') {
        setResidentialPumps(prev => [...prev, processedPump]);
      } else {
        setAgriculturalPumps(prev => [...prev, processedPump]);
      }
  
      setNewPumpData({
        id: '',
        name: '',
        price: '',
        features: [],
        image: null,
        rightImage: null
      });
  
      setShowAddForm(false);
      setError(null);
      alert('Pump added successfully!');
  
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
  
      let errorMessage = 'Error adding pump. ';
      if (error.response) {
        errorMessage += error.response.data.message || 'Unknown server error';
      } else if (error.request) {
        errorMessage += 'No response from server. Please check your connection.';
      } else {
        errorMessage += error.message;
      }
      setError(errorMessage);
    }
  };

  // Handle delete pump
  const handleDeletePump = async (id, type) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this pump?');
  
    if (confirmDelete) {
      try {
        const endpoint = type === 'residential' 
          ? `http://localhost:5001/api/pumps/${id}`
          : `http://localhost:5001/api/agpumps/${id}`;
  
        await axios.delete(endpoint);
  
        if (type === 'residential') {
          setResidentialPumps(prev => prev.filter(pump => pump.id !== id));
        } else {
          setAgriculturalPumps(prev => prev.filter(pump => pump.id !== id));
        }
        
        alert('Pump deleted successfully!');
      } catch (error) {
        console.error('Error deleting pump:', error);
        setError('Error deleting pump.');
      }
    } else {
      // If user cancels, log the cancellation
      console.log('Pump deletion was canceled.');
    }
  };


  return (
    <div className="admin-portal">
      <center><h1>Admin Portal</h1></center>
      <LogoutButton/> 

      <div className="sidebar">
  
        
        <button
          className={`sidebar-btn ${currentView === 'residential' ? 'active' : ''}`}
          onClick={() => setCurrentView('residential')}
        >
          Residential Pumps
        </button>
        <button
          className={`sidebar-btn ${currentView === 'agricultural' ? 'active' : ''}`}
          onClick={() => setCurrentView('agricultural')}
        >
          Agricultural Pumps
        </button>
        <button
          className={`sidebar-btn ${currentView === 'enquiries' ? 'active' : ''}`}
          onClick={() => setCurrentView('enquiries')}
        >
          Enqueries
        </button>
        <button
          className={`sidebar-btn ${currentView === 'Feedbacks' ? 'active' : ''}`}
          onClick={() => setCurrentView('Feedbacks')}
        >
          Feedbacks
        </button>
      </div>

      <div className="gallery-container">
        <div className="add-new-pump" onClick={() => setShowAddForm(true)}>
          <span className="plus-sign">+</span>
          <p className="add-text">Add New Pump</p>
        </div>
      </div>

      {showAddForm && (
        <div className="add-pump-form">
          <h2>Add New Pump</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleAddPump}>
            <select
              name="pumpType"
              value={pumpType}
              onChange={handlePumpTypeChange}
              className="pump-type-select"
              required
            >
              <option value="residential">Residential Pump</option>
              <option value="agricultural">Agricultural Pump</option>
            </select>

            <input
              type="text"
              name="id"
              value={newPumpData.id}
              onChange={handleInputChange}
              placeholder="Pump ID"
              required
            />
            <input
              type="text"
              name="name"
              value={newPumpData.name}
              onChange={handleInputChange}
              placeholder="Pump Name"
              required
            />
            <input
              type="text"
              name="price"
              value={newPumpData.price}
              onChange={handleInputChange}
              placeholder="Pump Price"
              required
            />
            <textarea
              name="features"
              value={newPumpData.features}
              onChange={handleInputChange}
              placeholder="Features (comma-separated)"
              required
            />
            <div className="file-input-container">
              <label>Main Image:</label>
              <input 
                type="file" 
                onChange={handleMultipleImageUpload} 
                required 
              />
            </div>
            <div className="file-input-container">
              <label>Right Image:</label>
              <input 
                type="file" 
                onChange={handleRightImageUpload} 
                required 
              />
            </div>
            <div className="form-buttons">
              <button type="submit">Add Pump</button>
              <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
<div className='data'>


        {currentView === 'enquiries' && (
          <>
            <Enquiries/> 
            {/* {enquiries.map((enquiry, index) => (
  <div key={index} className="enquiry">
    <h3>Name: {enquiry.title}</h3>
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
  </div>
))} */}

          </>
        )}
        
        
        {currentView === 'Feedbacks' && (
          <Feedbacks/>
        )}

       

    {/* Pump Gallery */}


    {currentView === 'residential' && (
<div className='headings'> 
  <div className='head'>
  <h2>Residential Pumps</h2>
  </div>
  <div className="pump-section">


      {residentialPumps.length > 0 ? (
        residentialPumps.map((pump) => (
          <div key={pump.id} className="pump-item animate-on-scroll">
            <img src={`http://localhost:5001/uploads/${pump.image}`} alt={pump.name} className="pump-image" />
            <div className="pump-info">
              <p className="pump-name">{pump.name}</p>
              <p className="pump-price">{pump.price}</p>
              <Link to={`/pumpDetail/${pump.id}`} className="read-more-btn">
                Read more
              </Link>
              <button 
                className="delete-btn" 
                onClick={() => handleDeletePump(pump.id, 'residential')}
              >
                Delete
              </button>
            </div>
          </div>
            
        ))
      ) : (
        <p className="loading-message">Loading Residential Pumps...</p>
      )}
          </div>
          </div>
        )}




{currentView === 'agricultural' && (
 <div className='headings'> 
 <div className='head1'>
 <h2>Agricultural Pumps</h2>
 </div>
  <div className="pump-section">
   

      {agriculturalPumps.length > 0 ? (
        agriculturalPumps.map((pump) => (
          <div key={pump.id} className="pump-item animate-on-scroll">
            <img src={`http://localhost:5001/uploads/${pump.image}`} alt={pump.name} className="pump-image" />
            <div className="pump-info">
              <p className="pump-name">{pump.name}</p>
              <p className="pump-price">{pump.price}</p>
              <Link to={`/pumpDetail/${pump.id}`} className="read-more-btn">
                Read more
              </Link>
              <button 
                className="delete-btn" 
                onClick={() => handleDeletePump(pump.id, 'agricultural')}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="loading-message">Loading Agricultural Pumps...</p>
      )}
    </div>
    </div>
)}



    </div>
  </div>

  );
};

export default AdminPortal;
