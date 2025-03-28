
const ErrorState = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-playfair text-navy mb-8">Image Management</h1>
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl text-red-600 mb-2">Error loading images</h2>
          <p className="text-gray-700">Please try refreshing the page</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
