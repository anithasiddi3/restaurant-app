import {useContext} from 'react'
import CartContext from '../../context/CartContext'
import Header from '../Header'
import './index.css'

const Cart = () => {
  const {
    cartList,
    removeAllCartItems,
    removeCartItem,
    incrementCartItemQuantity,
    decrementCartItemQuantity,
  } = useContext(CartContext)

  const onClickRemoveAll = () => {
    removeAllCartItems()
  }

  const renderEmptyView = () => (
    <div className="empty-cart-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
        alt="empty cart"
        className="empty-cart-image"
      />
      <h1 className="empty-heading">Your Cart is Empty</h1>
    </div>
  )

  const renderCartItems = () => (
    <div className="cart-content">
      <button
        type="button"
        className="remove-all-btn"
        onClick={onClickRemoveAll}
      >
        Remove All
      </button>
      <ul className="cart-list">
        {cartList.map(item => {
          const {dishId, dishName, dishImage, price, quantity} = item
          const totalPrice = price * quantity

          const onClickIncrement = () => {
            incrementCartItemQuantity(dishId)
          }

          const onClickDecrement = () => {
            decrementCartItemQuantity(dishId)
          }

          const onClickRemove = () => {
            removeCartItem(dishId)
          }

          return (
            <li className="cart-item" key={dishId}>
              <img
                src={dishImage}
                alt={dishName}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h1 className="cart-item-name">{dishName}</h1>
                <div className="cart-item-quantity-controls">
                  <button
                    type="button"
                    className="cart-qty-btn"
                    onClick={onClickDecrement}
                  >
                    -
                  </button>
                  <p className="cart-qty">{quantity}</p>
                  <button
                    type="button"
                    className="cart-qty-btn"
                    onClick={onClickIncrement}
                  >
                    +
                  </button>
                </div>
                <p className="cart-item-price">Rs {totalPrice}</p>
              </div>
              <button
                type="button"
                className="remove-item-btn"
                onClick={onClickRemove}
              >
                Remove
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )

  return (
    <>
      <Header />
      <div className="cart-bg">
        {cartList.length === 0 ? renderEmptyView() : renderCartItems()}
      </div>
    </>
  )
}

export default Cart
