import { BoardGeneratorOptions, ResourceType } from '../types/catan';

interface BoardControlsProps {
  onGenerateBoard: (options: BoardGeneratorOptions) => void;
  options: BoardGeneratorOptions;
  onOptionsChange: (options: BoardGeneratorOptions) => void;
}

const BoardControls: React.FC<BoardControlsProps> = ({ onGenerateBoard, options, onOptionsChange }) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    onOptionsChange({
      ...options,
      [name]: checked
    });
  };

  const handleResourcePreferenceChange = (resource: ResourceType) => {
    const currentPrefs = options.biasResources || [];
    const newPrefs = currentPrefs.includes(resource)
      ? currentPrefs.filter(r => r !== resource)
      : [...currentPrefs, resource];
    
    onOptionsChange({
      ...options,
      biasResources: newPrefs
    });
  };

  const handleGenerateBoard = () => {
    onGenerateBoard(options);
  };

  const resourceTypes: ResourceType[] = ['forest', 'pasture', 'fields', 'hills', 'mountains'];

  return (
    <div className="board-controls">
      <div className="control-section">
        <h3>Board Generation Options</h3>
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="forceDesertInMiddle"
              checked={options.forceDesertInMiddle}
              onChange={handleCheckboxChange}
            />
            Force Desert In Middle (for Fish expansion)
          </label>
        </div>
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="fiveAndSixPlayerExpansion"
              checked={options.fiveAndSixPlayerExpansion}
              onChange={handleCheckboxChange}
            />
            Use 5 & 6 Player Expansion Board
          </label>
        </div>
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="allow6And8Adjacent"
              checked={options.allow6And8Adjacent}
              onChange={handleCheckboxChange}
            />
            6's and 8's Can Touch
          </label>
        </div>
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="allow2And12Adjacent"
              checked={options.allow2And12Adjacent}
              onChange={handleCheckboxChange}
            />
            2 and 12 Can Touch
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