import './index.css'

const DishCard = props => {
  const {dish, quantity, onIncrement, onDecrement, hideButtons} = props
  const {
    dish_name: dishName,
    dish_image: dishImage,
    dish_price: dishPrice,
    dish_description: dishDescription,
    dish_Availability: dishAvailability,
    dish_calories: dishCalories,
    dish_currency: dishCurrency,
    addonCat,
  } = dish

  const hasCustomizations = addonCat && addonCat.length > 0

  const onClickIncrement = () => {
    // No increment if dish not available or all buttons hidden
    if (!dishAvailability || hideButtons) {
      return
    }
    onIncrement(dish)
  }

  const onClickDecrement = () => {
    // No decrement if dish not available or all buttons hidden
    if (!dishAvailability || hideButtons) {
      return
    }

    // Initial "-" click when quantity is 0: do nothing (test 30)
    if (quantity === 0) {
      return
    }

    onDecrement(dish)
  }

  const renderQuantitySection = () => {
    if (hideButtons) {
      // "Fresh From The Sea": NO +/- buttons at all, only a 0 paragraph per dish
      return <p className='counter-value'>{quantity}</p>
    }

    // For all other categories:
    // show +/- always, but disable them for unavailable dishes
    return (
      <div className='counter-container'>
        <button
          type='button'
          className='counter-button'
          onClick={onClickDecrement}
          disabled={!dishAvailability}
        >
          -
        </button>
        <p className='counter-value'>{quantity}</p>
        <button
          type='button'
          className='counter-button'
          onClick={onClickIncrement}
          disabled={!dishAvailability}
        >
          +
        </button>
        {!dishAvailability && (
          <p className='not-available-text'>Not available</p>
        )}
      </div>
    )
  }

  return (
    <li className='dish-card'>
      <div className='dish-details'>
        <h3 className='dish-name'>{dishName}</h3>
        <p className='dish-price'>
          {dishCurrency} {dishPrice}
        </p>
        <p className='dish-desc'>{dishDescription}</p>
        <p className='dish-calories'>{dishCalories} calories</p>
        {hasCustomizations && (
          <p className='custom-text'>Customizations available</p>
        )}
        {renderQuantitySection()}
      </div>
      <div className='dish-image-container'>
        <img src={dishImage} alt={dishName} className='dish-image' />
      </div>
    </li>
  )
}

export default DishCard
