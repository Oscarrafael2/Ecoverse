'use client';

export default function GameHUD({ gameState, onAction, onMobileControl, biome }) {
  const getActionButtons = () => {
    const baseButtons = [
      { label: 'Plantar', action: 'plant', color: 'bg-green-600', disabled: gameState.inventory.seeds === 0, count: gameState.inventory.seeds },
      { label: 'Limpiar', action: 'clean', color: 'bg-blue-600', disabled: gameState.inventory.tools === 0, count: gameState.inventory.tools },
      { label: 'Apagar', action: 'extinguish', color: 'bg-red-600', disabled: false },
      { label: 'Agua', action: 'collect_water', color: 'bg-cyan-600', disabled: gameState.inventory.water >= 12, count: gameState.inventory.water },
      { label: 'Animal', action: 'help_animal', color: 'bg-purple-600', disabled: false },
      { label: 'Flor', action: 'collect_flower', color: 'bg-pink-600', disabled: false },
      { label: 'Hongo', action: 'collect_mushroom', color: 'bg-amber-700', disabled: false },
      { label: 'Excavar', action: 'dig', color: 'bg-amber-600', disabled: gameState.inventory.tools === 0, count: gameState.inventory.tools },
      { label: 'Rellenar', action: 'fill_water', color: 'bg-teal-600', disabled: gameState.inventory.water === 0, count: gameState.inventory.water },
      { label: 'Talar', action: 'chop', color: 'bg-orange-600', disabled: gameState.inventory.axe === 0, count: gameState.inventory.axe },
      { label: 'Recoger', action: 'collect_resource', color: 'bg-yellow-600', disabled: false },
    ];

    return baseButtons.filter(btn => {
      if (biome === 'desert' && btn.action === 'chop') return false;
      return true;
    });
  };

  return (
    <div className="bg-slate-800 text-white p-3">
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-xs sm:text-sm">Salud del Bioma</span>
          <span className="text-sm sm:text-lg font-bold text-green-400">{gameState.biomeHealth.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-5 sm:h-6 border-2 border-green-400 overflow-hidden">
          <div
            className={`h-full transition-all flex items-center justify-center font-bold text-xs ${
              gameState.biomeHealth > 70 ? 'bg-green-500' : gameState.biomeHealth > 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${gameState.biomeHealth}%` }}
          >
            {gameState.biomeHealth > 20 && gameState.biomeHealth.toFixed(0)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {getActionButtons().map((btn) => (
          <button
            key={btn.action}
            onClick={() => onAction(btn.action)}
            disabled={btn.disabled}
            className={`${btn.color} hover:opacity-80 disabled:bg-gray-600 disabled:opacity-50 px-2 py-3 rounded font-bold text-xs transition active:scale-95`}
          >
            <div>{btn.label}</div>
            {btn.count !== undefined && <div className="text-xs opacity-80">({btn.count})</div>}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 p-3 rounded border border-slate-700">
        <p className="text-xs font-bold text-gray-300 mb-2 text-center">MOVIMIENTO</p>
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          <div></div>
          <button
            onTouchStart={(e) => { e.preventDefault(); onMobileControl('up', true); }}
            onTouchEnd={(e) => { e.preventDefault(); onMobileControl('up', false); }}
            onMouseDown={() => onMobileControl('up', true)}
            onMouseUp={() => onMobileControl('up', false)}
            className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 px-4 py-4 rounded-lg text-xl font-bold user-select-none"
          >
            ▲
          </button>
          <div></div>
          
          <button
            onTouchStart={(e) => { e.preventDefault(); onMobileControl('left', true); }}
            onTouchEnd={(e) => { e.preventDefault(); onMobileControl('left', false); }}
            onMouseDown={() => onMobileControl('left', true)}
            onMouseUp={() => onMobileControl('left', false)}
            className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 px-4 py-4 rounded-lg text-xl font-bold user-select-none"
          >
            ◄
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); onMobileControl('down', true); }}
            onTouchEnd={(e) => { e.preventDefault(); onMobileControl('down', false); }}
            onMouseDown={() => onMobileControl('down', true)}
            onMouseUp={() => onMobileControl('down', false)}
            className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 px-4 py-4 rounded-lg text-xl font-bold user-select-none"
          >
            ▼
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); onMobileControl('right', true); }}
            onTouchEnd={(e) => { e.preventDefault(); onMobileControl('right', false); }}
            onMouseDown={() => onMobileControl('right', true)}
            onMouseUp={() => onMobileControl('right', false)}
            className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 px-4 py-4 rounded-lg text-xl font-bold user-select-none"
          >
            ►
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">O usa WASD / Flechas</p>
      </div>
    </div>
  );
}
