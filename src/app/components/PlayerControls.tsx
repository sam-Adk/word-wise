import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Track } from '../App';

interface PlayerControlsProps {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export function PlayerControls({
  track,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
}: PlayerControlsProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - bounds.left;
    const percentage = clickX / bounds.width;
    const newTime = percentage * duration;
    onSeek(newTime);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - bounds.left;
    const percentage = Math.max(0, Math.min(1, clickX / bounds.width));
    onVolumeChange(percentage);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
      {/* Progress bar */}
      <div
        className="h-1 bg-gray-800 cursor-pointer group"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-100 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Current track info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <img
              src={track.cover}
              alt={track.title}
              className="w-14 h-14 rounded object-cover"
            />
            <div className="min-w-0">
              <h4 className="font-semibold text-white truncate">{track.title}</h4>
              <p className="text-sm text-gray-400 truncate">{track.artist}</p>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={onPrevious}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={onTogglePlay}
                className="p-4 bg-white text-black rounded-full hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            {/* Time display */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <button
              onClick={onToggleMute}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            <div
              className="w-24 h-1 bg-gray-700 rounded-full cursor-pointer group"
              onClick={handleVolumeClick}
            >
              <div
                className="h-full bg-white rounded-full relative"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
