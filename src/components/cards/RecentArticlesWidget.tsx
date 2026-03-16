import React, { useState } from 'react';
import { ASKGT_ARTICLES } from '@/utils/constants';
import { AskGTArticle } from '@/utils/types';
import { 
  HeartIcon, 
  EyeIcon, 
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const RecentArticlesWidget: React.FC = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['2'])); // Örnek favori

  // Son 3 makaleyi al
  const recentArticles = ASKGT_ARTICLES
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 3);

  const toggleFavorite = (articleId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(articleId)) {
      newFavorites.delete(articleId);
    } else {
      newFavorites.add(articleId);
    }
    setFavorites(newFavorites);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Son Makaleler</h3>
            <p className="text-sm text-gray-500">AskGT'den yeni yazılar</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-700 transition-colors">
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {recentArticles.map((article) => (
          <ArticlePreview
            key={article.id}
            article={article}
            isFavorite={favorites.has(article.id)}
            onToggleFavorite={() => toggleFavorite(article.id)}
            formatDate={formatDate}
          />
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
          Tüm makaleleri görüntüle
        </button>
      </div>
    </div>
  );
};

// Article Preview Component
interface ArticlePreviewProps {
  article: AskGTArticle;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  formatDate: (date: string) => string;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ 
  article, 
  isFavorite, 
  onToggleFavorite, 
  formatDate 
}) => {
  return (
    <div className="group cursor-pointer">
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden">
            <img
              src={article.thumbnailUrl || `https://picsum.photos/seed/${article.id}/64/64`}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                {article.author.name}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {isFavorite ? (
                <HeartSolidIcon className="h-4 w-4 text-red-500" />
              ) : (
                <HeartIcon className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              <span>{article.readTime}dk</span>
            </div>
            <div className="flex items-center gap-1">
              <EyeIcon className="h-3 w-3" />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <HeartIcon className="h-3 w-3" />
              <span>{article.likes}</span>
            </div>
            <span>{formatDate(article.publishDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentArticlesWidget;
