import { useState, useEffect } from 'react';
import { CatanBoard, BoardGeneratorOptions, HarborType } from '../types/catan';
import { API_ENDPOINTS } from '../config';
import '../styles/CommunityBoards.css';

interface SavedBoard {
  id: number;
  board_name: string;
  rating: number;
  board: {
    board: CatanBoard;
    options: BoardGeneratorOptions;
    generatedAt: string;
    version: string;
    harborLayout?: Array<{position: number, type: HarborType}>;
  };
}

interface CommunityBoardsProps {
  onLoadBoard: (board: CatanBoard, options: BoardGeneratorOptions, harborLayout?: Array<{position: number, type: HarborType}>) => void;
}

const CommunityBoards: React.FC<CommunityBoardsProps> = ({ onLoadBoard }) => {
  const [boards, setBoards] = useState<SavedBoard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBoards();
  }, []);

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
      onLoadBoard(board.board.board, board.board.options, board.board.harborLayout);
    } catch (error) {
      console.error('Error loading board:', error);
      setError('Error loading board data');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBoardType = (options: BoardGeneratorOptions) => {
    if (options.fiveAndSixPlayerExpansion) {
      return '5-6 Player Expansion';
    }
    return 'Standard Board';
  };

  const getBoardFeatures = (options: BoardGeneratorOptions) => {
    const features = [];
    if (options.forceDesertInMiddle) features.push('Desert in Middle');
    if (options.allow6And8Adjacent) features.push('6s & 8s Can Touch');
    if (options.allow2And12Adjacent) features.push('2 & 12 Can Touch');
    return features;
  };

  return (
    <div className="community-boards-tab">
      <div className="community-boards-header">
        <h2>Community Boards</h2>
        <button className="refresh-button" onClick={fetchBoards} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      <div className="community-boards-content">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading saved boards...</p>
          </div>
        )}
        
        {error && (
          <div className="error-container">
            <div className="error-message">
              <h3>Error</h3>
              <p>{error}</p>
              <button onClick={fetchBoards}>Retry</button>
            </div>
          </div>
        )}
        
        {!loading && !error && boards.length === 0 && (
          <div className="no-boards-container">
            <div className="no-boards-message">
              <h3>No Saved Boards</h3>
              <p>No saved boards found.</p>
              <p>Generate and save a board first to see it here.</p>
            </div>
          </div>
        )}
        
        {!loading && !error && boards.length > 0 && (
          <div className="boards-grid">
            {boards.map((board) => (
              <div key={board.id} className="board-card" onClick={() => handleBoardSelect(board)}>
                <div className="board-card-header">
                  <h3 className="board-name">{board.board_name}</h3>
                  <div className="board-rating">
                    <span className="stars">
                      {'★'.repeat(board.rating)}{'☆'.repeat(5 - board.rating)}
                    </span>
                    <span className="rating-text">{board.rating}/5</span>
                  </div>
                </div>
                
                <div className="board-card-body">
                  <div className="board-info">
                    <div className="board-type">
                      <strong>Type:</strong> {getBoardType(board.board.options)}
                    </div>
                    <div className="board-features">
                      <strong>Features:</strong>
                      {getBoardFeatures(board.board.options).length > 0 ? (
                        <ul>
                          {getBoardFeatures(board.board.options).map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      ) : (
                        <span> None</span>
                      )}
                    </div>
                    <div className="board-date">
                      <strong>Created:</strong> {formatDate(board.board.generatedAt)}
                    </div>
                  </div>
                  
                  <div className="board-actions">
                    <button className="load-board-button">
                      Load This Board
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityBoards; 