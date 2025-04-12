import './index.css'

const MovieItem = props => {
  const {movieDetails} = props
  const {
    title,
    adult,
    budget,
    overview,
    runtime,
    releaseDate,
    voteCount,
    voteAvg,
    backdropPath,
  } = movieDetails

  const newDate = new Date(releaseDate)
  const year = newDate.getFullYear()

  return (
    <div
      style={{
        backgroundImage: `url(${backdropPath})`,
      }}
      className="movie-top-sec"
    >
      <h1 className="item-head">{title}</h1>
      <div className="inside-sec">
        <p className="item-para">{runtime} min</p>
        <p className="item-para">{adult ? 'A' : 'U/A'}</p>
        <p className="item-para">{year}</p>
      </div>
      <p className="item-para">{overview}</p>
      <button className="top-section-btn">Play</button>
    </div>
  )
}
export default MovieItem
