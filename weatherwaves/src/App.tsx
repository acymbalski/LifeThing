import React, { useEffect, useState, useCallback, useRef } from "react";
import { createDeskThing } from "@deskthing/client";
import { ToClientData, GenericTransitData, GameState, GridState } from "./types/weather";
import { DEVICE_CLIENT } from "@deskthing/types";

const DeskThing = createDeskThing<ToClientData, GenericTransitData>()

interface GameSettings {
  background_color: string;
  foreground_color: string;
  cell_size: number;
  simulation_speed: number;
  fade_amount: number;
  stable_display_time: number;
  edge_wrapping: boolean;
  cell_padding: number;
  bottom_margin: number;
  cell_corner_radius: number;
  neighbor_opacity_enabled: boolean;
  neighbor_opacity_increment: number;
}

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [settings, setSettings] = useState<GameSettings>({
    background_color: "#000000",
    foreground_color: "#ffffff", 
    cell_size: 8,
    simulation_speed: 500,
    fade_amount: 0.3,
    stable_display_time: 200,
    edge_wrapping: true,
    cell_padding: 1,
    bottom_margin: 10,
    cell_corner_radius: 0,
    neighbor_opacity_enabled: false,
    neighbor_opacity_increment: 0.15,
  });
  const [grid, setGrid] = useState<GridState>([]);
  const [targetGrid, setTargetGrid] = useState<GridState>([]);
  const [isFading, setIsFading] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const stateHistoryRef = useRef<string[]>([]);
  const stuckCounterRef = useRef<number>(0);
  const fadeStartTimeRef = useRef<number>(0);
  const flipCellCountRef = useRef<number>(1);

  // Calculate grid dimensions based on window size, cell size, and bottom margin
  const calculateGridDimensions = useCallback(() => {
    const availableHeight = window.innerHeight - settings.bottom_margin;
    const width = Math.floor(window.innerWidth / (settings.cell_size + settings.cell_padding));
    const height = Math.floor(availableHeight / (settings.cell_size + settings.cell_padding));
    return { width: Math.max(1, width), height: Math.max(1, height) };
  }, [settings.cell_size, settings.cell_padding, settings.bottom_margin]);

  // Create random grid
  const createRandomGrid = useCallback((width: number, height: number): GridState => {
    return Array(height).fill(null).map(() => 
      Array(width).fill(null).map(() => Math.random() < 0.3)
    );
  }, []);

  // Count living neighbors for a cell
  const countNeighbors = useCallback((grid: GridState, x: number, y: number): number => {
    let count = 0;
    const height = grid.length;
    const width = grid[0].length;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        
        let newX = x + i;
        let newY = y + j;
        
        if (settings.edge_wrapping) {
          newX = (newX + height) % height;
          newY = (newY + width) % width;
        } else {
          if (newX < 0 || newX >= height || newY < 0 || newY >= width) continue;
        }
        
        if (grid[newX][newY]) count++;
      }
    }
    return count;
  }, [settings.edge_wrapping]);

  // Apply Conway's Game of Life rules
  const nextGeneration = useCallback((currentGrid: GridState): GridState => {
    const height = currentGrid.length;
    const width = currentGrid[0].length;
    const newGrid: GridState = Array(height).fill(null).map(() => Array(width).fill(false));

    for (let x = 0; x < height; x++) {
      for (let y = 0; y < width; y++) {
        const neighbors = countNeighbors(currentGrid, x, y);
        const isAlive = currentGrid[x][y];

        if (isAlive && (neighbors === 2 || neighbors === 3)) {
          newGrid[x][y] = true;
        } else if (!isAlive && neighbors === 3) {
          newGrid[x][y] = true;
        }
      }
    }

    return newGrid;
  }, [countNeighbors]);

  // Convert grid to string for comparison
  const gridToString = useCallback((grid: GridState): string => {
    return grid.map(row => row.map(cell => cell ? '1' : '0').join('')).join('');
  }, []);

  // Check if simulation is stuck or empty
  const isSimulationStuck = useCallback((grid: GridState): boolean => {
    const gridString = gridToString(grid);
    
    // Check if grid is empty
    const hasLiveCells = grid.some(row => row.some(cell => cell));
    if (!hasLiveCells) return true;

    // Check if we've seen this state recently (stuck in loop)
    if (stateHistoryRef.current.includes(gridString)) return true;

    // Add to history and keep only last 10 states
    stateHistoryRef.current.push(gridString);
    if (stateHistoryRef.current.length > 10) {
      stateHistoryRef.current.shift();
    }

    return false;
  }, [gridToString]);

  // Flip a random cell to unstick simulation
  const flipRandomCell = useCallback((grid: GridState): GridState => {
    const height = grid.length;
    const width = grid[0].length;
    const newGrid = grid.map(row => [...row]);
    
    const x = Math.floor(Math.random() * height);
    const y = Math.floor(Math.random() * width);
    newGrid[x][y] = !newGrid[x][y];
    
    return newGrid;
  }, []);

  // Flip multiple random cells to unstick simulation (escalating strategy)
  const flipRandomCells = useCallback((grid: GridState, count: number): GridState => {
    const height = grid.length;
    const width = grid[0].length;
    const newGrid = grid.map(row => [...row]);
    
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * height);
      const y = Math.floor(Math.random() * width);
      newGrid[x][y] = !newGrid[x][y];
    }
    
    return newGrid;
  }, []);

  // Draw rounded rectangle helper
  const drawRoundedRect = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    if (radius === 0) {
      ctx.fillRect(x, y, width, height);
      return;
    }
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }, []);

  // Render grid on canvas with fade animation and advanced options
  const renderGrid = useCallback((ctx: CanvasRenderingContext2D, currentGrid: GridState, nextGrid?: GridState, fadeProgress: number = 1) => {
    const { width: canvasWidth, height: canvasHeight } = ctx.canvas;
    
    // Clear canvas
    ctx.fillStyle = settings.background_color;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const cellSize = settings.cell_size;
    const padding = settings.cell_padding;
    const cornerRadius = settings.cell_corner_radius;
    
    // Parse foreground color for RGB values
    const hex = settings.foreground_color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    for (let x = 0; x < currentGrid.length; x++) {
      for (let y = 0; y < currentGrid[0].length; y++) {
        const pixelX = y * (cellSize + padding);
        const pixelY = x * (cellSize + padding);
        
        const currentAlive = currentGrid[x][y];
        const nextAlive = nextGrid && nextGrid[x] && nextGrid[x][y];
        
        let alpha = 0;
        
        if (settings.fade_amount > 0 && nextGrid && nextGrid.length > 0 && isFading) {
          // Calculate complete opacity for current state (living + neighbor influence)
          let currentOpacity = 0;
          if (currentAlive) {
            currentOpacity = 1;
          } else if (settings.neighbor_opacity_enabled) {
            const neighborCount = countNeighbors(currentGrid, x, y);
            if (neighborCount > 0) {
              currentOpacity = Math.min(neighborCount * settings.neighbor_opacity_increment, 0.8);
            }
          }
          
          // Calculate complete opacity for target state (living + neighbor influence)
          let targetOpacity = 0;
          if (nextAlive) {
            targetOpacity = 1;
          } else if (settings.neighbor_opacity_enabled) {
            const neighborCount = countNeighbors(nextGrid, x, y);
            if (neighborCount > 0) {
              targetOpacity = Math.min(neighborCount * settings.neighbor_opacity_increment, 0.8);
            }
          }
          
          // Interpolate between current and target opacity
          alpha = currentOpacity * (1 - fadeProgress) + targetOpacity * fadeProgress;
        } else {
          // No fade or not fading - calculate current state opacity
          if (currentAlive) {
            alpha = 1;
          } else if (settings.neighbor_opacity_enabled) {
            const neighborCount = countNeighbors(currentGrid, x, y);
            if (neighborCount > 0) {
              alpha = Math.min(neighborCount * settings.neighbor_opacity_increment, 0.8);
            }
          }
        }
        
        if (alpha > 0) {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          drawRoundedRect(ctx, pixelX, pixelY, cellSize, cellSize, cornerRadius);
        }
      }
    }
  }, [settings, isFading, countNeighbors, drawRoundedRect]);

  // Enhanced game loop with escalating cell flip strategy
  const gameLoop = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas || grid.length === 0) {
      animationRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      animationRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const fadeTime = settings.simulation_speed * settings.fade_amount;
    const stableTime = settings.stable_display_time;
    const totalCycleTime = fadeTime + stableTime;

    // Check if it's time for next generation (only when not fading)
    if (!isFading && timestamp - lastUpdateRef.current >= totalCycleTime) {
      const nextGrid = nextGeneration(grid);
      
      if (isSimulationStuck(nextGrid)) {
        stuckCounterRef.current++;
        if (stuckCounterRef.current > 5) {
          // Reset everything if stuck too long
          stuckCounterRef.current = 0;
          stateHistoryRef.current = [];
          flipCellCountRef.current = 1; // Reset flip count
          const newDims = calculateGridDimensions();
          const newGrid = createRandomGrid(newDims.width, newDims.height);
          setGrid(newGrid);
          setTargetGrid([]);
          setIsFading(false);
          lastUpdateRef.current = timestamp;
          return;
        } else {
          // Try flipping multiple random cells (escalating strategy)
          const flippedGrid = flipRandomCells(nextGrid, flipCellCountRef.current);
          flipCellCountRef.current++; // Increase for next time
          setTargetGrid(flippedGrid);
        }
      } else {
        stuckCounterRef.current = 0;
        flipCellCountRef.current = 1; // Reset flip count on successful evolution
        setTargetGrid(nextGrid);
      }

      // Start fade if enabled
      if (settings.fade_amount > 0 && fadeTime > 0) {
        setIsFading(true);
        fadeStartTimeRef.current = timestamp;
      } else {
        // No fade - instant update
        setGrid(targetGrid.length > 0 ? targetGrid : nextGrid);
        setTargetGrid([]);
      }
      
      lastUpdateRef.current = timestamp;
    }

    // Handle fade animation
    if (isFading && targetGrid.length > 0) {
      const fadeElapsed = timestamp - fadeStartTimeRef.current;
      const fadeProgress = Math.min(fadeElapsed / fadeTime, 1);

      // Always render the fade
      renderGrid(ctx, grid, targetGrid, fadeProgress);

      // Complete fade when done
      if (fadeProgress >= 1) {
        setGrid(targetGrid);
        setTargetGrid([]);
        setIsFading(false);
      }
    } else {
      // No fade active - render current grid
      renderGrid(ctx, grid);
    }
    
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [grid, targetGrid, isFading, nextGeneration, isSimulationStuck, flipRandomCells, calculateGridDimensions, createRandomGrid, renderGrid, settings.simulation_speed, settings.fade_amount, settings.stable_display_time]);

  // Handle screen tap to randomize
  const handleScreenTap = useCallback(() => {
    const newDims = calculateGridDimensions();
    const newGrid = createRandomGrid(newDims.width, newDims.height);
    setGrid(newGrid);
    setTargetGrid([]);
    setIsFading(false);
    stateHistoryRef.current = [];
    stuckCounterRef.current = 0;
    flipCellCountRef.current = 1; // Reset flip count
  }, [calculateGridDimensions, createRandomGrid]);

  // Initialize and handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      const newDims = calculateGridDimensions();
      setDimensions(newDims);
      
      if (grid.length === 0) {
        const initialGrid = createRandomGrid(newDims.width, newDims.height);
        setGrid(initialGrid);
        setTargetGrid([]);
        setIsFading(false);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [calculateGridDimensions, createRandomGrid, grid.length]);

  // Reset simulation when grid-affecting settings change
  useEffect(() => {
    if (grid.length > 0) {
      const newDims = calculateGridDimensions();
      const newGrid = createRandomGrid(newDims.width, newDims.height);
      setGrid(newGrid);
      setTargetGrid([]);
      setIsFading(false);
      setDimensions(newDims);
      stateHistoryRef.current = [];
      stuckCounterRef.current = 0;
      flipCellCountRef.current = 1; // Reset flip count
      
      // Update canvas size immediately
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - settings.bottom_margin;
      }
    }
  }, [settings.cell_size, settings.cell_padding, settings.bottom_margin, calculateGridDimensions, createRandomGrid]);

  // Start game loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);

  // Update canvas size when dimensions change (for window resize)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - settings.bottom_margin;
  }, [dimensions]);

  // Listen for settings changes
  useEffect(() => {
    const removeSettingsListener = DeskThing.on(DEVICE_CLIENT.SETTINGS, (data) => {
      if (data?.payload) {
        const newSettings: Partial<GameSettings> = {};
        
        if (data.payload.background_color?.value) {
          newSettings.background_color = data.payload.background_color.value as string;
        }
        if (data.payload.foreground_color?.value) {
          newSettings.foreground_color = data.payload.foreground_color.value as string;
        }
        if (data.payload.cell_size?.value) {
          newSettings.cell_size = data.payload.cell_size.value as number;
        }
        if (data.payload.simulation_speed?.value) {
          newSettings.simulation_speed = data.payload.simulation_speed.value as number;
        }
        if (data.payload.fade_amount?.value !== undefined) {
          newSettings.fade_amount = data.payload.fade_amount.value as number;
        }
        if (data.payload.stable_display_time?.value !== undefined) {
          newSettings.stable_display_time = data.payload.stable_display_time.value as number;
        }
        if (data.payload.edge_wrapping?.value !== undefined) {
          newSettings.edge_wrapping = data.payload.edge_wrapping.value as boolean;
        }
        if (data.payload.cell_padding?.value !== undefined) {
          newSettings.cell_padding = data.payload.cell_padding.value as number;
        }
        if (data.payload.bottom_margin?.value !== undefined) {
          newSettings.bottom_margin = data.payload.bottom_margin.value as number;
        }
        if (data.payload.cell_corner_radius?.value !== undefined) {
          newSettings.cell_corner_radius = data.payload.cell_corner_radius.value as number;
        }
        if (data.payload.neighbor_opacity_enabled?.value !== undefined) {
          newSettings.neighbor_opacity_enabled = data.payload.neighbor_opacity_enabled.value as boolean;
        }
        if (data.payload.neighbor_opacity_increment?.value !== undefined) {
          newSettings.neighbor_opacity_increment = data.payload.neighbor_opacity_increment.value as number;
        }

        setSettings(prev => ({ ...prev, ...newSettings }));
      }
    });

    // Fetch initial settings
    const fetchInitialSettings = async () => {
      const initialSettings = await DeskThing.getSettings();
      if (initialSettings) {
        const newSettings: Partial<GameSettings> = {};
        
        if (initialSettings.background_color?.value) {
          newSettings.background_color = initialSettings.background_color.value as string;
        }
        if (initialSettings.foreground_color?.value) {
          newSettings.foreground_color = initialSettings.foreground_color.value as string;
        }
        if (initialSettings.cell_size?.value) {
          newSettings.cell_size = initialSettings.cell_size.value as number;
        }
        if (initialSettings.simulation_speed?.value) {
          newSettings.simulation_speed = initialSettings.simulation_speed.value as number;
        }
        if (initialSettings.fade_amount?.value !== undefined) {
          newSettings.fade_amount = initialSettings.fade_amount.value as number;
        }
        if (initialSettings.stable_display_time?.value !== undefined) {
          newSettings.stable_display_time = initialSettings.stable_display_time.value as number;
        }
        if (initialSettings.edge_wrapping?.value !== undefined) {
          newSettings.edge_wrapping = initialSettings.edge_wrapping.value as boolean;
        }
        if (initialSettings.cell_padding?.value !== undefined) {
          newSettings.cell_padding = initialSettings.cell_padding.value as number;
        }
        if (initialSettings.bottom_margin?.value !== undefined) {
          newSettings.bottom_margin = initialSettings.bottom_margin.value as number;
        }
        if (initialSettings.cell_corner_radius?.value !== undefined) {
          newSettings.cell_corner_radius = initialSettings.cell_corner_radius.value as number;
        }
        if (initialSettings.neighbor_opacity_enabled?.value !== undefined) {
          newSettings.neighbor_opacity_enabled = initialSettings.neighbor_opacity_enabled.value as boolean;
        }
        if (initialSettings.neighbor_opacity_increment?.value !== undefined) {
          newSettings.neighbor_opacity_increment = initialSettings.neighbor_opacity_increment.value as number;
        }

        setSettings(prev => ({ ...prev, ...newSettings }));
      }
    };

    fetchInitialSettings();

    return () => {
      removeSettingsListener();
    };
  }, []);

  return (
    <div 
      className="w-screen h-screen overflow-hidden cursor-pointer"
      style={{ backgroundColor: settings.background_color }}
      onClick={handleScreenTap}
    >
      <canvas
        ref={canvasRef}
        className="block"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default App;
