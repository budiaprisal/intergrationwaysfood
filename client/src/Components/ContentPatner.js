import { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { API } from '../config/api'
import { Patners } from '../DataDummy/Patners'
import { Link } from 'react-router-dom'
import { Detail } from '../Pages/Detail'
import { useNavigate } from 'react-router-dom'
function ContentPatner() {
  const [profile, setProfile] = useState(null)

  const coba = async () => {
    try {
      const response = await API.get('/users')
      const filterPartner = response.data.data.filter(
        (item) => item.role.toLowerCase() == 'partner',
      )
      console.log('filter partner : ', filterPartner)
      setProfile(filterPartner)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    coba()
  }, [])

  const navigate = useNavigate()
  const handleDetail = (id) => {
    navigate(`Detail/${id}`)
  }

  return (
    <Container>
      <h2 className="mt-5">Popular Restaurant</h2>
      <Row>
        {profile?.map((item) => (
          <Col className="my-3 col-12 col-md-3">
            <Card
              width="18 rem"
              key={item.id}
              onClick={() => handleDetail(item.id)}
            >
              <Card.Body className="d-flex align-items-center shadow">
                <Card.Img
                  variant="top"
                  src={'http://localhost:5000/uploads/' + item?.image}
                  style={{ width: '50px', marginRight: '15px' }}
                />
                <Link to="/Detail" style={{ textDecoration: 'none ' }}>
                  <Card.Title className="text-dark">{item.fullName}</Card.Title>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default ContentPatner
