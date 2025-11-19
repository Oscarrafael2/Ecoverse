'use client';

import { useState, useEffect, useRef } from 'react';
import GameCanvas from '@/components/game-canvas';
import GameHUD from '@/components/game-hud';
import InventoryPanel from '@/components/inventory-panel';
import MissionPanel from '@/components/mission-panel';
import BiomeSelector from '@/components/biome-selector';
import HowToPlayModal from '@/components/how-to-play-modal';
import UpgradeShop from '@/components/upgrade-shop';
import StatsPanel from '@/components/stats-panel';
import { SoundManager } from '@/lib/sound-manager';
import { SaveManager } from '@/lib/save-manager';

const RANDOM_MISSIONS = [
  { name: 'Planta 8 árboles', type: 'plant', target: 8, reward: 50 },
  { name: 'Limpia 12 basuras', type: 'clean', target: 12, reward: 60 },
  { name: 'Apaga 3 incendios', type: 'extinguish', target: 3, reward: 80 },
  { name: 'Excava y llena 5 pozos', type: 'dig_fill', target: 5, reward: 100 },
  { name: 'Tala 3 árboles', type: 'chop', target: 3, reward: 40 },
  { name: 'Recoge 5 aguas', type: 'water', target: 5, reward: 30 },
  { name: 'Ayuda 4 animales', type: 'animal', target: 4, reward: 70 },
  { name: 'Cura 3 animales enfermos', type: 'sick_animal', target: 3, reward: 120 },
  { name: 'Recoge 8 recursos', type: 'resource', target: 8, reward: 50 },
  { name: 'Alimenta 6 animales', type: 'feed_animal', target: 6, reward: 65 },
  { name: 'Recoge 10 flores', type: 'flower', target: 10, reward: 45 },
  { name: 'Recoge 8 hongos', type: 'mushroom', target: 8, reward: 55 },
  { name: 'Planta 15 árboles DESAFÍO', type: 'plant', target: 15, reward: 150, isChallenge: true },
  { name: 'Apaga 7 incendios DESAFÍO', type: 'extinguish', target: 7, reward: 200, isChallenge: true },
  { name: 'Alimenta 12 animales DESAFÍO', type: 'feed_animal', target: 12, reward: 180, isChallenge: true },
];

const SPECIAL_MISSIONS = [
  { name: 'Salvar el bosque: Apaga 5 incendios en 3 minutos', type: 'timed_extinguish', target: 5, timeLimit: 180, reward: 250 },
  { name: 'Operación limpieza: 20 basuras', type: 'clean', target: 20, reward: 180, isSpecial: true },
  { name: 'Veterinario: Cura 6 animales enfermos', type: 'sick_animal', target: 6, reward: 200, isSpecial: true },
  { name: 'Guardabosques: Alimenta 15 animales', type: 'feed_animal', target: 15, reward: 220, isSpecial: true },
];

const BIOME_CONFIGS = {
  tropical: {
    name: 'Tropical',
    treeCount: 45,
    animalCount: 12, // Increased from 8 to 12
    waterSpots: 8,
    flowerCount: 20, // New: flowers
    bushCount: 15, // New: bushes
    mushroomCount: 10, // New: mushrooms
    rockCount: 8, // New: rocks
    initialHealth: 75,
    mapWidth: 1200,
    mapHeight: 900,
    description: 'Selva densa con muchos árboles',
    startingInventory: { seeds: 25, water: 8, tools: 15, axe: 3, metal: 0, plastic: 0, wood: 0, medicine: 5, food: 10, flowers: 0, mushrooms: 0 }
  },
  savanna: {
    name: 'Sabana',
    treeCount: 28,
    animalCount: 16, // Increased from 12 to 16
    waterSpots: 4,
    flowerCount: 30,
    bushCount: 20,
    mushroomCount: 5,
    rockCount: 12,
    initialHealth: 65,
    mapWidth: 1200,
    mapHeight: 900,
    description: 'Llanura con pocos árboles',
    startingInventory: { seeds: 35, water: 10, tools: 20, axe: 2, metal: 0, plastic: 0, wood: 0, medicine: 6, food: 15, flowers: 0, mushrooms: 0 }
  },
  desert: {
    name: 'Desierto',
    treeCount: 8,
    animalCount: 8, // Increased from 6 to 8
    waterSpots: 2,
    flowerCount: 8,
    bushCount: 5,
    mushroomCount: 2,
    rockCount: 20,
    initialHealth: 50,
    mapWidth: 1200,
    mapHeight: 900,
    description: 'Arena árida, sin árboles naturales',
    startingInventory: { seeds: 50, water: 15, tools: 25, axe: 1, metal: 0, plastic: 0, wood: 0, medicine: 8, food: 12, flowers: 0, mushrooms: 0 }
  },
  freshwater: {
    name: 'Agua Dulce',
    treeCount: 22,
    animalCount: 14, // Increased from 10 to 14
    waterSpots: 20,
    flowerCount: 25,
    bushCount: 18,
    mushroomCount: 15,
    rockCount: 10,
    initialHealth: 80,
    mapWidth: 1200,
    mapHeight: 900,
    description: 'Lago y ríos con vegetación',
    startingInventory: { seeds: 30, water: 12, tools: 18, axe: 3, metal: 0, plastic: 0, wood: 0, medicine: 7, food: 12, flowers: 0, mushrooms: 0 }
  }
};

