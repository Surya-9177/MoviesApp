import './App.css'
import {Switch, Route, Redirect} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Popular from './components/Popular'
import ProtectedRoute from './components/ProtectedRoute'
import MovieItemDetails from './components/MovieItemDetails'
import Account from './components/Account'
import NotFound from './components/NotFound'
import Search from './components/Search'

const App = () => (
  <>
    <Switch>
      <Route exact path="/login" component={LoginForm} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/popular" component={Popular} />
      <ProtectedRoute exact path="/movies/:id" component={MovieItemDetails} />
      <ProtectedRoute exact path="/account" component={Account} />
      <ProtectedRoute exact path="/search" component={Search} />
      <Route path="/not-found" component={NotFound} />
      <Redirect to="not-found" />
    </Switch>
  </>
)

export default App
