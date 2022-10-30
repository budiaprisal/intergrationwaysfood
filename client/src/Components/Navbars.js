import { useContext, useState } from 'react'
import { Badge, Button, Container, Dropdown, Navbar } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { API } from '../config/api'
import { CartContext } from '../Contexts/CartContext'
import Login from './Auth/Login'
import Register from './Auth/Register'
import { useQuery } from 'react-query'
import logo from '../assets/logo-name.svg'
import cart from '../assets/cart.svg'
import adminIcon from '../assets/admin-icon.svg'
import userIcon from '../assets/user-icon.svg'
import logoutIcon from '../assets/logout-icon.svg'
import foodIcon from '../assets/food-icon.svg'
import { UserContext } from '../Contexts/UserContex'

function Navbars() {
  const navigate = useNavigate()

  const { dataCart, setDataCart } = useContext(CartContext)
  const [state, dispatch] = useContext(UserContext)
  const id = state.user.id

  const [userRole, setUserRole] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const { data: profiles } = useQuery('profileCache', async () => {
    const response = await API.get(`/users/${id}`)
    console.log(response)
    return response.data.data
  })

  const { data: admins } = useQuery('profileCache', async () => {
    const response = await API.get(`/users/${id}`)
    console.log(response)
    return response.data.data
  })

  return (
    <div>
      <Navbar className="bg-yellow" expand="lg">
        <Container className="d-flex ">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Navbar.Brand>
              <img
                src={logo}
                width="140"
                height="50"
                className="d-inline-block align-top "
              />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" className="justify-content-end">
            {!state.isLogin ? (
              <div>
                <Button
                  variant="btn btn-nav text-white mx-2 px-5"
                  onClick={() => setShowRegister(true)}
                >
                  Register
                </Button>
                <Button
                  variant="btn btn-nav text-white  px-5"
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </Button>
              </div>
            ) : state.user?.role === 'user' ? (
              <div>
                <Dropdown>
                  <img
                    src={cart}
                    className="mx-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/order')}
                  />
                  {dataCart.length > 0 && (
                    <Badge
                      style={{ width: '25px', height: '20px' }}
                      className="bg-danger position-absolute badge"
                    >
                      {dataCart.length}
                    </Badge>
                  )}
                  <Dropdown.Toggle variant="bg-yellow" id="dropdown-basic">
                    <img
                      src={'http://localhost:5000/uploads/' + profiles?.image}
                      className="rounded-circle"
                      width={70}
                      height={70}
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate('/profile')}>
                      <img className="me-3" src={userIcon} />
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => {
                        dispatch({
                          type: 'LOGOUT',
                        })
                        navigate('/')
                      }}
                    >
                      <img className="me-3" src={logoutIcon} />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              <div>
                <Dropdown>
                  <Dropdown.Toggle variant="bg-yellow" id="dropdown-basic">
                    <img
                      src={'http://localhost:5000/uploads/' + admins?.image}
                      className="rounded-circle"
                      width={70}
                      height={70}
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate('/profile-admin')}>
                      <img className="me-3" src={adminIcon} />
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate('/add-product')}>
                      <img className="me-3" src={foodIcon} />
                      Add Product
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => {
                        dispatch({
                          type: 'LOGOUT',
                        })
                        navigate('/')
                      }}
                    >
                      <img className="me-3" src={logoutIcon} />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Login
        show={showLogin}
        setShow={setShowLogin}
        isLogin={state.isLogin}
        setShowRegister={setShowRegister}
        setUserRole={setUserRole}
      />
      <Register
        show={showRegister}
        setShow={setShowRegister}
        setShowLogin={setShowLogin}
      />
    </div>
  )
}

export default Navbars
