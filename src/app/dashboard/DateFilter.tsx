import React, { useState } from "react";

interface DateFilterProps {
  onApply: (from: string, to: string) => void;
  onReset: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ onApply, onReset }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleApply = () => {
    onApply(fromDate, toDate);
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    onReset();
  };

  return (
    <div className="flex flex-row items-center gap-4 mb-6">
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          From Date
        </label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          To Date
        </label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
      <button
        onClick={handleApply}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        disabled={!fromDate || !toDate}
      >
        Apply
      </button>
      <button
        onClick={handleReset}
        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer mt-6"
      >
        Reset
      </button>
    </div>
  );
};

export default DateFilter;
