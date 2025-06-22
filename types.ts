
export interface CharacterProfile {
  id: string;
  nameForDisplay: string;
  shortName: string;
  role: string;
  audience: string;
  toneAndVocab: string;
  perspective: string;
  knowledge: string;
  initialGreeting: string;
  systemInstruction: string;
  avatarSeed: string; 
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  characterId?: string; // Associates bot messages with a character profile for styling or avatar
  timestamp: number;
}
