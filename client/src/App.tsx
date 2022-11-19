import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

interface Deck {
  title: string,
  _id: string;
};

function App() {
  const [title, setTitle] = useState('');
  const [decks, setDecks] = useState<Deck[]>([]);

  // Send new deck to database upon form submission
  async function handleCreateDeck(e: React.FormEvent) {
    e.preventDefault();
    if (title === '') return;
    const response = await fetch('http://localhost:4000/decks', {
      method: 'POST',
      body: JSON.stringify({
        title,
      }),
      headers: {
        "Content-Type": "application/json"
      },
    })
    setTitle('');
    // Rerender to include the newly added deck
    const newDeck = await response.json(); 
    setDecks([...decks, newDeck])
  };

  // Request array of decks from database
  useEffect(() => {
    async function fetchDecks() {
      const response = await fetch('http://localhost:4000/decks');
      const newDecks = await response.json()
      setDecks(newDecks);
    }
    fetchDecks();
  }, [])

  async function handleDeleteDeck(deckId: string) {
    await fetch(`http://localhost:4000/decks/${deckId}`, {
      method: 'DELETE',
    });
    
    // Rerender to exclude the newly deleted deck
    setDecks(decks.filter((deck) => deck._id !== deckId));
  }

  return (
    <div className='app'>
      <form onSubmit={handleCreateDeck}>
        <label htmlFor='deck-title'>Deck Title:</label>
        <input id='deck-title'
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setTitle(e.target.value);
        }} />
        <button>Create Deck</button>
      </form>
      <div className='decks'>
        {decks.map((deck) => (
          <div key={deck._id}>
            <button onClick={() => handleDeleteDeck(deck._id)}>X</button>
            {deck.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
