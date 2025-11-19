'use client';

import { useState } from 'react';

export default function InventoryPanel({ inventory }) {
  return (
    <div className="bg-slate-800 text-white p-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex justify-between items-center bg-slate-700 p-2 rounded">
          <span className="text-xs sm:text-sm">Semillas</span>
          <span className="bg-green-600 text-white px-2 py-1 rounded font-bold text-xs sm:text-sm">{inventory.seeds}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-700 p-2 rounded">
          <span className="text-xs sm:text-sm">Agua</span>
          <span className="bg-blue-600 text-white px-2 py-1 rounded font-bold text-xs sm:text-sm">{inventory.water}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-700 p-2 rounded">
          <span className="text-xs sm:text-sm">Herramientas</span>
          <span className="bg-yellow-600 text-white px-2 py-1 rounded font-bold text-xs sm:text-sm">{inventory.tools}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-700 p-2 rounded">
          <span className="text-xs sm:text-sm">Medicina</span>
          <span className="bg-red-600 text-white px-2 py-1 rounded font-bold text-xs sm:text-sm">{inventory.medicine}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-700 p-2 rounded">
          <span className="text-xs sm:text-sm">Comida</span>
          <span className="bg-lime-600 text-white px-2 py-1 rounded font-bold text-xs sm:text-sm">{inventory.food || 0}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-700 p-2 rounded">
          <span className="text-xs sm:text-sm">Flores</span>
          <span className="bg-pink-500 text-white px-2 py-1 rounded font-bold text-xs sm:text-sm">{inventory.flowers || 0}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-700 p-2 rounded">
          <span className="text-xs sm:text-sm">Hongos</span>
          <span className="bg-amber-600 text-white px-2 py-1 rounded font-bold text-xs sm:text-sm">{inventory.mushrooms || 0}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-700 p-2 rounded">
          <span className="text-xs sm:text-sm">Metal</span>
          <span className="bg-gray-600 text-white px-2 py-1 rounded font-bold text-xs sm:text-sm">{inventory.metal}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-700 p-2 rounded">
          <span className="text-xs sm:text-sm">Plástico</span>
          <span className="bg-pink-600 text-white px-2 py-1 rounded font-bold text-xs sm:text-sm">{inventory.plastic}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-700 p-2 rounded">
          <span className="text-xs sm:text-sm">Madera</span>
          <span className="bg-amber-700 text-white px-2 py-1 rounded font-bold text-xs sm:text-sm">{inventory.wood}</span>
        </div>
        <div className="flex justify-between items-center bg-slate-700 p-2 rounded">
          <span className="text-xs sm:text-sm">Hacha</span>
          <span className="bg-orange-600 text-white px-2 py-1 rounded font-bold text-xs sm:text-sm">{inventory.axe}</span>
        </div>
      </div>
    </div>
  );
}
