import {useEffect, useState, useContext} from 'react'
import Header from '../Header'
import CartContext from '../../context/CartContext'
import './index.css'

const apiUrl =
  'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Home = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [restaurantName, setRestaurantName] = useState('')
  const [menuCategories, setMenuCategories] = useState([])
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [dishesById, setDishesById] = useState({})

  const {addCartItem} = useContext(CartContext)

  const fetchDishes = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()

      // The CCBP mock returns an array with a single restaurant object
      const restaurant = data[0]
      setRestaurantName(restaurant.restaurant_name)

      // table_menu_list is the categories array
      const categories = restaurant.table_menu_list
      setMenuCategories(categories)

      if (categories.length > 0) {
        // Prefer "Salads and Soup" as the default active category if present
        const saladsCategory = categories.find(
          each => each.menu_category === 'Salads and Soup',
        )
        if (saladsCategory) {
          setActiveCategoryId(saladsCategory.menu_category_id)
        } else {
          setActiveCategoryId(categories[0].menu_category_id)
        }
      }

      // Build a lookup of dishes by id with all fields tests expect
      const map = {}
      categories.forEach(category => {
        category.category_dishes.forEach(dish => {
          map[dish.dish_id] = {
            id: dish.dish_id,
            name: dish.dish_name,
            image: dish.dish_image,
            description: dish.dish_description,
            price: dish.dish_price,
            currency: dish.dish_currency,
            calories: dish.dish_calories,
            availability: dish.dish_Availability,
            addonCat: dish.addonCat,
            quantity: 0,
            category: category.menu_category,
          }
        })
      })
      setDishesById(map)

      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    fetchDishes()
  }, [])

  const onClickCategory = id => {
    setActiveCategoryId(id)
  }

  const incrementDishQuantity = id => {
    setDishesById(prev => {
      const dish = prev[id]
      if (!dish || !dish.availability) {
        return prev
      }
      return {
        ...prev,
        [id]: {...dish, quantity: dish.quantity + 1},
      }
    })
  }

  const decrementDishQuantity = id => {
    setDishesById(prev => {
      const dish = prev[id]
      if (!dish || dish.quantity === 0) {
        return prev
      }
      return {
        ...prev,
        [id]: {...dish, quantity: dish.quantity - 1},
      }
    })
  }

  const onClickAddToCart = dishId => {
    const dish = dishesById[dishId]
    if (!dish) {
      return
    }
    if (dish.quantity > 0) {
      addCartItem({
        dishId: dish.id,
        dishName: dish.name,
        dishImage: dish.image,
        dishCurrency: dish.currency,
        dishPrice: dish.price,
        dishDescription: dish.description,
        dishCalories: dish.calories,
        quantity: dish.quantity,
      })
    }
  }

  const renderCategoryTabs = () => (
    <ul className="categories-tabs">
      {menuCategories.map(category => (
        <li key={category.menu_category_id}>
          <button
            type="button"
            className={
              activeCategoryId === category.menu_category_id
                ? 'category-tab active-tab'
                : 'category-tab'
            }
            onClick={() => onClickCategory(category.menu_category_id)}
          >
            {category.menu_category}
          </button>
        </li>
      ))}
    </ul>
  )

  const renderDishesList = () => {
    const activeCategory = menuCategories.find(
      each => each.menu_category_id === activeCategoryId,
    )

    if (!activeCategory) {
      return null
    }

    return (
      <ul className="dishes-list">
        {activeCategory.category_dishes.map(dish => {
          const storedDish = dishesById[dish.dish_id]
          const quantity = storedDish ? storedDish.quantity : 0
          const availability =
            storedDish && typeof storedDish.availability === 'boolean'
              ? storedDish.availability
              : dish.dish_Availability

          const hasAddon =
            storedDish && Array.isArray(storedDish.addonCat)
              ? storedDish.addonCat.length > 0
              : Array.isArray(dish.addonCat) && dish.addonCat.length > 0

          return (
            <li key={dish.dish_id} className="dish-item">
              <div className="dish-text-section">
                {/* dish name: e.g., "Spinach Salad" */}
                <h1 className="dish-name">{dish.dish_name}</h1>

                {/* price: e.g., "SAR 7.95" or "SAR 15.9" */}
                <p className="dish-price">
                  {dish.dish_currency} {dish.dish_price}
                </p>

                {/* description: full API string */}
                <p className="dish-description">{dish.dish_description}</p>

                {/* calories: API text, e.g., "25 calories" or "50 calories" */}
                <p className="dish-calories">{dish.dish_calories}</p>

                {availability ? (
                  <div className="quantity-controls">
                    <button
                      type="button"
                      className="quantity-button"
                      onClick={() => decrementDishQuantity(dish.dish_id)}
                    >
                      -
                    </button>
                    <p className="dish-quantity">{quantity}</p>
                    <button
                      type="button"
                      className="quantity-button"
                      onClick={() => incrementDishQuantity(dish.dish_id)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <p className="not-available-text">Not available</p>
                )}

                {availability && hasAddon && (
                  <p className="customizations-text">Customizations available</p>
                )}

                {availability && quantity > 0 && (
                  <button
                    type="button"
                    className="add-to-cart-button"
                    onClick={() => onClickAddToCart(dish.dish_id)}
                  >
                    ADD TO CART
                  </button>
                )}
              </div>

              <div className="dish-image-section">
                <img
                  src={dish.dish_image}
                  alt={dish.dish_name}
                  className="dish-image"
                />
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  const renderSuccessView = () => (
    <div className="home-bg">
      <div className="home-header">
        <h1 className="home-heading">{restaurantName}</h1>
        <p className="home-subtitle">My Orders</p>
      </div>
      {renderCategoryTabs()}
      {renderDishesList()}
    </div>
  )

  const renderLoadingView = () => (
    <div className="home-bg">
      <p>Loading...</p>
    </div>
  )

  const renderFailureView = () => (
    <div className="home-bg">
      <p>Something went wrong</p>
    </div>
  )

  const renderHomeContent = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      {renderHomeContent()}
    </>
  )
}

export default Home
