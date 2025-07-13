import { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight} from 'lucide-react';

const animationStyles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
  }
  
  .animation-delay-150 {
    animation-delay: 0.15s;
  }
  
  .animation-delay-300 {
    animation-delay: 0.3s;
  }
  
  .animation-delay-500 {
    animation-delay: 0.5s;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = animationStyles;
  document.head.appendChild(styleElement);
}

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const slides = useMemo(() => [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Latest Technology",
      subtitle: "Discover amazing deals on cutting-edge devices",
      cta: "Shop Electronics"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Premium Quality",
      subtitle: "Best in class products for every lifestyle",
      cta: "Explore Collection"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80",
      title: "Innovation Hub",
      subtitle: "The future of shopping is here today",
      cta: "Discover More"
    }
  ], []);

  const onTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  }, [touchStart, touchEnd, slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length, isAutoPlaying]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      } else if (event.key === ' ') {
        event.preventDefault();
        setIsAutoPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleMouseEnter = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);


  return (
    <div className="h-[100vh] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="relative w-full mx-auto">
        <div 
          className="relative h-[100vh] sm:h-[90vh] md:h-[85vh] lg:h-[90vh] xl:h-[95vh] overflow-hidden shadow-2xl bg-gradient-to-r from-violet-900 via-indigo-900 to-blue-900"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-purple-500 opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-indigo-500 opacity-10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-blue-500 opacity-10 rounded-full translate-y-1/2 blur-3xl animate-pulse"></div>
          </div>

          {/* Slides */}
          <div className="relative w-full h-full">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0 scale-100'
                    : index < currentSlide
                      ? 'opacity-0 -translate-x-full scale-95'
                      : 'opacity-0 translate-x-full scale-95'
                }`}
              >
                <div className="relative w-full h-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover filter brightness-75 hover:brightness-90 transition-all duration-700"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center justify-center sm:justify-start px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
                    <div className="max-w-4xl text-center sm:text-left">
                      {/* Badge */}
                      <div className="mb-4 sm:mb-6 overflow-hidden">
                        <span className="inline-block px-3 py-1.5 sm:px-6 sm:py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full transform animate-fade-in-up shadow-lg">
                          Featured Collection
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-3 sm:mb-4 md:mb-6 text-white tracking-tight leading-tight animate-fade-in-up animation-delay-150">
                        <span className="inline-block bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-2xl">
                          {slide.title}
                        </span>
                      </h1>
                      
                      {/* Subtitle */}
                      <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-10 text-gray-100 max-w-xs sm:max-w-md md:max-w-lg animate-fade-in-up animation-delay-300 font-light leading-relaxed mx-auto sm:mx-0">
                        {slide.subtitle}
                      </p>
                      
                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-500">
                        <button 
                          className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-4 py-3 sm:px-6 md:px-8 lg:py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-pink-500/30 flex items-center justify-center group transform hover:scale-105 text-sm sm:text-base"
                          onClick={() => window.location.href = '/shopping'}
                        >
                          <span>{slide.cta}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                        <button className="border-2 border-white/30 hover:border-white/80 text-white px-4 py-3 sm:px-6 md:px-8 lg:py-4 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm hover:bg-white/10 text-sm sm:text-base transform hover:scale-105">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 lg:left-8 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-2 sm:p-3 lg:p-4 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-black/10 border border-white/10 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 lg:right-8 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-2 sm:p-3 lg:p-4 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-black/10 border border-white/10 z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 bg-black/20 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-white/10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-110 shadow-md shadow-white/30'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-pink-600 transition-all duration-300 ease-linear"
              style={{ 
                width: isAutoPlaying ? `${((currentSlide + 1) / slides.length) * 100}%` : '0%' 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
