import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API, setAuthToken } from '../../config/api'
import { UserContext } from '../../Contexts/UserContex'

function CheckAuth({ children }) {
  const [state, dispatch] = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }

    if (!state.isLogin && !isLoading) {
      navigate('/')
    } else {
      if (state.user?.role == 'user') {
        navigate('/profile')
      } else {
        navigate('/home-admin')
      }
    }
  }, [state])

  async function checkUser() {
    try {
      const response = await API.post('/check-auth')

      dispatch({
        type: 'USER_SUCCESS',
        payload: response.data.data,
      })

      console.log('data context', state)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (localStorage.token) {
      checkUser()
    }
  }, [])
  return children
}

export default CheckAuth
