'use client';

import { useEffect, useRef } from 'react';

export default function GameCanvas({ gameState, biome, mapWidth = 800, mapHeight = 600, visualFeedback }) {
  const canvasRef = useRef(null);
  const mapRef = useRef(null);
  const animationFrameRef = useRef(null);
  const containerRef = useRef(null);

  const BIOME_COLORS = {
    tropical: {
      grass: '#10b981',
      forest: '#059669',
      water: '#0891b2',
      mountain: '#6b7280'
    },
    savanna: {
      grass: '#d4af37',
      forest: '#8b7355',
      water: '#4a90e2',
      mountain: '#7d6b4a'
    },
    desert: {
      grass: '#e8c44a',
      forest: '#8b6f47',
      water: '#4a90e2',
      mountain: '#a68a5b'
    },
    freshwater: {
      grass: '#84cc16',
      forest: '#65a30d',
      water: '#06b6d4',
      mountain: '#6b7280'
    }
  };

  const initializeMap = () => {
    const canvas = document.createElement('canvas');
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    const ctx = canvas.getContext('2d');

    const tileSize = 40;
    const mapWidthTiles = mapWidth / tileSize;
    const mapHeightTiles = mapHeight / tileSize;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, mapWidth, mapHeight);

    const colors = BIOME_COLORS[biome];

    for (let y = 0; y < mapHeightTiles; y++) {
      for (let x = 0; x < mapWidthTiles; x++) {
        const tileX = x * tileSize;
        const tileY = y * tileSize;
        const dist = Math.hypot(x - mapWidthTiles / 2, y - mapHeightTiles / 2);

        let color = colors.grass;
        if (dist < 3.5) color = colors.forest;
        else if (dist > 10 && ((x + y) % 7 === 0)) color = colors.mountain;
        else if ((x * 17 + y * 13) % 11 === 0) color = colors.water;

        ctx.fillStyle = color;
        ctx.fillRect(tileX, tileY, tileSize, tileSize);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(tileX, tileY, tileSize, tileSize);
      }
    }

    return canvas;
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = initializeMap();
    }
  }, [biome, mapWidth, mapHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mapRef.current) return;

    const resizeCanvas = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const cameraX = Math.max(0, Math.min(gameState.playerPos.x - canvasWidth / 2, mapWidth - canvasWidth));
      const cameraY = Math.max(0, Math.min(gameState.playerPos.y - canvasHeight / 2, mapHeight - canvasHeight));

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.drawImage(mapRef.current, -cameraX, -cameraY);

      gameState.water.forEach((w) => {
        const ripple = Math.sin(Date.now() / 300 + w.x) * 2;
        const r1 = Math.max(1, 18 + ripple);
        const r2 = Math.max(1, 16 + ripple);
        const r3 = Math.max(1, 12 + ripple);
        
        ctx.fillStyle = '#0e7490';
        ctx.beginPath();
        ctx.arc(w.x - cameraX, w.y - cameraY, r1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(w.x - cameraX, w.y - cameraY, r2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(103, 232, 249, 0.4)';
        ctx.beginPath();
        ctx.arc(w.x - cameraX, w.y - cameraY, r3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#0891b2';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(w.x - cameraX, w.y - cameraY, r1, 0, Math.PI * 2);
        ctx.stroke();
      });

      gameState.holes?.forEach((hole) => {
        ctx.fillStyle = '#3d3d3d';
        ctx.beginPath();
        ctx.arc(hole.x - cameraX, hole.y - cameraY, 12, 0, Math.PI * 2);
        ctx.fill();

        if (hole.hasWater) {
          const ripple = Math.sin(Date.now() / 400 + hole.x) * 1;
          const wr1 = Math.max(1, 8 + ripple);
          const wr2 = Math.max(1, 6 + ripple);
          
          ctx.fillStyle = '#0891b2';
          ctx.beginPath();
          ctx.arc(hole.x - cameraX, hole.y - cameraY, wr1, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = 'rgba(103, 232, 249, 0.3)';
          ctx.beginPath();
          ctx.arc(hole.x - cameraX, hole.y - cameraY, wr2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.strokeStyle = '#1f1f1f';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      gameState.rocks?.forEach((rock) => {
        const size = rock.size || 1;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(rock.x - cameraX + 2, rock.y - cameraY + 2, 12 * size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(rock.x - cameraX, rock.y - cameraY, 12 * size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(rock.x - cameraX - 3 * size, rock.y - cameraY - 3 * size, 5 * size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      gameState.bushes?.forEach((bush) => {
        const sway = Math.sin(Date.now() / 600 + bush.x / 40) * 1.5;
        
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(bush.x - cameraX + sway - 5, bush.y - cameraY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(bush.x - cameraX + sway + 5, bush.y - cameraY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(bush.x - cameraX + sway, bush.y - cameraY - 5, 9, 0, Math.PI * 2);
        ctx.fill();
      });

      gameState.flowers?.forEach((flower) => {
        const bob = Math.sin(Date.now() / 500 + flower.x) * 2;
        
        let petalColor = '#ef4444';
        let centerColor = '#fbbf24';
        
        if (flower.color === 'yellow') petalColor = '#fde047';
        else if (flower.color === 'purple') petalColor = '#a855f7';
        else if (flower.color === 'pink') petalColor = '#ec4899';
        else if (flower.color === 'blue') petalColor = '#3b82f6';
        
        // Stem
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(flower.x - cameraX, flower.y - cameraY + 5);
        ctx.lineTo(flower.x - cameraX, flower.y - cameraY - 5 + bob);
        ctx.stroke();
        
        // Petals
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          const petalX = flower.x - cameraX + Math.cos(angle) * 6;
          const petalY = flower.y - cameraY - 8 + bob + Math.sin(angle) * 6;
          
          ctx.fillStyle = petalColor;
          ctx.beginPath();
          ctx.arc(petalX, petalY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Center
        ctx.fillStyle = centerColor;
        ctx.beginPath();
        ctx.arc(flower.x - cameraX, flower.y - cameraY - 8 + bob, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      gameState.mushrooms?.forEach((mushroom) => {
        let capColor = '#ef4444';
        if (mushroom.type === 'brown') capColor = '#92400e';
        else if (mushroom.type === 'yellow') capColor = '#fbbf24';
        
        // Stem
        ctx.fillStyle = '#f5f5f4';
        ctx.fillRect(mushroom.x - cameraX - 3, mushroom.y - cameraY - 2, 6, 8);
        
        // Cap shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(mushroom.x - cameraX, mushroom.y - cameraY - 2, 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Cap
        ctx.fillStyle = capColor;
        ctx.beginPath();
        ctx.ellipse(mushroom.x - cameraX, mushroom.y - cameraY - 4, 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Spots (for red mushrooms)
        if (mushroom.type === 'red') {
          ctx.fillStyle = '#fff';
          for (let i = 0; i < 3; i++) {
            const spotX = mushroom.x - cameraX + (i - 1) * 5;
            const spotY = mushroom.y - cameraY - 4 + Math.abs(i - 1) * 2;
            ctx.beginPath();
            ctx.arc(spotX, spotY, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      gameState.resources?.forEach((resource) => {
        const shimmer = Math.sin(Date.now() / 200 + resource.x) * 0.3 + 0.7;
        let color = '#888888';
        let highlight = '#b0b0b0';
        
        if (resource.type === 'metal') {
          color = '#a0a0a0';
          highlight = '#d4d4d4';
        } else if (resource.type === 'plastic') {
          color = '#ff69b4';
          highlight = '#ffb6db';
        } else if (resource.type === 'wood') {
          color = '#8b6f47';
          highlight = '#a68a5b';
        }

        ctx.save();
        ctx.globalAlpha = shimmer;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(resource.x - cameraX - 6, resource.y - cameraY - 4, 16, 16);
        
        ctx.fillStyle = color;
        ctx.fillRect(resource.x - cameraX - 8, resource.y - cameraY - 8, 16, 16);
        
        ctx.fillStyle = highlight;
        ctx.fillRect(resource.x - cameraX - 6, resource.y - cameraY - 6, 6, 6);
        
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1;
        ctx.strokeRect(resource.x - cameraX - 8, resource.y - cameraY - 8, 16, 16);
        
        ctx.restore();
      });

      gameState.trees.forEach((tree) => {
        const sway = Math.sin(Date.now() / 500 + tree.x / 50) * 2;
        
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(tree.x - cameraX + sway, tree.y - cameraY - 2, 16, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(tree.x - cameraX + sway, tree.y - cameraY, 14, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(tree.x - cameraX + sway - 3, tree.y - cameraY - 3, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#92400e';
        ctx.fillRect(tree.x - cameraX - 3, tree.y - cameraY + 5, 6, 12);
        
        ctx.fillStyle = '#b45309';
        ctx.fillRect(tree.x - cameraX - 2, tree.y - cameraY + 6, 2, 10);
      });

      gameState.trash.forEach((trash) => {
        const bob = Math.sin(Date.now() / 400 + trash.x) * 1;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(trash.x - cameraX - 8, trash.y - cameraY - 6, 20, 20);
        
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(trash.x - cameraX - 10, trash.y - cameraY - 10 + bob, 20, 20);
        
        ctx.fillStyle = '#374151';
        ctx.fillRect(trash.x - cameraX - 6, trash.y - cameraY - 6 + bob, 12, 12);
        
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(trash.x - cameraX - 5, trash.y - cameraY - 11 + bob, 10, 3);
      });

      gameState.fires.forEach((fire) => {
        const time = Date.now() / 100;
        const flicker = Math.sin(time) * 2 + 13;
        const flicker2 = Math.cos(time * 1.5) * 2 + 13;
        
        for (let i = 0; i < 5; i++) {
          const emberOffset = ((time * 20 + i * 50) % 100);
          const emberX = fire.x - cameraX + Math.sin(time + i) * 8;
          const emberY = fire.y - cameraY - emberOffset;
          const emberSize = Math.max(0.1, 2 - (emberOffset / 50));
          
          if (emberSize > 0.1) {
            ctx.fillStyle = `rgba(251, 191, 36, ${Math.max(0, 1 - emberOffset / 100)})`;
            ctx.beginPath();
            ctx.arc(emberX, emberY, emberSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        const fr1 = Math.max(1, flicker + 2);
        const fr2 = Math.max(1, flicker);
        const fr3 = Math.max(1, flicker2 - 3);
        const fr4 = Math.max(1, flicker - 6);
        const fr5 = Math.max(1, flicker + 8);
        
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.arc(fire.x - cameraX, fire.y - cameraY, fr1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(fire.x - cameraX, fire.y - cameraY, fr2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(fire.x - cameraX, fire.y - cameraY, fr3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.arc(fire.x - cameraX, fire.y - cameraY, fr4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.beginPath();
        ctx.arc(fire.x - cameraX, fire.y - cameraY, fr5, 0, Math.PI * 2);
        ctx.fill();
      });

      gameState.animals.forEach((animal) => {
        const walkCycle = Math.sin(Date.now() / 200 + animal.x) * 2;
        const bounce = Math.abs(Math.sin(Date.now() / 300 + animal.x)) * 2;
        
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(animal.x - cameraX, animal.y - cameraY + 5, 12, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        let bodyColor = '#ea580c';
        let accentColor = '#fbbf24';
        let bodySize = 12;
        
        // Different colors/sizes for different animal types
        if (animal.type === 'deer') {
          bodyColor = '#92400e';
          accentColor = '#d97706';
          bodySize = 14;
        } else if (animal.type === 'bird') {
          bodyColor = '#3b82f6';
          accentColor = '#fbbf24';
          bodySize = 8;
        } else if (animal.type === 'rabbit') {
          bodyColor = '#f5f5f4';
          accentColor = '#fda4af';
          bodySize = 10;
        } else if (animal.type === 'fox') {
          bodyColor = '#ea580c';
          accentColor = '#fbbf24';
          bodySize = 11;
        } else if (animal.type === 'bear') {
          bodyColor = '#44403c';
          accentColor = '#78716c';
          bodySize = 16;
        } else if (animal.type === 'wolf') {
          bodyColor = '#6b7280';
          accentColor = '#e5e7eb';
          bodySize = 13;
        } else if (animal.type === 'owl') {
          bodyColor = '#78350f';
          accentColor = '#fbbf24';
          bodySize = 10;
        } else if (animal.type === 'squirrel') {
          bodyColor = '#b45309';
          accentColor = '#f59e0b';
          bodySize = 9;
        }
        
        // Body
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(animal.x - cameraX, animal.y - cameraY - bounce, bodySize, bodySize * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(animal.x - cameraX - bodySize * 0.4, animal.y - cameraY + 2 - bounce);
        ctx.lineTo(animal.x - cameraX - bodySize * 0.4 + walkCycle, animal.y - cameraY + 8);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(animal.x - cameraX + bodySize * 0.4, animal.y - cameraY + 2 - bounce);
        ctx.lineTo(animal.x - cameraX + bodySize * 0.4 - walkCycle, animal.y - cameraY + 8);
        ctx.stroke();

        // Head
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(animal.x - cameraX + bodySize * 0.6, animal.y - cameraY - bodySize * 0.3 - bounce, bodySize * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(animal.x - cameraX + bodySize * 0.7, animal.y - cameraY - bodySize * 0.4 - bounce, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Ear/feature
        if (animal.type === 'rabbit') {
          // Long ears
          ctx.fillStyle = accentColor;
          ctx.fillRect(animal.x - cameraX + bodySize * 0.5, animal.y - cameraY - bodySize * 0.8 - bounce, 2, 6);
          ctx.fillRect(animal.x - cameraX + bodySize * 0.7, animal.y - cameraY - bodySize * 0.8 - bounce, 2, 6);
        } else if (animal.type === 'deer') {
          // Antlers
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(animal.x - cameraX + bodySize * 0.6, animal.y - cameraY - bodySize * 0.6 - bounce);
          ctx.lineTo(animal.x - cameraX + bodySize * 0.5, animal.y - cameraY - bodySize - bounce);
          ctx.lineTo(animal.x - cameraX + bodySize * 0.7, animal.y - cameraY - bodySize * 0.9 - bounce);
          ctx.stroke();
        } else {
          // Simple ear
          ctx.fillStyle = bodyColor;
          ctx.beginPath();
          ctx.arc(animal.x - cameraX + bodySize * 0.8, animal.y - cameraY - bodySize * 0.6 - bounce, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Status indicators
        if (animal.sick) {
          const pulse = Math.sin(Date.now() / 200) * 2 + 18;
          ctx.fillStyle = '#fef08a';
          ctx.font = `bold ${pulse}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('!', animal.x - cameraX, animal.y - cameraY - 20 - bounce);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeText('!', animal.x - cameraX, animal.y - cameraY - 20 - bounce);
        } else if (animal.hungry) {
          const pulse = Math.sin(Date.now() / 200) * 2 + 16;
          ctx.fillStyle = '#fde047';
          ctx.font = `bold ${pulse}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', animal.x - cameraX, animal.y - cameraY - 20 - bounce);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.strokeText('?', animal.x - cameraX, animal.y - cameraY - 20 - bounce);
        }
      });

      const playerWalk = Math.sin(Date.now() / 150) * 2;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(gameState.playerPos.x - cameraX - 10, gameState.playerPos.y - cameraY + 10, 20, 4);
      
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(gameState.playerPos.x - cameraX - 10, gameState.playerPos.y - cameraY - 10, 20, 20);
      
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(gameState.playerPos.x - cameraX - 8, gameState.playerPos.y - cameraY - 8, 12, 12);

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(gameState.playerPos.x - cameraX - 8, gameState.playerPos.y - cameraY - 16, 16, 8);
      
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(gameState.playerPos.x - cameraX - 8, gameState.playerPos.y - cameraY - 18, 16, 4);

      ctx.fillStyle = '#000';
      ctx.fillRect(gameState.playerPos.x - cameraX - 5, gameState.playerPos.y - cameraY - 14, 3, 3);
      ctx.fillRect(gameState.playerPos.x - cameraX + 2, gameState.playerPos.y - cameraY - 14, 3, 3);
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(gameState.playerPos.x - cameraX, gameState.playerPos.y - cameraY - 10, 4, 0, Math.PI);
      ctx.stroke();
      
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(gameState.playerPos.x - cameraX - 12, gameState.playerPos.y - cameraY - 5 + playerWalk, 4, 10);
      ctx.fillRect(gameState.playerPos.x - cameraX + 8, gameState.playerPos.y - cameraY - 5 - playerWalk, 4, 10);

      if (visualFeedback) {
        const screenX = visualFeedback.pos.x - cameraX;
        const screenY = visualFeedback.pos.y - cameraY;
        
        const age = Date.now() - visualFeedback.id;
        const opacity = 1 - age / 1000;
        
        if (opacity > 0) {
          ctx.save();
          ctx.globalAlpha = opacity;
          
          switch (visualFeedback.type) {
            case 'plant':
              for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                const dist = age / 20;
                const size = Math.max(0.5, 4 - (dist / 15));
                if (size > 0) {
                  ctx.fillStyle = i % 2 === 0 ? '#22c55e' : '#4ade80';
                  ctx.beginPath();
                  ctx.arc(screenX + Math.cos(angle) * dist, screenY + Math.sin(angle) * dist, size, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
              ctx.fillStyle = '#86efac';
              ctx.beginPath();
              ctx.arc(screenX, screenY, Math.max(0.5, 8 - age / 100), 0, Math.PI * 2);
              ctx.fill();
              break;
              
            case 'clean':
              for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2;
                const dist = age / 15;
                const size = Math.max(0.5, 5 - (dist / 20));
                if (size > 0) {
                  ctx.fillStyle = i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#60a5fa' : '#93c5fd';
                  ctx.beginPath();
                  ctx.arc(screenX + Math.cos(angle) * dist, screenY + Math.sin(angle) * dist, size, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
              break;
              
            case 'extinguish':
              for (let i = 0; i < 15; i++) {
                const angle = (i / 15) * Math.PI * 2;
                const dist = age / 10;
                const dropY = Math.sin(age / 50 + i) * 5;
                const size = Math.max(0.5, 6 - (dist / 15));
                if (size > 0) {
                  ctx.fillStyle = i % 2 === 0 ? '#06b6d4' : '#22d3ee';
                  ctx.beginPath();
                  ctx.arc(
                    screenX + Math.cos(angle) * dist, 
                    screenY + Math.sin(angle) * dist + dropY, 
                    size, 0, Math.PI * 2
                  );
                  ctx.fill();
                }
              }
              break;
              
            case 'animal':
              const heartY = screenY - age / 10;
              const heartScale = 1 - age / 1000;
              
              ctx.fillStyle = '#ec4899';
              ctx.font = `bold ${(20 + age / 30) * heartScale}px Arial`;
              ctx.textAlign = 'center';
              ctx.fillText('❤', screenX, heartY);
              
              if (age < 500) {
                ctx.font = `bold ${15 * heartScale}px Arial`;
                ctx.fillText('❤', screenX - 15, heartY - 10);
                ctx.fillText('❤', screenX + 15, heartY - 10);
              }
              break;
              
            case 'water':
            case 'collect':
              for (let i = 0; i < 8; i++) {
                const offsetX = Math.sin(i) * 10;
                const offsetY = -age / 15 - i * 5;
                ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#fde047';
                ctx.font = `bold ${18 - age / 50}px Arial`;
                ctx.textAlign = 'center';
                ctx.fillText('+', screenX + offsetX, screenY + offsetY);
              }
              break;
          }
          
          ctx.restore();
        }
      }

      const minimapSize = Math.min(120, canvasWidth * 0.15);
      const minimapScale = minimapSize / mapWidth;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(10, 10, minimapSize, minimapSize);

      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, minimapSize, minimapSize);

      ctx.fillStyle = '#16a34a';
      gameState.trees.forEach((tree) => {
        ctx.beginPath();
        ctx.arc(10 + tree.x * minimapScale, 10 + tree.y * minimapScale, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#ef4444';
      gameState.fires.forEach((fire) => {
        ctx.beginPath();
        ctx.arc(10 + fire.x * minimapScale, 10 + fire.y * minimapScale, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#6b7280';
      gameState.trash.forEach((trash) => {
        ctx.fillRect(10 + trash.x * minimapScale - 1, 10 + trash.y * minimapScale - 1, 3, 3);
      });

      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(10 + gameState.playerPos.x * minimapScale, 10 + gameState.playerPos.y * minimapScale, 3, 0, Math.PI * 2);
      ctx.fill();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [gameState, mapWidth, mapHeight, visualFeedback, biome]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
