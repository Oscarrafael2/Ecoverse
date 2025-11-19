'use client';

export default function UpgradeShop({ score, upgrades, onPurchase, onClose }) {
  const shopItems = [
    {
      name: 'speed',
      displayName: 'Velocidad',
      description: 'Muévete más rápido',
      baseCost: 100,
      level: upgrades.speed,
      maxLevel: 5,
      icon: '⚡'
    },
    {
      name: 'inventorySize',
      displayName: 'Capacidad',
      description: 'Lleva más recursos',
      baseCost: 150,
      level: upgrades.inventorySize,
      maxLevel: 3,
      icon: '🎒'
    },
    {
      name: 'range',
      displayName: 'Alcance',
      description: 'Interactúa desde más lejos',
      baseCost: 120,
      level: upgrades.range,
      maxLevel: 4,
      icon: '🎯'
    },
    {
      name: 'efficiency',
      displayName: 'Eficiencia',
      description: 'Acciones más efectivas',
      baseCost: 200,
      level: upgrades.efficiency,
      maxLevel: 3,
      icon: '💎'
    }
  ];

  const calculateCost = (baseCost, level) => {
    return Math.floor(baseCost * Math.pow(1.5, level - 1));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40">
      <div className="bg-slate-800 border-4 border-purple-500 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-400">Tienda de Mejoras</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 bg-slate-900 p-4 rounded-lg border-2 border-yellow-500">
          <div className="text-center text-yellow-400 font-bold text-xl">
            Puntos Disponibles: {score}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shopItems.map((item) => {
            const cost = calculateCost(item.baseCost, item.level);
            const isMaxLevel = item.level >= item.maxLevel;
            const canAfford = score >= cost;

            return (
              <div
                key={item.name}
                className={`bg-slate-700 border-2 rounded-lg p-4 ${
                  isMaxLevel ? 'border-green-500' : 'border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="text-white font-bold text-lg">{item.displayName}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Nivel:</span>
                    <span className="text-purple-400 font-bold">
                      {item.level} / {item.maxLevel}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${(item.level / item.maxLevel) * 100}%` }}
                    />
                  </div>
                </div>

                {isMaxLevel ? (
                  <div className="bg-green-600 text-white text-center py-2 rounded font-bold">
                    MÁXIMO
                  </div>
                ) : (
                  <button
                    onClick={() => onPurchase(item.name, cost)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded font-bold transition ${
                      canAfford
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? `Comprar - ${cost} pts` : `Necesitas ${cost} pts`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-blue-900/50 border-2 border-blue-500 rounded-lg p-4">
          <h3 className="text-blue-300 font-bold mb-2">Consejos:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Completa misiones para ganar puntos</li>
            <li>• Las mejoras son permanentes durante la partida</li>
            <li>• Prioriza mejoras según tu estilo de juego</li>
            <li>• Los costos aumentan con cada nivel</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
