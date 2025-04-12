import './index.css'
import {Link, withRouter} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'

const Header = props => {
  const renderSearchBar = () => {
    const onNavigateToSearchRoute = () => {
      const {history} = props
      history.push('/search')
    }
    return (
      <>
        <button
          onClick={onNavigateToSearchRoute}
          data-testid="searchButton"
          type="button"
          className="search-btn"
        >
          <HiOutlineSearch className="icon" />
        </button>
      </>
    )
  }
  return (
    <div className="head-con">
      <div className="head-con1">
        <Link className="li" to="/">
          <img
            className="header-img"
            src="https://res.cloudinary.com/dzie383ct/image/upload/v1743588416/Group_7399_z56bt5.png"
            alt="website logo"
          />
        </Link>
        <ul className="header-btm-sec">
          <Link className="li" to="/">
            <li className="header-list-item">Home</li>
          </Link>
          <Link className="li" to="/popular">
            <li className="header-list-item">Popular</li>
          </Link>
        </ul>
      </div>
      <div className="head-con2">
        {renderSearchBar()}
        <Link to="/account">
          <img
            alt="profile"
            src="https://res.cloudinary.com/dzie383ct/image/upload/v1741759500/Avatar_rttzth.png"
            className="profile"
          />
        </Link>
      </div>
    </div>
  )
}
export default withRouter(Header)
