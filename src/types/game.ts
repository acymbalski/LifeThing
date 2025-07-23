
export type GameOfLifeSettings = {
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
  color_mode: boolean;
  random_color_chance: number;
  saturation_factor: number;
  max_saturation_age: number;
  random_color_pure: boolean;
};

export type CellColor = {
  r: number;
  g: number;
  b: number;
};

export type ColoredCell = {
  alive: boolean;
  color?: CellColor;
  age?: number;
};

export type GridState = boolean[][];
export type ColoredGridState = ColoredCell[][];

export type GameState = {
  grid: GridState;
  generation: number;
  isRunning: boolean;
  lastStateHashes: string[];
};

export enum GameEvents {
  GET_STATE = 'get_state',
  RANDOMIZE = 'randomize',
  TOGGLE_PAUSE = 'toggle_pause',
}

export type ToClientData = {
  type: 'game_state',
  payload: GameState
}

export type GenericTransitData = {
  type: GameEvents,
  request?: string,
  payload?: any
}