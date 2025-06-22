
import React from 'react';
import { CharacterProfile } from '../types';
import { UserIcon } from './IconComponents';

interface CharacterSelectorProps {
  characters: CharacterProfile[];
  onSelectCharacter: (character: CharacterProfile) => void;
  selectedCharacterId?: string;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ characters, onSelectCharacter, selectedCharacterId }) => {
  return (
    <div className="space-y-3">
      {characters.map((character) => (
        <button
          key={character.id}
          onClick={() => onSelectCharacter(character)}
          className={`w-full flex items-start text-left p-3 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500
            ${selectedCharacterId === character.id ? 'bg-sky-600 text-white shadow-lg' : 'bg-white hover:bg-sky-50 text-stone-700 shadow-md'}`}
        >
          <img 
            src={`https://picsum.photos/seed/${character.avatarSeed}/50/50`} 
            alt={character.shortName} 
            className="w-12 h-12 rounded-full mr-3 border-2 border-stone-300 object-cover"
          />
          <div>
            <h3 className="font-semibold text-sm">{character.shortName}</h3>
            <p className={`text-xs ${selectedCharacterId === character.id ? 'text-sky-100' : 'text-stone-500'}`}>{character.role}</p>
          </div>
        </button>
      ))}
    </div>
  );
};
