import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const emojis = ['😊', '🍕', '🚗', '🐱', '🌈', '⚽', '🎮', '🌟']; // Memory game emojis
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize the shuffled deck of cards
  useEffect(() => {
    const shuffledCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false }));
    setCards(shuffledCards);
  }, []);

  const handleCardClick = (id) => {
    if (flippedCards.length === 2 || cards.find((card) => card.id === id).flipped) return;

    setMoves((prev) => prev + 1);

    // Flip the card
    const flippedCard = cards.find((card) => card.id === id);
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, flipped: true } : card
      )
    );

    setFlippedCards((prev) => [...prev, flippedCard]);

    if (flippedCards.length === 1) {
      checkForMatch(flippedCard);
    }
  };

  const checkForMatch = (newFlippedCard) => {
    const [firstCard] = flippedCards;

    if (firstCard.emoji === newFlippedCard.emoji) {
      setMatchedCards((prev) => [...prev, firstCard.id, newFlippedCard.id]);
    } else {
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstCard.id || card.id === newFlippedCard.id
              ? { ...card, flipped: false }
              : card
          )
        );
      }, 1000);
    }

    setFlippedCards([]);
  };

  // Check for game over
  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameOver(true);
    }
  }, [matchedCards, cards]);

  return (
    <div className="App">
      <h1>Memory Matching Game</h1>
      <p>Moves: {moves}</p>
      {gameOver ? (
        <h2>You won the game in {moves} moves!</h2>
      ) : (
        <div className="card-grid">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`card ${card.flipped ? 'flipped' : ''}`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="card-content">
                {card.flipped || matchedCards.includes(card.id) ? card.emoji : '❓'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
