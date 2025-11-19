'use client';

export default function MissionPanel({ missions }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-800 text-white p-3">
      <div className="space-y-2">
        {missions.map((mission) => (
          <div 
            key={mission.id} 
            className={`p-2 rounded border-2 ${
              mission.completed 
                ? 'bg-green-900/50 border-green-500' 
                : mission.failed
                ? 'bg-red-900/50 border-red-500'
                : mission.isChallenge
                ? 'bg-orange-900/50 border-orange-500'
                : mission.isSpecial
                ? 'bg-purple-900/50 border-purple-500'
                : 'bg-slate-700 border-slate-600'
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1 flex-wrap">
                  {mission.isChallenge && (
                    <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded font-bold">
                      DESAFÍO
                    </span>
                  )}
                  {mission.isSpecial && (
                    <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded font-bold">
                      ESPECIAL
                    </span>
                  )}
                  {mission.completed && (
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded font-bold">
                      ✓ COMPLETA
                    </span>
                  )}
                  {mission.failed && (
                    <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                      ✗ FALLIDA
                    </span>
                  )}
                </div>
                
                <p className="text-white text-xs sm:text-sm font-semibold mb-1">{mission.name}</p>
                
                {mission.timeLimit && !mission.completed && !mission.failed && (
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs text-yellow-400">⏱️</span>
                    <span className={`text-xs font-bold ${
                      mission.timeRemaining < 30 ? 'text-red-400 animate-pulse' : 'text-yellow-300'
                    }`}>
                      {formatTime(mission.timeRemaining)}
                    </span>
                  </div>
                )}
                
                <div className="mt-1 bg-slate-900 rounded-full h-3 sm:h-4 overflow-hidden border border-slate-600">
                  <div
                    className={`h-full transition-all ${
                      mission.completed 
                        ? 'bg-green-500' 
                        : mission.failed
                        ? 'bg-red-500'
                        : mission.isChallenge
                        ? 'bg-orange-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, (mission.current / mission.target) * 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-300">
                    {mission.current}/{mission.target}
                  </p>
                  {mission.reward && (
                    <p className="text-xs text-yellow-400 font-bold">
                      +{mission.reward}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
