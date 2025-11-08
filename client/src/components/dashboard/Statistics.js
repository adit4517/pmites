import React from 'react';

const StatisticsCard = ({ title, value, unit = '', isLoading, children }) => {
  if (isLoading) {
    return (
      <div className="dashboard-card">
        <h3>{title}</h3>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      {children ? (
         children
      ) : (
        <p style={{ fontSize: '2em', fontWeight: 'bold' }}>
          {value !== null && value !== undefined ? value : 'N/A'} {unit}
        </p>
      )}
    </div>
  );
};

export default StatisticsCard;