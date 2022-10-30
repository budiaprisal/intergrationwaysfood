import React, { useContext, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { API } from '../../config/api'
import { useMutation } from 'react-query'
import FormAll from '../Atoms/FormAll'
import { Alert } from 'react-bootstrap'
import { UserContext } from '../../Contexts/UserContex'

const Login = ({ show, setShow, setShowRegister }) => {
  const navigate = useNavigate()
  const handleClose = () => setShow(false)

  const [state, dispatch] = useContext(UserContext)

  const [message, setMessage] = useState(null)

  const [userLogin, setUserLogin] = useState({
    email: '',
    password: '',
  })

  const { email, password } = userLogin

  const handleChange = (e) => {
    setUserLogin({
      ...userLogin,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault()

      const data = await API.post('/login', userLogin)

      const alert = <Alert variant="success">Login berhasil!</Alert>

      setMessage(alert)

      let payload = data.data.data

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload,
      })

      navigate('/')
      setShow(false)

      console.log('isi payload', payload)
      console.log('ini data login', data)
    } catch (err) {
      console.log(err)
      const alert = <Alert variant="danger">Email / password salah!</Alert>

      setMessage(alert)
    }
  })

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          {message && message}
          <Form onSubmit={(e) => handleSubmit.mutate(e)}>
            <div className="text-yellow m-3">
              <h2>Login</h2>
            </div>
            <FormAll
              label="Email"
              type="email"
              placeholder="Email"
              value={userLogin.email}
              onChange={(e) =>
                setUserLogin({ ...userLogin, email: e.target.value })
              }
            />
            <FormAll
              label="Password"
              type="password"
              placeholder="Password"
              value={userLogin.password}
              onChange={(e) =>
                setUserLogin({ ...userLogin, password: e.target.value })
              }
            />

            <Button type="submit" className="btn-order btn-nav px-5">
              Login
            </Button>
          </Form>
          <p className="mt-3">
            Don't have an account ? click
            <span
              style={{ cursor: 'pointer' }}
              className="fw-bold ms-2 "
              onClick={() => {
                setShow(false)
                setShowRegister(true)
              }}
            >
              Here
            </span>
          </p>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Login
