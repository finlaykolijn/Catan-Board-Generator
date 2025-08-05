import { useState, useEffect } from 'react';
import { CatanBoard, BoardGeneratorOptions } from '../types/catan';
import { API_ENDPOINTS } from '../config';
import '../styles/BoardSelector.css';

interface SavedBoard {
  id: number;
  board_name: string;
  rating: number;
  board: {
    board: CatanBoard;
    options: BoardGeneratorOptions;
    generatedAt: string;
    version: string;
  };
}

interface BoardSelectorProps {
  onBoardSelect: (board: CatanBoard, options: BoardGeneratorOptions) => void;
  onClose: () => void;
  isOpen: boolean;
}

const BoardSelector: React.FC<BoardSelectorProps> = ({ onBoardSelect, onClose, isOpen }) => {
  const [boards, setBoards] = useState<SavedBoard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchBoards();
    }
  }, [isOpen]);

  const fetchBoards = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.GET_BOARDS);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched boards:', data); // Debug log
        setBoards(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch boards');
      }
    } catch (error) {
      setError('Network error: Unable to connect to server');
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardSelect = (board: SavedBoard) => {
    try {
      console.log('Selected board:', board); // Debug log
      onBoardSelect(board.board.board, board.board.options);
      onClose();
    } catch (error) {
      console.error('Error loading board:', error);
      setError('Error loading board data');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="board-selector-overlay">
      <div className="board-selector-content">
        <div className="board-selector-header">
          <h2>Load Saved Board</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="board-selector-body">
          {loading && <div className="loading">Loading saved boards...</div>}
          
          {error && (
            <div className="error">
              {error}
              <button onClick={fetchBoards}>Retry</button>
            </div>
          )}
          
          {!loading && !error && boards.length === 0 && (
            <div className="no-boards">
              <p>No saved boards found.</p>
              <p>Generate and save a board first to see it here.</p>
            </div>
          )}
          
          {!loading && !error && boards.length > 0 && (
            <div className="boards-list">
              {boards.map((board) => (
                <div key={board.id} className="board-item" onClick={() => handleBoardSelect(board)}>
                  <div className="board-name">{board.board_name}</div>
                  <div className="board-date">Created: {board.board.generatedAt}</div>
                  <div className="board-info">
                    {board.board.options?.fiveAndSixPlayerExpansion ? '5-6 Player' : 'Standard'} Board
                    {board.board.options?.forceDesertInMiddle && ' • Desert in Middle'}
                  </div>
                  <div className="board-rating">
                    Rating: {board.rating}/5
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardSelector; 