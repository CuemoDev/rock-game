import { useGame } from "@/hooks/use-game";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Skull, Target, Menu, Home } from "lucide-react";
import { useEffect, useState } from "react";

export function GameUI() {
  const { state, actions } = useGame();
  const [showMenu, setShowMenu] = useState(false);
  const [respawnTimer, setRespawnTimer] = useState(0);

  // Handle respawn countdown
  useEffect(() => {
    if (state.localPlayer && !state.localPlayer.isAlive) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, state.gameSettings.respawnTime - elapsed);
        setRespawnTimer(Math.ceil(remaining / 1000));

        if (remaining <= 0) {
          clearInterval(interval);
          setRespawnTimer(0);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [state.localPlayer?.isAlive, state.gameSettings.respawnTime]);

  // Handle ESC key for menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        setShowMenu(!showMenu);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showMenu]);

  if (!state.localPlayer) return null;

  return (
    <>
      {/* HUD */}
      <div className="absolute top-4 left-4 space-y-4 z-10">
        {/* Health Bar */}
        <Card className="bg-black/50 border-gray-600">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-white text-sm font-semibold">Health</span>
            </div>
            <Progress
              value={
                (state.localPlayer.health / state.localPlayer.maxHealth) * 100
              }
              className="w-48 h-2"
            />
            <div className="text-white text-xs mt-1">
              {state.localPlayer.health}/{state.localPlayer.maxHealth}
            </div>
          </CardContent>
        </Card>

        {/* Kill Streak */}
        <Card className="bg-black/50 border-gray-600">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-yellow-500" />
              <span className="text-white text-sm font-semibold">
                Kill Streak
              </span>
              <Badge variant="secondary" className="bg-yellow-600 text-white">
                {state.localPlayer.killStreak}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Player Info */}
        <Card className="bg-black/50 border-gray-600">
          <CardContent className="p-3">
            <div className="text-white text-sm">
              <div className="font-semibold">{state.localPlayer.username}</div>
              <div className="text-gray-300 text-xs">
                Status: {state.localPlayer.isAlive ? "Alive" : "Dead"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-black/50 border-gray-600">
          <CardContent className="p-3">
            <div className="text-white text-xs space-y-1">
              <div>
                <span className="font-semibold">WASD:</span> Move
              </div>
              <div>
                <span className="font-semibold">Mouse:</span> Look around
              </div>
              <div>
                <span className="font-semibold">Left Click:</span> Throw rock
              </div>
              <div>
                <span className="font-semibold">Space:</span> Jump
              </div>
              <div>
                <span className="font-semibold">ESC:</span> Menu
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={() => setShowMenu(true)}
          variant="secondary"
          size="sm"
          className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Death Screen */}
      {!state.localPlayer.isAlive && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Skull className="h-16 w-16 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-red-500">You Died!</h2>
                <p className="text-gray-600">
                  Your kill streak has been reset to 0
                </p>
                {respawnTimer > 0 && (
                  <div className="text-lg font-semibold text-blue-500">
                    Respawning in {respawnTimer}s...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* In-Game Menu */}
      {showMenu && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-bold text-center">Game Menu</h2>

              <div className="space-y-2">
                <Button
                  onClick={() => setShowMenu(false)}
                  variant="secondary"
                  className="w-full"
                >
                  Resume Game
                </Button>

                <Button
                  onClick={() => {
                    actions.setGameMode("menu");
                    setShowMenu(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Return to Menu
                </Button>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500 space-y-1">
                  <div>
                    Health: {state.localPlayer.health}/
                    {state.localPlayer.maxHealth}
                  </div>
                  <div>Kill Streak: {state.localPlayer.killStreak}</div>
                  <div>
                    Status: {state.localPlayer.isAlive ? "Alive" : "Dead"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-4 h-4 border border-white opacity-50">
          <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </>
  );
}
