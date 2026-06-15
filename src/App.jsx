import { useState, useEffect } from 'react'

function App() {
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false) // <-- NEW: checkout form
  const [showOrders, setShowOrders] = useState(false) // <-- NEW: order history
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  
  // NEW: Checkout form state
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  })
  
  // NEW: Order history state
  const [orderHistory, setOrderHistory] = useState([])

  // Load cart, dark mode, and order history on first load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) setCart(JSON.parse(savedCart))
    
    const savedMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedMode)
    if (savedMode) document.documentElement.classList.add('dark')
    
    const savedOrders = localStorage.getItem('orderHistory')
    if (savedOrders) setOrderHistory(JSON.parse(savedOrders))
  }, [])

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // Save order history whenever it changes
  useEffect(() => {
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory))
  }, [orderHistory])

  const toggleDarkMode = () => {
    const newMode =!darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const menu = [
    { 
      id: 1, 
      name: "French Fries", 
      desc: "Crispy fried potatoes with a dip", 
      price: 75,
      img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
      category: "Starters"
    },
    { 
      id: 2, 
      name: "Chicken Lollipop", 
      desc: "Fried chicken legs coated in a special sauce", 
      price: 120,
      img: "https://img.freepik.com/premium-photo/chicken-lollipop-schezwan-is-indian-chinese-appetizer-served-wooden-rustic-background_726363-1287.jpg",
      category: "Starters"
    },
    { 
      id: 3, 
      name: "Watermelon Juice", 
      desc: "Refreshing drink with ice cubes", 
      price: 60,
      img: "https://nurturedhomes.com/wp-content/uploads/2022/05/watermelon-juice-7-768x768.jpg",
      category: "Desserts"
    },
    { 
      id: 4, 
      name: "White Sauce Pasta", 
      desc: "Topped with brocolli and crushed pepper", 
      price: 180,
      img: "https://www.recipessin.com/wp-content/uploads/2025/01/chini1_39852_Capture_the_essence_of_This_Light_and_refreshing___8e93ed82-e1f9-4854-be90-52bfee535497.jpg",
      category: "Mains"
    },
    {
      id: 5,
      name: "Chocolate Brownie",
      desc: "Warm brownie with vanilla ice cream",
      price: 90,
      img: "https://www.livinggreenandfrugally.com/wp-content/uploads/Chocolate-Brownies-served-with-vanilla-ice-cream-.jpg",
      category: "Desserts"
    },
    {
      id: 5,
      name: "Butter Chicken With Naan",
      desc: "Creamy Butter CHicken with Soft Garlicy naan",
      price: 190,
      img: "https://orders.popskitchen.in/storage/2024/09/image-183.png",
      category: "Mains"
    },
    
  ]

  const categories = ["All", "Starters", "Mains", "Desserts"]

  const filteredMenu = selectedCategory === "All" 
  ? menu 
    : menu.filter(item => item.category === selectedCategory)

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
        ? {...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, {...item, quantity: 1 }])
    }
  }

  const removeFromCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem.quantity === 1) {
      setCart(cart.filter(cartItem => cartItem.id!== item.id))
    } else {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
        ? {...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ))
    }
  }

  const getQuantity = (id) => {
    const item = cart.find(cartItem => cartItem.id === id)
    return item? item.quantity : 0
  }

  // NEW: Handle final order placement
  const handlePlaceOrder = () => {
    if (!customerInfo.name ||!customerInfo.phone ||!customerInfo.address) {
      alert('Please fill all fields')
      return
    }

    const newOrder = {
      id: `AK${Date.now().toString().slice(-6)}`,
      items: cart,
      total: finalTotal,
      customer: customerInfo,
      date: new Date().toLocaleString(),
      status: 'Preparing'
    }

    setOrderHistory([newOrder,...orderHistory])
    setOrderPlaced(true)
    setShowCheckout(false)
    setShowCart(false)
    setCart([])
    setCustomerInfo({ name: '', phone: '', address: '' })
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 30
  const finalTotal = totalPrice + deliveryFee

  return (
    <div className={`min-h-screen p-4 pb-24 transition-colors duration-200 ${darkMode? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-md mx-auto">
        
        {/* NAV BAR WITH BADGE + DARK MODE + ORDER HISTORY */}
        <nav className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${darkMode? 'text-orange-400' : 'text-orange-600'}`}>
            Authentic Kitchen
          </h1>
          <div className="flex items-center gap-3">
            {/* Order History Button */}
            <button 
              onClick={() => setShowOrders(true)}
              className={`p-2 rounded-lg text-xl ${darkMode? 'bg-gray-700' : 'bg-gray-200'}`}
            >
              📋
            </button>
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode? '☀️' : '🌙'}
            </button>
            
            {/* Cart Badge */}
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-2"
            >
              <span className="text-2xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </nav>

        <p className={`text-center mb-4 ${darkMode? 'text-gray-400' : 'text-gray-600'}`}>
          Authentic flavors from God's Own Country
        </p>

        {/* CATEGORY FILTERS */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                ? "bg-orange-500 text-white" 
                  : darkMode 
                   ? "bg-gray-700 text-gray-300 border border-gray-600" 
                    : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MENU ITEMS */}
        {filteredMenu.map((item) => {
          const quantity = getQuantity(item.id)
          return (
            <div key={item.id} className={`rounded-lg shadow-md overflow-hidden mb-4 transition-colors ${darkMode? 'bg-gray-800' : 'bg-white'}`}>
              <img 
                src={item.img} 
                alt={item.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className={`text-xl font-semibold ${darkMode? 'text-gray-100' : 'text-gray-800'}`}>{item.name}</h4>
                <p className={`text-sm mt-1 ${darkMode? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-lg font-bold text-green-500">₹{item.price}</p>
                  
                  {quantity === 0? (
                    <button 
                      onClick={() => addToCart(item)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold active:bg-orange-600"
                    >
                      Add +
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-orange-500 rounded-lg">
                      <button 
                        onClick={() => removeFromCart(item)}
                        className="text-white px-3 py-2 font-bold text-lg active:bg-orange-600 rounded-l-lg"
                      >
                        -
                      </button>
                      <span className="text-white font-bold w-4 text-center">{quantity}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="text-white px-3 py-2 font-bold text-lg active:bg-orange-600 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                  )}
                  
                </div>
              </div>
            </div>
          )
        })}

      </div>

      {/* CART BAR */}
      {totalItems > 0 && (
        <div className={`fixed bottom-0 left-0 right-0 border-t-2 border-orange-500 p-4 shadow-lg transition-colors ${darkMode? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div>
              <p className={`text-sm ${darkMode? 'text-gray-400' : 'text-gray-600'}`}>{totalItems} items</p>
              <p className={`text-xl font-bold ${darkMode? 'text-gray-100' : 'text-gray-800'}`}>₹{totalPrice}</p>
            </div>
            <button 
              onClick={() => setShowCart(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold active:bg-green-700"
            >
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* CART MODAL */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowCart(false)}>
          <div 
            className={`fixed bottom-0 left-0 right-0 rounded-t-2xl max-h- overflow-y-auto transition-colors ${darkMode? 'bg-gray-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-2xl font-bold ${darkMode? 'text-gray-100' : 'text-gray-800'}`}>Your Cart</h2>
                <button 
                  onClick={() => setShowCart(false)}
                  className={`text-2xl font-bold ${darkMode? 'text-gray-400' : 'text-gray-500'}`}
                >
                  ×
                </button>
              </div>

              {cart.length === 0? (
                <p className={`text-center py-8 ${darkMode? 'text-gray-500' : 'text-gray-500'}`}>Your cart is empty</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className={`flex items-center gap-3 py-3 border-b ${darkMode? 'border-gray-700' : 'border-gray-200'}`}>
                      <img 
                        src={item.img} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className={`font-semibold ${darkMode? 'text-gray-100' : 'text-gray-800'}`}>{item.name}</h4>
                        <p className="text-green-500 font-bold">₹{item.price}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-orange-500 rounded-lg">
                        <button 
                          onClick={() => removeFromCart(item)}
                          className="text-white px-3 py-1 font-bold text-lg active:bg-orange-600 rounded-l-lg"
                        >
                          -
                        </button>
                        <span className="text-white font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="text-white px-3 py-1 font-bold text-lg active:bg-orange-600 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className={`mt-6 pt-4 border-t-2 ${darkMode? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between mb-2">
                      <span className={darkMode? 'text-gray-400' : 'text-gray-600'}>Item Total</span>
                      <span className={`font-semibold ${darkMode? 'text-gray-100' : 'text-gray-800'}`}>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className={darkMode? 'text-gray-400' : 'text-gray-600'}>Delivery Fee</span>
                      <span className={`font-semibold ${darkMode? 'text-gray-100' : 'text-gray-800'}`}>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between mb-4 text-lg">
                      <span className={`font-bold ${darkMode? 'text-gray-100' : 'text-gray-800'}`}>To Pay</span>
                      <span className="font-bold text-green-500">₹{finalTotal}</span>
                    </div>
                    
                    <button 
                      onClick={() => {setShowCheckout(true); setShowCart(false)}}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg active:bg-green-700"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT FORM MODAL - NEW */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors ${darkMode? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${darkMode? 'text-gray-100' : 'text-gray-800'}`}>Delivery Details</h2>
              <button 
                onClick={() => setShowCheckout(false)}
                className={`text-2xl font-bold ${darkMode? 'text-gray-400' : 'text-gray-500'}`}
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-1 ${darkMode? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${darkMode? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-1 ${darkMode? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${darkMode? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-1 ${darkMode? 'text-gray-300' : 'text-gray-700'}`}>Address</label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${darkMode? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="House no, Street, Area"
                  rows="3"
                />
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t ${darkMode? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-between mb-4 text-lg">
                <span className={`font-bold ${darkMode? 'text-gray-100' : 'text-gray-800'}`}>Total</span>
                <span className="font-bold text-green-500">₹{finalTotal}</span>
              </div>
              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg active:bg-green-700"
              >
                Place Order ₹{finalTotal}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDER HISTORY MODAL - NEW */}
      {showOrders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowOrders(false)}>
          <div 
            className={`fixed inset-x-0 bottom-0 rounded-t-2xl max-h-[80vh] overflow-y-auto transition-colors ${darkMode? 'bg-gray-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-2xl font-bold ${darkMode? 'text-gray-100' : 'text-gray-800'}`}>Order History</h2>
                <button 
                  onClick={() => setShowOrders(false)}
                  className={`text-2xl font-bold ${darkMode? 'text-gray-400' : 'text-gray-500'}`}
                >
                  ×
                </button>
              </div>

              {orderHistory.length === 0? (
                <p className={`text-center py-8 ${darkMode? 'text-gray-500' : 'text-gray-500'}`}>No orders yet</p>
              ) : (
                orderHistory.map((order) => (
                  <div key={order.id} className={`p-4 rounded-lg mb-3 ${darkMode? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className={`font-bold ${darkMode? 'text-gray-100' : 'text-gray-800'}`}>{order.id}</p>
                        <p className={`text-sm ${darkMode? 'text-gray-400' : 'text-gray-600'}`}>{order.date}</p>
                      </div>
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">{order.status}</span>
                    </div>
                    <div className={`text-sm ${darkMode? 'text-gray-300' : 'text-gray-700'}`}>
                      {order.items.map(item => (
                        <p key={item.id}>{item.name} × {item.quantity}</p>
                      ))}
                    </div>
                    <p className={`font-bold mt-2 text-right ${darkMode? 'text-gray-100' : 'text-gray-800'}`}>Total: ₹{order.total}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ORDER SUCCESS POPUP */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl p-6 max-w-sm w-full text-center transition-colors ${darkMode? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-500 mb-2">Order Placed!</h2>
            <p className={`mb-2 ${darkMode? 'text-gray-400' : 'text-gray-600'}`}>Order #{orderHistory[0]?.id}</p>
            <p className={`mb-6 ${darkMode? 'text-gray-400' : 'text-gray-600'}`}>Your food will arrive in 30-40 mins</p>
            <button 
              onClick={() => setOrderPlaced(false)}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold active:bg-orange-600"
            >
              Order More Food
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
