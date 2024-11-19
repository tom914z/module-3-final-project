import React, { useState, useEffect } from 'react';
import './App.css';

const initialCards = [
  { id: 1, value: '🍎', flipped: false, matched: false },
  { id: 2, value: '🍌', flipped: false, matched: false },
  { id: 3, value: '🍇', flipped: false, matched: false },
  { id: 4, value: '🍓', flipped: false, matched: false },
  { id: 5, value: '🍎', flipped: false, matched: false },
  { id: 6, value: '🍌', flipped: false, matched: false },
  { id: 7, value: '🍇', flipped: false, matched: false },
  { id: 8, value: '🍓', flipped: false, matched: false },
  // Adding two more pairs:
  { id: 9, value: '🍉', flipped: false, matched: false },
  { id: 10, value: '🍍', flipped: false, matched: false },
  { id: 11, value: '🍉', flipped: false, matched: false },
  { id: 12, value: '🍍', flipped: false, matched: false },
];


function App() {
  const [cards, setCards] = useState(shuffleCards([...initialCards]));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);

  // Shuffle function
  function shuffleCards(cards) {
    return cards.sort(() => Math.random() - 0.5);
  }

  // Handle card click
  const handleCardClick = (id) => {
    if (flippedCards.length === 2 || cards.find(card => card.id === id).flipped) return;
    
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [firstCard, secondCard] = newFlipped.map(cardId => cards.find(card => card.id === cardId));

      if (firstCard.value === secondCard.value) {
        setMatchedCards([...matchedCards, firstCard.id, secondCard.id]);
      }

      setTimeout(() => {
        setFlippedCards([]);
      }, 500);
    }
  };

  // Restart the game
  const restartGame = () => {
    setCards(shuffleCards([...initialCards]));
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
  };

  // Check for game victory
  const isGameWon = matchedCards.length === cards.length;

  return (
    <div className="memory-game">
      <h1>Memory Matching Game</h1>
      <p>Moves: {moves}</p>
      
      <div className="cards">
        {cards.map(card => (
          <div
            key={card.id}
            className={`card ${flippedCards.includes(card.id) || matchedCards.includes(card.id) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            {flippedCards.includes(card.id) || matchedCards.includes(card.id) ? card.value : '?'}
          </div>
        ))}
      </div>

      {isGameWon && (
        <div className="game-over">
          <h2>Victory! You won the game in {moves} moves!</h2>
          <button onClick={restartGame}>Restart Game</button>
        </div>
      )}
    </div>
  );
}

export default App;
