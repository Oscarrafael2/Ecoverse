'use client';

import { useState, useEffect } from 'react';

interface QuestionModalProps {
  question: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: string;
  };
  onAnswer: (correct: boolean) => void;
  timeLimit: number;
}

export default function QuestionModal({ question, onAnswer, timeLimit }: QuestionModalProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (!showResult) {
            setShowResult(true);
            setTimeout(() => onAnswer(false), 2000);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResult, onAnswer]);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setShowResult(true);
    const isCorrect = selectedOption === question.correctAnswer;
    
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 3000);
  };

  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-green-800 to-green-900 border-4 border-yellow-400 rounded-xl p-6 max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm">
            {question.category}
          </div>
          <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${
            timeRemaining <= 5 ? 'bg-red-600 animate-pulse' : 'bg-blue-600'
          } text-white`}>
            ⏱️ {timeRemaining}s
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg p-4 mb-6">
          <h2 className="text-white text-xl font-bold mb-2">¿Pregunta Ecológica?</h2>
          <p className="text-white text-lg leading-relaxed">{question.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrectAnswer = index === question.correctAnswer;
            
            let bgColor = 'bg-slate-700 hover:bg-slate-600';
            if (showResult && isCorrectAnswer) {
              bgColor = 'bg-green-600';
            } else if (showResult && isSelected && !isCorrectAnswer) {
              bgColor = 'bg-red-600';
            } else if (isSelected) {
              bgColor = 'bg-blue-600';
            }

            return (
              <button
                key={index}
                onClick={() => !showResult && setSelectedOption(index)}
                disabled={showResult}
                className={`w-full ${bgColor} text-white px-4 py-3 rounded-lg font-semibold text-left transition-all transform hover:scale-102 ${
                  isSelected ? 'border-4 border-yellow-400' : 'border-2 border-white/20'
                } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-xl mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
                {showResult && isCorrectAnswer && <span className="float-right">✓</span>}
                {showResult && isSelected && !isCorrectAnswer && <span className="float-right">✗</span>}
              </button>
            );
          })}
        </div>

        {/* Result & Explanation */}
        {showResult && (
          <div className={`${
            isCorrect ? 'bg-green-600' : 'bg-red-600'
          } border-2 border-white p-4 rounded-lg mb-4 animate-pulse`}>
            <p className="text-white font-bold text-xl mb-2">
              {isCorrect ? '¡CORRECTO! 🎉' : 'INCORRECTO 😞'}
            </p>
            <p className="text-white text-sm leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Submit Button */}
        {!showResult && (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`w-full ${
              selectedOption === null 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-yellow-500 hover:bg-yellow-400'
            } text-black font-bold px-6 py-4 rounded-lg transition-all text-lg`}
          >
            {selectedOption === null ? 'Selecciona una respuesta' : 'RESPONDER'}
          </button>
        )}
      </div>
    </div>
  );
}
