import React, { useState, useMemo } from 'react';
import { ASKGT_ARTICLES, ASKGT_CATEGORIES } from '@/utils/constants';
import { AskGTArticle } from '@/utils/types';
import {
  MagnifyingGlassIcon,
  HeartIcon,
  EyeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const AskGTPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('jboss');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['2', '5']));

  const filteredArticles = useMemo(() => {
    let filtered = ASKGT_ARTICLES;

    // Arama varsa tüm makalelerde ara, yoksa kategoriye göre filtrele
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.author.name.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    } else if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    return filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (articleId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(articleId)) {
      newFavorites.delete(articleId);
    } else {
      newFavorites.add(articleId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      {/* Search Header - Iconic Style */}
      <div className="bg-white border-b border-gray-200 py-12 px-4 shadow-sm relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#2993A3] rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2993A3] rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
            How can we help you today?
          </h1>
          <p className="text-gray-500 mb-8 text-lg">
            Search our knowledge base for tips, tricks, and documentation.
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 group-focus-within:text-[#2993A3] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search articles, guides, and tutorials..."
              className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 text-lg shadow-lg shadow-gray-100 group-hover:shadow-xl transition-all focus:ring-4 focus:ring-[#2993A3]/10 focus:border-[#2993A3] outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar - Categories & Popular */}
          <aside className="lg:w-72 shrink-0 space-y-8">
            {/* Categories Widget */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-3">
                Categories
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === 'all'
                    ? 'bg-[#2993A3] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">📁</span>
                    <span>All Articles</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-md ${selectedCategory === 'all' ? 'bg-white/20' : 'bg-gray-100'}`}>
                    {ASKGT_ARTICLES.length}
                  </span>
                </button>
                {ASKGT_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === category.id
                      ? 'bg-[#2993A3] text-white shadow-md shadow-[#2993A3]/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-md ${selectedCategory === category.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {ASKGT_ARTICLES.filter(a => a.category === category.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-3">
                Hot Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Performance', 'Security', 'Caching', 'Cloud', 'Automation', 'Networking'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-[#F4F7F6] text-gray-600 text-[11px] font-bold uppercase rounded-lg border border-gray-100 cursor-pointer hover:border-[#2993A3] hover:text-[#2993A3] transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {searchQuery.trim()
                  ? 'Search Results'
                  : (selectedCategory === 'all' ? 'Featured Articles' : ASKGT_CATEGORIES.find(c => c.id === selectedCategory)?.name + ' Guides')}
              </h2>
              <p className="text-sm text-gray-500">
                Found <span className="font-bold text-gray-700">{filteredArticles.length}</span> results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <IconicArticleCard
                  key={article.id}
                  article={article}
                  isFavorite={favorites.has(article.id)}
                  onToggleFavorite={() => toggleFavorite(article.id)}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredArticles.length === 0 && (
              <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                <div className="text-gray-300 mb-6 flex justify-center">
                  <div className="p-6 bg-gray-50 rounded-full">
                    <MagnifyingGlassIcon className="h-20 w-20" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No matching articles found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Try adjusting your search keywords or select a different category to explore.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const IconicArticleCard: React.FC<{
  article: AskGTArticle;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}> = ({ article, isFavorite, onToggleFavorite }) => {
  const category = ASKGT_CATEGORIES.find(cat => cat.id === article.category);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Article Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.thumbnailUrl || `https://picsum.photos/seed/${article.id}/800/600`}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>

        {/* Category Badge on Image */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-[#2993A3] text-[10px] font-bold uppercase rounded-lg shadow-sm">
            {category?.name || 'General'}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:bg-white transition-all scale-90 group-hover:scale-100"
        >
          {isFavorite ? (
            <HeartSolidIcon className="h-4 w-4 text-red-500" />
          ) : (
            <HeartIcon className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Article Body */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#2993A3] transition-colors line-clamp-2">
          {article.title}
        </h3>

        <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
          {article.description}
        </p>

        {/* Article Meta */}
        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#2993A3]/10 flex items-center justify-center text-[#2993A3] text-xs font-bold border border-[#2993A3]/20">
              {article.author.name.charAt(0)}
            </div>
            <div className="text-xs">
              <p className="font-bold text-gray-800">{article.author.name}</p>
              <div className="flex items-center gap-2 text-gray-400 font-medium">
                <ClockIcon className="w-3 h-3" />
                <span>{article.readTime} min read</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-1.5 text-gray-400 hover:text-[#2993A3] hover:bg-gray-50 rounded-lg transition-all">
              <ShareIcon className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-[#2993A3] hover:bg-gray-50 rounded-lg transition-all">
              <BookmarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskGTPage;
