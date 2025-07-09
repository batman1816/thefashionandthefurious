
import { useState } from 'react';

interface BannerLinkSelectorProps {
  buttonLink: string;
  onLinkChange: (link: string) => void;
}

const BannerLinkSelector = ({ buttonLink, onLinkChange }: BannerLinkSelectorProps) => {
  const [linkType, setLinkType] = useState(() => {
    if (buttonLink === '/sales') return 'sales';
    if (buttonLink === '/new-products') return 'new-products';
    if (buttonLink === '/drivers') return 'drivers';
    if (buttonLink?.startsWith('/category/')) return 'category';
    if (buttonLink?.startsWith('http')) return 'external';
    return 'custom';
  });

  const [customLink, setCustomLink] = useState(() => {
    if (linkType === 'custom' && buttonLink) return buttonLink;
    return '';
  });

  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (buttonLink?.startsWith('/category/')) {
      return buttonLink.replace('/category/', '');
    }
    return '';
  });

  const [externalUrl, setExternalUrl] = useState(() => {
    if (buttonLink?.startsWith('http')) return buttonLink;
    return '';
  });

  const categories = [
    { value: 'red-bull', label: 'Red Bull' },
    { value: 'ferrari', label: 'Ferrari' },
    { value: 'mercedes', label: 'Mercedes' },
    { value: 'mclaren', label: 'McLaren' },
    { value: 'aston-martin', label: 'Aston Martin' },
    { value: 'alpine', label: 'Alpine' },
    { value: 'williams', label: 'Williams' },
    { value: 'alphatauri', label: 'AlphaTauri' },
    { value: 'alfa-romeo', label: 'Alfa Romeo' },
    { value: 'haas', label: 'Haas' }
  ];

  const handleLinkTypeChange = (type: string) => {
    setLinkType(type);
    
    switch (type) {
      case 'sales':
        onLinkChange('/sales');
        break;
      case 'new-products':
        onLinkChange('/new-products');
        break;
      case 'drivers':
        onLinkChange('/drivers');
        break;
      case 'category':
        if (selectedCategory) {
          onLinkChange(`/category/${selectedCategory}`);
        } else {
          onLinkChange('');
        }
        break;
      case 'external':
        onLinkChange(externalUrl);
        break;
      case 'custom':
        onLinkChange(customLink);
        break;
      default:
        onLinkChange('');
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onLinkChange(`/category/${category}`);
  };

  const handleExternalUrlChange = (url: string) => {
    setExternalUrl(url);
    onLinkChange(url);
  };

  const handleCustomLinkChange = (link: string) => {
    setCustomLink(link);
    onLinkChange(link);
  };

  return (
    <div>
      <label className="block text-white mb-2">Button Link (Optional)</label>
      
      <div className="space-y-3">
        <select
          value={linkType}
          onChange={(e) => handleLinkTypeChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-gray-500 focus:outline-none"
        >
          <option value="">No Link</option>
          <option value="sales">Sales Page</option>
          <option value="new-products">New Products</option>
          <option value="drivers">Drivers</option>
          <option value="category">Category Page</option>
          <option value="external">External URL</option>
          <option value="custom">Custom Link</option>
        </select>

        {linkType === 'category' && (
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-gray-500 focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        )}

        {linkType === 'external' && (
          <input
            type="url"
            value={externalUrl}
            onChange={(e) => handleExternalUrlChange(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-gray-500 focus:outline-none"
          />
        )}

        {linkType === 'custom' && (
          <input
            type="text"
            value={customLink}
            onChange={(e) => handleCustomLinkChange(e.target.value)}
            placeholder="/custom-page"
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-gray-500 focus:outline-none"
          />
        )}
      </div>

      {buttonLink && (
        <div className="mt-2 text-sm text-gray-400">
          Link: {buttonLink}
        </div>
      )}
    </div>
  );
};

export default BannerLinkSelector;
