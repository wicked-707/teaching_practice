// src/components/UniversityPortal.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UniversityPortal = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="w-full bg-blue-800 text-white p-4 flex  items-center justify-between">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          <h1 className="ml-4 text-2xl font-bold">TPConnect</h1>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Profile</button>
      </nav>
      <div className='flex flex-row'>
        {/* Sidebar */}
        <aside className="w-64 bg-blue-200 p-4">
            <ul>
            <li className="mb-2">
                <Link to="/hodportal" className="text-blue-700 hover:underline">HOD Page</Link>
            </li>
            <li className="mb-2">
                <Link to="/supervisorportal" className="text-blue-700 hover:underline">Supervisors Page</Link>
            </li>
            <li className="mb-2">
                <Link to="/" className="text-blue-700 hover:underline">Manage Account</Link>
            </li>
            </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
            <header className="mb-4">
            <h2 className="text-3xl font-bold">Welcome to the University Portal</h2>
            <p className="text-lg mt-2">Explore and manage university details, departments, and more.</p>
            </header>
            
            {/* School Details and Departments */}
            <section className="bg-white p-4 rounded shadow-md">
            <h3 className="text-2xl font-semibold mb-2">School Details</h3>
            <p><strong>School Name:</strong> University of Eastern Africa, Baraton</p>
            <p><strong>Location:</strong> Kenya</p>
            <p><strong>Contact:</strong> +254 700 000 000</p>
            </section>

            <section className="bg-white p-4 rounded shadow-md mt-4">
            <h3 className="text-2xl font-semibold mb-2">Departments</h3>
            <ul>
                <li>Department of Mathematics</li>
                <li>Department of Science</li>
                <li>Department of Arts</li>
                {/* Add more departments as needed */}
            </ul>
            </section>
        </main>
      </div>
    </div>
  );
};

export default UniversityPortal;
