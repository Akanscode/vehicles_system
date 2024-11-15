'use client';
import { useEffect, useState } from 'react';

const ServiceHistory = () => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const response = await fetch('/api/bookings/fetchServiceHistory');
    const data = await response.json();
    setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Service History</h2>
      {history.map(service => (
        <div key={service.id}>
          <p>Service Type: {service.serviceType}</p>
          <p>Date: {service.date}</p>
          <p>Status: {service.status}</p>
        </div>
      ))}
    </div>
  );
};

export default ServiceHistory;
