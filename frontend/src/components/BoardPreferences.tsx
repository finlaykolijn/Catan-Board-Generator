import React, { useState, useEffect } from 'react';
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

  // Automatically disable border when 5&6 player expansion is enabled
  useEffect(() => {
    if (options.fiveAndSixPlayerExpansion && options.useFullBorder) {
      onChange({
        ...options,
        useFullBorder: false
      });
    }
  }, [options.fiveAndSixPlayerExpansion]);

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
                disabled={options.fiveAndSixPlayerExpansion}
              />
              Use Border
              
            </label>
            {options.fiveAndSixPlayerExpansion && (
              <span className="disabled-note"> (disabled for 5&6 player boards)</span>
            )}
          </div>
          

        </div>
      )}
    </div>
  );
};

export default BoardPreferences; 