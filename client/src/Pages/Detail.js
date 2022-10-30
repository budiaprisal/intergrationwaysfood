import { useContext, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { CartContext } from '../Contexts/CartContext'
import { API } from '../config/api'
import { useMutation, useQuery } from 'react-query'
import NotFound from '../assets/mie-ayam.svg'

export const Detail = () => {
  const params = useParams().id
  useContext(CartContext)
  const convertRupiah = require('rupiah-format')
  const { cartLength, setCartLength } = useContext(CartContext)

  const { data: products, refetch } = useQuery('productsCache', async () => {
    const response = await API.get(`/products/${params}`)
    console.log('detail', response)
    return response.data.data
    refetch()
  })

  let { data: partner } = useQuery('partnerCache', async () => {
    const response = await API.get(`/users/${params}`)
    console.log(response.data.data)
    return response.data.data
  })
  const addToCartHandler = async (productId, productPrice) => {
    try {
      const response = await API.post(`/cart/add/${productId}`, {
        price: productPrice,
      })
      const getCart = await API.get('/carts')
      setCartLength(getCart.data.data.length)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Container>
      <h2 className="mt-5 mb-3">{partner?.fullName}, Menus</h2>
      <Row>
        {products?.map((item, index) => {
          console.log('image', item.image)
          let number = item.price
          return (
            <Col key={index} className="my-3 col-12 col-md-3">
              <Card style={{ width: '16rem' }} className="shadow h-100">
                <Card.Img
                  variant="top"
                  src={
                    item?.image
                      ? 'http://localhost:5000/uploads/' + item.image
                      : NotFound
                  }
                />
                <Card.Body>
                  <Card.Text className="font-bold">{item.title}</Card.Text>
                  <Card.Text className="text-price">
                    {convertRupiah.convert(number)}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="border-0">
                  <Button
                    className="bg-yellow btn-order"
                    onClick={() => addToCartHandler(item.id, item.price)}
                  >
                    Order
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}
