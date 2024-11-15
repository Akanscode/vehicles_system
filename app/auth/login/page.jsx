import Navbar from '@/app/components/common/navbar'
import React from 'react'
import Login from './login'
import Footer from '@/app/components/common/footer'

const LoginPage = () => {
  return (
    <div>
        <Navbar/>
        <Login/>
        <Footer/>
    </div>
  )
}

export default LoginPage