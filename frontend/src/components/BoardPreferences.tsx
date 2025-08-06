import React, { useState } from 'react';
import { BoardGeneratorOptions } from '../types/catan';
import '../styles/BoardPreferences.css';

interface BoardPreferencesProps {
  options: BoardGeneratorOptions;
  onChange: (options: BoardGeneratorOptions) => void;
}

const BoardPreferences: React.FC<BoardPreferencesProps> = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTogglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onChange({
      ...options,
      [name]: checked
    });
  };

  return (
    <div className="board-preferences">
      <button 
        className="preferences-toggle"
        onClick={handleTogglePanel}
      >
        ⚙️ Preferences
      </button>
      
      {isOpen && (
        <div className="preferences-panel">
          <h3>Board Preferences</h3>
          
          <div className="preference-item">
            <label>
              <input
                type="checkbox"
                name="useImages"
                checked={options.useImages ?? true}
                onChange={handleOptionChange}
              />
              Use Resource Images
            </label>
          </div>
          
          <div className="preference-item">
            <label>
              <input
                type="checkbox"
                name="showBorders"
                checked={options.showBorders ?? false}
                onChange={handleOptionChange}
              />
              Show Hex Borders
            </label>
          </div>
          
          <div className="preference-item">
            <label>
              <input
                type="checkbox"
                name="useFullBorder"
                checked={options.useFullBorder ?? true}
                onChange={handleOptionChange}
              />
              Use Border
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardPreferences; 