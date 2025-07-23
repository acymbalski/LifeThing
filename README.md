# LifeThing

**Warning: This project is vibe-coded**

A Conway's Game of Life cellular automata display for DeskThing devices with color evolution, age-based saturation enhancement, and some stuck state recovery. Features both monochrome and colorful inheritance modes.

## Description

Conway's Game of Life simulation that runs fullscreen on DeskThing.

The simulation attempts to handle stuck states using Fibonacci sequence progression and includes optional smooth fade animations between generations. Tap the screen to randomize the grid.

## Settings

### Visual Appearance
- **Background Color**: Hex color value for canvas background
- **Cell Color**: Hex color value for living cells (standard mode only)
- **Cell Size**: 2-50px, determines zoom level and total grid size
- **Cell Padding**: 0-50px spacing between cells
- **Cell Corner Radius**: 0-20px for rounded cell corners
- **Bottom Margin**: 0-100px to avoid DeskThing UI elements

### Animation & Timing
- **Simulation Speed**: 100-4000ms between generation calculations
- **Stable Display Time**: 0-2000ms display duration after fade completion
- **Fade Amount**: 0-1.0 portion of cycle spent transitioning between generations

### Simulation Behavior
- **Edge Wrapping**: Enable/disable toroidal grid topology
- **Show Neighbor Influence**: Display empty cells with opacity based on living neighbor count
- **Neighbor Opacity Increment**: 0.01-0.5 opacity increase per neighbor

### Color Mode (Genetic Evolution)
- **Color Mode**: Enable genetic color inheritance system
- **Random Color Injection**: 0-1.0 chance for new cells to get mutated colors instead of inherited
- **Pure Random Colors**: Use completely random vs. tweaked inherited colors for mutations
- **Age Saturation Boost**: 0-1.0 maximum saturation enhancement factor for aged cells
- **Max Saturation Age**: 1-50 generations needed to reach maximum saturation boost

## Implementation Details


### Color System
When Color Mode is enabled, the color is determined via a few factors. Without them, the colors tend to get washed out and turn to shades of white.

#### Age-Weighted Inheritance
- New cells inherit colors from their living neighbors
- Older neighbors have stronger influence (age acts as weighting factor)

#### Color Mutations
- **Tweaked Inherited** (default): Takes weighted average, randomly sets one RGB channel to 0 or 255
- **Pure Random**: Completely random RGB values
- Maintains lineage

#### Saturation Enhancement
- Surviving cells gradually become more saturated with age
- Configurable saturation boost factor and age cap

### Stuck State Recovery
Uses Fibonacci sequence progression instead of linear:
1. Try flipping 1 cell (F₁)
2. If stuck, flip 1 cell (F₂) 
3. If stuck, flip 2 cells (F₃)
4. Continue: 3, 5, 8, 13, 21... cells (Fibonacci sequence)
5. If Fibonacci count would exceed 1/3 of total cells, perform full reset
6. Counter resets on successful evolution

### Fade Animation System
- Calculates complete opacity states for current and target generations
- Includes neighbor influence zones in fade calculations

## Build Instructions

```bash
npm run build
```

Generates a `.zip` file in the `dist/` directory for installation in DeskThing server.

## Installation

1. Build the project using above instructions
2. Install generated zip file through DeskThing web interface
3. Configure settings as desired through DeskThing settings panel
4. Enable Color Mode for genetic evolution features

## Usage

- **Tap screen**: Randomize grid and restart simulation
- **Settings**: Adjust through DeskThing interface
- **Color Mode**: Toggle for color evolution vs. standard display
