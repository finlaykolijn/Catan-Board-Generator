import { BoardGeneratorOptions, ResourceType, CatanBoard } from '../types/catan';

interface BoardControlsProps {
  onGenerateBoard: (options: BoardGeneratorOptions) => void;
  options: BoardGeneratorOptions;
  onOptionsChange: (options: BoardGeneratorOptions) => void;
  boardData?: CatanBoard; // Add board data prop
}

const BoardControls: React.FC<BoardControlsProps> = ({ onGenerateBoard, options, onOptionsChange, boardData }) => {
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

  const handleSaveBoard = () => {
    if (!boardData) {
      alert('No board data to save. Please generate a board first.');
      return;
    }

    // Create a data object that includes both the board data and the generation options
    const saveData = {
      board: boardData,
      options: options,
      generatedAt: new Date().toISOString(),
      version: '1.0'
    };

    // Create and download the JSON file
    const dataStr = JSON.stringify(saveData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `catan-board-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      
      <div className="button-group">
        <button className="generate-button" onClick={handleGenerateBoard}>
          Generate New Board
        </button>
        <button 
          className="save-button" 
          onClick={handleSaveBoard}
          disabled={!boardData}
        >
          Save Board as JSON
        </button>
      </div>
    </div>
  );
};

export default BoardControls; 