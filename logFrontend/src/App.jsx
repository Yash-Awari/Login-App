import { useState } from 'react'
import Signup from './signup'
import FirstPage from './firstPage'
import Login from './login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {


  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<FirstPage/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
