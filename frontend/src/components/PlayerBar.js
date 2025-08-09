import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Heart,
  Shuffle,
  Repeat
} from 'lucide-react';

const PlayerBar = () => {
  const { 
    currentSong, 
    isPlaying, 
    volume,
    currentTime,
    duration,
    togglePlayPause,
    skipNext,
    skipPrevious,
    setVolume
  } = usePlayer();

  if (!currentSong) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        
        {/* Current Song Info */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <img 
            src={currentSong.cover} 
            alt={currentSong.title}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <p className="text-white font-medium truncate">{currentSong.title}</p>
            <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={skipPrevious}
              className="text-gray-400 hover:text-white"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button 
              onClick={togglePlayPause}
              className="bg-white text-black hover:scale-105 transform transition-all duration-200"
              size="sm"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={skipNext}
              className="text-gray-400 hover:text-white"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-gray-400 w-10">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-gray-400 w-10">{currentSong.duration}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <Volume2 className="h-4 w-4 text-gray-400" />
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0] / 100)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;