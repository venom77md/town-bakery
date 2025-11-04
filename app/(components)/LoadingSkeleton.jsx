'use client';

export function ProductCardSkeleton() {
  return (
    <div className="bg-light-yellow rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="relative h-64 w-full bg-warm-brown/20"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-warm-brown/20 rounded w-3/4"></div>
        <div className="h-4 bg-warm-brown/20 rounded w-full"></div>
        <div className="h-4 bg-warm-brown/20 rounded w-5/6"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-warm-brown/20 rounded w-24"></div>
          <div className="h-10 bg-warm-brown/20 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-12 animate-pulse">
      <div className="relative h-96 md:h-[500px] rounded-lg bg-warm-brown/20"></div>
      <div className="space-y-6">
        <div className="h-12 bg-warm-brown/20 rounded w-3/4"></div>
        <div className="h-6 bg-warm-brown/20 rounded w-1/2"></div>
        <div className="h-10 bg-warm-brown/20 rounded w-32"></div>
        <div className="space-y-3">
          <div className="h-4 bg-warm-brown/20 rounded w-full"></div>
          <div className="h-4 bg-warm-brown/20 rounded w-full"></div>
          <div className="h-4 bg-warm-brown/20 rounded w-5/6"></div>
        </div>
        <div className="h-14 bg-warm-brown/20 rounded w-full"></div>
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 items-center bg-cream rounded-lg p-4 animate-pulse">
      <div className="w-24 h-24 rounded-lg bg-warm-brown/20"></div>
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-warm-brown/20 rounded w-3/4"></div>
        <div className="h-4 bg-warm-brown/20 rounded w-1/4"></div>
      </div>
      <div className="h-10 bg-warm-brown/20 rounded w-24"></div>
      <div className="h-8 bg-warm-brown/20 rounded w-20"></div>
    </div>
  );
}

