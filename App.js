import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cards, setCards] = useState([]);  // For card data
  const [flippedCards, setFlippedCards] = useState([]);  // Track flipped cards
  const [matchedCards, setMatchedCards] = useState([]);  // Track matched cards
  const [moves, setMoves] = useState(0);  // Track the number of moves

  // Initialize the cards (could be emojis or images)
  const emojis = ["😊", "🍕", "🚗", "🐱", "🌈", "⚽", "🎮", "🌟"];
  const shuffledCards = [...emojis, ...emojis]  // Duplicate and shuffle cards
    .sort(() => Math.random() - 0.5)  // Randomize order
    .map((emoji, index) => ({ id: index, emoji, flipped: false }));

  // When the component mounts, set up the cards
  useEffect(() => {
    setCards(shuffledCards);
  }, []);

  const handleCardClick = (id) => {
    if (flippedCards.length === 2 || cards.find(card => card.id === id).flipped) return;

    // Increment move count
    setMoves(moves + 1);

    // Handle card flip logic
    const flippedCard = cards.find(card => card.id === id);
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, flipped: true } : card
      )
    );
    
    setFlippedCards([...flippedCards, flippedCard]);

    if (flippedCards.length === 1) {
      checkForMatch(flippedCard);
    }
  };

  const checkForMatch = (newFlippedCard) => {
    const [firstCard] = flippedCards;
    
    // Check if the two cards match
    if (firstCard.emoji === newFlippedCard.emoji) {
      setMatchedCards([...matchedCards, firstCard.id, newFlippedCard.id]);
    } else {
      // If they don't match, flip both cards back after a delay
      setTimeout(() => {
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstCard.id || card.id === newFlippedCard.id
              ? { ...card, flipped: false }  // Flip both cards back
              : card
          )
        );
      }, 500);
    }
    
    // Clear the flippedCards array regardless of match or not
    setFlippedCards([]);
  };

  // Victory Screen logic
  if (matchedCards.length === cards.length && cards.length > 0) {
    return <h2>You won the game in {moves} moves!</h2>;
  }

  return (
    <div className="App">
      <h1>Memory Matching Game</h1>
      <p>Moves: {moves}</p>
      <div className="card-grid">
        {cards.map(card => (
          <div
            key={card.id}
            className={`card ${card.flipped ? "flipped" : ""}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-content">
              {card.flipped || matchedCards.includes(card.id) ? card.emoji : "❓"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
