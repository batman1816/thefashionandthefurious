
interface BannerLinkSelectorProps {
  buttonLink: string;
  onLinkChange: (link: string) => void;
}

const BannerLinkSelector = ({ buttonLink, onLinkChange }: BannerLinkSelectorProps) => {
  const predefinedLinks = [
    { value: '', label: 'No Link' },
    { value: '/drivers', label: 'Drivers Collection' },
    { value: '/f1-classic', label: 'F1 Classic Collection' },
    { value: '/teams', label: 'Teams Collection' },
    { value: '/new-products', label: 'New Products' },
    { value: '/drivers-products', label: 'Drivers Products' },
    { value: 'custom', label: 'Custom Link' }
  ];

  const isCustomLink = buttonLink && !predefinedLinks.some(link => link.value === buttonLink && link.value !== 'custom');

  const handleLinkChange = (value: string) => {
    if (value === 'custom') {
      onLinkChange('');
    } else {
      onLinkChange(value);
    }
  };

  return (
    <div>
      <label className="block text-white mb-2">Button Link (Optional)</label>
      <select
        value={isCustomLink ? 'custom' : buttonLink}
        onChange={(e) => handleLinkChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-700 text-white rounded mb-2 border border-gray-600 focus:border-gray-500 focus:outline-none"
      >
        {predefinedLinks.map(link => (
          <option key={link.value} value={link.value}>
            {link.label}
          </option>
        ))}
      </select>
      {isCustomLink && (
        <input
          type="text"
          value={buttonLink}
          onChange={(e) => onLinkChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-gray-500 focus:outline-none"
          placeholder="Enter custom link (e.g., /custom-page)"
        />
      )}
    </div>
  );
};

export default BannerLinkSelector;
