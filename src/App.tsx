import { useState } from 'react'
import CatanBoard from './components/CatanBoard'
import BoardControls from './components/BoardControls'
import BoardPreferences from './components/BoardPreferences'
import { BoardGeneratorOptions } from './types/catan'
import './App.css'
import './styles/BoardControls.css'

function App() {
  const [boardKey, setBoardKey] = useState(0) // Used to force re-render of board
  const [boardOptions, setBoardOptions] = useState<BoardGeneratorOptions>({
    useImages: true, // Default to using images
    showBorders: false, // Default to not showing borders
    forceDesertInMiddle: false,
    includeCitiesAndKnights: false,
    includeSeafarers: false,
    biasResources: [],
  })

  const handleGenerateBoard = (options: BoardGeneratorOptions) => {
    setBoardOptions(options)
    setBoardKey(prevKey => prevKey + 1) // Force a re-render
  }

  const handleOptionsChange = (options: BoardGeneratorOptions) => {
    setBoardOptions(options)
  }

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
            width={800} 
            height={600} 
          />
        </div>
      </main>
      
      <footer className="App-footer">
        <p>
          This is a basic Catan board generator. Future versions will include support for expansions
          like Cities & Knights and Seafarers.
        </p>
      </footer>
    </div>
  )
}

export default App
