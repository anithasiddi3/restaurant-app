import './index.css'

const Header = props => {
  const {restaurantName, cartCount} = props

  return (
    <header className="header-container">
      <div className="header-left">
        <h1 className="restaurant-name">{restaurantName}</h1>
        <p className="my-orders">My Orders</p>
      </div>
      <div className="header-right">
        <button type="button" className="cart-button" aria-label="Cart">
          <span className="cart-icon">🛒</span>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>
    </header>
  )
}

export default Header
