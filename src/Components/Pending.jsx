import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../assets/logo1.jpeg';

const Pending = () => {

  const navigate = useNavigate();

  const goHome = () => {
  navigate('/');
  };
  return (
    <section className='flex flex-col bg-slate-100 h-full md:h-screen items-center'>
        <nav className='h-16 pl-5 shadow-xl border-b border-slate-200 bg-slate-100 flex w-screen mb-10 items-center md:items-center lg:h-20 md:h-40 md:pl-10 md:shadow-md'>
            <img className='w-14 h-14 rounded-full md:mr-5 shadow-lg' src={logo1} alt="" />
            <h1 className='md:text-3xl text-xl font-bold md:font-bold text-slate-800'>TPConnect</h1>
        </nav>
        <div className='bg-slate-100 w-screen flex flex-col  md:mt-6 lg items-center justify-center'>
            <img className='md:w-60 md:h-60  w-36 h-36' src="https://threedio-cdn.icons8.com/nsKkqE2-5fcCnDxohYF0_HmQ7x_AXxPKi3ZAr8He7bw/rs:fit:1024:1024/czM6Ly90aHJlZWRp/by1wcm9kL3ByZXZp/ZXdzLzM0NC8xMmM5/M2Q0Zi05YjI0LTQ1/NjktOGU1Mi0yNThh/OTkwZjNiM2UucG5n.png" alt="" />
        <h1 className='text-xl md:text-3xl font-bold text-slate-800 '>Welcome To Our Community!</h1>
        <p className='text-md md:text-lg font-medium text-slate-600 mb-6 md:mb-3'>Thank you for requesting to be part of our vast community.</p>
            
        <div className='text-sm md:text-base border border-slate-300 rounded-2xl py-3 md:py-5 px-1 mx-3 md:px-3 mb-14 md:mb-0 text-center'>
            <p>Your account is currently pending approval.</p>
            <p >An administrator will review your application and approve your account soon.</p>
            <p>You'll receive an email notification once your account has been approved.</p>
            <button onClick={goHome} className='px-5 py-2 bg-slate-950 rounded-full text-slate-200 mt-4 md:mt-5 shadow-lg hover:translate-y-1 transition ease-in-out'>Go Back Home</button>
        </div>
        </div>
    </section>
  );
};

export default Pending;