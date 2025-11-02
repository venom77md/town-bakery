'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 space-x-reverse ${
              type === 'success'
                ? 'bg-green-600 text-white'
                : type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            <span className="text-xl">
              {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span className="font-semibold">{message}</span>
            <button
              onClick={onClose}
              className="mr-auto text-white hover:text-gray-200"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

