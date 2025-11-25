/* eslint-disable react/prop-types */
// Scenario UI Renderer Component
// Renders interactive UIs for each bug hunting scenario

export default function ScenarioRenderer({ scenario, onBugClick, foundBugs, selectedBug }) {
  const BugElement = ({ bug, children, className = '', style = {} }) => {
    const isSelected = selectedBug?.id === bug.id;
    
    return (
      <div
        onClick={() => onBugClick(bug)}
        className={`cursor-pointer hover:ring-2 hover:ring-yellow-400 transition-all ${
          isSelected ? 'bg-yellow-100 ring-2 ring-yellow-500' : ''
        } ${className}`}
        style={style}
      >
        {children}
      </div>
    );
  };

  switch (scenario.id) {
    case 1:
      return <ECommerceCheckout bugs={scenario.bugs} BugElement={BugElement} foundBugs={foundBugs} />;
    case 2:
      return <SocialMediaProfile bugs={scenario.bugs} BugElement={BugElement} foundBugs={foundBugs} />;
    case 3:
      return <LoginRegistration bugs={scenario.bugs} BugElement={BugElement} foundBugs={foundBugs} />;
    case 4:
      return <DashboardAnalytics bugs={scenario.bugs} BugElement={BugElement} foundBugs={foundBugs} />;
    case 5:
      return <MobileSettings bugs={scenario.bugs} BugElement={BugElement} foundBugs={foundBugs} />;
    case 6:
      return <BlogArticle bugs={scenario.bugs} BugElement={BugElement} foundBugs={foundBugs} />;
    default:
      return <div>Scenario UI not implemented</div>;
  }
}

// Scenario 1: E-Commerce Checkout
function ECommerceCheckout({ bugs, BugElement, foundBugs }) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
      
      <div className="border-2 border-gray-200 rounded-lg p-4">
        <BugElement bug={bugs.find(b => b.id === 'bug-1-8')} className="inline-block p-2 rounded">
          <h3 className="text-lg font-semibold mb-4">Shipping Adress</h3>
        </BugElement>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <BugElement bug={bugs.find(b => b.id === 'bug-1-2')}>
              <input type="text" placeholder="user@domain" className="w-full border-2 border-gray-300 rounded px-3 py-2" />
            </BugElement>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <BugElement bug={bugs.find(b => b.id === 'bug-1-7')}>
              <input type="text" placeholder="Can type letters here" className="w-full border-2 border-gray-300 rounded px-3 py-2" />
            </BugElement>
          </div>
        </div>
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        <BugElement bug={bugs.find(b => b.id === 'bug-1-5')}>
          <input type="text" placeholder="1234 5678 9012 3456" className="w-full border-2 border-gray-300 rounded px-3 py-2" />
          <p className="text-xs text-red-500 mt-1">⚠️ No label for this field</p>
        </BugElement>
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between"><span>Subtotal:</span><span>$99.00</span></div>
          <div className="flex justify-between"><span>Tax:</span><span>$9.90</span></div>
          <BugElement bug={bugs.find(b => b.id === 'bug-1-3')} className="p-2 rounded" style={{ paddingLeft: '40px' }}>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span><span>$108.90</span>
            </div>
          </BugElement>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <input type="checkbox" className="mt-1" />
        <label className="text-sm text-gray-700">I accept the terms and conditions</label>
      </div>

      <div className="flex gap-3">
        <BugElement bug={bugs.find(b => b.id === 'bug-1-6')} className="rounded-lg">
          <button className="px-6 py-3 bg-blue-400 text-white rounded-lg font-semibold">
            Continue Shopping
          </button>
        </BugElement>
        <BugElement bug={bugs.find(b => b.id === 'bug-1-1')} className="flex-1 rounded-lg">
          <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
            Procede to Payment
          </button>
        </BugElement>
      </div>
      
      <BugElement bug={bugs.find(b => b.id === 'bug-1-4')} className="p-3 bg-yellow-50 border border-yellow-300 rounded">
        <p className="text-sm text-gray-700">⚠️ Submit button works without accepting terms</p>
      </BugElement>
    </div>
  );
}

