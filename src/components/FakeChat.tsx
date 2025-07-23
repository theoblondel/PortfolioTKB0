import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Download } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface Message {
  id: number;
  type: 'client' | 'you';
  content: string;
  timestamp: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  attachmentUrl?: string;
}

export default function FakeChat() {
  const { t } = useApp();
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTypingMessage, setCurrentTypingMessage] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const messages: Message[] = [
    {
      id: 1,
      type: 'client',
      content: t('fakeChat.message1'),
      timestamp: t('fakeChat.timestamp1')
    },
    {
      id: 2,
      type: 'you',
      content: t('fakeChat.message2'),
      timestamp: t('fakeChat.timestamp2')
    },
    {
      id: 3,
      type: 'client',
      content: t('fakeChat.message3'),
      timestamp: t('fakeChat.timestamp3')
    },
    {
      id: 4,
      type: 'you',
      content: t('fakeChat.message4'),
      timestamp: t('fakeChat.timestamp4')
    },
    {
      id: 5,
      type: 'client',
      content: t('fakeChat.message5'),
      timestamp: t('fakeChat.timestamp5'),
      hasAttachment: true,
      attachmentName: t('fakeChat.attachmentName1'),
      attachmentUrl: '/DSC00831.png'
    },
    {
      id: 6,
      type: 'you',
      content: t('fakeChat.message6'),
      timestamp: t('fakeChat.timestamp6')
    },
    {
      id: 7,
      type: 'you',
      content: t('fakeChat.message7'),
      timestamp: t('fakeChat.timestamp7'),
      hasAttachment: true,
      attachmentName: t('fakeChat.attachmentName2'),
      attachmentUrl: '/DSC00831.png'
    },
    {
      id: 8,
      type: 'client',
      content: t('fakeChat.message8'),
      timestamp: t('fakeChat.timestamp8')
    }
  ];

  // Reset animation when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          startAnimation();
        } else if (!entry.isIntersecting && hasStarted) {
          // Reset when section leaves viewport
          resetAnimation();
        }
      },
      {
        threshold: 0.4, // Trigger when 40% of section is visible
        rootMargin: '-100px 0px -100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  const resetAnimation = () => {
    setVisibleMessages([]);
    setIsTyping(false);
    setHasStarted(false);
    setCurrentTypingMessage(null);
  };

  const startAnimation = async () => {
    // Clear any existing messages
    setVisibleMessages([]);
    setIsTyping(false);
    setCurrentTypingMessage(null);

    // Wait a bit before starting
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Start the animation sequence with improved timing
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      
      // Show typing indicator before each message (except the first one)
      if (i > 0) {
        setCurrentTypingMessage(message.id);
        setIsTyping(true);
        
        // Typing duration varies based on message length and type
        const typingDuration = message.type === 'you' 
          ? (message.hasAttachment ? 2500 : 1800) // Longer for attachments
          : 1200; // Shorter for client messages
        
        await new Promise(resolve => setTimeout(resolve, typingDuration));
        setIsTyping(false);
        setCurrentTypingMessage(null);
      }
      
      // Show the message
      setVisibleMessages(prev => [...prev, message.id]);
      
      // Wait before next message (shorter for quick responses)
      const waitTime = i === 0 ? 800 : // First message
                     (i === 2 || i === 4 || i === 6) ? 1000 : // Quick responses
                     1500; // Normal responses
      
      if (i < messages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  };

  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.5
      }
    }
  };

  const typingVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 15 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20
      }
    }
  };

  const chatVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      ref={sectionRef}
      className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Chat Interface */}
        <motion.div
          variants={chatVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Chat Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-t-2xl border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="w-3 h-3 bg-red-500 rounded-full"
                />
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="w-3 h-3 bg-yellow-500 rounded-full"
                />
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
              </div>
              <div className="flex items-center gap-3 flex-1">
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                  className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 text-white dark:text-black" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <h3 className="font-semibold text-black dark:text-white">{t('fakeChat.clientName')}</h3>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('fakeChat.onlineStatus')}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Chat Messages */}
          <div className="bg-white dark:bg-gray-800 rounded-b-2xl p-4 sm:p-6 min-h-[600px] max-h-[700px] overflow-y-auto shadow-lg">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  visibleMessages.includes(message.id) && (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      layout
                      className={`flex ${message.type === 'you' ? 'justify-end' : 'justify-start'}`}
                    >
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className={`max-w-[80%] sm:max-w-[70%] ${
                          message.type === 'client' 
                            ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white' 
                            : 'bg-black dark:bg-white text-white dark:text-black'
                        } rounded-2xl px-4 py-3 shadow-md hover:shadow-lg transition-all cursor-pointer`}
                      >
                        <div 
                          className="text-sm sm:text-base leading-relaxed text-balance"
                          dangerouslySetInnerHTML={{ __html: message.content }}
                        />
                        
                        {message.hasAttachment && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.4, type: "spring" }}
                            className="mt-3 p-3 bg-white/10 dark:bg-black/10 rounded-xl border border-white/20 dark:border-black/20 backdrop-blur-sm"
                          >
                            <div className="flex items-center gap-3">
                              <motion.div 
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="w-8 h-8 bg-white/20 dark:bg-black/20 rounded-lg flex items-center justify-center"
                              >
                                <Download className="w-4 h-4" />
                              </motion.div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{message.attachmentName}</p>
                                <p className="text-xs opacity-70">{t('fakeChat.attachmentLabel')}</p>
                              </div>
                              <motion.button
                                onClick={() => handleDownload(message.attachmentUrl!, message.attachmentName!)}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-xs px-3 py-1 bg-white/20 dark:bg-black/20 rounded-full hover:bg-white/30 dark:hover:bg-black/30 transition-all shadow-sm"
                              >
                                {t('fakeChat.downloadButton')}
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                        
                        <div className={`text-xs mt-2 opacity-70 ${
                          message.type === 'you' ? 'text-right' : 'text-left'
                        }`}>
                          {message.timestamp}
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    variants={typingVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    layout
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 max-w-[200px] shadow-md">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('fakeChat.typingIndicator')}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}