
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CharacterProfile, ChatMessage } from './types';
import { HISTORICAL_CHARACTERS } from './constants';
import { CharacterSelector } from './components/CharacterSelector';
import { ChatWindow } from './components/ChatWindow';
import { ErrorDisplay } from './components/ErrorDisplay';
import { startChatWithCharacter, sendMessageToCharacter } from './services/geminiService';
import { Chat } from '@google/genai'; // Assuming Chat type is exported from the SDK

const App: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterProfile | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  const geminiApiKey = process.env.API_KEY;

  useEffect(() => {
    if (!geminiApiKey) {
      setError("La clave API de Gemini no está configurada. Por favor, asegúrese de que la variable de entorno API_KEY esté definida.");
    }
  }, [geminiApiKey]);

  const handleSelectCharacter = useCallback(async (character: CharacterProfile) => {
    if (!geminiApiKey) {
      setError("La clave API de Gemini no está configurada.");
      return;
    }
    setSelectedCharacter(character);
    setIsLoading(true);
    setError(null);
    setChatMessages([]); // Clear previous messages

    try {
      const newChat = await startChatWithCharacter(character.systemInstruction, geminiApiKey);
      setCurrentChat(newChat);
      setChatMessages([{
        id: Date.now().toString(),
        sender: 'bot',
        text: character.initialGreeting,
        characterId: character.id,
        timestamp: Date.now(),
      }]);
    } catch (e) {
      console.error("Error starting chat:", e);
      setError("Error al iniciar la conversación con el personaje. Por favor, inténtalo de nuevo.");
      setChatMessages([{
        id: Date.now().toString(),
        sender: 'system',
        text: "No se pudo conectar con el personaje. Verifica tu conexión o la configuración de la API.",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [geminiApiKey]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!selectedCharacter || !currentChat || !messageText.trim() || !geminiApiKey) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: Date.now(),
    };
    setChatMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const botResponseText = await sendMessageToCharacter(currentChat, messageText);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponseText,
        characterId: selectedCharacter.id,
        timestamp: Date.now(),
      };
      setChatMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (e) {
      console.error("Error sending message:", e);
      const errorMessageText = e instanceof Error ? e.message : "Error desconocido al comunicarse con el personaje.";
      setError(`Error al enviar el mensaje: ${errorMessageText}. Por favor, inténtalo de nuevo.`);
      const systemErrorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'system',
        text: `No se pudo obtener respuesta del personaje. ${errorMessageText}`,
        timestamp: Date.now(),
      };
      setChatMessages(prevMessages => [...prevMessages, systemErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCharacter, currentChat, geminiApiKey]);
  
  return (
    <div className="flex flex-col h-screen bg-stone-100 text-stone-800">
      <header className="bg-sky-700 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Ecos del Batllismo: Uruguay 1903-1933</h1>
      </header>

      {!geminiApiKey && (
         <div className="p-4 m-4 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            <strong>Advertencia:</strong> La clave API de Gemini no está configurada. La aplicación no funcionará correctamente. Por favor, defina la variable de entorno <code>API_KEY</code>.
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/4 bg-stone-200 p-4 overflow-y-auto custom-scrollbar shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-sky-800">Elige un Personaje</h2>
          <CharacterSelector
            characters={HISTORICAL_CHARACTERS}
            onSelectCharacter={handleSelectCharacter}
            selectedCharacterId={selectedCharacter?.id}
          />
        </aside>

        <main className="flex-1 flex flex-col p-4 bg-white">
          {selectedCharacter ? (
            <ChatWindow
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              currentCharacterName={selectedCharacter.nameForDisplay}
              avatarSeed={selectedCharacter.avatarSeed}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xl text-stone-500">Selecciona un personaje para comenzar a dialogar.</p>
            </div>
          )}
          {error && <ErrorDisplay message={error} onClose={() => setError(null)} />}
        </main>
      </div>
       <footer className="bg-sky-700 text-white p-2 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Ecos del Batllismo. Una aplicación educativa.</p>
      </footer>
    </div>
  );
};

export default App;
