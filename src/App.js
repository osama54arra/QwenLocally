import React, { useState } from 'react';
import './App.css';
import logo from './bilsan_logo.png'; // استيراد الصورة

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // لتخزين المحادثة

  // دالة لإرسال الرسالة إلى الخادم (API)
  const sendMessage = async () => {
    if (!input.trim()) return;

    // إضافة رسالة المستخدم إلى المحادثة
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }]);

    try {
      // إرسال الرسالة إلى API
      const response = await fetch('http://127.0.0.1:5001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botResponse = data.response;

      // إضافة رد الروبوت إلى المحادثة
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: botResponse },
      ]);
    } catch (error) {
      console.error('Error communicating with the backend:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'عذرًا، حدث خطأ أثناء معالجة الطلب.' },
      ]);
    }

    // مسح مربع الإدخال
    setInput('');
  };

  return (
    <div className="App">
      {/* الصورة والوصف */}
      <header className="App-header">
        <img src={logo} alt="Bilsan Logo" className="logo" />
        <p>Ask Bilsan, Know More.</p>
      </header>

      {/* شاشة المحادثة */}
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
      </div>

      {/* مربع الإدخال والأزرار */}
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="How can I help you today?"
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {/* خيارات إضافية */}
      <div className="features">
        <button>Create image</button>
        <button>Code</button>
        <button>Make a plan</button>
        <button>News</button>
        <button>More</button>
      </div>
    </div>
  );
}

export default App;
