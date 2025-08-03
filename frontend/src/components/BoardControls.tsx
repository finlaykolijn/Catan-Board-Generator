import { useState } from 'react';
import { BoardGeneratorOptions, ResourceType, CatanBoard } from '../types/catan';
import BoardSelector from './BoardSelector';

interface BoardControlsProps {
  onGenerateBoard: (options: BoardGeneratorOptions) => void;
  options: BoardGeneratorOptions;
  onOptionsChange: (options: BoardGeneratorOptions) => void;
  boardData?: CatanBoard; // Add board data prop
  onLoadBoard: (board: CatanBoard, options: BoardGeneratorOptions) => void;
}

// Input sanitization constants
const MAX_BOARD_NAME_LENGTH = 30; // Can edit this to change the max length of the board name
const ALLOWED_CHARACTERS_REGEX = /^[a-zA-Z0-9\s\-_.,!?()]+$/;

// Sanitize board name input (for final user submission)
const sanitizeBoardName = (input: string): string => {
  // Remove any characters that don't match our allowed pattern
  const sanitized = input.replace(/[^a-zA-Z0-9\s\-_.,!?()]/g, '');
  // Trim whitespace and limit to 30 characters
  return sanitized.trim().substring(0, MAX_BOARD_NAME_LENGTH);
};

// Validate board name
const validateBoardName = (name: string): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: 'Board name cannot be empty' };
  }
  
  if (name.length > MAX_BOARD_NAME_LENGTH) {
    return { isValid: false, error: `Board name cannot exceed ${MAX_BOARD_NAME_LENGTH} characters` };
  }
  
  if (!ALLOWED_CHARACTERS_REGEX.test(name)) {
    return { isValid: false, error: 'Board name contains invalid characters. Only letters, numbers, spaces, dashes, underscores, commas, periods, exclamation marks, question marks, and parentheses are allowed.' };
  }
  
  return { isValid: true };
};

const BoardControls: React.FC<BoardControlsProps> = ({ onGenerateBoard, options, onOptionsChange, boardData, onLoadBoard }) => {
  const [showBoardSelector, setShowBoardSelector] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [nameError, setNameError] = useState<string>('');

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

  const handleSaveBoard = async () => {
    if (!boardData) {
      alert('No board data to save. Please generate a board first.');
      return;
    }

    // Show the naming dialog first
    setShowNameDialog(true);
  };

  const handleBoardNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBoardName(value);
    
    // Clear error when user starts typing
    if (nameError) {
      setNameError('');
    }
  };

  const handleConfirmSave = async () => {
    const validation = validateBoardName(boardName);
    
    if (!validation.isValid) {
      setNameError(validation.error || 'Invalid board name');
      return;
    }

    // Sanitize the name for final submission
    const sanitizedName = sanitizeBoardName(boardName);

    // Create a data object that includes both the board data and the generation options
    const saveData = {
      board: boardData,
      options: options,
      name: sanitizedName,
      generatedAt: new Date().toLocaleString(),
      version: '1.0'
    };

    try {
      const response = await fetch('http://localhost:3001/api/save-board', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Board saved successfully to JSONB database!');
        console.log('Board saved:', result);
        // Reset the dialog state
        setShowNameDialog(false);
        setBoardName('');
        setNameError('');
      } else {
        // Check if response is JSON or HTML
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          alert(`Failed to save board: ${errorData.error || 'Unknown error'}`);
          console.error('Save failed:', errorData);
        } else {
          // Server returned HTML instead of JSON (likely an error page)
          const errorText = await response.text();
          console.error('Server returned HTML:', errorText);
          alert(`Server error: Received HTML response instead of JSON. Please check if the backend server is running on port 3001.`);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error saving board: ${errorMessage}`);
      console.error('Network error:', error);
    }
  };

  const handleCancelSave = () => {
    setShowNameDialog(false);
    setBoardName('');
    setNameError('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && boardName.trim() && !nameError) {
      handleConfirmSave();
    } else if (event.key === 'Escape') {
      handleCancelSave();
    }
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleCancelSave();
    }
  };

  const handleLoadBoards = () => {
    setShowBoardSelector(true);
  };

  const handleBoardSelect = (board: CatanBoard, boardOptions: BoardGeneratorOptions) => {
    onLoadBoard(board, boardOptions);
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
        <button className="save-button" onClick={handleSaveBoard}disabled={!boardData}>
          Save Board
        </button>
        <button className="load-button" onClick={handleLoadBoards}> 
          Load Board
        </button>
      </div>

      <BoardSelector
        isOpen={showBoardSelector}
        onClose={() => setShowBoardSelector(false)}
        onBoardSelect={handleBoardSelect}
      />

      {/* Board Naming Dialog */}
      {showNameDialog && (
        <div className="board-naming-overlay" onClick={handleOverlayClick}>
          <div className="board-naming-content">
            <h3>Name Your Board</h3>
            <p>Please enter a name for your board (max {MAX_BOARD_NAME_LENGTH} characters):</p>
            <input
              type="text"
              value={boardName}
              onChange={handleBoardNameChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter board name..."
              className="board-name-input"
              autoFocus
            />
            {nameError && (
              <div className="name-error">
                {nameError}
              </div>
            )}
            <div className="character-count">
              {boardName.length}/{MAX_BOARD_NAME_LENGTH} characters
            </div>
            <div className="board-naming-buttons">
              <button 
                className="cancel-button" 
                onClick={handleCancelSave}
              >
                Cancel
              </button>
              <button 
                className="save-button" 
                onClick={handleConfirmSave}
                disabled={!boardName.trim() || !!nameError}
              >
                Save Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardControls; 