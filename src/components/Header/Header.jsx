import React from 'react'
import './Header.css'

const Header = () => {
  const scrollToProducts = () => {
    const section = document.getElementById('products-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className='header'>
      <div className="header-contents">
        <h1>El-Masry Electronics | المصري لقطع غيار الشاشات والكاميرات في مصر</h1>
        <p>المصري إلكترونك هو وجهتك الأولى للحصول على أفضل قطع غيار الشاشات والكاميرات في مصر. نحن نوفر كوفات المصرى، ليدات المصرى، تيكونات المصرى، وبورد المصرى بأعلى جودة وأقل سعر. El-Masry Electronics provides the best genuine screen parts including LEDs, T-cons, Boards, and COFs with fast delivery across Egypt.</p>
        <button onClick={scrollToProducts}>أستعرض المنتجات</button>
      </div>
    </div>
  )
}

export default Header
