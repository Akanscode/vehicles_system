'use client';
import React from 'react';
//import VehicleOwnersTable from './components/VehicleOwnersTable';
import EmployeeManagementTable from './components/EmployeeManagement';
import UserTable from './components/UserTable';


const AdminDashboard = () => {
 
 

  return (
   <div>
    <UserTable/>
    <EmployeeManagementTable/>
   </div>
  );
};

export default AdminDashboard;
