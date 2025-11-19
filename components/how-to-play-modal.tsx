'use client';

export default function HowToPlayModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border-4 border-green-400 p-6 rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-400">Cómo Jugar</h2>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded"
          >
            ✕
          </button>
        </div>

        <div className="text-white space-y-4 text-sm sm:text-base">
          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Objetivo</h3>
            <p>Restaura la salud del bioma al 100% para ganar. Si la salud baja a 20%, pierdes.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Controles</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Movimiento:</strong> Flechas o WASD (teclado) / Botones direccionales (móvil)</li>
              <li><strong>Acciones:</strong> Usa los botones del panel de controles</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Acciones</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-slate-700 p-2 rounded">
                <span className="text-green-400 font-bold">Plantar:</span> Planta árboles para aumentar la salud (+4%) y ganar puntos
              </div>
              <div className="bg-slate-700 p-2 rounded">
                <span className="text-blue-400 font-bold">Limpiar:</span> Recoge basura para mejorar el bioma (+3%)
              </div>
              <div className="bg-slate-700 p-2 rounded">
                <span className="text-red-400 font-bold">Apagar:</span> Extingue incendios forestales (+5%)
              </div>
              <div className="bg-slate-700 p-2 rounded">
                <span className="text-cyan-400 font-bold">Agua:</span> Recoge agua de fuentes naturales
              </div>
              <div className="bg-slate-700 p-2 rounded">
                <span className="text-purple-400 font-bold">Animal:</span> Ayuda animales (usa medicina si están enfermos)
              </div>
              <div className="bg-slate-700 p-2 rounded">
                <span className="text-amber-400 font-bold">Excavar:</span> Crea pozos para rellenar con agua
              </div>
              <div className="bg-slate-700 p-2 rounded">
                <span className="text-teal-400 font-bold">Rellenar:</span> Llena pozos con agua (+6%)
              </div>
              <div className="bg-slate-700 p-2 rounded">
                <span className="text-orange-400 font-bold">Talar:</span> Corta árboles enfermos (usa con cuidado, -3%)
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Eventos y Dificultad</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Eventos aleatorios:</strong> Incendios, basura, animales y recursos aparecen periódicamente</li>
              <li><strong>Dificultad progresiva:</strong> El juego se vuelve más difícil con el tiempo (más eventos frecuentes)</li>
              <li><strong>Decaimiento natural:</strong> La salud del bioma disminuye lentamente con el tiempo</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Misiones</h3>
            <p>Completa misiones para obtener puntos extra. Las misiones tienen objetivos específicos como plantar árboles, limpiar basura, o apagar incendios.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Recursos e Inventario</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Semillas:</strong> Para plantar árboles</li>
              <li><strong>Agua:</strong> Para rellenar pozos y restaurar el bioma</li>
              <li><strong>Herramientas:</strong> Para limpiar basura y excavar</li>
              <li><strong>Hacha:</strong> Para talar árboles enfermos</li>
              <li><strong>Medicina:</strong> Para curar animales enfermos</li>
              <li><strong>Materiales:</strong> Metal, plástico y madera que recoges</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Consejos</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Prioriza apagar incendios y limpiar basura inmediatamente</li>
              <li>Planta árboles constantemente para mantener la salud alta</li>
              <li>Usa el minimapa (esquina superior izquierda) para ubicar eventos</li>
              <li>Mantén un balance entre todas las acciones</li>
              <li>La dificultad aumenta con el tiempo, así que actúa rápido</li>
            </ul>
          </section>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-black font-bold px-6 py-3 rounded transition"
        >
          ¡Entendido! Jugar
        </button>
      </div>
    </div>
  );
}
