import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const LoginChoice = () => {
const navigate = useNavigate();
    const goToSchool = () => {
    navigate('/highschoolsignin');
  }; 

    const goToUni = () => {
    navigate('/unisignin');
  }; 

    const goToStudent = () => {
    navigate('/signin');
  }; 
  return (
    <div className="min-h-screen bg-slate-100 text-slate-500 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-slate-700">Who Will You Be Today?</h1>
      <h2 className="text-xl mb-8 max-w-2xl text-center">
        Embark on your educational journey by selecting your role. Whether you're shaping minds, 
        representing institutions, or eager to learn, your adventure begins with a single click.
      </h2>
      
      <img 
        src="https://maxst.icons8.com/vue-static/threedio/errors/not-found.png" 
        alt="Educational roles illustration" 
        className="w-64 h-64 object-cover mb-8"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button onClick={goToStudent} className="bg-slate-900 text-orange-500 px-6 py-3 rounded-lg hover:bg-slate-800 transition duration-300">
          Student / Teacher
        </button>
        <button onClick={goToUni} className="bg-slate-900 text-orange-500 px-6 py-3 rounded-lg hover:bg-slate-800 transition duration-300">
          University Representative
        </button>
        <button onClick={goToSchool} className="bg-slate-900 text-orange-500 px-6 py-3 rounded-lg hover:bg-slate-800 transition duration-300">
          High School
        </button>
      </div>
      
      <Link to="/" className="mt-12 bg-slate-900 text-orange-500 px-6 py-3 rounded-lg hover:bg-slate-800 transition duration-300">
        Go Back Home
      </Link>
    </div>
  );
};

export default LoginChoice;