const generateRandomMission = (id, includeSpecial = false) => {
  const missionPool = includeSpecial && Math.random() < 0.15 ? [...RANDOM_MISSIONS, ...SPECIAL_MISSIONS] : RANDOM_MISSIONS;
  const baseMission = missionPool[Math.floor(Math.random() * missionPool.length)];
  return {
    id,
    name: baseMission.name,
    type: baseMission.type,
    target: baseMission.target,
    reward: baseMission.reward,
    isChallenge: baseMission.isChallenge || false,
    isSpecial: baseMission.isSpecial || false,
    timeLimit: baseMission.timeLimit || null,
    timeRemaining: baseMission.timeLimit || null,
    current: 0,
    completed: false,
  };
};

export default function Home() {
  const [selectedBiome, setSelectedBiome] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [visualFeedback, setVisualFeedback] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('controls');
  const gameCanvasRef = useRef(null);
  const inputRef = useRef({});
  const mobileInputRef = useRef({});
  const eventCounterRef = useRef(0);
  const difficultyLevelRef = useRef(1);
  const soundManagerRef = useRef(null);
  const autoSaveIntervalRef = useRef(null);
  const previousPosRef = useRef(null);

  useEffect(() => {
    soundManagerRef.current = new SoundManager();
    
    return () => {
      if (soundManagerRef.current) {
        soundManagerRef.current.stopBackgroundMusic();
      }
    };
  }, []);

  useEffect(() => {
    if (gameState && !gameState.gameOver && !gameState.gameWon) {
      autoSaveIntervalRef.current = setInterval(() => {
        SaveManager.saveGame(selectedBiome, gameState, difficultyLevelRef.current);
      }, 30000);

      return () => {
        if (autoSaveIntervalRef.current) {
          clearInterval(autoSaveIntervalRef.current);
        }
      };
    }
  }, [gameState, selectedBiome]);

  const initializeGame = (biome) => {
    const config = BIOME_CONFIGS[biome];
    setSelectedBiome(biome);
    
    const initialTrees = [];
    for (let i = 0; i < config.treeCount; i++) {
      initialTrees.push({
        id: `init_tree_${i}`,
        x: Math.random() * config.mapWidth,
        y: Math.random() * config.mapHeight,
      });
    }

    const animalTypes = ['deer', 'bird', 'rabbit', 'fox', 'bear', 'wolf', 'owl', 'squirrel'];
    const initialAnimals = [];
    for (let i = 0; i < config.animalCount; i++) {
      const isSick = Math.random() < 0.3; // 30% chance of being sick
      const isHungry = Math.random() < 0.4; // 40% chance of being hungry
      initialAnimals.push({
        id: `init_animal_${i}`,
        x: Math.random() * config.mapWidth,
        y: Math.random() * config.mapHeight,
        type: animalTypes[Math.floor(Math.random() * animalTypes.length)],
        sick: isSick,
        hungry: isHungry,
      });
    }

    const initialWater = [];
    for (let i = 0; i < config.waterSpots; i++) {
      initialWater.push({
        id: `water_${i}`,
        x: Math.random() * config.mapWidth,
        y: Math.random() * config.mapHeight,
      });
    }

    const initialFlowers = [];
    for (let i = 0; i < config.flowerCount; i++) {
      initialFlowers.push({
        id: `flower_${i}`,
        x: Math.random() * config.mapWidth,
        y: Math.random() * config.mapHeight,
        color: ['red', 'yellow', 'purple', 'pink', 'blue'][Math.floor(Math.random() * 5)],
      });
    }

    const initialBushes = [];
    for (let i = 0; i < config.bushCount; i++) {
      initialBushes.push({
        id: `bush_${i}`,
        x: Math.random() * config.mapWidth,
        y: Math.random() * config.mapHeight,
      });
    }

    const initialMushrooms = [];
    for (let i = 0; i < config.mushroomCount; i++) {
      initialMushrooms.push({
        id: `mushroom_${i}`,
        x: Math.random() * config.mapWidth,
        y: Math.random() * config.mapHeight,
        type: ['red', 'brown', 'yellow'][Math.floor(Math.random() * 3)],
      });
    }

    const initialRocks = [];
    for (let i = 0; i < config.rockCount; i++) {
      initialRocks.push({
        id: `rock_${i}`,
        x: Math.random() * config.mapWidth,
        y: Math.random() * config.mapHeight,
        size: Math.random() * 0.5 + 0.8,
      });
    }

    const initialState = {
      biome,
      biomeHealth: config.initialHealth,
      playerPos: { x: config.mapWidth / 2, y: config.mapHeight / 2 },
      inventory: { ...config.startingInventory },
      missions: [
        generateRandomMission(1, false),
        generateRandomMission(2, false),
        generateRandomMission(3, true),
      ],
      trees: initialTrees,
      water: initialWater,
      trash: [],
      fires: [],
      animals: initialAnimals,
      holes: [],
      resources: [],
      flowers: initialFlowers, // New
      bushes: initialBushes, // New
      mushrooms: initialMushrooms, // New
      rocks: initialRocks, // New
      gameOver: false,
      gameWon: false,
      message: '',
      score: 0,
      upgrades: { // Added upgrade system
        speed: 1,
        inventorySize: 1,
        range: 1,
        efficiency: 1,
      },
      stats: {
        treesPlanted: 0,
        treesChopped: 0,
        trashCleaned: 0,
        plasticCleaned: 0,
        metalCleaned: 0,
        firesExtinguished: 0,
        animalsHelped: 0,
        animalsCured: 0,
        animalsFed: 0, // New
        distanceTraveled: 0,
        resourcesCollected: 0,
        waterCollected: 0,
        holesDigged: 0,
        holesFilled: 0,
        missionsCompleted: 0,
        flowersCollected: 0, // New
        mushroomsCollected: 0, // New
      },
    };

    setGameState(initialState);
    previousPosRef.current = { x: config.mapWidth / 2, y: config.mapHeight / 2 };
    eventCounterRef.current = 0;
    difficultyLevelRef.current = 1;

    if (soundManagerRef.current) {
      soundManagerRef.current.playBackgroundMusic();
    }
  };

  const loadSavedGame = () => {
    const saveData = SaveManager.loadGame();
    if (saveData) {
      setSelectedBiome(saveData.biome);
      setGameState(saveData.gameState);
      difficultyLevelRef.current = saveData.difficultyLevel;
      
      if (soundManagerRef.current) {
        soundManagerRef.current.playBackgroundMusic();
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      inputRef.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      inputRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!gameState || gameState.gameOver || gameState.gameWon) return;

    const gameLoop = setInterval(() => {
      setGameState((prev) => {
        let newState = { ...prev };
        eventCounterRef.current++;
        const config = BIOME_CONFIGS[prev.biome];

        const baseEventInterval = 20;
        const timePlayed = Math.floor(eventCounterRef.current / 60);
        difficultyLevelRef.current = Math.min(5, 1 + Math.floor(timePlayed / 30));
        const eventChance = 0.05 + (difficultyLevelRef.current - 1) * 0.02;
        const eventInterval = Math.max(8, baseEventInterval - (difficultyLevelRef.current - 1) * 2);

        const baseSpeed = 4;
        const speed = baseSpeed + (prev.upgrades.speed - 1) * 1.5;
        
        const moveX = (inputRef.current['arrowleft'] || inputRef.current['a'] || mobileInputRef.current['left'] ? -speed : 0) +
                      (inputRef.current['arrowright'] || inputRef.current['d'] || mobileInputRef.current['right'] ? speed : 0);
        const moveY = (inputRef.current['arrowup'] || inputRef.current['w'] || mobileInputRef.current['up'] ? -speed : 0) +
                      (inputRef.current['arrowdown'] || inputRef.current['s'] || mobileInputRef.current['down'] ? speed : 0);

        newState.playerPos = {
          x: Math.max(0, Math.min(config.mapWidth, prev.playerPos.x + moveX)),
          y: Math.max(0, Math.min(config.mapHeight, prev.playerPos.y + moveY)),
        };

        if (previousPosRef.current) {
          const distanceMoved = Math.hypot(
            newState.playerPos.x - previousPosRef.current.x,
            newState.playerPos.y - previousPosRef.current.y
          );
          newState.stats = {
            ...prev.stats,
            distanceTraveled: prev.stats.distanceTraveled + distanceMoved,
          };
        }
        previousPosRef.current = { ...newState.playerPos };

        if (eventCounterRef.current % eventInterval === 0 && Math.random() < eventChance) {
          const eventTypes = ['fire', 'trash', 'trash', 'animal', 'animal', 'resource', 'flower', 'mushroom'];
          const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
          
          if (eventType === 'fire' && newState.fires.length < 5 + difficultyLevelRef.current) {
            newState.fires.push({
              id: Date.now() + Math.random(),
              x: Math.random() * config.mapWidth,
              y: Math.random() * config.mapHeight,
              intensity: 100,
            });
            newState.biomeHealth = Math.max(20, newState.biomeHealth - 5);
            newState.message = 'INCENDIO FORESTAL!';
          } else if (eventType === 'trash' && newState.trash.length < 25 + difficultyLevelRef.current * 3) {
            newState.trash.push({
              id: Date.now() + Math.random(),
              x: Math.random() * config.mapWidth,
              y: Math.random() * config.mapHeight,
              type: ['plastic', 'metal', 'general'][Math.floor(Math.random() * 3)],
            });
            newState.biomeHealth = Math.max(20, newState.biomeHealth - 2);
            newState.message = 'BASURA ACUMULADA!';
          } else if (eventType === 'animal') {
            const isSick = Math.random() < 0.4;
            const isHungry = Math.random() < 0.5;
            const animalTypes = ['deer', 'bird', 'rabbit', 'fox', 'bear', 'wolf', 'owl', 'squirrel'];
            newState.animals.push({
              id: Date.now() + Math.random(),
              x: Math.random() * config.mapWidth,
              y: Math.random() * config.mapHeight,
              type: animalTypes[Math.floor(Math.random() * animalTypes.length)],
              sick: isSick,
              hungry: isHungry,
            });
            newState.message = isSick ? 'Animal enfermo!' : isHungry ? 'Animal hambriento!' : 'Animal aparecio!';
          } else if (eventType === 'resource' && newState.resources.length < 15) {
            newState.resources.push({
              id: Date.now() + Math.random(),
              x: Math.random() * config.mapWidth,
              y: Math.random() * config.mapHeight,
              type: ['metal', 'plastic', 'wood'][Math.floor(Math.random() * 3)],
            });
            newState.message = 'Recurso encontrado!';
          } else if (eventType === 'flower' && newState.flowers.length < config.flowerCount + 10) {
            newState.flowers.push({
              id: Date.now() + Math.random(),
              x: Math.random() * config.mapWidth,
              y: Math.random() * config.mapHeight,
              color: ['red', 'yellow', 'purple', 'pink', 'blue'][Math.floor(Math.random() * 5)],
            });
          } else if (eventType === 'mushroom' && newState.mushrooms.length < config.mushroomCount + 5) {
            newState.mushrooms.push({
              id: Date.now() + Math.random(),
              x: Math.random() * config.mapWidth,
              y: Math.random() * config.mapHeight,
              type: ['red', 'brown', 'yellow'][Math.floor(Math.random() * 3)],
            });
          }
        }

        if (eventCounterRef.current % 120 === 0) {
          newState.biomeHealth = Math.max(20, newState.biomeHealth - 0.3);
        }

        newState.missions = newState.missions.map(mission => {
          if (mission.timeLimit && !mission.completed) {
            const updatedTimeRemaining = mission.timeRemaining - 0.03;
            if (updatedTimeRemaining <= 0) {
              return { ...mission, completed: false, failed: true };
            }
            return { ...mission, timeRemaining: updatedTimeRemaining };
          }
          
          if (!mission.completed && mission.current >= mission.target) {
            if (soundManagerRef.current) {
              soundManagerRef.current.playSoundEffect('mission_complete');
            }
            newState.score += mission.reward;
            newState.stats = {
              ...newState.stats,
              missionsCompleted: newState.stats.missionsCompleted + 1,
            };
            return { ...mission, completed: true };
          }
          return mission;
        });

        if (newState.biomeHealth >= 100) {
          newState.gameWon = true;
          newState.message = 'VICTORIA! Bioma restaurado!';
          if (soundManagerRef.current) {
            soundManagerRef.current.playSoundEffect('victory');
            soundManagerRef.current.stopBackgroundMusic();
          }
          SaveManager.deleteSave();
        }
        if (newState.biomeHealth <= 20) {
          newState.gameOver = true;
          newState.message = 'DERROTA! El bioma está destruido.';
          if (soundManagerRef.current) {
            soundManagerRef.current.playSoundEffect('defeat');
            soundManagerRef.current.stopBackgroundMusic();
          }
          SaveManager.deleteSave();
        }

        return newState;
      });
    }, 30);

    return () => clearInterval(gameLoop);
  }, [gameState]);

  const handleAction = (action) => {
    setGameState((prev) => {
      if (!prev) return prev;
      let newState = { ...prev };
      let feedbackType = null;
      let feedbackPos = { x: prev.playerPos.x, y: prev.playerPos.y };

      const baseRange = 80;
      const range = baseRange + (prev.upgrades.range - 1) * 20;
      const efficiency = prev.upgrades.efficiency;

      if (action === 'plant' && prev.inventory.seeds > 0) {
        const minPlantingDistance = 30;
        const closestTree = prev.trees.reduce((closest, tree) => {
          const dist = Math.hypot(tree.x - prev.playerPos.x, tree.y - prev.playerPos.y);
          return dist < minPlantingDistance && (!closest || dist < Math.hypot(closest.x - prev.playerPos.x, closest.y - prev.playerPos.y)) ? tree : closest;
        }, null);

        if (!closestTree) {
          const treePos = {
            x: Math.max(10, Math.min(BIOME_CONFIGS[prev.biome].mapWidth - 10, prev.playerPos.x + (Math.random() - 0.5) * 50)),
            y: Math.max(10, Math.min(BIOME_CONFIGS[prev.biome].mapHeight - 10, prev.playerPos.y + (Math.random() - 0.5) * 50)),
          };
          newState.trees.push({
            id: Date.now(),
            ...treePos,
          });
          newState.inventory.seeds--;
          const healthGain = 4 * efficiency;
          newState.biomeHealth = Math.min(100, newState.biomeHealth + healthGain);
          newState.score += 10;
          newState.message = 'Árbol plantado!';
          feedbackType = 'plant';
          feedbackPos = treePos;
          newState.stats = {
            ...prev.stats,
            treesPlanted: prev.stats.treesPlanted + 1,
          };
          
          newState.missions = newState.missions.map(m => 
            m.type === 'plant' && !m.completed ? { ...m, current: Math.min(m.target, m.current + 1) } : m
          );
        } else {
          newState.message = 'Muy cerca de otro árbol!';
        }
      }
      else if (action === 'help_animal') {
        const closestAnimal = prev.animals.reduce((closest, animal) => {
          const dist = Math.hypot(animal.x - prev.playerPos.x, animal.y - prev.playerPos.y);
          return dist < range && (!closest || dist < Math.hypot(closest.x - prev.playerPos.x, closest.y - prev.playerPos.y)) ? animal : closest;
        }, null);

        if (closestAnimal) {
          let shouldRemove = true;
          let pointsGained = 25;
          let animalsCured = 0;
          let animalsFed = 0;
          
          if (closestAnimal.sick) {
            if (newState.inventory.medicine > 0) {
              newState.inventory.medicine--;
              pointsGained = 40;
              newState.message = 'Animal curado!';
              animalsCured = 1;
              
              newState.missions = newState.missions.map(m => 
                m.type === 'sick_animal' && !m.completed ? { ...m, current: Math.min(m.target, m.current + 1) } : m
              );
            } else {
              pointsGained = 10;
              newState.message = 'Animal enfermo sin medicina!';
              shouldRemove = false;
            }
          } else if (closestAnimal.hungry) {
            if (newState.inventory.food > 0) {
              newState.inventory.food--;
              pointsGained = 30;
              newState.message = 'Animal alimentado!';
              animalsFed = 1;
              
              newState.missions = newState.missions.map(m => 
                m.type === 'feed_animal' && !m.completed ? { ...m, current: Math.min(m.target, m.current + 1) } : m
              );
            } else {
              pointsGained = 5;
              newState.message = 'Animal hambriento sin comida!';
              shouldRemove = false;
            }
          } else {
            newState.message = 'Animal ayudado!';
          }
          
          if (shouldRemove) {
            newState.animals = prev.animals.filter(a => a.id !== closestAnimal.id);
          }
          
          const healthGain = shouldRemove ? 2 * efficiency : 1;
          newState.biomeHealth = Math.min(100, newState.biomeHealth + healthGain);
          newState.score += pointsGained;
          feedbackType = 'animal';
          feedbackPos = closestAnimal;
          newState.stats = {
            ...prev.stats,
            animalsHelped: prev.stats.animalsHelped + (shouldRemove ? 1 : 0),
            animalsCured: prev.stats.animalsCured + animalsCured,
            animalsFed: prev.stats.animalsFed + animalsFed,
          };
          
          newState.missions = newState.missions.map(m => 
            m.type === 'animal' && !m.completed && shouldRemove ? { ...m, current: Math.min(m.target, m.current + 1) } : m
          );
        }
      }
      else if (action === 'collect_flower') {
        const closestFlower = prev.flowers.reduce((closest, flower) => {
          const dist = Math.hypot(flower.x - prev.playerPos.x, flower.y - prev.playerPos.y);
          return dist < range && (!closest || dist < Math.hypot(closest.x - prev.playerPos.x, closest.y - prev.playerPos.y)) ? flower : closest;
        }, null);

        if (closestFlower) {
          newState.flowers = prev.flowers.filter(f => f.id !== closestFlower.id);
          newState.inventory.flowers = (newState.inventory.flowers || 0) + 1;
          newState.biomeHealth = Math.min(100, newState.biomeHealth + 1);
          newState.score += 8;
          newState.message = 'Flor recogida!';
          feedbackType = 'collect';
          feedbackPos = closestFlower;
          newState.stats = {
            ...prev.stats,
            flowersCollected: prev.stats.flowersCollected + 1,
          };
          
          newState.missions = newState.missions.map(m => 
            m.type === 'flower' && !m.completed ? { ...m, current: Math.min(m.target, m.current + 1) } : m
          );
        }
      }
      else if (action === 'collect_mushroom') {
        const closestMushroom = prev.mushrooms.reduce((closest, mushroom) => {
          const dist = Math.hypot(mushroom.x - prev.playerPos.x, mushroom.y - prev.playerPos.y);
          return dist < range && (!closest || dist < Math.hypot(closest.x - prev.playerPos.x, closest.y - prev.playerPos.y)) ? mushroom : closest;
        }, null);

        if (closestMushroom) {
          newState.mushrooms = prev.mushrooms.filter(m => m.id !== closestMushroom.id);
          newState.inventory.mushrooms = (newState.inventory.mushrooms || 0) + 1;
          // Mushrooms can be used as food
          if (Math.random() < 0.5) {
            newState.inventory.food = (newState.inventory.food || 0) + 1;
            newState.message = 'Hongo comestible!';
          } else {
            newState.message = 'Hongo recogido!';
          }
          newState.score += 12;
          feedbackType = 'collect';
          feedbackPos = closestMushroom;
          newState.stats = {
            ...prev.stats,
            mushroomsCollected: prev.stats.mushroomsCollected + 1,
          };
          
          newState.missions = newState.missions.map(m => 
            m.type === 'mushroom' && !m.completed ? { ...m, current: Math.min(m.target, m.current + 1) } : m
          );
        }
      }
      else if (action === 'chop' && prev.inventory.axe > 0) {
        const closestTree = prev.trees.reduce((closest, tree) => {
          const dist = Math.hypot(tree.x - prev.playerPos.x, tree.y - prev.playerPos.y);
          return dist < range && (!closest || dist < Math.hypot(closest.x - prev.playerPos.x, closest.y - prev.playerPos.y)) ? tree : closest;
        }, null);

        if (closestTree) {
          newState.trees = prev.trees.filter(t => t.id !== closestTree.id);
          newState.biomeHealth = Math.max(20, newState.biomeHealth - 3);
          newState.inventory.wood++;
          newState.score -= 10;
          newState.message = 'Árbol talado!';
          feedbackType = 'chop';
          feedbackPos = closestTree;
          newState.stats = {
            ...prev.stats,
            treesChopped: prev.stats.treesChopped + 1,
          };
          
          newState.missions = newState.missions.map(m => 
            m.type === 'chop' && !m.completed ? { ...m, current: Math.min(m.target, m.current + 1) } : m
          );
        }
      }
      else if (action === 'dig' && prev.inventory.tools > 0) {
        const closestHole = prev.holes.reduce((closest, hole) => {
          const dist = Math.hypot(hole.x - prev.playerPos.x, hole.y - prev.playerPos.y);
          return dist < range ? hole : closest;
        }, null);

        if (!closestHole) {
          const holePos = {
            x: prev.playerPos.x + (Math.random() - 0.5) * 40,
            y: prev.playerPos.y + (Math.random() - 0.5) * 40,
          };
          newState.holes.push({
            id: Date.now(),
            ...holePos,
            hasWater: false,
          });
          newState.inventory.tools--;
          newState.score -= 5;
          newState.message = 'Pozo excavado!';
          feedbackType = 'dig';
          feedbackPos = holePos;
          newState.stats = {
            ...prev.stats,
            holesDigged: prev.stats.holesDigged + 1,
          };
        }
      }
      else if (action === 'fill_water' && prev.inventory.water > 0) {
        const closestHole = prev.holes.reduce((closest, hole) => {
          const dist = Math.hypot(hole.x - prev.playerPos.x, hole.y - prev.playerPos.y);
          return dist < range && !hole.hasWater && (!closest || dist < Math.hypot(closest.x - prev.playerPos.x, closest.y - prev.playerPos.y)) ? hole : closest;
        }, null);

        if (closestHole) {
          newState.holes = prev.holes.map(h => 
            h.id === closestHole.id ? { ...h, hasWater: true } : h
          );
          newState.inventory.water--;
          const healthGain = 6 * efficiency;
          newState.biomeHealth = Math.min(100, newState.biomeHealth + healthGain);
          newState.score += 20;
          newState.message = 'Agua puesta en pozo!';
          feedbackType = 'water';
          feedbackPos = closestHole;
          newState.stats = {
            ...prev.stats,
            holesFilled: prev.stats.holesFilled + 1,
          };
          
          newState.missions = newState.missions.map(m => 
            m.type === 'dig_fill' && !m.completed ? { ...m, current: Math.min(m.target, m.current + 1) } : m
          );
        }
      }
      else if (action === 'clean' && prev.inventory.tools > 0) {
        const closestTrash = prev.trash.reduce((closest, trash) => {
          const dist = Math.hypot(trash.x - prev.playerPos.x, trash.y - prev.playerPos.y);
          return dist < range && (!closest || dist < Math.hypot(closest.x - prev.playerPos.x, closest.y - prev.playerPos.y)) ? trash : closest;
        }, null);

        if (closestTrash) {
          newState.trash = prev.trash.filter(t => t.id !== closestTrash.id);
          const healthGain = 3 * efficiency;
          newState.biomeHealth = Math.min(100, newState.biomeHealth + healthGain);
          if (closestTrash.type === 'plastic') newState.inventory.plastic++;
          else if (closestTrash.type === 'metal') newState.inventory.metal++;
          else newState.inventory.wood++;
          newState.score += 15;
          newState.message = 'Basura limpiada!';
          feedbackType = 'clean';
          feedbackPos = closestTrash;
          newState.stats = {
            ...prev.stats,
            trashCleaned: prev.stats.trashCleaned + 1,
            plasticCleaned: closestTrash.type === 'plastic' ? prev.stats.plasticCleaned + 1 : prev.stats.plasticCleaned,
            metalCleaned: closestTrash.type === 'metal' ? prev.stats.metalCleaned + 1 : prev.stats.metalCleaned,
          };
          
          newState.missions = newState.missions.map(m => 
            m.type === 'clean' && !m.completed ? { ...m, current: Math.min(m.target, m.current + 1) } : m
          );
        }
      }
      else if (action === 'extinguish') {
        const closestFire = prev.fires.reduce((closest, fire) => {
          const dist = Math.hypot(fire.x - prev.playerPos.x, fire.y - prev.playerPos.y);
          return dist < range && (!closest || dist < Math.hypot(closest.x - prev.playerPos.x, closest.y - prev.playerPos.y)) ? fire : closest;
        }, null);

        if (closestFire) {
          newState.fires = prev.fires.filter(f => f.id !== closestFire.id);
          const healthGain = 5 * efficiency;
          newState.biomeHealth = Math.min(100, newState.biomeHealth + healthGain);
          newState.score += 20;
          newState.message = 'Incendio apagado!';
          feedbackType = 'extinguish';
          feedbackPos = closestFire;
          newState.stats = {
            ...prev.stats,
            firesExtinguished: prev.stats.firesExtinguished + 1,
          };
          
          newState.missions = newState.missions.map(m => 
            (m.type === 'extinguish' || m.type === 'timed_extinguish') && !m.completed ? { ...m, current: Math.min(m.target, m.current + 1) } : m
          );
        }
      }
      else if (action === 'collect_water' && prev.inventory.water < (20 + (prev.upgrades.inventorySize - 1) * 10)) {
        const closestWater = prev.water.reduce((closest, water) => {
          const dist = Math.hypot(water.x - prev.playerPos.x, water.y - prev.playerPos.y);
          return dist < range && (!closest || dist < Math.hypot(closest.x - prev.playerPos.x, closest.y - prev.playerPos.y)) ? water : closest;
        }, null);

        if (closestWater) {
          newState.water = prev.water.filter(w => w.id !== closestWater.id);
          newState.inventory.water = Math.min(20 + (prev.upgrades.inventorySize - 1) * 10, newState.inventory.water + 1);
          newState.biomeHealth = Math.min(100, newState.biomeHealth + 1);
          newState.score += 5;
          newState.message = 'Agua recogida!';
          feedbackType = 'collect';
          feedbackPos = closestWater;
          newState.stats = {
            ...prev.stats,
            waterCollected: prev.stats.waterCollected + 1,
          };

          newState.missions = newState.missions.map(m => 
            m.type === 'water' && !m.completed ? { ...m, current: Math.min(m.target, m.current + 1) } : m
          );
        }
      }
      else if (action === 'collect_resource') {
        const closestResource = prev.resources.reduce((closest, resource) => {
          const dist = Math.hypot(resource.x - prev.playerPos.x, resource.y - prev.playerPos.y);
          return dist < range && (!closest || dist < Math.hypot(closest.x - prev.playerPos.x, closest.y - prev.playerPos.y)) ? resource : closest;
        }, null);

        if (closestResource) {
          newState.resources = prev.resources.filter(r => r.id !== closestResource.id);
          if (closestResource.type === 'metal') newState.inventory.metal++;
          else if (closestResource.type === 'plastic') newState.inventory.plastic++;
          else newState.inventory.wood++;
          newState.score += 5;
          newState.message = `${closestResource.type} recogido!`;
          feedbackType = 'collect';
          feedbackPos = closestResource;
          newState.stats = {
            ...prev.stats,
            resourcesCollected: prev.stats.resourcesCollected + 1,
          };
          
          newState.missions = newState.missions.map(m => 
            m.type === 'resource' && !m.completed ? { ...m, current: Math.min(m.target, m.current + 1) } : m
          );
        }
      }

      if (feedbackType && soundManagerRef.current) {
        soundManagerRef.current.playSoundEffect(feedbackType);
      }

      if (feedbackType) {
        setVisualFeedback({ type: feedbackType, pos: feedbackPos, id: Date.now() });
        setTimeout(() => setVisualFeedback(null), 1000);
      }

      return newState;
    });
  };

  const handleMobileControl = (direction, pressed) => {
    mobileInputRef.current[direction] = pressed;
  };

  const resetGame = () => {
    if (soundManagerRef.current) {
      soundManagerRef.current.stopBackgroundMusic();
    }
    
    setGameState(null);
    setSelectedBiome(null);
    eventCounterRef.current = 0;
    difficultyLevelRef.current = 1;
    SaveManager.deleteSave();
  };

  const saveAndQuit = () => {
    if (gameState && !gameState.gameOver && !gameState.gameWon) {
      SaveManager.saveGame(selectedBiome, gameState, difficultyLevelRef.current);
    }
    if (soundManagerRef.current) {
      soundManagerRef.current.stopBackgroundMusic();
    }
    setGameState(null);
    setSelectedBiome(null);
  };

  const handleToggleMusic = () => {
    if (soundManagerRef.current) {
      const enabled = soundManagerRef.current.toggleMusic();
      setMusicEnabled(enabled);
    }
  };

  const handleToggleSFX = () => {
    if (soundManagerRef.current) {
      const enabled = soundManagerRef.current.toggleSFX();
      setSfxEnabled(enabled);
    }
  };

  const handlePurchaseUpgrade = (upgradeName, cost) => {
    setGameState(prev => {
      if (prev.score >= cost) {
        return {
          ...prev,
          score: prev.score - cost,
          upgrades: {
            ...prev.upgrades,
            [upgradeName]: prev.upgrades[upgradeName] + 1,
          }
        };
      }
      return prev;
    });
  };

  if (!gameState) {
    return (
      <BiomeSelector 
        onSelectBiome={initializeGame} 
        onShowHowToPlay={() => setShowHowToPlay(true)}
        onLoadGame={loadSavedGame}
        hasSavedGame={SaveManager.hasSave()}
      />
    );
  }

  return (
    <main className="w-full h-screen bg-slate-900 overflow-hidden relative flex flex-col">
      <div className="fixed top-0 right-0 w-40 h-16 bg-slate-900 z-50 pointer-events-none" />
      
      <div className="w-full bg-slate-800/90 border-b-2 border-green-400 px-2 py-2 flex items-center justify-between z-30">
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => setShowHowToPlay(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm font-bold"
          >
            ¿Cómo?
          </button>

          <button
            onClick={() => setShowShop(!showShop)}
            className="bg-purple-600 hover:bg-purple-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm font-bold"
          >
            Tienda
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-slate-700 hover:bg-slate-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm"
          >
            ⚙️
          </button>
        </div>

        <div className="flex flex-col items-end">
          <div className="font-bold text-green-400 text-xs sm:text-sm">
            {BIOME_CONFIGS[gameState.biome].name}
          </div>
          <div className="font-bold text-yellow-400 text-xs sm:text-sm">
            Puntos: {gameState.score}
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowSettings(false)}>
          <div className="bg-slate-800 border-2 border-slate-600 rounded-lg p-4 w-11/12 max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white font-bold mb-3 text-lg">Configuración</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleToggleMusic}
                className={`w-full px-4 py-2 rounded font-semibold ${
                  musicEnabled ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'
                } text-white text-sm`}
              >
                Música: {musicEnabled ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={handleToggleSFX}
                className={`w-full px-4 py-2 rounded font-semibold ${
                  sfxEnabled ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'
                } text-white text-sm`}
              >
                Efectos: {sfxEnabled ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={saveAndQuit}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded font-semibold text-sm"
              >
                Guardar y Salir
              </button>

              <button
                onClick={resetGame}
                className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-semibold text-sm"
              >
                Salir sin Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-16 left-2 z-20 bg-slate-800/90 border-2 border-orange-400 px-2 py-1 rounded text-orange-400 font-bold text-xs">
        {'⭐'.repeat(difficultyLevelRef.current)}
      </div>

      <div className="flex-1 w-full overflow-hidden">
        <GameCanvas 
          gameState={gameState} 
          biome={gameState.biome} 
          mapWidth={BIOME_CONFIGS[gameState.biome].mapWidth} 
          mapHeight={BIOME_CONFIGS[gameState.biome].mapHeight}
          visualFeedback={visualFeedback}
        />
      </div>

      <div className="w-full bg-slate-900 border-t-2 border-green-400 z-30">
        {/* Tab navigation */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('controls')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold ${
              activeTab === 'controls' 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            CONTROLES
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold ${
              activeTab === 'inventory' 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            INVENTARIO
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold ${
              activeTab === 'missions' 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            MISIONES
          </button>
        </div>

        {/* Tab content */}
        <div className="max-h-64 overflow-y-auto">
          {activeTab === 'controls' && (
            <GameHUD 
              gameState={gameState} 
              onAction={handleAction} 
              onMobileControl={handleMobileControl} 
              biome={gameState.biome} 
            />
          )}
          {activeTab === 'inventory' && (
            <InventoryPanel inventory={gameState.inventory} />
          )}
          {activeTab === 'missions' && (
            <MissionPanel missions={gameState.missions} />
          )}
        </div>
      </div>

      {showShop && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <UpgradeShop
              score={gameState.score}
              upgrades={gameState.upgrades}
              onPurchase={handlePurchaseUpgrade}
              onClose={() => setShowShop(false)}
            />
          </div>
        </div>
      )}

      {gameState.message && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-3 sm:px-6 py-2 rounded-lg font-bold animate-pulse z-40 text-xs sm:text-sm max-w-[90%] text-center">
          {gameState.message}
        </div>
      )}

      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {(gameState.gameOver || gameState.gameWon) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="flex flex-col items-center gap-4">
            <StatsPanel
              stats={gameState.stats}
              score={gameState.score}
              biomeHealth={gameState.biomeHealth}
              gameWon={gameState.gameWon}
            />
            <button
              onClick={resetGame}
              className="bg-green-500 hover:bg-green-600 text-black font-bold px-8 py-3 rounded transition text-lg"
            >
              Jugar de Nuevo
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
