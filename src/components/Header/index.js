import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import CartContext from '../../context/CartContext'
import './index.css'

class Header extends Component {
  onClickLogo = () => {
    const {history} = this.props
    history.replace('/')
  }

  onClickCart = () => {
    const {history} = this.props
    history.push('/cart')
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    return (
      <CartContext.Consumer>
        {value => {
          const {cartList} = value
          const cartItemsCount = cartList.length

          return (
            <nav className='header-container'>
              <button
                type='button'
                className='logo-btn'
                onClick={this.onClickLogo}
              >
                <h1 className='restaurant-name'>UNI Resto Cafe</h1>
              </button>
              <div className='header-right'>
                <button
                  type='button'
                  className='cart-icon-button'
                  onClick={this.onClickCart}
                  data-testid='cart'
                >
                  <span>Cart</span>
                  {cartItemsCount > 0 && (
                    <span className='cart-count'>{cartItemsCount}</span>
                  )}
                </button>
                <button
                  type='button'
                  className='logout-btn'
                  onClick={this.onClickLogout}
                >
                  Logout
                </button>
              </div>
            </nav>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default withRouter(Header)
