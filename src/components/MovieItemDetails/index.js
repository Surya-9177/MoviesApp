import './index.css'
import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {format} from 'date-fns'
import MovieItem from '../MovieItem'
import Header from '../Header'
import Footer from '../Footer'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const MovieItemDetails = props => {
  const [retryTrigger, setRetryTrigger] = useState(0)
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    movieDetailsList: [],
    similarMovieList: [],
    genres: [],
    spokenLang: [],
  })

  useEffect(() => {
    const getData = async () => {
      setApiResponse({
        status: apiStatusConstants.inProgress,
        movieDetailsList: [],
        similarMovieList: [],
        genres: [],
        spokenLang: [],
      })
      const jwtToken = Cookies.get('jwt_token')
      const {match} = props
      const {params} = match
      const {id} = params
      const url = `https://apis.ccbp.in/movies-app/movies/${id}`
      const opt = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(url, opt)
      const data = await response.json()
      console.log(data.movie_details)

      if (response.ok === true) {
        const each = data.movie_details
        const formattedDetails1 = {
          adult: each.adult,
          backdropPath: each.backdrop_path,
          id: each.id,
          overview: each.overview,
          budget: each.budget,
          posterPath: each.poster_path,
          releaseDate: each.release_date,
          runtime: each.runtime,
          title: each.title,
          voteAvg: each.vote_average,
          voteCount: each.vote_count,
        }

        const formattedSimilarMovies = data.movie_details.similar_movies.map(
          each0 => ({
            id: each0.id,
            backdropPath: each0.backdrop_path,
            posterPath: each0.poster_path,
            title: each0.title,
          }),
        )

        const formattedSpokenLang = data.movie_details.spoken_languages.map(
          each1 => ({
            id: each1.id,
            engName: each1.english_name,
          }),
        )

        const formattedGenres = data.movie_details.genres.map(each2 => ({
          id: each2.id,
          name: each2.name,
        }))
        setApiResponse({
          status: apiStatusConstants.success,
          movieDetailsList: formattedDetails1,
          similarMovieList: formattedSimilarMovies,
          spokenLang: formattedSpokenLang,
          genres: formattedGenres,
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
    const {movieDetailsList, genres, spokenLang, similarMovieList} = apiResponse
    const formattedDate = format(
      new Date(movieDetailsList.releaseDate),
      'do MMMM yyyy',
    )
    console.log(similarMovieList)
    return (
      <div className="movie-det-con">
        <Header />
        <div className="det-con">
          <MovieItem
            movieDetails={movieDetailsList}
            key={movieDetailsList.id}
          />
        </div>
        <div className="btm-sec">
          <div className="sec-1">
            <ul>
              <h1 className="movie-det-btm-sec-head">genres</h1>
              {genres.map(each => (
                <p className="movie-det-btm-sec-para" key={each.id}>
                  {each.name}
                </p>
              ))}
            </ul>
          </div>
          <div className="sec-2">
            <ul>
              <h1 className="movie-det-btm-sec-head">Audio Available</h1>
              {spokenLang.map(each => (
                <p className="movie-det-btm-sec-para" key={each.id}>
                  {each.engName}
                </p>
              ))}
            </ul>
          </div>
          <div className="sec-3">
            <h1 className="movie-det-btm-sec-head">Rating Count</h1>
            <p className="movie-det-btm-sec-para">
              {movieDetailsList.voteCount}
            </p>
            <h1 className="movie-det-btm-sec-head">Rating Average</h1>
            <p className="movie-det-btm-sec-para">{movieDetailsList.voteAvg}</p>
          </div>
          <div className="sec-4">
            <h1 className="movie-det-btm-sec-head">Budget</h1>
            <p className="movie-det-btm-sec-para">
              {movieDetailsList.budget} Crores
            </p>
            <h1 className="movie-det-btm-sec-head">Release Date</h1>
            <p className="movie-det-btm-sec-para">{formattedDate}</p>
          </div>
        </div>
        <div className="btm-sec2">
          <h1 className="movie-det-btm-sec2-head">More like this</h1>
          <ul className="similar-con">
            {similarMovieList.map(each => (
              <img
                alt={each.title}
                key={each.id}
                className="imgg"
                src={each.posterPath}
              />
            ))}
          </ul>
        </div>
        <div className="btm-sec3">
          <Footer />
        </div>
      </div>
    )
  }

  const retry = () => {
    setApiResponse({
      status: apiStatusConstants.initial,
      trendingList: [],
      originalList: [],
    })
    setRetryTrigger(prev => prev + 1)
  }

  const renderLoadingView1 = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="Circles" color="red" height="50" width="50" />
    </div>
  )

  const renderFailureView = () => (
    <div className="popular-con">
      <Header />
      <img
        src="https://res.cloudinary.com/dzie383ct/image/upload/v1744274899/Background-Complete_q6tgar.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button onClick={retry}>Try Again</button>
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
export default MovieItemDetails
