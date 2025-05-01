import type React from 'react';
import { useNavigate } from 'react-router-dom';

import { EventThemeType } from '../../event/interfaces/event.interface';

// Map event themes to icons and descriptions
const CATEGORY_DETAILS: Record<EventThemeType, { icon: React.ReactNode; description: string }> = {
  [EventThemeType.MUSIC]: {
    icon: <span className="text-purple-500">🎵</span>,
    description: 'Live concerts, festivals, and performances'
  },
  [EventThemeType.FOOD]: {
    icon: <span className="text-orange-500">🍔</span>,
    description: 'Tastings, cooking classes, and food festivals'
  },
  [EventThemeType.ART]: {
    icon: <span className="text-blue-500">🎨</span>,
    description: 'Exhibitions, performances, and workshops'
  },
  [EventThemeType.BUSINESS]: {
    icon: <span className="text-green-500">💼</span>,
    description: 'Networking, conferences, and workshops'
  },
  [EventThemeType.EDUCATION]: {
    icon: <span className="text-red-500">📚</span>,
    description: 'Courses, seminars, and educational events'
  },
  [EventThemeType.HEALTH]: {
    icon: <span className="text-yellow-500">🧘</span>,
    description: 'Wellness, fitness, and health events'
  },
  [EventThemeType.SPORTS]: {
    icon: <span className="text-indigo-500">⚽</span>,
    description: 'Games, tournaments, and fitness events'
  },
  [EventThemeType.TRAVEL]: {
    icon: <span className="text-teal-500">✈️</span>,
    description: 'Travel experiences and adventures'
  },
  [EventThemeType.FASHION]: {
    icon: <span className="text-pink-500">👗</span>,
    description: 'Fashion shows, styling events, and trends'
  },
  [EventThemeType.CULTURE]: {
    icon: <span className="text-amber-500">🏛️</span>,
    description: 'Cultural celebrations and heritage events'
  },
  [EventThemeType.SCIENCE]: {
    icon: <span className="text-cyan-500">🔬</span>,
    description: 'Scientific exhibitions and discoveries'
  },
  [EventThemeType.ENVIRONMENT]: {
    icon: <span className="text-emerald-500">🌱</span>,
    description: 'Environmental awareness and sustainability'
  },
  [EventThemeType.ENTERTAINMENT]: {
    icon: <span className="text-violet-500">🎭</span>,
    description: 'Shows, performances, and entertainment'
  },
  [EventThemeType.POLITICS]: {
    icon: <span className="text-slate-500">🗳️</span>,
    description: 'Political gatherings and discussions'
  },
  [EventThemeType.SOCIAL]: {
    icon: <span className="text-rose-500">👥</span>,
    description: 'Social gatherings and community events'
  },
  [EventThemeType.TECHNOLOGY]: {
    icon: <span className="text-gray-700">💻</span>,
    description: 'Tech conferences, workshops, and expos'
  },
  [EventThemeType.OTHER]: {
    icon: <span className="text-gray-500">✨</span>,
    description: 'Unique and special events'
  }
};

export const CategoriesSection: React.FC = () => {
  const navigate = useNavigate();

  // Get all categories from the enum
  const categories = Object.values(EventThemeType);

  // Limit to 7 categories for display
  const displayCategories = categories;

  const handleCategoryClick = (category: EventThemeType) => {
    navigate(`/events?themes=${category}`);
  };

  return (
    <section className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
        <p className="max-w-2xl mx-auto text-accent-foreground">
          Explore events by category to find exactly what you&apos;re looking for
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
        {displayCategories.map((category) => (
          <div
            key={category}
            className="flex flex-col items-center group cursor-pointer"
            onClick={() => handleCategoryClick(category)}>
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-accent mb-4 transition-all duration-300 transform group-hover:scale-110 group-hover:bg-primary-light">
              <div className="text-3xl">{CATEGORY_DETAILS[category].icon}</div>
            </div>
            <h3 className="font-semibold mb-1 group-hover:text-primary dark:group-hover:text-primary-light transition-colors duration-300 capitalize">
              {category.replace(/_/g, ' ').toLowerCase()}
            </h3>
            <p className="text-xs text-muted-foreground text-center">{CATEGORY_DETAILS[category].description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
