import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {CartContextProvider} from './context/CartContext'
import Login from './components/Login'
import Home from './components/Home'
import Cart from './components/Cart'
import './index.css'

const ProtectedRoute = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

const App = () => {
  const jwtToken = Cookies.get('jwt_token')

  return (
    <CartContextProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login">
            {jwtToken !== undefined ? <Redirect to="/" /> : <Login />}
          </Route>

          <ProtectedRoute exact path="/">
            <Home />
          </ProtectedRoute>

          <ProtectedRoute exact path="/cart">
            <Cart />
          </ProtectedRoute>

          <Redirect to="/login" />
        </Switch>
      </BrowserRouter>
    </CartContextProvider>
  )
}

export default App
