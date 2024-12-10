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
  const [time, setTime] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // New state for pause

  useEffect(() => {
    if (!isGameWon && timerRunning && !isPaused) {
      const interval = setInterval(() => setTime(time + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [time, timerRunning, isGameWon, isPaused]);

  function shuffleCards(cards) {
    return cards.sort(() => Math.random() - 0.5);
  }

  const handleCardClick = (id) => {
    if (!timerRunning || isPaused) return; // Prevent clicks when paused or before starting
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

  const restartGame = () => {
    setCards(shuffleCards([...initialCards]));
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTime(0);
    setIsGameWon(false);
    setTimerRunning(false);
    setIsPaused(false); // Reset pause state
  };

  const pauseGame = () => {
    setIsPaused(true);
  };

  const resumeGame = () => {
    setIsPaused(false);
  };

  useEffect(() => {
    if (matchedCards.length === cards.length) {
      setIsGameWon(true);
      setTimerRunning(false);
    }
  }, [matchedCards]);

  return (
    <div className="memory-game-container">
      {/* Background Effect */}
      <div className="background-effects">
        {Array(10).fill(0).map((_, index) => (
          <span key={index} className="floating-circle"></span>
        ))}
      </div>

      {/* Memory Game Content */}
      <div className="memory-game">
        <h1>Memory Matching Game</h1>
        <p>Moves: {moves}</p>
        <p>Time: {time}s</p>

        <div className="game-controls">
          {!timerRunning ? (
            <button onClick={() => setTimerRunning(true)}>Start Game</button>
          ) : isPaused ? (
            <button onClick={resumeGame}>Resume Game</button>
          ) : (
            <button onClick={pauseGame}>Pause Game</button>
          )}
          <button onClick={restartGame}>Restart Game</button>
        </div>

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
            <h2>You won the game with {moves} moves in {time} seconds!</h2>
            <button onClick={restartGame}>Restart Game</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
