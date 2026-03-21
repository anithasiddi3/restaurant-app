import {Component} from 'react'
import CartContext from '../../context/CartContext'
import './index.css'

const apiUrl =
  'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list'

class Restaurant extends Component {
  state = {
    menuList: [],
    activeCategoryId: '',
    apiStatus: 'INITIAL',
  }

  componentDidMount() {
    this.getMenuData()
  }

  getMenuData = async () => {
    this.setState({apiStatus: 'IN_PROGRESS'})
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()
      const {table_menu_list} = data
      const firstCategory = table_menu_list[0]
      this.setState({
        menuList: table_menu_list,
        activeCategoryId: firstCategory.menu_category_id,
        apiStatus: 'SUCCESS',
      })
    } else {
      this.setState({apiStatus: 'FAILURE'})
    }
  }

  onChangeCategory = id => {
    this.setState({activeCategoryId: id})
  }

  renderCategoryButtons = () => {
    const {menuList, activeCategoryId} = this.state
    return (
      <div className="categories-container">
        {menuList.map(each => {
          const isActive = each.menu_category_id === activeCategoryId
          const activeClassName = isActive ? 'active-category-button' : ''
          return (
            <button
              type="button"
              key={each.menu_category_id}
              className={`category-button ${activeClassName}`}
              onClick={() => this.onChangeCategory(each.menu_category_id)}
            >
              {each.menu_category}
            </button>
          )
        })}
      </div>
    )
  }

  renderDishes = () => (
    <CartContext.Consumer>
      {value => {
        const {
          addCartItem,
          incrementCartItemQuantity,
          decrementCartItemQuantity,
          cartList,
        } = value
        const {menuList, activeCategoryId} = this.state

        const activeCategory = menuList.find(
          each => each.menu_category_id === activeCategoryId,
        )
        if (!activeCategory) {
          return null
        }

        const {category_dishes} = activeCategory

        const getQuantityForDish = id => {
          const dishObject = cartList.find(each => each.dish_id === id)
          if (dishObject === undefined) {
            return 0
          }
          return dishObject.quantity
        }

        return (
          <ul className="dishes-list">
            {category_dishes.map(eachDish => {
              const {
                dish_id,
                dish_name,
                dish_currency,
                dish_price,
                dish_description,
                dish_calories,
                dish_Availability,
              } = eachDish

              const quantity = getQuantityForDish(dish_id)

              const onClickAdd = () => {
                addCartItem(eachDish)
              }

              const onClickIncrement = () => {
                // Test 8
                incrementCartItemQuantity(dish_id)
              }

              const onClickDecrement = () => {
                // Test 40 – don’t go below 0
                if (quantity > 0) {
                  decrementCartItemQuantity(dish_id)
                }
              }

              return (
                <li key={dish_id} className="dish-item">
                  {/* Test 16 – Spinach Salad */}
                  <h1>{dish_name}</h1>

                  {/* Test 17 – SAR 7.95 / SAR 15.9 */}
                  <p>{`${dish_currency} ${dish_price}`}</p>

                  {/* Test 18 – full description */}
                  <p>{dish_description}</p>

                  {/* Tests 19 & 27 – 25 calories / 50 calories */}
                  <p>{`${dish_calories} calories`}</p>

                  {/* Tests 21, 29, 40 – quantity paragraphs */}
                  <div className="quantity-container">
                    <button type="button" onClick={onClickDecrement}>
                      -
                    </button>
                    <p>{quantity}</p>
                    <button type="button" onClick={onClickIncrement}>
                      +
                    </button>
                  </div>

                  {dish_Availability && (
                    <button type="button" onClick={onClickAdd}>
                      ADD TO CART
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )
      }}
    </CartContext.Consumer>
  )

  renderSuccessView = () => (
    <div className="restaurant-container">
      {this.renderCategoryButtons()}
      {this.renderDishes()}
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderSuccessView()
      case 'IN_PROGRESS':
        return <p>Loading</p>
      case 'FAILURE':
        return <p>Failed</p>
      default:
        return null
    }
  }
}

export default Restaurant
