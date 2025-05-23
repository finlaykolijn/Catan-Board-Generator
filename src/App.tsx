import { useState, useEffect } from 'react'
import CatanBoard from './components/CatanBoard'
import BoardControls from './components/BoardControls'
import BoardPreferences from './components/BoardPreferences'
import { BoardGeneratorOptions, CatanBoard as CatanBoardType } from './types/catan'
import { generateBoard } from './utils/boardGenerator'
import './App.css'
import './styles/BoardControls.css'

function App() {
  const [boardKey, setBoardKey] = useState(0) // Used to force re-render of board
  const [boardData, setBoardData] = useState<CatanBoardType | undefined>(undefined) // Initially set to undefined
  const [boardOptions, setBoardOptions] = useState<BoardGeneratorOptions>({
    useImages: true, // Default to using images
    showBorders: false, // Default to not showing borders
    forceDesertInMiddle: false,
    includeCitiesAndKnights: false,
    includeSeafarers: false,
    fiveAndSixPlayerExpansion: false,
    biasResources: [],
    allow6And8Adjacent: true, // Default to allowing 6's and 8's to touch
    allow2And12Adjacent: true, // Default to allowing 2 and 12 to touch
  })

  // Generate a new board only when explicitly requested
  const handleGenerateBoard = (options: BoardGeneratorOptions) => {
    // Create a new board with current options
    const newBoard = generateBoard(options)
    setBoardData(newBoard)
    setBoardKey(prevKey => prevKey + 1) // Force a re-render
  }

  // Update options without regenerating the board
  const handleOptionsChange = (options: BoardGeneratorOptions) => {
    setBoardOptions(options)
  }

  // Generate initial board once on component mount
  useEffect(() => {
    if (!boardData) {
      const initialBoard = generateBoard(boardOptions)
      setBoardData(initialBoard)
    }
  }, []) // Empty dependency array means it only runs once on mount

  return (
    <div className="App">
      <header className="App-header">
        <h1>Catan Board Generator</h1>
      </header>
      
      <main className="App-main">
        <BoardControls 
          onGenerateBoard={handleGenerateBoard} 
          options={boardOptions}
          onOptionsChange={handleOptionsChange}
        />
        
        <div className="board-container">
          <BoardPreferences 
            options={boardOptions}
            onChange={handleOptionsChange}
          />
          <CatanBoard 
            key={boardKey}
            options={boardOptions}
            boardData={boardData}
            width={800}
            height={600}
            //width={window.innerWidth > 768 ? 800 : window.innerWidth - 40} 
            //height={window.innerWidth > 768 ? 600 : window.innerWidth * 0.75} 
          />
        </div>
      </main>
      
      <footer className="App-footer">
        <p>
          This Catan board generator supports both standard boards and the 5 & 6 player expansion.
          Future versions will include support for other expansions.
        </p>
      </footer>
    </div>
  )
}

export default App
