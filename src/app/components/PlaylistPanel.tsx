import { Music, Play, Pause } from 'lucide-react';
import { Track } from '../App';

interface PlaylistPanelProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onPlayTrack: (index: number) => void;
}

export function PlaylistPanel({ tracks, currentTrackIndex, isPlaying, onPlayTrack }: PlaylistPanelProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <Music className="w-5 h-5 text-pink-400" />
          <h3 className="text-xl font-bold text-white">Playlist</h3>
        </div>
        <p className="text-gray-400 text-sm">{tracks.length} tracks</p>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {tracks.map((track, index) => {
          const isCurrent = index === currentTrackIndex;
          const isCurrentAndPlaying = isCurrent && isPlaying;

          return (
            <button
              key={track.id}
              onClick={() => onPlayTrack(index)}
              className={`w-full p-4 flex items-center gap-4 hover:bg-gray-800/50 transition-colors ${
                isCurrent ? 'bg-gray-800/30' : ''
              }`}
            >
              {/* Album art thumbnail */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-full h-full object-cover rounded"
                />

                {isCurrentAndPlaying && (
                  <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center">
                    <div className="flex gap-0.5">
                      <div className="w-0.5 h-3 bg-pink-400 rounded-full animate-pulse" />
                      <div className="w-0.5 h-4 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                      <div className="w-0.5 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Track info */}
              <div className="flex-1 text-left overflow-hidden">
                <h4
                  className={`font-semibold truncate ${
                    isCurrent ? 'text-pink-400' : 'text-white'
                  }`}
                >
                  {track.title}
                </h4>
                <p className="text-sm text-gray-400 truncate">{track.artist}</p>
              </div>

              {/* Duration */}
              <span className="text-sm text-gray-400">{formatDuration(track.duration)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
