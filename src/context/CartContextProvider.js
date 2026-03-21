import {Component} from 'react'
import CartContext from './CartContext'

class CartContextProvider extends Component {
  state = {cartList: []}

  addCartItem = dish => {
    const {cartList} = this.state
    const dishObject = cartList.find(each => each.dish_id === dish.dish_id)
    if (dishObject) {
      const updatedList = cartList.map(each =>
        each.dish_id === dish.dish_id
          ? {...each, quantity: each.quantity + 1}
          : each,
      )
      this.setState({cartList: updatedList})
    } else {
      const updatedDish = {...dish, quantity: 1}
      this.setState({cartList: [...cartList, updatedDish]})
    }
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const updatedList = cartList.filter(each => each.dish_id !== id)
    this.setState({cartList: updatedList})
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  incrementCartItemQuantity = id => {
    const {cartList} = this.state
    const updatedList = cartList.map(each =>
      each.dish_id === id ? {...each, quantity: each.quantity + 1} : each,
    )
    this.setState({cartList: updatedList})
  }

  decrementCartItemQuantity = id => {
    const {cartList} = this.state
    const dishObject = cartList.find(each => each.dish_id === id)
    if (dishObject === undefined) {
      return
    }
    if (dishObject.quantity === 1) {
      this.removeCartItem(id)
    } else {
      const updatedList = cartList.map(each =>
        each.dish_id === id ? {...each, quantity: each.quantity - 1} : each,
      )
      this.setState({cartList: updatedList})
    }
  }

  render() {
    const {children} = this.props
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        {children}
      </CartContext.Provider>
    )
  }
}

export default CartContextProvider
