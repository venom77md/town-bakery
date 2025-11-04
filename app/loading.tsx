export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-light-yellow to-cream flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block mb-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🍞</span>
          </div>
        </div>
        <p className="text-brown text-lg font-semibold">جاري التحميل...</p>
      </div>
    </div>
  );
}
