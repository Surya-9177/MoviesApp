import './index.css'
import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import {useContext} from 'react'
import Footer from '../Footer'
import AuthContext from '../../context/AuthContext'
import Header from '../Header'

const Account = props => {
  // const {user} = useContext(AuthContext)
  const username = localStorage.getItem('username')
  const password = localStorage.getItem('password')

  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="account">
      <Header />
      <div className="acount-con">
        <h1>Account</h1>
        <div>
          <p className="account-para1">Member ship: {username}@gmail.com</p>
          <p className="account-para2">
            Password: {'*'.repeat(password.length)}
          </p>
        </div>
        <div className="account-premium-con">
          <p className="account-para2">Plan details</p>
          <p className="account-para2">Premium Ultra Hd</p>
        </div>
        <button className="account-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="btm-sec">
        <Footer />
      </div>
    </div>
  )
}
export default withRouter(Account)
