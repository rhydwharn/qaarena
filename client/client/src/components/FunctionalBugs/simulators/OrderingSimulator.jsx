import React, { useState } from 'react';
import { Package, Calendar, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

const OrderingSimulator = ({ bug, onBugFound, disabled }) => {
  const bugId = bug.bugId;

  // FB031: Wrong Delivery Date
  const DeliveryDateBug = () => {
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState('');

    const placeOrder = () => {
      // BUG: Doesn't include processing day
      // const orderDay = 'Monday';
      const shippingDays = 3;
      // Should be: Monday + 1 processing + 3 shipping = Friday (4 days total)
      // But shows: Monday + 3 shipping = Thursday (wrong - missing processing day)
      
      // Buggy calculation - doesn't add processing day
      const daysToAdd = shippingDays; // Should be shippingDays + processingDays (1) = 4
      const deliveryDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const orderDayIndex = 0; // Monday
      const deliveryDayIndex = (orderDayIndex + daysToAdd) % 7;
      
      setDeliveryDate(deliveryDays[deliveryDayIndex]); // Shows Thursday (wrong), should be Friday
      setOrderPlaced(true);
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            Place Your Order
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Order Date:</p>
              <p className="text-lg font-semibold text-gray-900">Monday</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Shipping Option:</p>
              <p className="text-lg font-semibold text-gray-900">3-Day Shipping</p>
              <p className="text-xs text-gray-500 mt-1">Plus 1 day processing time</p>
            </div>

            {!orderPlaced ? (
              <button
                onClick={placeOrder}
                disabled={disabled}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Place Order
              </button>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 mb-2">Order Confirmed!</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Order Number:</span>
                        <span className="font-mono text-sm">#ORD-12345</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Estimated Delivery:</span>
                        <span className="font-semibold text-lg text-blue-600">{deliveryDate}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <p className="text-xs text-gray-600">
                        <strong>Expected:</strong> Friday (Mon + 1 processing + 3 shipping = 4 days)
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        <strong>Shown:</strong> {deliveryDate} {deliveryDate === 'Thursday' && '❌'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900">Testing Hint:</p>
              <p className="text-sm text-yellow-800 mt-1">
                Calculate the delivery date manually. Does it match what's shown?
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // FB032: Duplicate Orders on Double-Click
  const DuplicateOrderBug = () => {
    const [orders, setOrders] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const cartTotal = 100;

    const placeOrder = () => {
      // BUG: No button disable or request deduplication
      // Allows multiple clicks to create duplicate orders
      
      const newOrder = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        amount: cartTotal,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setOrders(prev => [...prev, newOrder]);
      
      // Simulate processing delay (but button stays enabled - BUG!)
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    };

    const resetOrders = () => {
      setOrders([]);
      setIsProcessing(false);
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-purple-600" />
            Checkout
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Cart Total:</span>
                <span className="text-2xl font-bold text-gray-900">${cartTotal}</span>
              </div>
              <div className="text-sm text-gray-500">
                Payment Method: Credit Card ****1234
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={placeOrder}
                disabled={disabled}
                className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isProcessing 
                    ? 'bg-gray-400 text-white cursor-wait' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
              
              {orders.length > 0 && (
                <button
                  onClick={resetOrders}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                💡 <strong>Tip:</strong> Try clicking "Place Order" multiple times quickly!
              </p>
            </div>
          </div>
        </div>

        {orders.length > 0 && (
          <div className={`rounded-lg p-4 border-2 ${
            orders.length > 1 
              ? 'bg-red-50 border-red-300' 
              : 'bg-green-50 border-green-300'
          }`}>
            <div className="flex items-start gap-3 mb-3">
              {orders.length > 1 ? (
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h4 className={`font-semibold mb-2 ${
                  orders.length > 1 ? 'text-red-900' : 'text-green-900'
                }`}>
                  {orders.length > 1 
                    ? `⚠️ ${orders.length} Orders Created!` 
                    : 'Order Confirmed'}
                </h4>
                
                <div className="space-y-2">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded p-3 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-mono text-sm text-gray-600">#{order.id}</p>
                          <p className="text-xs text-gray-500">{order.timestamp}</p>
                        </div>
                        <p className="font-bold text-lg">${order.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {orders.length > 1 && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <p className="text-sm text-red-800">
                      <strong>Total Charged:</strong> ${orders.length * cartTotal}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Multiple orders created from rapid clicking!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900">Testing Hint:</p>
              <p className="text-sm text-yellow-800 mt-1">
                What happens if you click the button multiple times quickly? Should that be allowed?
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render appropriate simulator based on bugId
  const renderSimulator = () => {
    switch (bugId) {
      case 'FB031':
        return <DeliveryDateBug />;
      case 'FB032':
        return <DuplicateOrderBug />;
      default:
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              This simulator is under development. Check back soon!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Package className="h-7 w-7 text-blue-600" />
          Ordering System Simulator
        </h2>
        <p className="text-gray-600">
          {bug.title}
        </p>
      </div>

      {renderSimulator()}

      {!disabled && (
        <button
          onClick={onBugFound}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <AlertCircle className="h-5 w-5" />
          I Found the Bug!
        </button>
      )}
    </div>
  );
};

export default OrderingSimulator;
