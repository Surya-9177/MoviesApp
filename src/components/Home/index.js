import './index.css'
import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Loader from 'react-loader-spinner'
import {MdError} from 'react-icons/md'
import Footer from '../Footer'
import Header from '../Header'
import TrendingItem from '../TrendingItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Home = () => {
  const [retryTrigger, setRetryTrigger] = useState(0)

  const [retryTrendingTrigger, setRetryTrendingTrigger] = useState(0)

  const [retryOriginalTrigger, setOriginalRetryTrigger] = useState(0)

  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
  })

  const [trendingApiResponse, setTrendingApiResponse] = useState({
    trendingSectionStatus: apiStatusConstants.initial,
    trendingList: [],
  })

  const [originalApiResponse, setOriginalApiResponse] = useState({
    originalSectionStatus: apiStatusConstants.initial,
    originalList: [],
  })

  useEffect(() => {
    const getHomeResponse = async () => {
      const jwtToken = Cookies.get('jwt_token')
      if (jwtToken === undefined) {
        return <Redirect to="/login" />
      }
      setApiResponse({
        status: apiStatusConstants.inProgress,
      })
      const trendingUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
      const originalUrl = 'https://apis.ccbp.in/movies-app/originals'

      const opt = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const originalResponse = await fetch(originalUrl, opt)
      const trendingResponse = await fetch(trendingUrl, opt)
      console.log()
      console.log(originalResponse.ok === trendingResponse.ok)
      if (trendingResponse.ok === originalResponse.ok) {
        setApiResponse({
          status: apiStatusConstants.success,
        })
      } else {
        setApiResponse({
          status: apiStatusConstants.failure,
        })
      }
      return null
    }
    getHomeResponse()
  }, [retryTrigger])

  useEffect(() => {
    const getData = async () => {
      const jwtToken = Cookies.get('jwt_token')
      if (jwtToken === undefined) {
        return <Redirect to="/login" />
      }
      console.log('trending called')
      setTrendingApiResponse({
        trendingSectionStatus: apiStatusConstants.inProgress,
        trendingList: [],
      })

      const trendingUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
      const opt = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const trendingResponse = await fetch(trendingUrl, opt)

      const trendingData = await trendingResponse.json()

      if (trendingResponse.ok) {
        const formattedData = trendingData.results.map(each => ({
          id: each.id,
          backdropPath: each.backdrop_path,
          overview: each.overview,
          posterPath: each.poster_path,
          title: each.title,
        }))

        setTrendingApiResponse({
          trendingList: formattedData,
          trendingSectionStatus: apiStatusConstants.success,
        })
      } else {
        setTrendingApiResponse(ps => ({
          ...ps,
          trendingSectionStatus: apiStatusConstants.failure,
        }))
      }
      return null
    }
    getData()
  }, [retryTrendingTrigger])

  useEffect(() => {
    console.log('original api called')
    const getOriginalData = async () => {
      const jwtToken = Cookies.get('jwt_token')
      if (jwtToken === undefined) {
        return <Redirect to="/login" />
      }
      setOriginalApiResponse({
        originalSectionStatus: apiStatusConstants.inProgress,
        originalList: [],
      })
      const originalUrl = 'https://apis.ccbp.in/movies-app/originals'
      const opt = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const originalResponse = await fetch(originalUrl, opt)
      const originalData = await originalResponse.json()

      if (originalResponse.ok) {
        const formattedOriginalData = originalData.results.map(each => ({
          id: each.id,
          backdropPath: each.backdrop_path,
          overview: each.overview,
          posterPath: each.poster_path,
          title: each.title,
        }))
        setOriginalApiResponse({
          originalList: formattedOriginalData,
          originalSectionStatus: apiStatusConstants.success,
        })
      } else {
        setOriginalApiResponse(ps => ({
          ...ps,
          originalSectionStatus: apiStatusConstants.failure,
        }))
      }
      return null
    }
    getOriginalData()
  }, [retryOriginalTrigger])

  const retry = () => {
    setApiResponse({
      status: apiStatusConstants.initial,
    })
    setTrendingApiResponse({
      trendingSectionStatus: apiStatusConstants.initial,
      trendingList: [],
    })
    setOriginalApiResponse({
      originalSectionStatus: apiStatusConstants.initial,
      originalList: [],
    })
    setRetryTrigger(prev => prev + 1)
    setRetryTrendingTrigger(prev => prev + 1)
    setOriginalRetryTrigger(prev => prev + 1)
  }

  const retryTrendingSec = () => {
    console.log('retry Trending section')
    setTrendingApiResponse({
      trendingSectionStatus: apiStatusConstants.initial,
      trendingList: [],
    })
    setRetryTrendingTrigger(prev => prev + 1)
  }

  const retryOriginalSec = () => {
    setOriginalApiResponse({
      originalSectionStatus: apiStatusConstants.initial,
      originalList: [],
    })
    setOriginalRetryTrigger(prev => prev + 1)
  }

  const renderLoadingView2 = () => (
    <div data-testid="loader" className="products-loader-container1">
      <Loader type="ThreeDots" color="red" height="50" width="50" />
    </div>
  )

  const renderTrendingSuccessView = () => {
    const {trendingList} = trendingApiResponse
    const settings = {
      slidesToShow: 4,
      slidesToScroll: 4,
      dots: false,
      cssEase: 'linear',
    }

    return (
      <div className="trending-con">
        <Slider {...settings}>
          {trendingList.map(each => (
            <TrendingItem trendingDetails={each} key={each.id} />
          ))}
        </Slider>
      </div>
    )
  }

  const renderTrendingFailureView = () => (
    <div className="failure-view-con2">
      <img
        src="https://res.cloudinary.com/dzie383ct/image/upload/v1744366211/alert-triangle_n68jo2.png"
        alt="failure view"
      />
      <MdError />
      <p>Something went wrong. Please try again</p>
      <button onClick={retryTrendingSec}>Try Again</button>
    </div>
  )

  const renderTrendingView = () => {
    const {trendingSectionStatus} = trendingApiResponse

    switch (trendingSectionStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView2()
      case apiStatusConstants.success:
        return renderTrendingSuccessView()
      case apiStatusConstants.failure:
        return renderTrendingFailureView()
      default:
        return null
    }
  }

  const renderOriginalFailureView = () => (
    <div className="failure-view-con2">
      <img
        src="https://res.cloudinary.com/dzie383ct/image/upload/v1744366211/alert-triangle_n68jo2.png"
        alt="failure view"
      />
      <MdError />
      <p>Something went wrong. Please try again</p>
      <button onClick={retryOriginalSec}>Try Again</button>
    </div>
  )

  const renderOriginalSuccessView = () => {
    const {originalList} = originalApiResponse
    const settings = {
      slidesToShow: 4,
      slidesToScroll: 4,
      dots: false,
      cssEase: 'linear',
    }
    return (
      <Slider {...settings}>
        {originalList.map(each => (
          <TrendingItem trendingDetails={each} key={each.id} />
        ))}
      </Slider>
    )
  }

  const renderOriginalView = () => {
    const {originalSectionStatus} = originalApiResponse

    switch (originalSectionStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView2()
      case apiStatusConstants.success:
        return renderOriginalSuccessView()
      case apiStatusConstants.failure:
        return renderOriginalFailureView()
      default:
        return null
    }
  }

  const renderLoadingView1 = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="Circles" color="red" height="50" width="50" />
    </div>
  )

  const renderSuccessview = () => {
    const {originalList} = originalApiResponse
    const randomNum = Math.floor(Math.random() * originalList.length)
    return (
      <div className="home-con">
        {originalList && originalList[randomNum] !== undefined ? (
          <div
            style={{
              backgroundImage: `url(${originalList[randomNum].backdropPath})`,
            }}
            className="top-sec"
          >
            <Header />
            <div className="top-initial-sec">
              <h1 className="top-section-head">
                {originalList[randomNum].title}
              </h1>
              <p className="top-section-para">
                {originalList[randomNum].overview}
              </p>
              <button className="top-section-btn">Play</button>
            </div>
          </div>
        ) : (
          <div>{renderOriginalFailureView()}</div>
        )}
        <div className="slider">
          <h1 className="slider-head">Trending Now</h1>
          {renderTrendingView()}
        </div>
        <div className="slider">
          <h1 className="slider-head">Originals</h1>
          {renderOriginalView()}
        </div>
        <div className="btm-sec">
          <Footer />
        </div>
      </div>
    )
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
      case apiStatusConstants.inProgress:
        return renderLoadingView1()
      case apiStatusConstants.success:
        return renderSuccessview()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return <div>{renderResult()}</div>
}

export default Home
