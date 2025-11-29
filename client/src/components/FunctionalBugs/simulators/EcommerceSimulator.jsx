import React, { useState } from 'react';
import { ShoppingCart, Trash2, Tag } from 'lucide-react';

const EcommerceSimulator = ({ bug, onBugFound, disabled }) => {
  const bugId = bug.bugId;

  // FB016: Cart Total Doesn't Update After Removing Item
  if (bugId === 'FB016') {
    return <CartTotalBugScenario onBugFound={onBugFound} disabled={disabled} />;
  }

  // FB017: Discount Code Applied Multiple Times
  if (bugId === 'FB017') {
    return <DiscountCodeBugScenario onBugFound={onBugFound} disabled={disabled} />;
  }

  return <div>E-commerce simulator for {bugId} coming soon...</div>;
};

// FB016: Cart Total Doesn't Update After Removing Item
const CartTotalBugScenario = ({ onBugFound, disabled }) => {
  const [items, setItems] = useState([
    { id: 1, name: 'Wireless Mouse', price: 40 },
    { id: 2, name: 'USB Cable', price: 30 },
    { id: 3, name: 'Keyboard', price: 30 }
  ]);
  const [total, setTotal] = useState(100); // BUG: Total not updated when item removed
  const [removedItem, setRemovedItem] = useState(null);

  const handleRemoveItem = (itemId) => {
    if (disabled) return;

    const item = items.find(i => i.id === itemId);
    setRemovedItem(item);
    setItems(items.filter(i => i.id !== itemId));
    
    // BUG: Total is NOT updated here!
    // setTotal(total - item.price); // This line is missing!
    
    setTimeout(() => {
      if (onBugFound) onBugFound();
    }, 1000);
  };

  const actualTotal = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ShoppingCart className="h-7 w-7" />
          Shopping Cart
        </h2>
        <p className="text-gray-600">
          Remove an item and check if the total updates
        </p>
      </div>

      {/* Cart Items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">Quantity: 1</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-semibold text-gray-900">${item.price}</p>
              <button
                onClick={() => handleRemoveItem(item.id)}
                disabled={disabled}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Total */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold">${total}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span className="text-blue-600">${total}</span>
        </div>
      </div>

      {removedItem && (
        <div className="mt-6 space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              ✓ {removedItem.name} removed from cart
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              🤔 You removed a ${removedItem.price} item. Is the total correct?
              <br />
              <span className="text-xs">Hint: Try refreshing the page or calculating manually</span>
            </p>
          </div>

          {total !== actualTotal && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                Expected total: ${actualTotal} | Displayed total: ${total}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// FB017: Discount Code Applied Multiple Times
const DiscountCodeBugScenario = ({ onBugFound, disabled }) => {
  const [subtotal] = useState(100);
  const [discountCode, setDiscountCode] = useState('');
  const [discountsApplied, setDiscountsApplied] = useState(0);
  const discountPercent = 10;

  const handleApplyDiscount = () => {
    if (disabled || discountCode !== 'SAVE10') return;

    // BUG: No check to prevent applying discount multiple times
    setDiscountsApplied(discountsApplied + 1);
    
    if (discountsApplied >= 1) {
      setTimeout(() => {
        if (onBugFound) onBugFound();
      }, 500);
    }
  };

  const totalDiscount = subtotal * (discountPercent / 100) * discountsApplied;
  const total = subtotal - totalDiscount;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Tag className="h-7 w-7" />
          Apply Discount Code
        </h2>
        <p className="text-gray-600">
          Use code "SAVE10" for 10% off
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        {discountsApplied > 0 && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Discount ({discountPercent}% × {discountsApplied}):</span>
            <span>-${totalDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Total:</span>
          <span className="text-blue-600">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Discount Code Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
              disabled={disabled}
            />
            <button
              onClick={handleApplyDiscount}
              disabled={disabled || !discountCode}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg"
            >
              Apply
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Try clicking "Apply" multiple times with the same code
          </p>
        </div>
      </div>

      {discountsApplied > 0 && (
        <div className="mt-6 space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              ✓ Discount code applied {discountsApplied} time{discountsApplied > 1 ? 's' : ''}
            </p>
          </div>

          {discountsApplied > 1 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                🤔 Should the same discount code be applied multiple times?
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EcommerceSimulator;
