'use client';
import { useEffect, useState, useCallback } from "react";

const ServiceHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/fetchServiceHistory?userId=${userId}`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Fetch service history error:", error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchHistory();
  }, [fetchHistory, userId]);

  if (isLoading) return <p>Loading service history...</p>;

  return (
    <div>
      <h2>Service History</h2>
      {history.length === 0 ? (
        <p>No service history found.</p>
      ) : (
        history.map((service) => (
          <div key={service.id}>
            <p>Service Type: {service.serviceType}</p>
            <p>Date: {service.date}</p>
            <p>Status: {service.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ServiceHistory;
