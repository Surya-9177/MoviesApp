import {useState, useContext} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import './index.css'

const LoginForm = props => {
  // const {setUser} = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showSubmitError, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Redirect to='/' />
  }

  const onChangeUsername = event => {
    setUsername(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const onSubmitSuccess = jwt => {
    // const userDetails = {username, password}
    localStorage.setItem('username', username)
    localStorage.setItem('password', password)
    // setUser(userDetails)
    const {history} = props
    Cookies.set('jwt_token', jwt, {expires: 30})
    history.replace('/')
  }
  const onSubmitFailure = errMsg => {
    setError(true)
    setErrorMsg(errMsg)
  }

  const submitForm = async event => {
    event.preventDefault()
    const userDetails = {username, password}
    const opt = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch('https://apis.ccbp.in/login', opt)
    const data = await response.json()
    // console.log(data)

    if (response.ok === true) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg)
    }
  }
  return (
    <div className='login-con'>
      <img
        className='login-img'
        src='https://res.cloudinary.com/dzie383ct/image/upload/v1743588416/Group_7399_z56bt5.png'
        alt='login website logo'
      />
      <div className='login-card'>
        <h1>Login</h1>
        <form onSubmit={submitForm} className='login-form'>
          <label htmlFor='forUsername'>USERNAME</label>
          <br />
          <input
            id='forUsername'
            type='text'
            onChange={onChangeUsername}
            value={username}
          />
          <br />
          <label htmlFor='forPassword'>PASSWORD</label>
          <br />
          <input
            value={password}
            onChange={onChangePassword}
            type='password'
            id='forPassword'
          />
          <br />
          <button type='submit' className='login-btn'>
            Login
          </button>
          {showSubmitError && <p className='error-para'>{errorMsg}</p>}
        </form>
      </div>
    </div>
  )
}

export default LoginForm
