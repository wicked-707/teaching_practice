import React from 'react';
import { Link } from 'react-router-dom'; // If using React Router for navigation

function Unipage() {
  return (
    <div className="App">
      <header>
        <h1>Welcome to My University</h1>
        <p>This is your introductory page. Here you can find information about our university.</p>
      </header>
      <main>
        <section>
          <h2>Supervisor Signup</h2>
          <p>Are you a supervisor? Signup here:</p>
          <Link to="/unisignup">
            <button>Signup as Supervisor</button>
          </Link>
        </section>
        <section>
          <h2>HOD Signup</h2>
          <p>Are you an HOD? Signup here:</p>
          <Link to="/hodsignup">
            <button>Signup as HOD</button>
          </Link>
        </section>
      </main>
      <footer>
        <p>Footer information goes here.</p>
      </footer>
    </div>
  );
}

export default Unipage;
