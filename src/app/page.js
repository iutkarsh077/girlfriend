import { redirect } from 'next/navigation'
import React from 'react'

const Home = () => {
  redirect("/ai")
  return (
    <div className='bg-black'>
    Redirected
    </div>
  )
}

export default Home
