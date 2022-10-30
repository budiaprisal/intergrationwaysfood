import { Button, Col, Container, Form, Row } from 'react-bootstrap'

import FormAll from '../../Components/Atoms/FormAll'
import iconFile from '../../assets/icon-file.svg'
import { useNavigate } from 'react-router-dom'
import { API } from '../../config/api'
import { useMutation } from 'react-query'
import { useContext, useEffect, useState } from 'react'

const AddProduct = () => {
  const navigate = useNavigate()
  const [produk, setProduk] = useState('')
  const [preview, setPreview] = useState(null) //For image preview

  const [form, setForm] = useState({
    image: '',
    title: '',
    price: 0,
    qty: 0,
  })
  const { image, title, price, qty } = form

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === 'file' ? e.target.files : e.target.value,
    })

    // Create image url for preview
    if (e.target.type === 'file') {
      let url = URL.createObjectURL(e.target.files[0])
      setPreview(url)
    }
  }

  // Create function for handle insert product data with useMutation here ...
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault()

      const formData = new FormData()
      formData.set('image', form.image[0], form.image[0].name)
      formData.set('title', form.title)
      formData.set('price', form.price)
      formData.set('qty', form.qty)
      const data = await API.post('/product', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })

      console.log('ini insert product', data)
      navigate('/detail')
    } catch (error) {
      console.log(error)
    }
  })

  return (
    <Container>
      <h2 className="my-5">Add Product</h2>
      <Form onSubmit={(e) => handleSubmit.mutate(e)}>
        <Row>
          <Col className="col-12 col-md-9">
            <FormAll
              label="Title"
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              placeholder="Title"
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
                      maxWidth: '150px',
                      maxHeight: '150px',
                      objectFit: 'cover',
                    }}
                    alt={preview}
                  />
                </div>
              )}
              <Form.Control
                type="file"
                placeholder="Attach Image"
                name="image"
                onChange={handleChange}
                hidden
              />
              <Form.Label className="d-flex align-items-center border-form border-dark input-img border border-1 ">
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
          label="Price"
          type="number"
          placeholder="Price (Rp.)"
          name="price"
          value={price}
          onChange={handleChange}
          className="border-form border-dark text-dark"
        />
        <FormAll
          label="Qty"
          type="number"
          placeholder="Qty"
          name="qty"
          value={qty}
          onChange={handleChange}
          className="border-form border-dark text-dark"
        />
        <div className="d-flex justify-content-end">
          <Button
            className="btn-nav w-25 mt-5 "
            type="submit"
            variant="success"
          >
            Save
          </Button>
        </div>
      </Form>
    </Container>
  )
}

export default AddProduct
