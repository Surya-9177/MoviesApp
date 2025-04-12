import './index.css'
import {Link} from 'react-router-dom'

const TrendingItem = props => {
  const {trendingDetails} = props
  const {id, title, backdropPath, overview, posterPath} = trendingDetails
  return (
    <Link to={`/movies/${id}`}>
      <img className="t-img" src={posterPath} alt={title} />
    </Link>
  )
}
export default TrendingItem
