import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainMenu } from "@/components/MainMenu";
import { GameWorld } from "@/components/GameWorld";
import { GameProvider, useGame } from "@/hooks/use-game";
import NotFound from "@/pages/NotFound";

function GameRouter() {
  const { state } = useGame();

  if (state.gameMode === 'menu') {
    return <MainMenu />;
  }

  if (state.gameMode === 'playing' || state.gameMode === 'paused') {
    return <GameWorld />;
  }

  return <MainMenu />;
}

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameRouter />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
