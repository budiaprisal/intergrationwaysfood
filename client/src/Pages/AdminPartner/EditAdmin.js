import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import FormAll from '../../Components/Atoms/FormAll'
import iconFile from '../../assets/icon-file.svg'
import mapIcon from '../../assets/map-icon.png'
import { useQuery } from 'react-query'
import { API } from '../../config/api'
import { UserContext } from '../../Contexts/UserContex'
import Map from '../../Contexts/Map'

const EditAdmin = () => {
  const navigate = useNavigate()
  const [preview, setPreview] = useState(null) //For image preview
  const [show, setShow] = useState(false)
  const [state, dispatch] = useContext(UserContext)
  const id = state.user.id
  const [showMap, setShowMap] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    image: '',
  })

  const { data: profile } = useQuery('profileCache', async () => {
    const response = await API.get(`/users/${id}`)
    console.log(response)
    return response.data.data
  })

  useEffect(() => {
    if (profile) {
      setForm({
        ...form,
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        image: profile.image,
        location: profile.location,
      })
    }
  }, [profile])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === 'file' ? e.target.files : e.target.value,
    })

    if (e.target.type === 'file') {
      let url = URL.createObjectURL(e.target.files[0])
      setPreview(url)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      if (form.image) {
        formData.set('image', form?.image[0], form?.image[0]?.name)
      }
      formData.set('fullName', form.fullName)
      formData.set('email', form.email)
      formData.set('phone', form.phone)
      formData.set('location', form.location)

      const response = await API.patch('/users/' + profile.id, formData)

      console.log('ini data update', response.data)

      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Form onSubmit={(e) => handleSubmit(e)}>
      <Row>
        <Col className="col-12 col-md-9">
          <FormAll
            label="Full Name"
            type="text"
            name="fullName"
            defaultValue={form?.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="border-form border-dark text-dark"
          />
        </Col>
        <Col className="col-12 col-md-3">
          <Form.Group
            className="mb-3 d-flex"
            controlId="formBasicEmail"
            style={{ height: '90%' }}
          >
            {preview && (
              <div>
                <img
                  src={preview}
                  style={{
                    maxWidth: '200px',
                    maxHeight: '2000px',
                    objectFit: 'cover',
                  }}
                  alt={preview}
                />
              </div>
            )}
            <Form.Control
              type="file"
              name="image"
              onChange={handleChange}
              placeholder="Attach Image"
              hidden
            />
            <Form.Label className="d-flex align-items-center border-form border-dark input-img border border-1">
              Attach Image
            </Form.Label>
            <img
              src={iconFile}
              style={{
                marginLeft: '-30px',
                paddingBottom: '8px',
                width: '20px',
              }}
            />
          </Form.Group>
        </Col>
      </Row>

      <FormAll
        label="Email"
        type="email"
        name="email"
        defaultValue={form?.email}
        onChange={handleChange}
        placeholder="Email"
        className="border-form border-dark text-dark"
      />
      <FormAll
        label="Phone"
        type="number"
        placeholder="Phone"
        name="phone"
        defaultValue={form?.phone}
        onChange={handleChange}
        className="border-form border-dark text-dark"
      />
      <Row className="mb-5">
        <Col className="col-12 col-md-8 col-lg-9">
          <FormAll
            value={form.location}
            name="location"
            onChange={handleChange}
            label="Location"
            type="text"
            placeholder="Location"
            className="mb-3 bg-grey2 border-grey3"
          />
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Button
              type="button"
              className="btn-dark btn-full p-3 ff-avenir f-14 d-none d-md-block"
              onClick={() => setShowMap(true)}
            >
              Select on Map <img src={mapIcon} alt=""></img>
            </Button>
          </Form.Group>
        </Col>
      </Row>
      <div className="d-flex justify-content-end">
        <Button className="btn-nav w-25 mt-5 " type="submit">
          Save
        </Button>
      </div>
      <Map showMap={showMap} setShowMap={setShowMap} />
    </Form>
  )
}

export default EditAdmin
