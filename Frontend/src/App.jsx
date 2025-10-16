
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router'

import LoginSignUp from './pages/LoginSignUp'
import Dashboard from './pages/Dashboard'
import HomePage from './pages/HomePage'
import MainLayout from './Layout/MainLayout'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginSignUp/>}/>
          {/* Layout as parent route */}
          <Route path="/home" element={<MainLayout/>}>
            <Route index element={<HomePage />} />
            {/* <Route path="categories" element={<CategoryPage />} />
            <Route path="categories/:categoryName" element={<CategoryPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
