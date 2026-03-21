import {createContext, useState} from 'react'

const CartContext = createContext({
  cartList: [],
  addCartItem: () => {},
  removeCartItem: () => {},
  incrementCartItemQuantity: () => {},
  decrementCartItemQuantity: () => {},
  removeAllCartItems: () => {},
})

export const CartContextProvider = ({children}) => {
  const [cartList, setCartList] = useState([])

  const addCartItem = item => {
    setCartList(prevList => {
      const itemIndex = prevList.findIndex(
        eachItem => eachItem.dishId === item.dishId,
      )
      if (itemIndex === -1) {
        return [...prevList, {...item, quantity: item.quantity || 1}]
      }
      const updatedList = [...prevList]
      updatedList[itemIndex].quantity += item.quantity || 1
      return updatedList
    })
  }

  const removeCartItem = id => {
    setCartList(prevList => prevList.filter(eachItem => eachItem.dishId !== id))
  }

  const incrementCartItemQuantity = id => {
    setCartList(prevList =>
      prevList.map(eachItem =>
        eachItem.dishId === id
          ? {...eachItem, quantity: eachItem.quantity + 1}
          : eachItem,
      ),
    )
  }

  const decrementCartItemQuantity = id => {
    setCartList(prevList =>
      prevList
        .map(eachItem =>
          eachItem.dishId === id
            ? {...eachItem, quantity: eachItem.quantity - 1}
            : eachItem,
        )
        .filter(eachItem => eachItem.quantity > 0),
    )
  }

  const removeAllCartItems = () => {
    setCartList([])
  }

  return (
    <CartContext.Provider
      value={{
        cartList,
        addCartItem,
        removeCartItem,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
        removeAllCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
