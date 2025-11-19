'use client';

export default function BiomeSelector({ onSelectBiome, onShowHowToPlay, onLoadGame, hasSavedGame }) {
  const biomes = [
    { id: 'tropical', name: 'Tropical', description: 'Selva densa con muchos árboles y vida' },
    { id: 'savanna', name: 'Sabana', description: 'Llanura con pocos árboles' },
    { id: 'desert', name: 'Desierto', description: 'Arena árida sin árboles naturales' },
    { id: 'freshwater', name: 'Agua Dulce', description: 'Lagos y ríos con vegetación' },
  ];

  return (
    <main className="w-full h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-green-400 mb-2">ECOVERSE</h1>
        <p className="text-xl text-gray-300">Elige un bioma para restaurar</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={onShowHowToPlay}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg transition text-lg"
        >
          Cómo Jugar
        </button>

        {hasSavedGame && (
          <button
            onClick={onLoadGame}
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold px-6 py-3 rounded-lg transition text-lg"
          >
            Continuar Partida
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full px-4">
        {biomes.map((biome) => (
          <button
            key={biome.id}
            onClick={() => onSelectBiome(biome.id)}
            className="bg-slate-700 hover:bg-green-600 border-2 border-green-400 p-8 rounded-lg transition-all transform hover:scale-105"
          >
            <div className="text-3xl mb-3">{biome.name}</div>
            <p className="text-sm text-gray-300">{biome.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-12 text-gray-400 text-sm text-center max-w-xl">
        <p>Cada bioma tiene características únicas. Algunos tienen más árboles, otros menos agua. Restaura tu bioma a 100% de salud para ganar!</p>
      </div>
    </main>
  );
}
