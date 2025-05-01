import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CiAlignTop } from 'react-icons/ci';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import { MdOutlineCategory } from 'react-icons/md';
import { TbTicket, TbTimelineEventPlus } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import CreateEventImage from '@/assets/images/create-events.png';
import DiscoverEventImage from '@/assets/images/discover-events.png';
import ExploreCategoriesImage from '@/assets/images/explore-categories.png';
import SecureTicketsImage from '@/assets/images/secure-tickets.png';
import TopOrganizersImage from '@/assets/images/top-organizers.png';
import { useAuth } from '@/modules/auth/queries/use-auth.query';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { TimeUtils } from '@/shared/utils/time.utils';

const HERO_SLIDES = [
  {
    title: 'Discover Events Near You',
    description: 'Find exciting events happening in your area and connect with like-minded people',
    cta: 'Explore Events',
    image: DiscoverEventImage,
    link: '/events',
    icon: FaLocationCrosshairs,
    color: 'from-indigo-600 to-purple-700'
  },
  {
    title: 'Create & Host Your Own Events',
    description: 'Share your passion with others by creating and hosting your own events',
    cta: 'Create Event',
    image: CreateEventImage,
    link: '/auth/sign-up',
    icon: TbTimelineEventPlus,
    color: 'from-blue-600 to-cyan-700'
  },
  {
    title: 'Discover Top Event Organizers',
    description: 'Follow your favorite event organizers and never miss their upcoming events',
    cta: 'View Organizers',
    image: TopOrganizersImage,
    link: '/companies',
    icon: CiAlignTop,
    color: 'from-emerald-600 to-teal-700'
  },
  {
    title: 'Secure Your Tickets',
    description: 'Easy registration and ticketing for all types of events with instant confirmation',
    cta: 'Get Tickets',
    image: SecureTicketsImage,
    link: '/events',
    icon: TbTicket,
    color: 'from-rose-600 to-pink-700'
  },
  {
    title: 'Explore Event Categories',
    description: 'Browse events by category to find exactly what interests you most',
    cta: 'Browse Categories',
    image: ExploreCategoriesImage,
    link: '/events',
    icon: MdOutlineCategory,
    color: 'from-green-600 to-emerald-700'
  }
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const nav = useNavigate();
  const { isLoggedIn, data: user } = useAuth();
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to start the auto-scroll timer
  const startAutoScrollTimer = () => {
    // Clear any existing timer first
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }

    // Set a new timer
    autoScrollTimerRef.current = setInterval(() => {
      nextSlide();
    }, TimeUtils.ONE_SECOND * 5); // Change slide every 5 seconds
  };

  useEffect(() => {
    // Start the auto-scroll timer
    startAutoScrollTimer();

    // Clean up on component unmount
    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    // Reset the timer when manually changing slides
    startAutoScrollTimer();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    // Reset the timer when manually changing slides
    startAutoScrollTimer();
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    // Reset the timer when manually changing slides
    startAutoScrollTimer();
  };

  return (
    <section className="min-h-100 w-full grid group/hero overflow-hidden">
      <div className="relative h-full w-full">
        {/* Carousel Track - Using transform for snapping effect */}
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {HERO_SLIDES.map((slide, index) => (
            <div key={index} className="min-w-full h-full relative flex-shrink-0">
              <div className="absolute inset-0 opacity-50 bg-black z-10"></div>
              <div className={cn('absolute inset-0 bg-gradient-to-r opacity-60 z-20', slide.color)}></div>
              <img
                src={slide.image || '/placeholder.svg'}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover group-hover/hero:scale-110 transition-transform duration-700 transform"
              />
              <div className="absolute inset-0 z-30 flex items-center justify-center">
                <div className="text-center max-w-3xl px-4 sm:px-6 lg:px-8">
                  <h1
                    className={cn(
                      'text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 transition-all duration-700 delay-200'
                    )}>
                    {slide.title}
                  </h1>
                  <p className={cn('text-xl md:text-2xl text-white mb-8 transition-all duration-700 delay-500')}>
                    {slide.description}
                  </p>

                  <Button
                    variant={'ghost'}
                    size={'lg'}
                    onClick={() => {
                      if (slide.cta === 'Create Event') {
                        if (!isLoggedIn) {
                          nav(slide.link);
                          return;
                        }

                        nav(`users/${user?.id}`);
                        return;
                      }

                      nav(slide.link);
                    }}
                    className="group relative overflow-hidden rounded-full text-lg text-white border-2 border-current font-semibold transition-all duration-500 hover:bg-white/10 bg-white/20">
                    <span className="absolute inset-0 bg-white/0 group-hover:bg-white/30 transition-all duration-500 transform origin-left scale-x-0 group-hover:scale-x-100"></span>
                    <span className="flex items-center justify-center">
                      <slide.icon className="mr-2 h-5 w-5 transition-transform duration-500 group-hover:scale-110" />
                      <span className="relative z-10">{slide.cta}</span>
                    </span>
                    <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-2/3 h-20 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 bg-white/20 backdrop-blur-xs text-white p-2 rounded-full hover:bg-white/30 transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 bg-white/20 backdrop-blur-xs text-white p-2 rounded-full hover:bg-white/30 transition-colors">
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex space-x-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}></button>
          ))}
        </div>
      </div>
    </section>
  );
};