// Scenario 2: Social Media Profile
function SocialMediaProfile({ bugs, BugElement, foundBugs }) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <BugElement bug={bugs.find(b => b.id === 'bug-2-3')} className="relative border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <img src="https://via.placeholder.com/100" alt="Profile" className="w-24 h-24 rounded-full" style={{ position: 'absolute', zIndex: 10 }} />
          <div style={{ marginLeft: '60px', marginTop: '20px' }}>
            <h2 className="text-2xl font-bold">John Doe</h2>
            <p className="text-gray-600">Software Developer</p>
            <p className="text-sm text-gray-500 mt-2"></p>
          </div>
        </div>
      </BugElement>

      <div className="flex gap-4 border-b-2 border-gray-200">
        <button className="px-4 py-2 font-semibold text-blue-600 border-b-2 border-blue-600">Posts</button>
        <BugElement bug={bugs.find(b => b.id === 'bug-2-1')} className="px-4 py-2 rounded">
          <span className="font-semibold">Freinds</span>
        </BugElement>
        <button className="px-4 py-2 font-semibold text-gray-600">Photos</button>
      </div>

      <div className="flex gap-3">
        <BugElement bug={bugs.find(b => b.id === 'bug-2-2')} className="rounded-lg">
          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold">
            Edit Profile
          </button>
        </BugElement>
        <BugElement bug={bugs.find(b => b.id === 'bug-2-4')} className="rounded-lg hover:scale-110 transition-transform">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold">Follow</button>
        </BugElement>
        <BugElement bug={bugs.find(b => b.id === 'bug-2-7')} className="rounded-lg">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold">Mesage</button>
        </BugElement>
      </div>

      <BugElement bug={bugs.find(b => b.id === 'bug-2-5')} className="border-2 border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <p style={{ color: '#d0d0d0' }}>
          This text has very low contrast (2.1:1) against white background. Fails WCAG standards.
        </p>
      </BugElement>

      <BugElement bug={bugs.find(b => b.id === 'bug-2-6')} className="inline-block rounded-lg">
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">← Back</button>
      </BugElement>
    </div>
  );
}

