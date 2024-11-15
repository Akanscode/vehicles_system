import React from 'react'
import Navbar from './common/navbar'
import { Header } from './hero'
import Footer from './common/footer'
import Content from './content'
import Team from './team'

const LandingPage = () => {
  return (
    <div>
        <Navbar/>
        <Header/>
        <Content/>
        <Team/>
        <Footer/>
       
      
    </div>
  )
}

export default LandingPage
