import React, { useState } from 'react';
import { BoardGeneratorOptions, ResourceType } from '../types/catan';

interface BoardControlsProps {
  onGenerateBoard: (options: BoardGeneratorOptions) => void;
}

const BoardControls: React.FC<BoardControlsProps> = ({ onGenerateBoard }) => {
  const [options, setOptions] = useState<BoardGeneratorOptions>({
    forceDesertInMiddle: false,
    includeCitiesAndKnights: false,
    includeSeafarers: false,
    biasResources: [],
    useImages: true // Default to using images
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setOptions(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleResourcePreferenceChange = (resource: ResourceType) => {
    setOptions(prev => {
      const currentPrefs = prev.biasResources || [];
      const newPrefs = currentPrefs.includes(resource)
        ? currentPrefs.filter(r => r !== resource)
        : [...currentPrefs, resource];
      
      return {
        ...prev,
        biasResources: newPrefs
      };
    });
  };

  const handleGenerateBoard = () => {
    onGenerateBoard(options);
  };

  const resourceTypes: ResourceType[] = ['forest', 'pasture', 'fields', 'hills', 'mountains'];

  return (
    <div className="board-controls">
      <div className="control-section">
        <h3>Board Options</h3>
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="useImages"
              checked={options.useImages}
              onChange={handleCheckboxChange}
            />
            Use Resource Images
          </label>
        </div>
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="forceDesertInMiddle"
              checked={options.forceDesertInMiddle}
              onChange={handleCheckboxChange}
            />
            Force Desert Off Edge
          </label>
        </div>
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="includeCitiesAndKnights"
              checked={options.includeCitiesAndKnights}
              onChange={handleCheckboxChange}
              disabled={true} // Not implemented yet
            />
            Include Cities & Knights (coming soon)
          </label>
        </div>
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="includeSeafarers"
              checked={options.includeSeafarers}
              onChange={handleCheckboxChange}
              disabled={true} // Not implemented yet
            />
            Include Seafarers (coming soon)
          </label>
        </div>
      </div>
      
      <div className="control-section">
        <h3>Bias these resources:</h3>
        <div className="resource-preference-group">
          {resourceTypes.map(resource => (
            <label key={resource}>
              <input
                type="checkbox"
                checked={options.biasResources?.includes(resource) || false}
                onChange={() => handleResourcePreferenceChange(resource)}
              />
              {resource.charAt(0).toUpperCase() + resource.slice(1)}
            </label>
          ))}
        </div>
      </div>
      
      <button className="generate-button" onClick={handleGenerateBoard}>
        Generate New Board
      </button>
    </div>
  );
};

export default BoardControls; 