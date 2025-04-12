import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {HiOutlineSearch} from 'react-icons/hi'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Search = () => {
  const [searchInput, setInput] = useState('')
  const [searchRes, setList] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const onChangeEventHandler = event => setInput(event.target.value)

  const makeApiCall = async () => {
    console.log('api called')
    setApiStatus(apiStatusConstants.inProgress)
    const url = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const opt = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, opt)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      const formattedSearchData = data.results.map(each => ({
        id: each.id,
        posterPath: each.poster_path,
        title: each.title,
      }))
      setList(formattedSearchData)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  const renderLoadingView1 = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="Circles" color="red" height="50" width="50" />
    </div>
  )

  const retry = () => {
    setApiStatus(apiStatusConstants.initial)
    makeApiCall()
  }

  const renderFailureView = () => (
    <div>
      <img
        src="https://res.cloudinary.com/dzie383ct/image/upload/v1744274899/Background-Complete_q6tgar.png"
        alt="failure view"
      />
      <h1>Something went wrong. Please try again</h1>
      <button onClick={retry}>Try Again</button>
    </div>
  )

  const renderSuccessView = () => {
    console.log('called')
    return searchRes.length !== 0 ? (
      <ul className="search-res-con">
        {searchRes.map(each => (
          <img
            key={each.id}
            alt={each.title}
            className="search-con-img"
            src={each.posterPath}
          />
        ))}
      </ul>
    ) : (
      <div className="search-con">
        <div className="no-res-con">
          <img
            className="search-no-res-img"
            src="https://res.cloudinary.com/dzie383ct/image/upload/v1744189800/Group_7394_wxwimz.png"
            alt="no movies"
          />

          <p>Your search for {searchInput} did not find any matches.</p>
        </div>
      </div>
    )
  }

  const renderResult = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView1()
      default:
        return null
    }
  }

  return (
    <div className="search-container">
      <div className="search-head-con">
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
        <Link to="/account">
          <img
            alt="profile"
            src="https://res.cloudinary.com/dzie383ct/image/upload/v1741759500/Avatar_rttzth.png"
            className="profile"
          />
        </Link>
        <div className="search-input-con">
          <input
            className="search-input"
            type="search"
            onChange={onChangeEventHandler}
          />
          <button
            onClick={makeApiCall}
            data-testid="searchButton"
            type="button"
            className="search-btn"
          >
            <HiOutlineSearch className="icon" />
          </button>
        </div>
      </div>
      {renderResult()}
    </div>
  )
}
export default Search
