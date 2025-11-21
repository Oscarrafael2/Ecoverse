export const EDUCATIONAL_QUESTIONS = [
  {
    id: 1,
    question: '¿Cuántos árboles se necesitan para producir el oxígeno que una persona respira en un año?',
    options: ['1-2 árboles', '5-7 árboles', '10-15 árboles', '20-25 árboles'],
    correctAnswer: 1,
    explanation: 'Se necesitan aproximadamente 5-7 árboles para producir el oxígeno que una persona respira en un año. Por eso es tan importante plantar árboles.',
    category: 'Reforestación'
  },
  {
    id: 2,
    question: '¿Cuánto tiempo tarda un árbol en absorber una tonelada de CO2?',
    options: ['5 años', '10 años', '40 años', '100 años'],
    correctAnswer: 2,
    explanation: 'Un árbol tarda aproximadamente 40 años en absorber una tonelada de CO2. Los árboles son esenciales para combatir el cambio climático.',
    category: 'Cambio Climático'
  },
  {
    id: 3,
    question: '¿Qué porcentaje del oxígeno del planeta producen los océanos?',
    options: ['25%', '50%', '70%', '90%'],
    correctAnswer: 2,
    explanation: 'Los océanos producen aproximadamente el 70% del oxígeno del planeta gracias al fitoplancton. Debemos cuidar nuestros océanos.',
    category: 'Ecosistemas'
  },
  {
    id: 4,
    question: '¿Cuántos años tarda una botella de plástico en degradarse?',
    options: ['50 años', '100 años', '450 años', '1000 años'],
    correctAnswer: 2,
    explanation: 'Una botella de plástico tarda hasta 450 años en degradarse completamente. Por eso es crucial reciclar y reducir el uso de plásticos.',
    category: 'Contaminación'
  },
  {
    id: 5,
    question: '¿Qué porcentaje de especies viven en los bosques tropicales?',
    options: ['25%', '50%', '80%', '95%'],
    correctAnswer: 2,
    explanation: 'Los bosques tropicales albergan aproximadamente el 80% de las especies terrestres del planeta, a pesar de cubrir solo el 6% de la superficie.',
    category: 'Biodiversidad'
  },
  {
    id: 6,
    question: '¿Cuánta agua puede retener un árbol maduro en un día?',
    options: ['10 litros', '50 litros', '200 litros', '380 litros'],
    correctAnswer: 3,
    explanation: 'Un árbol maduro puede retener hasta 380 litros de agua en un día, ayudando a prevenir inundaciones y mantener el ciclo del agua.',
    category: 'Reforestación'
  },
  {
    id: 7,
    question: '¿Cuántas especies de animales se extinguen cada día debido a la deforestación?',
    options: ['5 especies', '50 especies', '150 especies', '300 especies'],
    correctAnswer: 2,
    explanation: 'Se estima que aproximadamente 150 especies se extinguen cada día debido a la deforestación y destrucción de hábitats.',
    category: 'Biodiversidad'
  },
  {
    id: 8,
    question: '¿Qué porcentaje de basura en los océanos es plástico?',
    options: ['40%', '60%', '80%', '95%'],
    correctAnswer: 2,
    explanation: 'Aproximadamente el 80% de la basura en los océanos es plástico. Esto representa una grave amenaza para la vida marina.',
    category: 'Contaminación'
  },
  {
    id: 9,
    question: '¿Cuántos litros de agua se ahorran al reciclar 1 kg de papel?',
    options: ['10 litros', '50 litros', '100 litros', '200 litros'],
    correctAnswer: 2,
    explanation: 'Reciclar 1 kg de papel ahorra aproximadamente 100 litros de agua. El reciclaje es fundamental para conservar recursos.',
    category: 'Reciclaje'
  },
  {
    id: 10,
    question: '¿Qué es la deforestación?',
    options: [
      'Plantar nuevos árboles',
      'La tala excesiva de bosques',
      'Cuidar los bosques',
      'Regar árboles'
    ],
    correctAnswer: 1,
    explanation: 'La deforestación es la tala o eliminación excesiva de bosques, lo que causa pérdida de biodiversidad y aumenta el cambio climático.',
    category: 'Reforestación'
  },
  {
    id: 11,
    question: '¿Cuál es el principal gas de efecto invernadero?',
    options: ['Oxígeno', 'Nitrógeno', 'Dióxido de carbono (CO2)', 'Hidrógeno'],
    correctAnswer: 2,
    explanation: 'El dióxido de carbono (CO2) es el principal gas de efecto invernadero producido por actividades humanas, contribuyendo al calentamiento global.',
    category: 'Cambio Climático'
  },
  {
    id: 12,
    question: '¿Qué significa "biodiversidad"?',
    options: [
      'Variedad de climas',
      'Variedad de vida en un ecosistema',
      'Cantidad de agua',
      'Número de árboles'
    ],
    correctAnswer: 1,
    explanation: 'Biodiversidad es la variedad de especies de plantas, animales y microorganismos que viven en un ecosistema.',
    category: 'Biodiversidad'
  },
  {
    id: 13,
    question: '¿Cuál es la mejor manera de reducir la contaminación por plástico?',
    options: [
      'Usar más plástico',
      'Tirar plástico al mar',
      'Reducir, reutilizar y reciclar',
      'Quemar plástico'
    ],
    correctAnswer: 2,
    explanation: 'La regla de las "3R" (Reducir, Reutilizar, Reciclar) es la mejor manera de reducir la contaminación por plástico.',
    category: 'Reciclaje'
  },
  {
    id: 14,
    question: '¿Qué animales son importantes para dispersar semillas de árboles?',
    options: ['Solo insectos', 'Aves y mamíferos', 'Solo peces', 'Ninguno'],
    correctAnswer: 1,
    explanation: 'Las aves y mamíferos son cruciales para dispersar semillas de árboles, ayudando a la regeneración natural de los bosques.',
    category: 'Ecosistemas'
  },
  {
    id: 15,
    question: '¿Por qué es importante apagar los incendios forestales rápidamente?',
    options: [
      'Para ahorrar agua',
      'Porque destruyen ecosistemas completos',
      'Para practicar deportes',
      'No es importante'
    ],
    correctAnswer: 1,
    explanation: 'Los incendios forestales destruyen ecosistemas completos, matan animales, eliminan árboles y liberan grandes cantidades de CO2.',
    category: 'Prevención'
  }
];

export function getRandomQuestion(usedQuestionIds: number[]) {
  const availableQuestions = EDUCATIONAL_QUESTIONS.filter(q => !usedQuestionIds.includes(q.id));
  
  if (availableQuestions.length === 0) {
    // If all questions used, reset
    return EDUCATIONAL_QUESTIONS[Math.floor(Math.random() * EDUCATIONAL_QUESTIONS.length)];
  }
  
  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
}
