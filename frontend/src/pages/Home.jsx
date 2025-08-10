
import React from 'react';
import Navbar from '../components/Navbar';
import Imageslider from '../components/Imageslider';
import './Home.css';
import { useNavigate } from 'react-router-dom';



const Home = () => {
  const navigate = useNavigate() ;
  return (
    <div className="home-container">
      <Navbar />
      <section className="section1">
        <div className="imageslider">
          <Imageslider />
        </div>
        <div className="signup">
          <div className="welcome">
              <h1>Join Now And Start Sharing Instantly!</h1>
          </div>
          <button className="tosignup" onClick={()=> navigate('/signup')}>Sign Up</button>
        </div>
      </section>
    </div>
  );
};

export default Home;