// Scenario 3: Login & Registration
function LoginRegistration({ bugs, BugElement, foundBugs }) {
  return (
    <div className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center text-gray-900">Create Account</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <BugElement bug={bugs.find(b => b.id === 'bug-3-7')}>
            <input type="text" placeholder="user@name#123" className="w-full border-2 border-gray-300 rounded px-3 py-2" />
            <p className="text-xs text-gray-500 mt-1">Accepts @, #, $ characters</p>
          </BugElement>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <BugElement bug={bugs.find(b => b.id === 'bug-3-5')}>
            <input type="text" placeholder="email@example.com" className="w-full border-2 border-gray-300 rounded px-3 py-2" />
            <p className="text-xs text-red-500 mt-1">No error shown for invalid email</p>
          </BugElement>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <BugElement bug={bugs.find(b => b.id === 'bug-3-1')}>
            <input type="text" placeholder="password123" className="w-full border-2 border-gray-300 rounded px-3 py-2" />
            <p className="text-xs text-red-500 mt-1">⚠️ Password visible in plain text!</p>
          </BugElement>
        </div>

        <BugElement bug={bugs.find(b => b.id === 'bug-3-2')} className="p-3 bg-yellow-50 border border-yellow-300 rounded">
          <p className="text-xs text-gray-700">No password strength indicator</p>
        </BugElement>

        <BugElement bug={bugs.find(b => b.id === 'bug-3-6')} className="space-y-3 p-2 rounded">
          <div style={{ marginLeft: '0px' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input type="text" className="w-full border-2 border-gray-300 rounded px-3 py-2" />
          </div>
          <div style={{ marginLeft: '20px' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input type="text" className="w-full border-2 border-gray-300 rounded px-3 py-2" />
          </div>
        </BugElement>

        <div className="flex items-center gap-2">
          <input type="checkbox" />
          <BugElement bug={bugs.find(b => b.id === 'bug-3-8')} className="inline-block p-1 rounded">
            <label className="text-sm text-gray-700">Rember me</label>
          </BugElement>
        </div>

        <BugElement bug={bugs.find(b => b.id === 'bug-3-4')} className="rounded-lg">
          <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
            Sign Up
          </button>
          <p className="text-xs text-red-500 mt-2 text-center">Works without filling required fields</p>
        </BugElement>

        <BugElement bug={bugs.find(b => b.id === 'bug-3-3')} className="p-3 bg-green-50 border border-green-300 rounded text-center">
          <p className="text-sm text-green-700">Sucessfully registered!</p>
        </BugElement>
      </div>
    </div>
  );
}

// Scenario 4: Dashboard Analytics
function DashboardAnalytics({ bugs, BugElement, foundBugs }) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
      
      <BugElement bug={bugs.find(b => b.id === 'bug-4-5')} className="grid grid-cols-3 gap-4 p-2 rounded">
        <div className="border-2 border-gray-200 rounded-lg p-4" style={{ height: '120px' }}>
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-3xl font-bold text-gray-900">$45,231</p>
        </div>
        <div className="border-2 border-gray-200 rounded-lg p-4" style={{ height: '150px' }}>
          <p className="text-sm text-gray-600">New Users</p>
          <p className="text-3xl font-bold text-gray-900">1,234</p>
        </div>
        <div className="border-2 border-gray-200 rounded-lg p-4" style={{ height: '130px' }}>
          <p className="text-sm text-gray-600">Orders</p>
          <p className="text-3xl font-bold text-gray-900">567</p>
        </div>
      </BugElement>

      <div className="border-2 border-gray-200 rounded-lg p-4">
        <BugElement bug={bugs.find(b => b.id === 'bug-4-2')} className="inline-block p-2 rounded">
          <h3 className="text-lg font-semibold mb-4">Monthly Reveue</h3>
        </BugElement>
        
        <BugElement bug={bugs.find(b => b.id === 'bug-4-1')} className="relative p-4 bg-gray-50 rounded" style={{ height: '200px' }}>
          <div className="absolute top-4 left-4 bg-white border-2 border-gray-300 p-2 rounded z-10">
            <p className="text-xs">Legend overlaps data</p>
          </div>
          <div className="flex items-end justify-around h-full pt-8">
            <div className="w-12 bg-blue-500" style={{ height: '60%' }}></div>
            <div className="w-12 bg-blue-500" style={{ height: '80%' }}></div>
            <div className="w-12 bg-blue-500" style={{ height: '70%' }}></div>
            <div className="w-12 bg-blue-500" style={{ height: '90%' }}></div>
          </div>
        </BugElement>
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Date Filter</h3>
        <BugElement bug={bugs.find(b => b.id === 'bug-4-3')}>
          <input type="date" className="border-2 border-gray-300 rounded px-3 py-2" defaultValue="2025-12-31" />
          <p className="text-xs text-red-500 mt-1">Can select future dates for historical data</p>
        </BugElement>
      </div>

      <BugElement bug={bugs.find(b => b.id === 'bug-4-4')} className="p-4 bg-red-50 border border-red-300 rounded">
        <p className="text-sm text-gray-700">⚠️ Loading 10,000+ records at once - page freezes</p>
      </BugElement>

      <BugElement bug={bugs.find(b => b.id === 'bug-4-6')} className="border-2 border-gray-200 rounded-lg p-4">
        <img src="https://via.placeholder.com/400x200?text=Chart+Image" alt="" className="w-full rounded" />
        <p className="text-xs text-red-500 mt-2">No alt text for screen readers</p>
      </BugElement>
    </div>
  );
}

// Scenario 5: Mobile Settings
function MobileSettings({ bugs, BugElement, foundBugs }) {
  return (
    <div className="max-w-sm mx-auto space-y-4 bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      
      <div className="border-2 border-gray-200 rounded-lg p-4">
        <BugElement bug={bugs.find(b => b.id === 'bug-5-3')} className="inline-block p-2 rounded">
          <h3 className="text-lg font-semibold mb-4">Notifcations</h3>
        </BugElement>
        
        <div className="space-y-3">
          <BugElement bug={bugs.find(b => b.id === 'bug-5-2')} className="flex items-center justify-between p-2 rounded">
            <span className="text-sm">Push Notifications</span>
            <div className="w-12 h-6 bg-blue-600 rounded-full"></div>
          </BugElement>
        </div>
      </div>

      <BugElement bug={bugs.find(b => b.id === 'bug-5-1')} className="border-2 border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">
          This is a very long setting name that gets truncated on mobile screens without any indication
        </p>
      </BugElement>

      <div className="space-y-2">
        <BugElement bug={bugs.find(b => b.id === 'bug-5-4')} className="inline-block rounded">
          <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Tiny Button</button>
          <p className="text-xs text-red-500 mt-1">Only 30x30px - too small for touch</p>
        </BugElement>
      </div>

      <BugElement bug={bugs.find(b => b.id === 'bug-5-5')} className="p-3 bg-yellow-50 border border-yellow-300 rounded">
        <p className="text-sm text-gray-700">⚠️ No back button on sub-pages</p>
      </BugElement>

      <BugElement bug={bugs.find(b => b.id === 'bug-5-6')} className="flex gap-4 items-center p-2 rounded">
        <div className="w-4 h-4 bg-gray-400"></div>
        <div className="w-6 h-6 bg-gray-400"></div>
        <div className="w-5 h-5 bg-gray-400"></div>
        <div className="w-7 h-7 bg-gray-400"></div>
      </BugElement>

      <BugElement bug={bugs.find(b => b.id === 'bug-5-7')} className="p-3 bg-blue-50 border border-blue-300 rounded">
        <p className="text-sm text-gray-700">⚠️ No focus indicators for keyboard navigation</p>
      </BugElement>
    </div>
  );
}

// Scenario 6: Blog Article
function BlogArticle({ bugs, BugElement, foundBugs }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900">How to Master QA Testing</h1>
      
      <div className="text-sm text-gray-600">
        <BugElement bug={bugs.find(b => b.id === 'bug-6-1')} className="inline-block p-1 rounded">
          <span>Publised on November 25, 2025</span>
        </BugElement>
      </div>

      <BugElement bug={bugs.find(b => b.id === 'bug-6-2')} className="p-2 rounded">
        <img src="https://via.placeholder.com/800x400" alt="Article" className="w-full max-w-full rounded" />
      </BugElement>

      <BugElement bug={bugs.find(b => b.id === 'bug-6-3')} className="space-y-4 p-2 rounded">
        <h2 className="text-xl font-semibold">Introduction</h2>
        <h2 className="text-xl font-semibold">Getting Started</h2>
        <h2 className="text-xl font-semibold">Advanced Techniques</h2>
      </BugElement>

      <BugElement bug={bugs.find(b => b.id === 'bug-6-5')} className="p-4 bg-gray-50 rounded" style={{ lineHeight: '1.2' }}>
        <p className="text-gray-700">
          This is body text with very tight line height (1.2). It makes reading difficult and tiring for users. 
          Proper line height should be between 1.5 and 1.8 for optimal readability. Notice how cramped this text feels.
        </p>
      </BugElement>

      <div className="flex gap-3">
        <BugElement bug={bugs.find(b => b.id === 'bug-6-4')} className="rounded-lg">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Share on Twitter</button>
          <p className="text-xs text-red-500 mt-1">Doesn't include article URL</p>
        </BugElement>
      </div>

      <div className="border-t-2 border-gray-200 pt-6">
        <BugElement bug={bugs.find(b => b.id === 'bug-6-6')} className="inline-block p-2 rounded">
          <h2 className="text-2xl font-bold mb-4">Coments</h2>
        </BugElement>
        <p className="text-gray-600">No comments yet.</p>
      </div>
    </div>
  );
}
