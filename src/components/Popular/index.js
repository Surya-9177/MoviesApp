import './index.css'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import TrendingItem from '../TrendingItem'
import Footer from '../Footer'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Popular = () => {
  const [retryTrigger, setRetryTrigger] = useState(0)
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    popularList: [],
  })

  useEffect(() => {
    const getData = async () => {
      setApiResponse({
        status: apiStatusConstants.inProgress,
        popularList: [],
      })
      const jwtToken = Cookies.get('jwt_token')
      const url = 'https://apis.ccbp.in/movies-app/popular-movies'
      const opt = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(url, opt)
      const data = await response.json()
      if (response.ok === true) {
        const formattedData = data.results.map(each => ({
          id: each.id,
          backdropPath: each.backdrop_path,
          overview: each.overview,
          posterPath: each.poster_path,
          title: each.title,
        }))
        setApiResponse({
          status: apiStatusConstants.success,
          popularList: formattedData,
        })
      } else {
        setApiResponse(ps => ({
          ...ps,
          status: apiStatusConstants.failure,
        }))
      }
    }
    getData()
  }, [retryTrigger])

  const renderSuccessview = () => {
    const {popularList} = apiResponse
    console.log('popular component called')
    return (
      <div className="popular-con">
        <Header />
        <ul className="popular-items-con">
          {popularList.map(each => (
            <TrendingItem trendingDetails={each} key={each.id} />
          ))}

          <div className="btm-sec">
            <Footer />
          </div>
        </ul>
      </div>
    )
  }

  const renderLoadingView1 = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="Circles" color="red" height="50" width="50" />
    </div>
  )

  const retry = () => {
    setApiResponse({
      status: apiStatusConstants.initial,
      trendingList: [],
      originalList: [],
    })
    setRetryTrigger(prev => prev + 1)
  }

  const renderFailureView = () => (
    <div className="failure-con">
      <Header />
      <div className="failure-con2">
        <img
          src="https://res.cloudinary.com/dzie383ct/image/upload/v1744274899/Background-Complete_q6tgar.png"
          alt="failure view"
        />
        <p>Something went wrong. Please try again</p>
        <button onClick={retry}>Try Again</button>
      </div>
    </div>
  )

  const renderResult = () => {
    const {status} = apiResponse
    switch (status) {
      case apiStatusConstants.success:
        return renderSuccessview()
      case apiStatusConstants.inProgress:
        return renderLoadingView1()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return <>{renderResult()}</>
}
export default Popular
