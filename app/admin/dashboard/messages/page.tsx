'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  message: string;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contacts');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">جاري التحميل...</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-3xl font-bold text-brown mb-8">الرسائل</h2>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedMessage(message)}
              className={`bg-light-yellow rounded-lg p-4 cursor-pointer transition-all ${
                selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-brown">{message.name}</p>
                  {message.email && (
                    <p className="text-sm text-light-brown">{message.email}</p>
                  )}
                  <p className="text-sm text-light-brown mt-2 line-clamp-2">
                    {message.message}
                  </p>
                </div>
                <p className="text-xs text-light-brown">
                  {new Date(message.createdAt).toLocaleDateString('ar-EG')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        {messages.length === 0 && (
          <div className="text-center py-12 text-light-brown">
            لا توجد رسائل
          </div>
        )}
      </div>

      {selectedMessage && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-light-yellow rounded-lg p-6 shadow-md sticky top-8"
        >
          <h3 className="text-2xl font-bold text-brown mb-4">تفاصيل الرسالة</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-light-brown">الاسم</p>
              <p className="font-bold text-brown">{selectedMessage.name}</p>
            </div>
            {selectedMessage.email && (
              <div>
                <p className="text-sm text-light-brown">البريد الإلكتروني</p>
                <p className="font-bold text-brown">{selectedMessage.email}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-light-brown">التاريخ</p>
              <p className="font-bold text-brown">
                {new Date(selectedMessage.createdAt).toLocaleString('ar-EG')}
              </p>
            </div>
            <div>
              <p className="text-sm text-light-brown mb-2">الرسالة</p>
              <p className="text-brown leading-relaxed">{selectedMessage.message}</p>
            </div>
            <button
              onClick={() => setSelectedMessage(null)}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
            >
              إغلاق
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

