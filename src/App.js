// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { AdminAuthProvider } from './AdminPortal/components/Auth';
// import AdminDashboard from './AdminPortal/pages/AdminDashboard';
// import ProtectedRoute from './AdminPortal/pages/ProtectedRoute';
// import AuthForm from './AdminPortal/components/AuthForm';
// import PumpDetail from './AdminPortal/pages/PumpDetail';
// import PumpDetails from './AdminPortal/pages/PumpDetails';
// import './AdminPortal/components/AdminAuth.css';



// const App = () => {
//   return (
//     <AdminAuthProvider>
//       <Routes>

//         <Route path="/" element={<AuthForm />} />
//         <Route
//           path="/admin-dashboard"
//           element={<ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>}
//             />

          //  < Route path= "pumpDetail/:pumpId" element= {<PumpDetail /> } />
          //  < Route path= "pumpDetails/:pumpId" element= {<PumpDetails /> } />
  
//       </Routes>
//     </AdminAuthProvider>
//   );
// };
// export default App;




// // import React from 'react';
// // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // import Login from './component/Login';
// // import Admin from './component/Admin';
// // import PrivateRoute from './component/PrivateRoute';

// // function App() {
// //   return (

// //       <Routes>
// //         <Route path="/login" element={<Login />} />
// //         {/* <Route path="/pumpDetail" element={<PumpDetail />} />
// //         <Route path="/pumpDetails" element={<PumpDetails />} /> */}
// //         <Route path="/admin" element={<Admin />} />
// //       </Routes>

// //   );
// // }

// // export default App;




// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AdminAuth from './component/AdminAuth';
// import AdminDashboard from './component/AdminDashboard'; // Placeholder for now

// function App() {
//   return (

//       <Routes>
//         <Route path="/" element={<AdminAuth />} />
//         <Route path="/admin/dashboard" element={<AdminDashboard />} />
//       </Routes>

//   );
// }

// export default App;



import React from 'react';
//import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './AdminPortal/components/Auth';
// import ProtectedRoute from './AdminPortal/components/ProtectedRoute';
// import AdminAuth from './AdminPortal/components/AdminAuth';
import { BrowserRouter as  Routes, Route } from 'react-router-dom';
import Login from './AdminPortal/pages/LoginPage';
import PumpDetail from './AdminPortal/components/PumpDetail';
import PumpDetails from './AdminPortal/components/PumpDetails';
import Dashboard from './AdminPortal/pages/AdminDashboard';
import PrivateRoute from './AdminPortal/components/PrivateRoute'; // We'll create this next

function App() {
  return (

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
          < Route path= "pumpDetail/:pumpId" element= {<PumpDetail /> } />
          < Route path= "pumpDetails/:pumpId" element= {<PumpDetails /> } />
      </Routes>

  );
}
export default App;