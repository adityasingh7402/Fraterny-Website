import React, { useState } from 'react';

const WebsiteSettings: React.FC = () => {
  const [availableSeats, setAvailableSeats] = useState('25');
  const [registrationCloseDate, setRegistrationCloseDate] = useState('31-07-2025');
  const [acceptingApplicationsDate, setAcceptingApplicationsDate] = useState('September 2025');
  const [discountedPrice, setDiscountedPrice] = useState('₹499/month');
  const [originalPrice, setOriginalPrice] = useState('₹600/month');
  const [mainDiscountedPrice, setMainDiscountedPrice] = useState('₹48,500');
  const [mainOriginalPrice, setMainOriginalPrice] = useState('₹60,000');
  const [executiveDiscountedPrice, setExecutiveDiscountedPrice] = useState('₹1,50,000');
  const [executiveOriginalPrice, setExecutiveOriginalPrice] = useState('₹2,00,000');

  // Calculate days left until registration closes
  const calculateDaysLeft = () => {
    const closeDate = new Date(registrationCloseDate.split('-').reverse().join('-'));
    const today = new Date();
    const timeDiff = closeDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };

  const handleSaveSeats = () => {
    // Add save functionality here
    console.log('Saving available seats:', availableSeats);
  };

  const handleSaveCloseDate = () => {
    // Add save functionality here
    console.log('Saving registration close date:', registrationCloseDate);
  };

  const handleSaveApplicationsDate = () => {
    // Add save functionality here
    console.log('Saving accepting applications date:', acceptingApplicationsDate);
  };

  const handleSaveDiscountedPrice = () => {
    // Add save functionality here
    console.log('Saving discounted price:', discountedPrice);
  };

  const handleSaveOriginalPrice = () => {
    // Add save functionality here
    console.log('Saving original price:', originalPrice);
  };

  const handleSaveMainDiscountedPrice = () => {
    // Add save functionality here
    console.log('Saving main discounted price:', mainDiscountedPrice);
  };

  const handleSaveMainOriginalPrice = () => {
    // Add save functionality here
    console.log('Saving main original price:', mainOriginalPrice);
  };

  const handleSaveExecutiveDiscountedPrice = () => {
    // Add save functionality here
    console.log('Saving executive discounted price:', executiveDiscountedPrice);
  };

  const handleSaveExecutiveOriginalPrice = () => {
    // Add save functionality here
    console.log('Saving executive original price:', executiveOriginalPrice);
  };

  const handleSaveAllChanges = () => {
    // Add save all functionality here
    console.log('Saving all changes');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Website Settings</h1>
      
      {/* Registration Settings */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Registration Settings</h2>
        
        {/* Available Seats */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Seats
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSaveSeats}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Registration Close Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Close Date
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={registrationCloseDate.split('-').reverse().join('-')}
              onChange={(e) => setRegistrationCloseDate(e.target.value.split('-').reverse().join('-'))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSaveCloseDate}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Save
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Days left until registration closes: {calculateDaysLeft()}
          </p>
        </div>

        {/* Accepting Applications For Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accepting Applications For Date
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={acceptingApplicationsDate}
              onChange={(e) => setAcceptingApplicationsDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSaveApplicationsDate}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Save
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            The date to display on the website (e.g. "Currently accepting applications for February 2026")
          </p>
        </div>
      </div>

      {/* Insider Access Pricing */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Insider Access Pricing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Discounted Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discounted Price
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSaveDiscountedPrice}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          {/* Original Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSaveOriginalPrice}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Experience Pricing */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Main Experience Pricing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Discounted Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discounted Price
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={mainDiscountedPrice}
                onChange={(e) => setMainDiscountedPrice(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSaveMainDiscountedPrice}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          {/* Main Original Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={mainOriginalPrice}
                onChange={(e) => setMainOriginalPrice(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSaveMainOriginalPrice}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Escape Pricing */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Executive Escape Pricing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Executive Discounted Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discounted Price
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={executiveDiscountedPrice}
                onChange={(e) => setExecutiveDiscountedPrice(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSaveExecutiveDiscountedPrice}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          {/* Executive Original Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={executiveOriginalPrice}
                onChange={(e) => setExecutiveOriginalPrice(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSaveExecutiveOriginalPrice}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save All Changes Button */}
      <div className="mt-8">
        <button
          onClick={handleSaveAllChanges}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
};

export default WebsiteSettings;