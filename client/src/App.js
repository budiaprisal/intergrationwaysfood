import { useContext, useState } from 'react'
import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom'

import Navbars from './Components/Navbars'
import AddProduct from './Pages/AdminPartner/AddProduct'
import HomeAdmin from './Pages/AdminPartner/HomeAdmin'
import ProfileAdmin from './Pages/AdminPartner/ProfileAdmin'
import EditProfile from './Pages/EditProfile'
import EditAdmin from './Pages/AdminPartner/EditAdmin'
import Home from './Pages/Home'
import Order from './Pages/Order'
import Profile from './Pages/Profile'
import './styles/style.css'

import CheckAuth from './Components/Auth/CheckAuth'
import { CartContext } from './Contexts/CartContext'
import { LoginContext } from './Contexts/LoginContext'
import { UserContext } from './Contexts/UserContex'

import { Detail } from './Pages/Detail'

const PrivateRoute = () => {
  const [state, dispatch] = useContext(UserContext)

  console.log('private route islogin', state)

  return state.isLogin ? <Outlet /> : <Navigate to="/" />
}

function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [dataCart, setDataCart] = useState([])

  return (
    <LoginContext.Provider value={{ isLogin, setIsLogin }}>
      <CartContext.Provider value={{ dataCart, setDataCart }}>
        <Router>
          <CheckAuth>
            <Navbars />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route exact path="/" element={<PrivateRoute />}>
                <Route exact path="/detail/:id" element={<Detail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/order" element={<Order />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route exact path="/home-admin" element={<HomeAdmin />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/profile-admin" element={<ProfileAdmin />} />
                <Route path="/edit-admin" element={<EditAdmin />} />
              </Route>
            </Routes>
          </CheckAuth>
        </Router>
      </CartContext.Provider>
    </LoginContext.Provider>
  )
}

export default App
