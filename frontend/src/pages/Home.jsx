import React from 'react'
import HeroSlider from '../components/HeroSlider'
import CampusFeatures from '../components/CampusFeatures'
import WhyChooseCampusSync from '../components/WhyChooseCampusSync'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import JoinCTA from '../components/JoinCTA'
import FloatingActions from '../components/FloatingActions'

const Home = () => {
  return (
   
         <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-330 to-slate-900">


      <HeroSlider />
       <CampusFeatures />
       <WhyChooseCampusSync/>
       <HowItWorks/>
       <Testimonials/>
       <JoinCTA/>
      
       
    </div>
   
  )
}

export default Home
