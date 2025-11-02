'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images, productName }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg mb-4">
        <Image
          src={images[currentIndex] || images[0]}
          alt={`${productName} - صورة ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === idx 
                  ? 'border-primary ring-2 ring-primary ring-offset-2' 
                  : 'border-transparent hover:border-warm-brown'
              }`}
              aria-label={`عرض صورة ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${productName} ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

