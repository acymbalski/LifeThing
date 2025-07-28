import React, { useEffect, useState, useCallback, useRef } from "react";
import { createDeskThing } from "@deskthing/client";
import { ToClientData, GenericTransitData, GameState, GridState, ColoredGridState, ColoredCell, CellColor } from "./types/game";
import { DEVICE_CLIENT } from "@deskthing/types";

const DeskThing = createDeskThing<ToClientData, GenericTransitData>()

// Local storage helpers
const STORAGE_KEY = 'lifething-settings';

interface GameSettings {
  background_color: string;
  foreground_color: string;
  cell_size: number;
  simulation_speed: number;
  try_revive_stuck_sim: boolean; // Added for stuck sim control
  hard_reset_on_stuck: boolean; // Added for stuck sim control
  max_revival_attempts: number; // Added for stuck sim control
  grid_population_percentage: number; // Added for grid reset control
  fade_amount: number;
  stable_display_time: number;
  edge_wrapping: boolean;
  cell_padding: number;
  bottom_margin: number;
  cell_corner_radius: number;
  neighbor_opacity_enabled: boolean;
  neighbor_opacity_increment: number;
  color_mode: boolean;
  random_color_chance: number; // Added for new logic
  max_saturation_age: number; // Added for new logic
  saturation_factor: number; // Added for new logic
  random_color_pure: boolean; // Added for new logic
}

// Default settings that work offline
const DEFAULT_SETTINGS: GameSettings = {
  background_color: "#000000",
  foreground_color: "#ffffff", 
  cell_size: 8,
  simulation_speed: 500,
  try_revive_stuck_sim: true, // Added for stuck sim control
  hard_reset_on_stuck: false, // Added for stuck sim control
  max_revival_attempts: 5, // Added for stuck sim control
  grid_population_percentage: 0.3, // Added for grid reset control
  fade_amount: 0.3,
  stable_display_time: 200,
  edge_wrapping: true,
  cell_padding: 1,
  bottom_margin: 10,
  cell_corner_radius: 0,
  neighbor_opacity_enabled: false,
  neighbor_opacity_increment: 0.15,
  color_mode: false,
  random_color_chance: 0.5, // Added for new logic
  max_saturation_age: 15, // Added for new logic
  saturation_factor: 0.3, // Added for new logic
  random_color_pure: false, // Added for new logic
};

// Local storage helpers
const saveSettingsToStorage = (settings: GameSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
};

