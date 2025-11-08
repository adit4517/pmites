import React from 'react';

const ProfesiFilter = ({ filterValues, onFilterChange, onApplyFilter }) => {
  const { startDate, endDate } = filterValues;

  return (
    <div className="filter-container">
      <label htmlFor="startDateProfesi">Dari Tanggal:</label>
      <input
        type="date"
        id="startDateProfesi"
        name="startDate"
        value={startDate}
        onChange={onFilterChange}
        className="filter-input"
      />
      <label htmlFor="endDateProfesi">Sampai Tanggal:</label>
      <input
        type="date"
        id="endDateProfesi"
        name="endDate"
        value={endDate}
        onChange={onFilterChange}
        className="filter-input"
      />
      <button onClick={onApplyFilter} className="filter-button">
        Filter Profesi
      </button>
    </div>
  );
};

export default ProfesiFilter;