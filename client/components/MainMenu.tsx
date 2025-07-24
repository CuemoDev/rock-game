import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Settings, Play, Trophy } from "lucide-react";
import { useGame } from "@/hooks/use-game";

export function MainMenu() {
  const { state, actions } = useGame();
  const [username, setUsername] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const handleStartGame = () => {
    if (username.trim()) {
      actions.setUsername(username.trim());
      actions.setGameMode("playing");
    }
  };

  const handleSettingsChange = (setting: string, value: number) => {
    actions.dispatch({
      type: "UPDATE_SETTINGS",
      payload: { [setting]: value },
    });
  };

  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Game Settings
            </CardTitle>
            <CardDescription>Customize your game experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Max Health: {state.gameSettings.maxHealth}</Label>
              <Slider
                value={[state.gameSettings.maxHealth]}
                onValueChange={([value]) =>
                  handleSettingsChange("maxHealth", value)
                }
                max={200}
                min={50}
                step={25}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Rock Damage: {state.gameSettings.rockDamage}</Label>
              <Slider
                value={[state.gameSettings.rockDamage]}
                onValueChange={([value]) =>
                  handleSettingsChange("rockDamage", value)
                }
                max={50}
                min={10}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Movement Speed: {state.gameSettings.movementSpeed}</Label>
              <Slider
                value={[state.gameSettings.movementSpeed]}
                onValueChange={([value]) =>
                  handleSettingsChange("movementSpeed", value)
                }
                max={10}
                min={2}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Throw Force: {state.gameSettings.throwForce}</Label>
              <Slider
                value={[state.gameSettings.throwForce]}
                onValueChange={([value]) =>
                  handleSettingsChange("throwForce", value)
                }
                max={25}
                min={5}
                step={2}
                className="w-full"
              />
            </div>

            <Button onClick={() => setShowSettings(false)} className="w-full">
              Back to Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            ROCK
            <span className="text-purple-400">WARS</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-md mx-auto">
            Enter the arena and battle other players in this intense 3D
            rock-throwing combat game!
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="bg-purple-600 text-white">
              <Trophy className="h-3 w-3 mr-1" />
              Kill Streaks
            </Badge>
            <Badge variant="secondary" className="bg-purple-600 text-white">
              3D Combat
            </Badge>
            <Badge variant="secondary" className="bg-purple-600 text-white">
              Respawn System
            </Badge>
          </div>
        </div>

        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Join the Battle</CardTitle>
            <CardDescription>
              Enter your username to start playing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleStartGame()}
                maxLength={20}
              />
            </div>

            <Button
              onClick={handleStartGame}
              disabled={!username.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Game
            </Button>

            <Button
              onClick={() => setShowSettings(true)}
              variant="outline"
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </CardContent>
        </Card>

        <div className="text-sm text-slate-400 space-y-1">
          <p>
            Controls: WASD to move, Mouse to look around, Left Click to throw
            rocks
          </p>
          <p>Goal: Get kills to build your streak, avoid dying to keep it!</p>
        </div>
      </div>
    </div>
  );
}