const loadSettingsFromStorage = (): GameSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle missing properties
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  return DEFAULT_SETTINGS;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [settings, setSettings] = useState<GameSettings>(loadSettingsFromStorage());
  const [grid, setGrid] = useState<GridState>([]);
  const [coloredGrid, setColoredGrid] = useState<ColoredGridState>([]);
  const [targetGrid, setTargetGrid] = useState<GridState>([]);
  const [targetColoredGrid, setTargetColoredGrid] = useState<ColoredGridState>([]);
  const [isFading, setIsFading] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const stateHistoryRef = useRef<string[]>([]);
  const stuckCounterRef = useRef<number>(0);
  const fadeStartTimeRef = useRef<number>(0);
  const fibonacciIndexRef = useRef<number>(0);

  // Update settings and save to localStorage
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveSettingsToStorage(updated);
      return updated;
    });
  }, []);

  // Calculate fibonacci number at given index (0-indexed)
  const fibonacci = useCallback((n: number): number => {
    if (n <= 0) return 1;
    if (n === 1) return 1;
    let a = 1, b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }, []);

  // Generate a random color
  const generateRandomColor = useCallback((): CellColor => {
    return {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    };
  }, []);

  // Create a tweaked version of an inherited color by modifying one RGB channel
  const generateTweakedColor = useCallback((baseColor: CellColor): CellColor => {
    const channels = ['r', 'g', 'b'] as const;
    const randomChannel = channels[Math.floor(Math.random() * 3)];
    const extremeValue = Math.random() < 0.5 ? 0 : 255;
    
    return {
      ...baseColor,
      [randomChannel]: extremeValue
    };
  }, []);

  // Average multiple colors
  const averageColors = useCallback((colors: CellColor[]): CellColor => {
    if (colors.length === 0) return { r: 255, g: 255, b: 255 };
    
    const sum = colors.reduce((acc, color) => ({
      r: acc.r + color.r,
      g: acc.g + color.g,
      b: acc.b + color.b
    }), { r: 0, g: 0, b: 0 });
    
    return {
      r: Math.round(sum.r / colors.length),
      g: Math.round(sum.g / colors.length),
      b: Math.round(sum.b / colors.length)
    };
  }, []);

  // Enhance color saturation based on cell age
  const enhanceColorSaturation = useCallback((color: CellColor, age: number): CellColor => {
    // Cap the saturation enhancement to prevent extreme colors
    const maxAge = settings.max_saturation_age; // Configurable age limit
    const ageBoost = Math.min(age, maxAge) / maxAge;
    const saturationFactor = 1 + (ageBoost * settings.saturation_factor); // Configurable saturation boost
    
    // Find the average (center) of the color
    const center = (color.r + color.g + color.b) / 3;
    
    // Push each channel away from center toward its extreme
    const enhanceChannel = (channel: number) => {
      const distance = channel - center;
      const enhanced = center + (distance * saturationFactor);
      
      // Clamp to valid RGB range
      return Math.round(Math.max(0, Math.min(255, enhanced)));
    };
    
    return {
      r: enhanceChannel(color.r),
      g: enhanceChannel(color.g),
      b: enhanceChannel(color.b)
    };
  }, [settings.saturation_factor, settings.max_saturation_age]);

  // Average multiple colors with age-based weighting
  const averageColorsWeighted = useCallback((colors: CellColor[], ages: number[]): CellColor => {
    if (colors.length === 0) return { r: 255, g: 255, b: 255 };
    if (colors.length !== ages.length) return averageColors(colors);
    
    let totalWeight = 0;
    const weightedSum = colors.reduce((acc, color, index) => {
      const weight = ages[index] || 1; // Age acts as weight
      totalWeight += weight;
      return {
        r: acc.r + color.r * weight,
        g: acc.g + color.g * weight,
        b: acc.b + color.b * weight
      };
    }, { r: 0, g: 0, b: 0 });
    
    return {
      r: Math.round(weightedSum.r / totalWeight),
      g: Math.round(weightedSum.g / totalWeight),
      b: Math.round(weightedSum.b / totalWeight)
    };
  }, [averageColors]);

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
      Array(width).fill(null).map(() => Math.random() < settings.grid_population_percentage)
    );
  }, [settings.grid_population_percentage]);

  // Create random colored grid
  const createRandomColoredGrid = useCallback((width: number, height: number): ColoredGridState => {
    return Array(height).fill(null).map(() => 
      Array(width).fill(null).map(() => {
        const alive = Math.random() < settings.grid_population_percentage;
        return {
          alive,
          color: alive ? generateRandomColor() : undefined,
          age: alive ? 1 : undefined
        };
      })
    );
  }, [generateRandomColor, settings.grid_population_percentage]);

  // Count living neighbors for a cell (standard version)
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

  // Count living neighbors and get their colors (colored version)
  const countNeighborsColored = useCallback((grid: ColoredGridState, x: number, y: number): { count: number, colors: CellColor[], ages: number[] } => {
    let count = 0;
    const colors: CellColor[] = [];
    const ages: number[] = [];
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
        
        const cell = grid[newX][newY];
        if (cell.alive && cell.color) {
          count++;
          colors.push(cell.color);
          ages.push(cell.age || 1);
        }
      }
    }
    return { count, colors, ages };
  }, [settings.edge_wrapping]);

  // Apply Conway's Game of Life rules (standard version)
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

  // Apply Conway's Game of Life rules (colored version)
  const nextGenerationColored = useCallback((currentGrid: ColoredGridState): ColoredGridState => {
    const height = currentGrid.length;
    const width = currentGrid[0].length;
    const newGrid: ColoredGridState = Array(height).fill(null).map(() => 
      Array(width).fill(null).map(() => ({ alive: false }))
    );

    for (let x = 0; x < height; x++) {
      for (let y = 0; y < width; y++) {
        const { count, colors, ages } = countNeighborsColored(currentGrid, x, y);
        const isAlive = currentGrid[x][y].alive;
        const currentAge = currentGrid[x][y].age || 1;

        if (isAlive && (count === 2 || count === 3)) {
          // Cell survives - enhance saturation based on age and increment age
          const currentColor = currentGrid[x][y].color;
          newGrid[x][y] = {
            alive: true,
            color: currentColor ? enhanceColorSaturation(currentColor, currentAge) : currentColor,
            age: currentAge + 1
          };
        } else if (!isAlive && count === 3) {
          // Cell is born - decide between inherited or random color
          const useRandomColor = Math.random() < settings.random_color_chance;
          
          let cellColor: CellColor;
          if (!useRandomColor) {
            // Use inherited color from weighted average
            cellColor = averageColorsWeighted(colors, ages);
          } else if (settings.random_color_pure) {
            // Use completely random color
            cellColor = generateRandomColor();
          } else {
            // Use tweaked inherited color
            const inheritedColor = averageColorsWeighted(colors, ages);
            cellColor = generateTweakedColor(inheritedColor);
          }
          
          newGrid[x][y] = {
            alive: true,
            color: cellColor,
            age: 1
          };
        }
      }
    }

    return newGrid;
  }, [countNeighborsColored, averageColorsWeighted, generateRandomColor, generateTweakedColor, enhanceColorSaturation, settings.random_color_chance, settings.random_color_pure]);

  // Convert grid to string for comparison
  const gridToString = useCallback((grid: GridState): string => {
    return grid.map(row => row.map(cell => cell ? '1' : '0').join('')).join('');
  }, []);

  // Convert colored grid to string for comparison
  const coloredGridToString = useCallback((grid: ColoredGridState): string => {
    return grid.map(row => row.map(cell => cell.alive ? '1' : '0').join('')).join('');
  }, []);

  // Check if simulation is stuck or empty
  const isSimulationStuck = useCallback((grid: GridState | ColoredGridState): boolean => {
    const gridString = settings.color_mode ? 
      coloredGridToString(grid as ColoredGridState) : 
      gridToString(grid as GridState);
    
    // Check if grid is empty
    const hasLiveCells = settings.color_mode ?
      (grid as ColoredGridState).some(row => row.some(cell => cell.alive)) :
      (grid as GridState).some(row => row.some(cell => cell));
    if (!hasLiveCells) return true;

    // Check if we've seen this state recently (stuck in loop)
    if (stateHistoryRef.current.includes(gridString)) return true;

    // Add to history and keep only last 10 states
    stateHistoryRef.current.push(gridString);
    if (stateHistoryRef.current.length > 10) {
      stateHistoryRef.current.shift();
    }

    return false;
  }, [gridToString, coloredGridToString, settings.color_mode]);

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

  // Flip multiple random cells for colored grid
  const flipRandomCellsColored = useCallback((grid: ColoredGridState, count: number): ColoredGridState => {
    const height = grid.length;
    const width = grid[0].length;
    const newGrid = grid.map(row => [...row]);
    
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * height);
      const y = Math.floor(Math.random() * width);
      const currentCell = newGrid[x][y];
      newGrid[x][y] = {
        alive: !currentCell.alive,
        color: !currentCell.alive ? generateRandomColor() : undefined,
        age: !currentCell.alive ? 1 : undefined
      };
    }
    
    return newGrid;
  }, [generateRandomColor]);

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

  // Render grid on canvas with fade animation and color mode support
  const renderGrid = useCallback((ctx: CanvasRenderingContext2D, currentGrid: GridState | ColoredGridState, nextGrid?: GridState | ColoredGridState, fadeProgress: number = 1) => {
    const { width: canvasWidth, height: canvasHeight } = ctx.canvas;
    
    // Clear canvas
    ctx.fillStyle = settings.background_color;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const cellSize = settings.cell_size;
    const padding = settings.cell_padding;
    const cornerRadius = settings.cell_corner_radius;
    
    // Parse default foreground color for RGB values
    const hex = settings.foreground_color.replace('#', '');
    const defaultR = parseInt(hex.substring(0, 2), 16);
    const defaultG = parseInt(hex.substring(2, 4), 16);
    const defaultB = parseInt(hex.substring(4, 6), 16);
    
    const gridHeight = currentGrid.length;
    const gridWidth = currentGrid[0].length;
    
    for (let x = 0; x < gridHeight; x++) {
      for (let y = 0; y < gridWidth; y++) {
        const pixelX = y * (cellSize + padding);
        const pixelY = x * (cellSize + padding);
        
        let alpha = 0;
        let r = defaultR, g = defaultG, b = defaultB;
        
        if (settings.color_mode) {
          const currentCell = (currentGrid as ColoredGridState)[x][y];
          const nextCell = nextGrid ? (nextGrid as ColoredGridState)[x][y] : undefined;
          
          if (settings.fade_amount > 0 && nextGrid && nextGrid.length > 0 && isFading) {
            // Calculate complete opacity for current state
            let currentOpacity = 0;
            let currentColor = { r: 0, g: 0, b: 0 }; // Default to black (invisible when alpha=0)
            
            if (currentCell.alive && currentCell.color) {
              currentOpacity = 1;
              currentColor = currentCell.color;
            } else if (settings.neighbor_opacity_enabled) {
              const { count, colors } = countNeighborsColored(currentGrid as ColoredGridState, x, y);
              if (count > 0) {
                currentOpacity = Math.min(count * settings.neighbor_opacity_increment, 0.8);
                currentColor = averageColors(colors);
              }
            }
            
            // Calculate complete opacity for target state
            let targetOpacity = 0;
            let targetColor = { r: 0, g: 0, b: 0 }; // Default to black (invisible when alpha=0)
            
            if (nextCell?.alive && nextCell.color) {
              targetOpacity = 1;
              targetColor = nextCell.color;
            } else if (settings.neighbor_opacity_enabled) {
              const { count, colors } = countNeighborsColored(nextGrid as ColoredGridState, x, y);
              if (count > 0) {
                targetOpacity = Math.min(count * settings.neighbor_opacity_increment, 0.8);
                targetColor = averageColors(colors);
              }
            }
            
            // Interpolate opacity and color
            alpha = currentOpacity * (1 - fadeProgress) + targetOpacity * fadeProgress;
            r = Math.round(currentColor.r * (1 - fadeProgress) + targetColor.r * fadeProgress);
            g = Math.round(currentColor.g * (1 - fadeProgress) + targetColor.g * fadeProgress);
            b = Math.round(currentColor.b * (1 - fadeProgress) + targetColor.b * fadeProgress);
          } else {
            // No fade - calculate current state
            if (currentCell.alive && currentCell.color) {
              alpha = 1;
              r = currentCell.color.r;
              g = currentCell.color.g;
              b = currentCell.color.b;
            } else if (settings.neighbor_opacity_enabled) {
              const { count, colors } = countNeighborsColored(currentGrid as ColoredGridState, x, y);
              if (count > 0) {
                alpha = Math.min(count * settings.neighbor_opacity_increment, 0.8);
                const avgColor = averageColors(colors);
                r = avgColor.r;
                g = avgColor.g;
                b = avgColor.b;
              }
            }
          }
        } else {
          // Standard mode (no colors)
          const currentAlive = (currentGrid as GridState)[x][y];
          const nextAlive = nextGrid ? (nextGrid as GridState)[x][y] : undefined;
          
          if (settings.fade_amount > 0 && nextGrid && nextGrid.length > 0 && isFading) {
            // Calculate complete opacity for current state
            let currentOpacity = 0;
            if (currentAlive) {
              currentOpacity = 1;
            } else if (settings.neighbor_opacity_enabled) {
              const neighborCount = countNeighbors(currentGrid as GridState, x, y);
              if (neighborCount > 0) {
                currentOpacity = Math.min(neighborCount * settings.neighbor_opacity_increment, 0.8);
              }
            }
            
            // Calculate complete opacity for target state
            let targetOpacity = 0;
            if (nextAlive) {
              targetOpacity = 1;
            } else if (settings.neighbor_opacity_enabled) {
              const neighborCount = countNeighbors(nextGrid as GridState, x, y);
              if (neighborCount > 0) {
                targetOpacity = Math.min(neighborCount * settings.neighbor_opacity_increment, 0.8);
              }
            }
            
            // Interpolate between current and target opacity
            alpha = currentOpacity * (1 - fadeProgress) + targetOpacity * fadeProgress;
          } else {
            // No fade - calculate current state opacity
            if (currentAlive) {
              alpha = 1;
            } else if (settings.neighbor_opacity_enabled) {
              const neighborCount = countNeighbors(currentGrid as GridState, x, y);
              if (neighborCount > 0) {
                alpha = Math.min(neighborCount * settings.neighbor_opacity_increment, 0.8);
              }
            }
          }
        }
        
        if (alpha > 0) {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          drawRoundedRect(ctx, pixelX, pixelY, cellSize, cellSize, cornerRadius);
        }
      }
    }
  }, [settings, isFading, countNeighbors, countNeighborsColored, averageColors, drawRoundedRect]);

  // Enhanced game loop with color mode support
  const gameLoop = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas || (settings.color_mode ? coloredGrid.length === 0 : grid.length === 0)) {
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
      if (settings.color_mode) {
        const nextGrid = nextGenerationColored(coloredGrid);
        
        if (isSimulationStuck(nextGrid)) {
          // Check if simulation is completely empty
          const isEmpty = !(nextGrid as ColoredGridState).some(row => row.some(cell => cell.alive));
          
          // If hard reset on stuck is enabled, always reset immediately
          if (settings.hard_reset_on_stuck) {
            stuckCounterRef.current = 0;
            stateHistoryRef.current = [];
            fibonacciIndexRef.current = 0;
            const newDims = calculateGridDimensions();
            const newGrid = createRandomColoredGrid(newDims.width, newDims.height);
            setColoredGrid(newGrid);
            setTargetColoredGrid([]);
            setIsFading(false);
            lastUpdateRef.current = timestamp;
            return;
          }
          
          // If try_revive_stuck_sim is disabled, only reset when completely empty
          if (isEmpty) {
            stuckCounterRef.current = 0;
            stateHistoryRef.current = [];
            fibonacciIndexRef.current = 0;
            const newDims = calculateGridDimensions();
            const newGrid = createRandomColoredGrid(newDims.width, newDims.height);
            setColoredGrid(newGrid);
            setTargetColoredGrid([]);
            setIsFading(false);
            lastUpdateRef.current = timestamp;
            return;
          }
          if (!settings.try_revive_stuck_sim) {
            // Not empty and revival disabled, just use the stuck grid as-is
            setTargetColoredGrid(nextGrid);
          } else {
            // Revival is enabled, try fibonacci sequence
            stuckCounterRef.current++;
            if (stuckCounterRef.current > settings.max_revival_attempts) {
              // Reset everything if stuck too long
              stuckCounterRef.current = 0;
              stateHistoryRef.current = [];
              fibonacciIndexRef.current = 0;
              const newDims = calculateGridDimensions();
              const newGrid = createRandomColoredGrid(newDims.width, newDims.height);
              setColoredGrid(newGrid);
              setTargetColoredGrid([]);
              setIsFading(false);
              lastUpdateRef.current = timestamp;
              return;
            } else {
              // Try flipping cells using fibonacci sequence
              const cellsToFlip = fibonacci(fibonacciIndexRef.current);
              const totalCells = coloredGrid.length * coloredGrid[0].length;
              
              // If we're about to flip more than 1/3 of cells, just do a full reset
              if (cellsToFlip > totalCells / 3) {
                stuckCounterRef.current = 0;
                stateHistoryRef.current = [];
                fibonacciIndexRef.current = 0;
                const newDims = calculateGridDimensions();
                const newGrid = createRandomColoredGrid(newDims.width, newDims.height);
                setColoredGrid(newGrid);
                setTargetColoredGrid([]);
                setIsFading(false);
                lastUpdateRef.current = timestamp;
                return;
              }
              
              const flippedGrid = flipRandomCellsColored(nextGrid, cellsToFlip);
              fibonacciIndexRef.current++;
              setTargetColoredGrid(flippedGrid);
            }
          }
        } else {
          stuckCounterRef.current = 0;
          fibonacciIndexRef.current = 0;
          setTargetColoredGrid(nextGrid);
        }
      } else {
        const nextGrid = nextGeneration(grid);
        
        if (isSimulationStuck(nextGrid)) {
          // Check if simulation is completely empty
          const isEmpty = !(nextGrid as GridState).some(row => row.some(cell => cell));
          
          // If hard reset on stuck is enabled, always reset immediately
          if (settings.hard_reset_on_stuck ){
            stuckCounterRef.current = 0;
            stateHistoryRef.current = [];
            fibonacciIndexRef.current = 0;
            const newDims = calculateGridDimensions();
            const newGrid = createRandomGrid(newDims.width, newDims.height);
            setGrid(newGrid);
            setTargetGrid([]);
            setIsFading(false);
            lastUpdateRef.current = timestamp;
            return;
          }
          
          // If try_revive_stuck_sim is disabled, only reset when completely empty
          if (isEmpty) {
            stuckCounterRef.current = 0;
            stateHistoryRef.current = [];
            fibonacciIndexRef.current = 0;
            const newDims = calculateGridDimensions();
            const newGrid = createRandomGrid(newDims.width, newDims.height);
            setGrid(newGrid);
            setTargetGrid([]);
            setIsFading(false);
            lastUpdateRef.current = timestamp;
            return;
          }
          if (!settings.try_revive_stuck_sim) {
              // Not empty and revival disabled, just use the stuck grid as-is
              setTargetGrid(nextGrid);
          } else {
            // Revival is enabled, try fibonacci sequence
            stuckCounterRef.current++;
            if (stuckCounterRef.current > settings.max_revival_attempts) {
              // Reset everything if stuck too long
              stuckCounterRef.current = 0;
              stateHistoryRef.current = [];
              fibonacciIndexRef.current = 0;
              const newDims = calculateGridDimensions();
              const newGrid = createRandomGrid(newDims.width, newDims.height);
              setGrid(newGrid);
              setTargetGrid([]);
              setIsFading(false);
              lastUpdateRef.current = timestamp;
              return;
            } else {
              // Try flipping cells using fibonacci sequence
              const cellsToFlip = fibonacci(fibonacciIndexRef.current);
              const totalCells = grid.length * grid[0].length;
              
              // If we're about to flip more than 1/3 of cells, just do a full reset
              if (cellsToFlip > totalCells / 3) {
                stuckCounterRef.current = 0;
                stateHistoryRef.current = [];
                fibonacciIndexRef.current = 0;
                const newDims = calculateGridDimensions();
                const newGrid = createRandomGrid(newDims.width, newDims.height);
                setGrid(newGrid);
                setTargetGrid([]);
                setIsFading(false);
                lastUpdateRef.current = timestamp;
                return;
              }
              
              const flippedGrid = flipRandomCells(nextGrid, cellsToFlip);
              fibonacciIndexRef.current++;
              setTargetGrid(flippedGrid);
            }
          }
        } else {
          stuckCounterRef.current = 0;
          fibonacciIndexRef.current = 0;
          setTargetGrid(nextGrid);
        }
      }

      // Start fade if enabled
      if (settings.fade_amount > 0 && fadeTime > 0) {
        setIsFading(true);
        fadeStartTimeRef.current = timestamp;
      } else {
        // No fade - instant update
        if (settings.color_mode) {
          setColoredGrid(targetColoredGrid.length > 0 ? targetColoredGrid : (nextGenerationColored as any));
          setTargetColoredGrid([]);
        } else {
          setGrid(targetGrid.length > 0 ? targetGrid : (nextGeneration as any));
          setTargetGrid([]);
        }
      }
      
      lastUpdateRef.current = timestamp;
    }

    // Handle fade animation
    if (isFading) {
      const fadeElapsed = timestamp - fadeStartTimeRef.current;
      const fadeProgress = Math.min(fadeElapsed / fadeTime, 1);

      // Always render the fade
      if (settings.color_mode) {
        renderGrid(ctx, coloredGrid, targetColoredGrid, fadeProgress);
      } else {
        renderGrid(ctx, grid, targetGrid, fadeProgress);
      }

      // Complete fade when done
      if (fadeProgress >= 1) {
        if (settings.color_mode) {
          setColoredGrid(targetColoredGrid);
          setTargetColoredGrid([]);
        } else {
          setGrid(targetGrid);
          setTargetGrid([]);
        }
        setIsFading(false);
      }
    } else {
      // No fade active - render current grid
      if (settings.color_mode) {
        renderGrid(ctx, coloredGrid);
      } else {
        renderGrid(ctx, grid);
      }
    }
    
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [grid, coloredGrid, targetGrid, targetColoredGrid, isFading, nextGeneration, nextGenerationColored, isSimulationStuck, flipRandomCells, flipRandomCellsColored, calculateGridDimensions, createRandomGrid, createRandomColoredGrid, renderGrid, settings.simulation_speed, settings.fade_amount, settings.stable_display_time, settings.color_mode, fibonacci]);

  // Handle screen tap to randomize
  const handleScreenTap = useCallback(() => {
    const newDims = calculateGridDimensions();
    if (settings.color_mode) {
      const newGrid = createRandomColoredGrid(newDims.width, newDims.height);
      setColoredGrid(newGrid);
      setTargetColoredGrid([]);
    } else {
      const newGrid = createRandomGrid(newDims.width, newDims.height);
      setGrid(newGrid);
      setTargetGrid([]);
    }
    setIsFading(false);
    stateHistoryRef.current = [];
    stuckCounterRef.current = 0;
    fibonacciIndexRef.current = 0;
  }, [calculateGridDimensions, createRandomGrid, createRandomColoredGrid, settings.color_mode]);

  // Initialize simulation
  useEffect(() => {
    const initializeSimulation = () => {
      const newDims = calculateGridDimensions();
      setDimensions(newDims);
      
      if (settings.color_mode ? coloredGrid.length === 0 : grid.length === 0) {
        if (settings.color_mode) {
          const initialGrid = createRandomColoredGrid(newDims.width, newDims.height);
          setColoredGrid(initialGrid);
          setTargetColoredGrid([]);
        } else {
          const initialGrid = createRandomGrid(newDims.width, newDims.height);
          setGrid(initialGrid);
          setTargetGrid([]);
        }
        setIsFading(false);
      }
    };

    initializeSimulation();
    window.addEventListener('resize', initializeSimulation);
    return () => window.removeEventListener('resize', initializeSimulation);
  }, [calculateGridDimensions, createRandomGrid, createRandomColoredGrid, grid.length, coloredGrid.length, settings.color_mode]);

  // Reset simulation when grid-affecting settings change
  useEffect(() => {
    if (settings.color_mode ? coloredGrid.length > 0 : grid.length > 0) {
      const newDims = calculateGridDimensions();
      if (settings.color_mode) {
        const newGrid = createRandomColoredGrid(newDims.width, newDims.height);
        setColoredGrid(newGrid);
        setTargetColoredGrid([]);
      } else {
        const newGrid = createRandomGrid(newDims.width, newDims.height);
        setGrid(newGrid);
        setTargetGrid([]);
      }
      setIsFading(false);
      setDimensions(newDims);
      stateHistoryRef.current = [];
      stuckCounterRef.current = 0;
      fibonacciIndexRef.current = 0;
      
      // Update canvas size immediately
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - settings.bottom_margin;
      }
    }
  }, [settings.cell_size, settings.cell_padding, settings.bottom_margin, settings.color_mode, calculateGridDimensions, createRandomGrid, createRandomColoredGrid]);

  // Switch between color and standard modes
  useEffect(() => {
    if (grid.length > 0 || coloredGrid.length > 0) {
      const newDims = calculateGridDimensions();
      if (settings.color_mode) {
        // Switching to color mode
        if (coloredGrid.length === 0) {
          const newGrid = createRandomColoredGrid(newDims.width, newDims.height);
          setColoredGrid(newGrid);
          setTargetColoredGrid([]);
          // Clear standard grid
          setGrid([]);
          setTargetGrid([]);
        }
      } else {
        // Switching to standard mode
        if (grid.length === 0) {
          const newGrid = createRandomGrid(newDims.width, newDims.height);
          setGrid(newGrid);
          setTargetGrid([]);
          // Clear colored grid
          setColoredGrid([]);
          setTargetColoredGrid([]);
        }
      }
      setIsFading(false);
      stateHistoryRef.current = [];
      stuckCounterRef.current = 0;
      fibonacciIndexRef.current = 0;
    }
  }, [settings.color_mode]);

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
        if (data.payload.try_revive_stuck_sim?.value !== undefined) {
          newSettings.try_revive_stuck_sim = data.payload.try_revive_stuck_sim.value as boolean;
        }
        if (data.payload.hard_reset_on_stuck?.value !== undefined) {
          newSettings.hard_reset_on_stuck = data.payload.hard_reset_on_stuck.value as boolean;
        }
        if (data.payload.max_revival_attempts?.value !== undefined) {
          newSettings.max_revival_attempts = data.payload.max_revival_attempts.value as number;
        }
        if (data.payload.grid_population_percentage?.value !== undefined) {
          newSettings.grid_population_percentage = data.payload.grid_population_percentage.value as number;
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
        if (data.payload.color_mode?.value !== undefined) {
          newSettings.color_mode = data.payload.color_mode.value as boolean;
        }
        if (data.payload.random_color_chance?.value !== undefined) {
          newSettings.random_color_chance = data.payload.random_color_chance.value as number;
        }
        if (data.payload.max_saturation_age?.value !== undefined) {
          newSettings.max_saturation_age = data.payload.max_saturation_age.value as number;
        }
        if (data.payload.saturation_factor?.value !== undefined) {
          newSettings.saturation_factor = data.payload.saturation_factor.value as number;
        }
        if (data.payload.random_color_pure?.value !== undefined) {
          newSettings.random_color_pure = data.payload.random_color_pure.value as boolean;
        }

        updateSettings(newSettings);
        setIsConnected(true);
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
        if (initialSettings.try_revive_stuck_sim?.value !== undefined) {
          newSettings.try_revive_stuck_sim = initialSettings.try_revive_stuck_sim.value as boolean;
        }
        if (initialSettings.hard_reset_on_stuck?.value !== undefined) {
          newSettings.hard_reset_on_stuck = initialSettings.hard_reset_on_stuck.value as boolean;
        }
        if (initialSettings.max_revival_attempts?.value !== undefined) {
          newSettings.max_revival_attempts = initialSettings.max_revival_attempts.value as number;
        }
        if (initialSettings.grid_population_percentage?.value !== undefined) {
          newSettings.grid_population_percentage = initialSettings.grid_population_percentage.value as number;
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
        if (initialSettings.color_mode?.value !== undefined) {
          newSettings.color_mode = initialSettings.color_mode.value as boolean;
        }
        if (initialSettings.random_color_chance?.value !== undefined) {
          newSettings.random_color_chance = initialSettings.random_color_chance.value as number;
        }
        if (initialSettings.max_saturation_age?.value !== undefined) {
          newSettings.max_saturation_age = initialSettings.max_saturation_age.value as number;
        }
        if (initialSettings.saturation_factor?.value !== undefined) {
          newSettings.saturation_factor = initialSettings.saturation_factor.value as number;
        }
        if (initialSettings.random_color_pure?.value !== undefined) {
          newSettings.random_color_pure = initialSettings.random_color_pure.value as boolean;
        }

        updateSettings(newSettings);
        setIsConnected(true);
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
