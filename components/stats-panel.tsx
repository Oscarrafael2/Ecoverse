interface StatsPanelProps {
  stats: {
    treesPlanted: number;
    treesChopped: number;
    dryTreesChopped: number;
    healthyTreesChopped: number;
    trashCleaned: number;
    plasticCleaned: number;
    metalCleaned: number;
    firesExtinguished: number;
    animalsHelped: number;
    animalsCured: number;
    animalsFed: number;
    distanceTraveled: number;
    resourcesCollected: number;
    waterCollected: number;
    holesDigged: number;
    holesFilled: number;
    missionsCompleted: number;
    flowersCollected: number;
    mushroomsCollected: number;
    questionsAnswered?: number;
    correctAnswers?: number;
  };
  score: number;
  biomeHealth: number;
  gameWon: boolean;
}

export default function StatsPanel({ stats, score, biomeHealth, gameWon }: StatsPanelProps) {
  // Calcular eficiencia de reciclaje
  const recyclingEfficiency = stats.trashCleaned > 0 
    ? Math.round((stats.trashCleaned / (stats.trashCleaned + 10)) * 100)
    : 0;

  // Calcular balance ecológico
  const ecologicalBalance = stats.treesPlanted - stats.treesChopped;
  const balancePercentage = stats.treesPlanted > 0
    ? Math.round((ecologicalBalance / stats.treesPlanted) * 100)
    : 0;

  const questionAccuracy = stats.questionsAnswered && stats.questionsAnswered > 0
    ? Math.round((stats.correctAnswers! / stats.questionsAnswered) * 100)
    : 0;

  return (
    <div className="bg-slate-800 border-4 border-green-400 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-green-400">
        {gameWon ? '🏆 ESTADÍSTICAS DE VICTORIA' : '📊 ESTADÍSTICAS FINALES'}
      </h2>

      {/* Resumen General */}
      <div className="bg-slate-700 rounded-lg p-4 mb-4">
        <h3 className="text-xl font-bold text-yellow-400 mb-3">📈 Resumen General</h3>
        <div className="grid grid-cols-2 gap-3 text-white">
          <div className="bg-slate-600 rounded p-2">
            <div className="text-xs text-gray-300">Puntuación Final</div>
            <div className="text-2xl font-bold text-yellow-400">{score}</div>
          </div>
          <div className="bg-slate-600 rounded p-2">
            <div className="text-xs text-gray-300">Salud del Bioma</div>
            <div className="text-2xl font-bold text-green-400">{biomeHealth.toFixed(1)}%</div>
          </div>
          <div className="bg-slate-600 rounded p-2">
            <div className="text-xs text-gray-300">Misiones Completadas</div>
            <div className="text-2xl font-bold text-purple-400">{stats.missionsCompleted}</div>
          </div>
          <div className="bg-slate-600 rounded p-2">
            <div className="text-xs text-gray-300">Distancia Recorrida</div>
            <div className="text-2xl font-bold text-blue-400">{Math.round(stats.distanceTraveled)}m</div>
          </div>
        </div>
      </div>

      {stats.questionsAnswered && stats.questionsAnswered > 0 && (
        <div className="bg-gradient-to-r from-green-700 to-blue-700 rounded-lg p-4 mb-4 border-2 border-yellow-400">
          <h3 className="text-xl font-bold text-yellow-300 mb-3">🎓 Conocimiento Ecológico</h3>
          <div className="space-y-2 text-white text-sm">
            <div className="flex justify-between items-center bg-black/30 rounded px-3 py-2">
              <span>Preguntas Respondidas</span>
              <span className="font-bold text-yellow-300">{stats.questionsAnswered}</span>
            </div>
            <div className="flex justify-between items-center bg-black/30 rounded px-3 py-2">
              <span>Respuestas Correctas</span>
              <span className="font-bold text-green-300">{stats.correctAnswers}</span>
            </div>
            <div className="flex justify-between items-center bg-black/30 rounded px-3 py-2">
              <span>Precisión</span>
              <span className={`font-bold text-2xl ${
                questionAccuracy >= 80 ? 'text-green-300' : 
                questionAccuracy >= 60 ? 'text-yellow-300' : 'text-orange-300'
              }`}>
                {questionAccuracy}%
              </span>
            </div>
            <div className="flex justify-between items-center bg-black/30 rounded px-3 py-2">
              <span>Calificación</span>
              <span className="font-bold text-xl text-yellow-300">
                {questionAccuracy >= 90 ? '⭐⭐⭐ Excelente' :
                 questionAccuracy >= 70 ? '⭐⭐ Muy Bien' :
                 questionAccuracy >= 50 ? '⭐ Bien' : '💪 Sigue Aprendiendo'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas Ecológicas */}
      <div className="bg-slate-700 rounded-lg p-4 mb-4">
        <h3 className="text-xl font-bold text-green-400 mb-3">🌳 Ecosistema</h3>
        <div className="space-y-2 text-white text-sm">
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Árboles Plantados</span>
            <span className="font-bold text-green-400">+{stats.treesPlanted}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Árboles Talados (Total)</span>
            <span className="font-bold text-orange-400">{stats.treesChopped}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2 ml-4">
            <span className="text-xs">• Árboles Secos (Bueno)</span>
            <span className="font-bold text-green-400">+{stats.dryTreesChopped}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2 ml-4">
            <span className="text-xs">• Árboles Sanos (Malo)</span>
            <span className="font-bold text-red-400">-{stats.healthyTreesChopped}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Balance Ecológico</span>
            <span className={`font-bold ${ecologicalBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {ecologicalBalance >= 0 ? '+' : ''}{ecologicalBalance} ({balancePercentage}%)
            </span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Incendios Apagados</span>
            <span className="font-bold text-orange-400">{stats.firesExtinguished}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Flores Recolectadas</span>
            <span className="font-bold text-pink-400">{stats.flowersCollected}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Hongos Recolectados</span>
            <span className="font-bold text-amber-400">{stats.mushroomsCollected}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-700 rounded-lg p-4 mb-4">
        <h3 className="text-xl font-bold text-yellow-400 mb-3">🦊 Cuidado de Animales</h3>
        <div className="space-y-2 text-white text-sm">
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Animales Ayudados</span>
            <span className="font-bold text-yellow-400">{stats.animalsHelped}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Animales Curados</span>
            <span className="font-bold text-pink-400">{stats.animalsCured}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Animales Alimentados</span>
            <span className="font-bold text-lime-400">{stats.animalsFed}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Total de Interacciones</span>
            <span className="font-bold text-purple-400">{stats.animalsHelped + stats.animalsCured + stats.animalsFed}</span>
          </div>
        </div>
      </div>

      {/* Estadísticas de Reciclaje */}
      <div className="bg-slate-700 rounded-lg p-4 mb-4">
        <h3 className="text-xl font-bold text-blue-400 mb-3">♻️ Reciclaje y Limpieza</h3>
        <div className="space-y-2 text-white text-sm">
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Basura Total Limpiada</span>
            <span className="font-bold text-blue-400">{stats.trashCleaned}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>• Plástico Reciclado</span>
            <span className="font-bold text-cyan-400">{stats.plasticCleaned}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>• Metal Reciclado</span>
            <span className="font-bold text-gray-400">{stats.metalCleaned}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Eficiencia de Reciclaje</span>
            <span className="font-bold text-green-400">{recyclingEfficiency}%</span>
          </div>
        </div>
      </div>

      {/* Estadísticas de Recursos */}
      <div className="bg-slate-700 rounded-lg p-4 mb-4">
        <h3 className="text-xl font-bold text-cyan-400 mb-3">💧 Recursos y Agua</h3>
        <div className="space-y-2 text-white text-sm">
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Agua Recolectada</span>
            <span className="font-bold text-blue-400">{stats.waterCollected}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Pozos Excavados</span>
            <span className="font-bold text-orange-400">{stats.holesDigged}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Pozos Llenados con Agua</span>
            <span className="font-bold text-cyan-400">{stats.holesFilled}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Recursos Recolectados</span>
            <span className="font-bold text-yellow-400">{stats.resourcesCollected}</span>
          </div>
        </div>
      </div>

      {/* Cálculos Matemáticos */}
      <div className="bg-slate-700 rounded-lg p-4">
        <h3 className="text-xl font-bold text-purple-400 mb-3">🧮 Pensamiento Matemático</h3>
        <div className="space-y-2 text-white text-sm">
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Distancia Total Recorrida</span>
            <span className="font-bold text-blue-400">{Math.round(stats.distanceTraveled)} metros</span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Acciones Positivas Totales</span>
            <span className="font-bold text-green-400">
              {stats.treesPlanted + stats.trashCleaned + stats.firesExtinguished + 
               stats.animalsHelped + stats.animalsCured + stats.animalsFed + stats.holesFilled +
               stats.flowersCollected + stats.mushroomsCollected + stats.dryTreesChopped}
            </span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Ratio Acción/Metro</span>
            <span className="font-bold text-yellow-400">
              {stats.distanceTraveled > 0 
                ? ((stats.treesPlanted + stats.trashCleaned + stats.firesExtinguished) / (stats.distanceTraveled / 100)).toFixed(2)
                : '0.00'}
            </span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Promedio Puntos/Acción</span>
            <span className="font-bold text-purple-400">
              {(stats.treesPlanted + stats.trashCleaned + stats.firesExtinguished + stats.animalsHelped) > 0
                ? Math.round(score / (stats.treesPlanted + stats.trashCleaned + stats.firesExtinguished + stats.animalsHelped))
                : 0}
            </span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Eficiencia Ecológica</span>
            <span className="font-bold text-green-400">
              {stats.treesPlanted > 0
                ? Math.round((stats.treesPlanted / (stats.treesPlanted + stats.treesChopped)) * 100)
                : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center bg-slate-600 rounded px-3 py-2">
            <span>Tala Inteligente</span>
            <span className="font-bold text-lime-400">
              {stats.treesChopped > 0
                ? Math.round((stats.dryTreesChopped / stats.treesChopped) * 100)
                : 0}% correcta
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
