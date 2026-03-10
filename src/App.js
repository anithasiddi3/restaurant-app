import {useEffect, useState} from 'react'
import Header from './components/Header'
import CategoryTabs from './components/CategoryTabs'
import DishList from './components/DishList'
import './App.css'

const API_URL =
  'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

const App = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [cartItems, setCartItems] = useState({})
  const [restaurantName, setRestaurantName] = useState('Restaurant')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        const firstRestaurant = data[0]
        setRestaurantName(firstRestaurant.restaurant_name)
        const list = firstRestaurant.table_menu_list
        setCategories(list)
        if (list.length > 0) {
          setSelectedCategoryId(list[0].menu_category_id)
        }
        setErrorMsg('')
      } catch (error) {
        setErrorMsg('Something went wrong. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenu()
  }, [])

  const handleChangeCategory = id => {
    setSelectedCategoryId(id)
  }

  const handleIncrement = dish => {
    setCartItems(prev => {
      const existing = prev[dish.dish_id]
      const newQty = existing ? existing.quantity + 1 : 1
      return {
        ...prev,
        [dish.dish_id]: {
          ...dish,
          quantity: newQty,
        },
      }
    })
  }

  const handleDecrement = dish => {
    setCartItems(prev => {
      const existing = prev[dish.dish_id]

      // if nothing in cart or quantity is 0, do nothing
      if (!existing || existing.quantity === 0) {
        return prev
      }

      if (existing.quantity === 1) {
        const copy = {...prev}
        delete copy[dish.dish_id]
        return copy
      }

      return {
        ...prev,
        [dish.dish_id]: {
          ...dish,
          quantity: existing.quantity - 1,
        },
      }
    })
  }

  const totalCartCount = Object.values(cartItems).reduce(
    (sum, item) => sum + item.quantity,
    0,
  )

  const selectedCategory = categories.find(
    each => each.menu_category_id === selectedCategoryId,
  )

  const dishes = selectedCategory ? selectedCategory.category_dishes : []

  return (
    <div className="app-container">
      <Header restaurantName={restaurantName} cartCount={totalCartCount} />
      {isLoading && <p className="status-text">Loading...</p>}
      {errorMsg !== '' && <p className="status-text error-text">{errorMsg}</p>}
      {!isLoading && errorMsg === '' && (
        <>
          <CategoryTabs
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onChangeCategory={handleChangeCategory}
          />
          <DishList
            dishes={dishes}
            cartItems={cartItems}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        </>
      )}
    </div>
  )
}

export default App
