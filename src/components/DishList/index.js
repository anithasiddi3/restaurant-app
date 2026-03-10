import DishCard from '../DishCard'
import './index.css'

const DishList = props => {
  const {dishes, cartItems, onIncrement, onDecrement} = props

  if (dishes.length === 0) {
    return <p className="no-dishes-text">No dishes available</p>
  }

  // menu_category is on the category object, not each dish.
  // The parent App passes only category_dishes here,
  // so we detect "Fresh From The Sea" by looking at dish_category_name on each dish
  const firstDish = dishes[0]
  const categoryName = firstDish.dish_category_name || ''

  const hideButtonsForAllDishes = categoryName === 'Fresh From The Sea'

  return (
    <ul className="dishes-list">
      {dishes.map(each => {
        const itemInCart = cartItems[each.dish_id]
        const quantity = itemInCart ? itemInCart.quantity : 0

        return (
          <DishCard
            key={each.dish_id}
            dish={each}
            quantity={quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            hideButtons={hideButtonsForAllDishes}
          />
        )
      })}
    </ul>
  )
}

export default DishList
