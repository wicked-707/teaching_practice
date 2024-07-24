// src/components/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import logo1 from '../assets/logo1.jpeg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';


const Home = () => {
  const [message, setMessage]= useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigate = useNavigate();

  const goToLoginChoice = () => {
    navigate('/loginchoice');
  };

   

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
        console.log('Form Data:', formData); 

    try {
      const response = await axios.post('http://localhost:5000/messages', formData, 
        {
          headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
        }
      );
      console.log(response.data)
      if (response.status === 200 ){
        setMessage('Message sent successfully!');
      }// Reset form fields
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setError('Error sending message. Please try again.');
    }
  };

  return (
    <section className='flex flex-col items-center justify-center '>

      {/* Navbar */}
      <div className='relative'>
      <div className='flex flex-row items-center justify-between w-screen h-20 bg-slate-100 right-0 px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-row md:ml-16 lg:ml-40 items-center'>
          <img className='w-14 h-14 rounded-full md:mr-5 shadow-lg' src={logo1} alt="" />
          <h1 className='md:text-lg font-bold text-slate-700'>TPConnect</h1>
        </div>
        <ul className="hidden md:flex md:flex-row list-none text-slate-700 lg:mr-40 md:mr-20 font-medium font-serif text-base justify-between">
          <li>
            <Link to="/" className="md:mr-5 lg:mr-10 hover:text-orange-500 transition duration-300">Home</Link>
          </li>
          <li>
            <Link to="/about" className="md:mr-5 lg:mr-10 hover:text-orange-500 transition duration-300">About</Link>
          </li>
          <li>
            <Link to="/services" className="md:mr-5 lg:mr-10 hover:text-orange-500 transition duration-300">Services</Link>
          </li>
          <li>
            <Link to="/contact" className="md:mr-5 lg:mr-10 hover:text-orange-500 transition duration-300">Contact</Link>
          </li>
        </ul>
        <Link to="/universityportal">
             <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                University
              </button>
            </Link>
        <Link to="/adminportal">
             <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Admin
              </button>
            </Link>
        <button 
          className="md:hidden text-slate-700 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full md:hidden z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800 shadow-lg">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-white hover:bg-slate-700 hover:text-orange-500 transition duration-300">Home</Link>
            <Link to="/about" className="block px-3 py-2 text-base font-medium text-white hover:bg-slate-700 hover:text-orange-500 transition duration-300">About</Link>
            <Link to="/services" className="block px-3 py-2 text-base font-medium text-white hover:bg-slate-700 hover:text-orange-500 transition duration-300">Services</Link>
            <Link to="/contact" className="block px-3 py-2 text-base font-medium text-white hover:bg-slate-700 hover:text-orange-500 transition duration-300">Contact</Link>
          </div>
        </div>
      )}
    </div>

      {/* hero section */}
      <div className="bg-slate-100 w-screen lg:h-96 lg:mb-24">
        <div className="flex flex-row md:flex-row items-center bg-slate-100">
          <div className="md:w-1/2 lg:ml-20">
            <p className=' md:text-3xl text-slate-800 md:font-bold'>Welcome To</p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-slate-800">
              TPConnect
            </h1>
            <p className="text-lg md:text-base text-slate-990 mb-10">
              At TP Connect, we streamline the teaching practice application and assessment process, 
              making it seamless and efficient. Whether you're a student-teacher eager to gain real-world experience 
              or a high school looking to nurture the next generation of educators, our platform bridges the gap 
              with ease and precision.            </p>
            <button onClick={goToLoginChoice} className="px-6 rounded-full bg-slate-900 py-2 text-lg font-medium text-orange-500">Get Started</button>

          </div>
          <div className="md:w-1/2">
            <img 
              src="https://photo-cdn2.icons8.com/tOuJUcTY-MxtpXdQ6f4A7nNRCCzXFDIZ4OdvZgCI0jk/rs:fit:288:336/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5h/c3NldHMvYXNzZXRz/L2VkaXRvci9tb2Rl/bC83ODMvMmZhOGYw/OTAtZTY0YS00ZWEw/LTk0ZjQtMTc3NjNj/YTJmN2IwLnBuZw.webp"
              alt="Teaching practice illustration"
              className="lg:mt-8 lg:w-96 lg:ml-32"
            />
          </div>
        </div>
      </div>
    
      {/* Services section */}
      <div className="lg:mt-10 flex flex-col items-center">
      <div className='flex flex-col items-center text-center mb-8'>
        <h2 className='text-3xl font-bold font-serif text-slate-950'>Our Services</h2>
        <p className='text-base mx-8 mt-4 text-slate-900 font-normal md:mx-40'>
          TPConnect offers solutions for managing and streamlining the teaching practice application and assessment process. 
          High schools can easily upload vacancies, and students can browse and apply for these opportunities.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        <div className="flex flex-col items-center text-center text-sm">
          <Link to="/streamlined-application-process" className='bg-slate-200 shadow-xl rounded-2xl p-6 w-full flex items-center flex-col transition transform hover:scale-105'>
            <img src="https://img.icons8.com/?size=48&id=108300&format=png" alt="Streamlined Application Process" className="w-14 h-14 shadow-md" />
            <h3 className='text-md font-bold text-slate-800 mt-3 mb-4'>Streamlined Application Process</h3>
            <p>
              Our platform allows easy application of teaching practice applications, ensuring you stay organized and up-to-date.
            </p>
          </Link>
        </div>
        <div className="flex flex-col items-center text-center text-sm">
          <Link to="/comprehensive-vacancy-listings" className='bg-slate-200 shadow-xl rounded-2xl p-6 w-full flex items-center flex-col transition transform hover:scale-105'>
            <img src="https://img.icons8.com/?size=80&id=0JF1WhA0SvTr&format=png" alt="Comprehensive Vacancy Listings" className="w-14 h-14 shadow-md" />
            <h3 className='text-md font-bold text-slate-800 mt-3 mb-4'>Comprehensive Vacancy Listings</h3>
            <p>
              Browse through teaching practice vacancies. Find the perfect opportunity that matches your specialization and career goals.
            </p>
          </Link>
        </div>
        <div className="flex flex-col items-center text-center text-sm">
          <Link to="/detailed-performance-assessment" className='bg-slate-200 shadow-xl rounded-2xl p-6 w-full flex items-center flex-col transition transform hover:scale-105'>
            <img src="https://img.icons8.com/?size=48&id=GFq5ySbMSvtS&format=png" alt="Assessment Materials Submission" className="w-14 h-14 shadow-md" />
            <h3 className='text-md font-bold text-slate-800 mt-3 mb-4'>Assessment Materials Submission</h3>
            <p>
              Submit assessment materials to your supervisors. Our platform ensures you gain valuable insights to improve your teaching skills.
            </p>
          </Link>
        </div>
        <div className="flex flex-col items-center text-center text-sm">
          <Link to="/efficient-communication-tools" className='bg-slate-200 shadow-xl rounded-2xl p-6 w-full flex items-center flex-col transition transform hover:scale-105'>
            <img src="https://img.icons8.com/?size=80&id=QN6Lw5eIm0fG&format=png" alt="Vacancy Uploading" className="w-14 h-14 shadow-md" />
            <h3 className='text-md font-bold text-slate-800 mt-3 mb-4'>Vacancy Uploading</h3>
            <p>
              Empower your institution by posting teaching practice vacancies through our platform, connecting you with aspiring student-teachers.
            </p>
          </Link>
        </div>
        <div className="flex flex-col items-center text-center text-sm">
          <Link to="/secure-data-management" className='bg-slate-200 shadow-xl rounded-2xl p-6 w-full flex items-center flex-col transition transform hover:scale-105'>
            <img src="https://img.icons8.com/?size=60&id=GuPOZ2vPgV9a&format=png" alt="Secure Data Management" className="w-14 h-14 shadow-md" />
            <h3 className='text-md font-bold text-slate-800 mt-3 mb-4'>Secure Data Management</h3>
            <p>
              Trust in our secure data management practices to keep your information safe. Your privacy is our top priority.
            </p>
          </Link>
        </div>
        <div className="flex flex-col items-center text-center text-sm">
          <Link to="/secure-data-management" className='bg-slate-200 shadow-xl rounded-2xl p-6 w-full flex items-center flex-col transition transform hover:scale-105'>
            <img src="https://img.icons8.com/?size=64&id=pV0pl5QK5Pjq&format=png" alt="Secure Data Management" className="w-14 h-14 shadow-md" />
            <h3 className='text-md font-bold text-slate-800 mt-3 mb-4'>Secure Data Management</h3>
            <p>
              Trust in our secure data management practices to keep your information safe. Your privacy is our top priority.
            </p>
          </Link>
        </div>
      </div>
    </div>

    {/* about Us */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-10 p-8 bg-gray-100">
      <div className="md:w-1/2 p-4">
        <img 
          src="https://photo-cdn2.icons8.com/sI5-YblaG34FydHGxiLglz0eakjhiI0Ac6BxltV7Acw/rs:fit:288:204/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5h/c3NldHMvYXNzZXRz/L2VkaXRvci9tb2Rl/bC8zMjEvNTMwZDVi/MGYtNDEwYi00ZDcw/LTk3ZmUtZTZjNzAw/YzM5MDE3LnBuZw.webp" 
          alt="About Us" 
          className="w-full h-auto " 
        />
      </div>
      <div className="md:w-1/2 p-4">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="mb-4">
          Welcome to TPConnect! Our mission is to simplify the teaching practice application and assessment process for Kenyan universities. We provide a streamlined platform for students, HODs, supervisors, and high schools to manage and coordinate teaching practice opportunities effectively.
        </p>
        <button className="bg-slate-900 text-orange-500 px-5 py-2 rounded-full shadow hover:bg-slate-700">
          Learn More
        </button>
      </div>
    </div>

     {/* contact form */}
   <div className="lg:mt-10 lg:mb-8 flex flex-col lg:flex-row items-center justify-between w-screen">
      <div className='flex flex-col items-center text-center mb-8 lg:ml-16'>
        <h2 className='text-3xl font-bold font-serif text-slate-950'>Contact Us</h2>
        <p className='text-base mt-4 text-slate-900 font-normal '>
          Have a question or feedback? Fill out the form, and we'll get back to you soon.
        </p>
        <img src="https://img.icons8.com/?size=80&id=64004&format=png" alt="" className='h-40 w-40'/>
      </div>
      <div className="max-w-md w-1/2 space-y-6 p-8 rounded-xl lg:flex-1 lg:mr-16 lg:ml-16">
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
          <div >
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              autoComplete="name"
              onChange={handleChange}
              required
              className="appearance-none rounded-lg relative w-52 px-3 pt-2 pb-1 border-l border-b border-slate-300 placeholder-slate-600 text-gray-900 focus:outline-none focus:border-slate-600 focus:z-10 shadow-xl sm:text-sm"
              placeholder="Your Name..."
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              autoComplete="email"
              onChange={handleChange}
              required
              className="appearance-none rounded-lg relative block w-52 px-3 pt-2 pb-1 border-l border-b border-slate-300 placeholder-slate-600 text-gray-900 focus:outline-none focus:border-slate-600 shadow-xl focus:z-10 sm:text-sm"
              placeholder="Your Email..."
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject:</label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              required
              className="appearance-none rounded-lg relative block w-52 px-3 pt-2 pb-1 border-b border-l border-slate-300 placeholder-slate-600 text-gray-900 focus:outline-none focus:border-slate-600 focus:z-10 shadow-xl sm:text-sm"
              placeholder="Subject..."
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message:</label>
            <textarea
              id="message"
              name="message"
              onChange={handleChange}
              value={formData.message}
              rows="4"
              required
              className="appearance-none rounded-xl relative block w-full px-3 py-2 border border-slate-500 placeholder-slate-600 shadow-2xl text-slate-900 focus:outline-none focus:ring-slate-700 focus:border-slate-700 focus:z-10 sm:text-sm"
              placeholder="Your Message..."
            ></textarea>
          </div>
          <div className="flex w-1/2 items-start justify-center">
            <button
              type="submit"
              className="w-56 py-2 border border-transparent text-sm font-medium rounded-full text-orange-500 bg-slate-900 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
      {/* <div className="hidden lg:block lg:flex-1 lg:ml-8">
        <img
          src="https://via.placeholder.com/400x300"
          alt="Contact Image"
          className="rounded-xl shadow-lg"
        />
      </div> */}
    </div>

      {/* footer */}
    <footer className="bg-slate-900 text-white w-screen py-8">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">TPConnect</h2>
            <p>
              Simplifying the teaching practice application and assessment process for Kenyan universities.
            </p>
          </div>
          <div className="md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <ul>
              <li className="mb-2"><a href="#" className="hover:underline">Home</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">About Us</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Services</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div className="md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-4">Contact Info</h2>
            <ul>
              <li className="mb-2">Email: info@tpconnect.com</li>
              <li className="mb-2">Phone: +254 123 456 789</li>
              <li className="mb-2">Address: Nairobi, Kenya</li>
            </ul>
          </div>
          <div className="md:w-1/4">
            <h2 className="text-xl font-bold mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-400"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="hover:text-gray-400"><i className="fab fa-twitter"></i></a>
              <a href="#" className="hover:text-gray-400"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="hover:text-gray-400"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="text-center border-t border-gray-700 pt-4">
          <p>&copy; 2024 TPConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
   
    </section>
  );
};

export default Home;
