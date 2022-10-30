import React, { useContext } from 'react'
import { Button, Form, FormText, Modal } from 'react-bootstrap'
import { useMutation } from 'react-query'
import FormAll from '../Atoms/FormAll'
import { API } from '../../config/api'
import { useState } from 'react'
import { Alert } from 'react-bootstrap'
import { UserContext } from '../../Contexts/UserContex'

function Register({ show, setShow, setShowLogin }) {
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [message, setMessage] = useState(null)
  const [formregister, setFormRegister] = useState({
    email: '',
    password: '',
    fullname: '',
    gender: '',
    phone: '',
    role: '',
  })

  const { email, password, fullname, gender, phone, role } = formregister

  const handleChange = (e) => {
    setFormRegister({
      ...formregister,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault()
      // Configuration Content-type
      // const config = {
      // headers: {
      // 'Content-type': 'application/json',
      // },
      // }

      // Data body
      // const body = JSON.stringify(formregister)

      // Insert data user to database
      const response = await API.post('/register', formregister)
      // console.log(response)
      // setShow(false)
      const alert = (
        <Alert variant="success" className="py-1">
          Registrasi berhasil.
          <br />
          Silahkan login
        </Alert>
      )
      setMessage(alert)

      setFormRegister({
        email: '',
        password: '',
        fullname: '',
        gender: '',
        phone: '',
        role: '',
      })

      // Handling response here
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Gagal Register.
          <br />
          Silahkan Register Kembali
        </Alert>
      )
      setMessage(alert)
      // console.log(error)
    }
  })
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          {message && message}
          <form onSubmit={(e) => handleSubmit.mutate(e)}>
            <div className="text-yellow m-3">
              <h2>Register</h2>
            </div>
            <div>
              <FormAll
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Email"
              />
              <FormAll
                label="Password"
                type="password"
                value={password}
                name="password"
                onChange={handleChange}
                placeholder="password"
              />
              <FormAll
                label="fullname"
                type="text"
                name="fullname"
                value={fullname}
                onChange={handleChange}
                placeholder="Full Name"
              />
              <Form.Select
                aria-label="Default select example m-3"
                name="gender"
                value={gender}
                onChange={handleChange}
              >
                <option>Gender</option>
                <option value="Laki-Laki">Laki-Laki</option>
                <option value="Perempuan">Perempuan</option>
              </Form.Select>
              <FormAll
                label="Phone Number"
                type="number"
                name="phone"
                value={phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="mt-3"
              />
              <Form.Select
                aria-label="Default select example m-3"
                name="role"
                value={role}
                onChange={handleChange}
              >
                <option hidden>Role</option>
                <option value="user">User</option>
                <option value="Partner">Patner</option>
              </Form.Select>
            </div>
            <Button type="submit" className="btn-order btn-nav mt-3">
              Register
            </Button>
          </form>
          <p className="mt-3">
            Already have an account ? Klik
            <span
              style={{ cursor: 'pointer' }}
              className="fw-bold ms-2 "
              onClick={() => {
                setShow(false)
                setShowLogin(true)
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

export default Register
