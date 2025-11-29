import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { ArrowLeft, ShoppingCart, Search, Star, Plus, Minus, Trash2, CreditCard } from 'lucide-react';

export default function EcommerceSimulator() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [checkoutStep, setCheckoutStep] = useState(null);

  const products = [
    { id: 1, name: 'Wireless Headphones', category: 'electronics', price: 79.99, rating: 4.5, image: '🎧', stock: 15 },
    { id: 2, name: 'Smart Watch', category: 'electronics', price: 199.99, rating: 4.8, image: '⌚', stock: 8 },
    { id: 3, name: 'Running Shoes', category: 'sports', price: 89.99, rating: 4.3, image: '👟', stock: 20 },
    { id: 4, name: 'Yoga Mat', category: 'sports', price: 29.99, rating: 4.6, image: '🧘', stock: 30 },
    { id: 5, name: 'Coffee Maker', category: 'home', price: 129.99, rating: 4.7, image: '☕', stock: 12 },
    { id: 6, name: 'Desk Lamp', category: 'home', price: 39.99, rating: 4.4, image: '💡', stock: 25 },
    { id: 7, name: 'Backpack', category: 'accessories', price: 49.99, rating: 4.5, image: '🎒', stock: 18 },
    { id: 8, name: 'Sunglasses', category: 'accessories', price: 59.99, rating: 4.2, image: '🕶️', stock: 22 }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'sports', name: 'Sports' },
    { id: 'home', name: 'Home' },
    { id: 'accessories', name: 'Accessories' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50" data-cy="ecommerce-simulator-page">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm" data-cy="ecommerce-header">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/arena/dashboard" data-cy="ecommerce-back-button">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900" data-cy="ecommerce-title">
                  ShopMart - E-Commerce Simulator
                </h1>
                <p className="text-sm text-gray-500" data-cy="ecommerce-subtitle">
                  Practice testing product browsing, cart, and checkout
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="relative"
              onClick={() => setCheckoutStep(checkoutStep ? null : 'cart')}
              data-cy="ecommerce-cart-button"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              {getTotalItems() > 0 && (
                <span 
                  className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center"
                  data-cy="ecommerce-cart-count"
                >
                  {getTotalItems()}
                </span>
              )}
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4" data-cy="ecommerce-search-section">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-cy="ecommerce-search-input"
              />
            </div>
            <div className="flex gap-2" data-cy="ecommerce-category-filters">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  data-cy={`ecommerce-category-${category.id}`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!checkoutStep ? (
          /* Product Grid */
          <div>
            <div className="mb-6" data-cy="ecommerce-results-info">
              <p className="text-gray-600" data-cy="ecommerce-results-count">
                Showing {filteredProducts.length} products
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" data-cy="ecommerce-products-grid">
              {filteredProducts.map(product => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow" data-cy={`ecommerce-product-${product.id}`}>
                  <CardHeader>
                    <div className="text-6xl text-center mb-4" data-cy={`ecommerce-product-image-${product.id}`}>
                      {product.image}
                    </div>
                    <CardTitle className="text-lg" data-cy={`ecommerce-product-name-${product.id}`}>
                      {product.name}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2 mt-2" data-cy={`ecommerce-product-rating-${product.id}`}>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900" data-cy={`ecommerce-product-price-${product.id}`}>
                          ${product.price}
                        </span>
                        <span className="text-sm text-gray-500" data-cy={`ecommerce-product-stock-${product.id}`}>
                          {product.stock} in stock
                        </span>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => addToCart(product)}
                        data-cy={`ecommerce-add-to-cart-${product.id}`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12" data-cy="ecommerce-no-results">
                <p className="text-gray-500 text-lg">No products found matching your search</p>
              </div>
            )}
          </div>
        ) : checkoutStep === 'cart' ? (
          /* Shopping Cart */
          <div data-cy="ecommerce-cart-view">
            <h2 className="text-2xl font-bold mb-6" data-cy="ecommerce-cart-title">Shopping Cart</h2>
            {cart.length === 0 ? (
              <Card data-cy="ecommerce-empty-cart">
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                  <Button onClick={() => setCheckoutStep(null)} data-cy="ecommerce-continue-shopping">
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4" data-cy="ecommerce-cart-items">
                  {cart.map(item => (
                    <Card key={item.id} data-cy={`ecommerce-cart-item-${item.id}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl" data-cy={`ecommerce-cart-item-image-${item.id}`}>
                            {item.image}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg" data-cy={`ecommerce-cart-item-name-${item.id}`}>
                              {item.name}
                            </h3>
                            <p className="text-gray-600" data-cy={`ecommerce-cart-item-price-${item.id}`}>
                              ${item.price}
                            </p>
                          </div>
                          <div className="flex items-center gap-2" data-cy={`ecommerce-cart-item-quantity-${item.id}`}>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, -1)}
                              data-cy={`ecommerce-cart-decrease-${item.id}`}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold" data-cy={`ecommerce-cart-quantity-${item.id}`}>
                              {item.quantity}
                            </span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, 1)}
                              data-cy={`ecommerce-cart-increase-${item.id}`}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg" data-cy={`ecommerce-cart-item-total-${item.id}`}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeFromCart(item.id)}
                              data-cy={`ecommerce-cart-remove-${item.id}`}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div>
                  <Card className="sticky top-24" data-cy="ecommerce-cart-summary">
                    <CardHeader>
                      <CardTitle data-cy="ecommerce-summary-title">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-gray-600" data-cy="ecommerce-summary-subtotal">
                        <span>Subtotal</span>
                        <span>${getTotalPrice()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600" data-cy="ecommerce-summary-shipping">
                        <span>Shipping</span>
                        <span>$10.00</span>
                      </div>
                      <div className="flex justify-between text-gray-600" data-cy="ecommerce-summary-tax">
                        <span>Tax</span>
                        <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-xl font-bold" data-cy="ecommerce-summary-total">
                          <span>Total</span>
                          <span>${(parseFloat(getTotalPrice()) + 10 + (getTotalPrice() * 0.1)).toFixed(2)}</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => setCheckoutStep('checkout')}
                        data-cy="ecommerce-proceed-checkout"
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        Proceed to Checkout
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setCheckoutStep(null)}
                        data-cy="ecommerce-continue-shopping-cart"
                      >
                        Continue Shopping
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Checkout Success */
          <Card className="max-w-2xl mx-auto" data-cy="ecommerce-checkout-success">
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-green-600 mb-4" data-cy="ecommerce-success-title">
                Order Placed Successfully!
              </h2>
              <p className="text-gray-600 mb-6" data-cy="ecommerce-success-message">
                Thank you for your purchase. Your order has been confirmed.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-6" data-cy="ecommerce-order-details">
                <p className="text-sm text-gray-600 mb-2">Order Number</p>
                <p className="text-2xl font-bold text-gray-900 mb-4" data-cy="ecommerce-order-number">
                  #ORD-{Math.floor(Math.random() * 100000)}
                </p>
                <p className="text-sm text-gray-600 mb-2">Total Amount</p>
                <p className="text-xl font-bold text-gray-900" data-cy="ecommerce-order-total">
                  ${(parseFloat(getTotalPrice()) + 10 + (getTotalPrice() * 0.1)).toFixed(2)}
                </p>
              </div>
              <Button 
                onClick={() => {
                  setCart([]);
                  setCheckoutStep(null);
                }}
                data-cy="ecommerce-new-order"
              >
                Start New Order
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
