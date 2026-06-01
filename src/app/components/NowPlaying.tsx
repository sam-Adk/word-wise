import { Music } from 'lucide-react';
import { Track } from '../App';

interface NowPlayingProps {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export function NowPlaying({ track, isPlaying, currentTime, duration }: NowPlayingProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
      {/* Album art */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={track.cover}
          alt={track.title}
          className="w-full h-full object-cover"
        />

        {/* Overlay with playing status */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
          <div className="w-full">
            {isPlaying && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-6 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-5 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  <div className="w-1 h-7 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                </div>
                <span className="text-pink-400 text-sm font-semibold">Now Playing</span>
              </div>
            )}

            <h2 className="text-4xl font-bold text-white mb-2">{track.title}</h2>
            <p className="text-xl text-gray-300 mb-1">{track.artist}</p>
            <p className="text-gray-400">{track.album}</p>
          </div>
        </div>
      </div>

      {/* Progress info */}
      <div className="p-6">
        {/* Progress bar */}
        <div className="mb-2">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Time stamps */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
