import React, { useState } from 'react';
import axios from 'axios';

const SidebarSearch = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    primarySubject: '',
    schoolName: '',
    county: '',
    subCounty: '',
    schoolType: '',
    schoolLevel: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const queryParams = Object.entries(formData)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    try {
      const response = await axios.get(`/api/vacancies?${queryParams}`);
      onSearch(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className="w-full md:w-1/4 bg-slate-100 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Search Vacancies</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Form fields */}
        <div>
          <label htmlFor="primarySubject" className="block text-sm font-medium text-gray-700">Primary Subject</label>
          <select
            id="primarySubject"
            name="primarySubject"
            value={formData.primarySubject}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Subjects</option>
            <option>Mathematics</option>
            <option>English</option>
            <option>Science</option>
          </select>
        </div>
        <div>
          <label htmlFor="county" className="block text-sm font-medium text-gray-700">County</label>
          <select
            id="county"
            name="county"
            value={formData.county}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Counties</option>
            <option>Nairobi</option>
            <option>Mombasa</option>
            <option>Kisumu</option>
            {/* Add more counties as needed */}
          </select>
        </div>
        
        <div>
          <label htmlFor="subCounty" className="block text-sm font-medium text-gray-700">Sub-County</label>
          <select
            id="subCounty"
            name="subCounty"
            value={formData.subCounty}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Sub-Counties</option>
            {/* Add sub-counties based on selected county */}
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SidebarSearch;