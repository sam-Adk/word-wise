import { Volume2, BookOpen, Link as LinkIcon } from 'lucide-react';
import { WordData } from '../App';
import { useState } from 'react';

interface WordDefinitionProps {
  wordData: WordData;
}

export function WordDefinition({ wordData }: WordDefinitionProps) {
  const [playingAudio, setPlayingAudio] = useState(false);

  const playPronunciation = () => {
    // Find first audio URL
    const audioUrl = wordData.phonetics.find((p) => p.audio)?.audio;

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      setPlayingAudio(true);

      audio.play();
      audio.onended = () => setPlayingAudio(false);
    }
  };

  const hasAudio = wordData.phonetics.some((p) => p.audio);

  return (
    <div className="space-y-6">
      {/* Word header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">{wordData.word}</h1>
            {wordData.phonetic && (
              <p className="text-2xl text-blue-400">{wordData.phonetic}</p>
            )}
          </div>

          {hasAudio && (
            <button
              onClick={playPronunciation}
              disabled={playingAudio}
              className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Volume2 className={`w-6 h-6 ${playingAudio ? 'animate-pulse' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Meanings */}
      {wordData.meanings.map((meaning, index) => (
        <div
          key={index}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
        >
          {/* Part of speech */}
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-semibold text-white capitalize">
              {meaning.partOfSpeech}
            </h2>
          </div>

          {/* Definitions */}
          <div className="space-y-4">
            {meaning.definitions.map((def, defIndex) => (
              <div key={defIndex} className="pl-4 border-l-2 border-blue-500">
                <p className="text-white text-lg mb-2">{def.definition}</p>

                {def.example && (
                  <p className="text-gray-400 italic">
                    "{def.example}"
                  </p>
                )}

                {/* Synonyms */}
                {def.synonyms.length > 0 && (
                  <div className="mt-2">
                    <span className="text-gray-500 text-sm">Synonyms: </span>
                    <span className="text-green-400 text-sm">
                      {def.synonyms.slice(0, 5).join(', ')}
                    </span>
                  </div>
                )}

                {/* Antonyms */}
                {def.antonyms.length > 0 && (
                  <div className="mt-1">
                    <span className="text-gray-500 text-sm">Antonyms: </span>
                    <span className="text-red-400 text-sm">
                      {def.antonyms.slice(0, 5).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Overall synonyms/antonyms */}
          {meaning.synonyms.length > 0 && (
            <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <h3 className="text-green-400 font-semibold mb-2">Synonyms</h3>
              <div className="flex flex-wrap gap-2">
                {meaning.synonyms.map((synonym, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm"
                  >
                    {synonym}
                  </span>
                ))}
              </div>
            </div>
          )}

          {meaning.antonyms.length > 0 && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
              <h3 className="text-red-400 font-semibold mb-2">Antonyms</h3>
              <div className="flex flex-wrap gap-2">
                {meaning.antonyms.map((antonym, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-red-600/20 text-red-300 rounded-full text-sm"
                  >
                    {antonym}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Source */}
      {wordData.sourceUrls.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <LinkIcon className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-white">Source</h3>
          </div>
          <a
            href={wordData.sourceUrls[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline break-all"
          >
            {wordData.sourceUrls[0]}
          </a>
        </div>
      )}
    </div>
  );
}
