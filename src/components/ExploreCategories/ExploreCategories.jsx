import { useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './ExploreCategories.css'
import { category_list } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatCategoryName } from '../../utils/seoHelpers'

const ExploreCategories = ({ category, setCategory }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const { categories } = useContext(StoreContext);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className='explore-categories' id='categories-section'>
      <div className="explore-categories-header">
        <h1>أستكشف فئاتنا</h1>
        <p className='explore-categories-text'>قطع غيار أصلية وإلكترونيات عالية الجودة.</p>
      </div>

      <div className="categories-slider-wrapper">
        <button className="scroll-btn left" onClick={() => scroll('left')} aria-label="تمرير لليسار">
          <ChevronLeft size={24} aria-hidden="true" />
        </button>

        <div className="explore-categories-list" ref={scrollRef}>
          {(categories && categories.length > 0 ? categories : category_list).map((item, index) => {
            const name = item.nameAr || item.category_name;
            const slug = item.slug || item.category_slug;
            const image = item.image || item.category_image;

            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  navigate(`/category/${slug}`);
                  window.scrollTo(0, 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/category/${slug}`);
                    window.scrollTo(0, 0);
                  }
                }}
                className={`explore-categories-item ${category === name ? "active" : ""}`}
                aria-label={`تصفح فئة ${name}`}
                aria-current={category === name ? 'true' : undefined}
              >
                <div className="category-img-wrapper">
                  <img src={image} alt="" aria-hidden="true" />
                </div>
                <p>{formatCategoryName(name)}</p>
              </button>
            )
          })}
        </div>

        <button className="scroll-btn right" onClick={() => scroll('right')} aria-label="تمرير لليمين">
          <ChevronRight size={24} aria-hidden="true" />
        </button>
      </div>
      <hr className="categories-hr" />
    </div>
  )
}

export default ExploreCategories
