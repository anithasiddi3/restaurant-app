import {useContext, useState} from 'react'
import CartContext from '../../context/CartContext'
import './index.css'

const DishItem = props => {
  const {dish} = props
  const {addCartItem} = useContext(CartContext)
  const {
    dishId,
    dishName,
    dishImage,
    price,
    available,
    quantity: initialQty,
  } = dish

  const [quantity, setQuantity] = useState(initialQty || 0)

  const onClickIncrement = () => {
    setQuantity(prev => prev + 1)
  }

  const onClickDecrement = () => {
    setQuantity(prev => (prev > 0 ? prev - 1 : 0))
  }

  const onClickAddToCart = () => {
    const cartItem = {
      dishId,
      dishName,
      dishImage,
      price,
      quantity: quantity || 1,
    }
    addCartItem(cartItem)
  }

  const showAddButton = available && quantity > 0

  return (
    <li className="dish-item">
      <img src={dishImage} alt={dishName} className="dish-image" />
      <h1 className="dish-name">{dishName}</h1>
      <p className="dish-price">Rs {price}</p>

      <div className="dish-quantity-controls">
        <button
          type="button"
          className="dish-qty-btn"
          onClick={onClickDecrement}
        >
          -
        </button>
        <p className="dish-qty">{quantity}</p>
        <button
          type="button"
          className="dish-qty-btn"
          onClick={onClickIncrement}
        >
          +
        </button>
      </div>

      {showAddButton && (
        <button
          type="button"
          className="add-to-cart-btn"
          onClick={onClickAddToCart}
        >
          ADD TO CART
        </button>
      )}
    </li>
  )
}

export default DishItem
