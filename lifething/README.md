# LifeThing

**This project is vibe-coded**

A Conway's Game of Life cellular automata display for DeskThing devices. Includes parameters for customizing visual appearance and timing to enhance use as an ambient display.

## Description

Conway's Game of Life simulation that runs fullscreen on DeskThing. The simulation automatically handles stuck states by progressively flipping random cells until evolution resumes, or performing a full reset if needed. Tap the screen to randomize the grid.

## Settings

### Visual Appearance
- **Background Color**: Hex color value for canvas background
- **Cell Color**: Hex color value for living cells
- **Cell Size**: 2-50px, determines zoom level and total grid size
- **Cell Padding**: 0-50px spacing between cells
- **Cell Corner Radius**: 0-20px for rounded cell corners
- **Bottom Margin**: 0-100px to avoid DeskThing UI elements

### Neighbor Visualization
- **Show Neighbor Influence**: Display empty cells with opacity based on living neighbor count
- **Neighbor Opacity Increment**: 0.01-0.5 opacity increase per neighbor

### Simulation Parameters
- **Simulation Speed**: 100-2000ms between generation calculations
- **Stable Display Time**: 0-2000ms display duration after fade completion
- **Fade Amount**: 0-1.0 portion of cycle spent transitioning between generations
- **Edge Wrapping**: Enable/disable toroidal grid topology

## Implementation Details

### Conway's Game of Life Rules
- Live cell with fewer than 2 neighbors dies (underpopulation)
- Live cell with 2-3 neighbors survives
- Live cell with more than 3 neighbors dies (overpopulation)
- Dead cell with exactly 3 neighbors becomes alive (birth)

### Stuck State Recovery
When simulation reaches a static state or loop:
1. Flip 1 random cell
2. If stuck again, flip 2 random cells
3. Continue escalating (3, 4, 5... cells) until evolution resumes
4. Full grid randomization after 50 failed attempts
5. Counter resets on successful evolution

### Fade Animation
Calculates complete opacity states for current and target generations, including both living cells (opacity 1.0) and neighbor influence zones. Interpolates smoothly between states during transitions.

### Grid Management
- Grid dimensions calculated from screen size and cell parameters
- Automatic grid regeneration when size-affecting settings change
- Efficient neighbor counting with optional edge wrapping

## Build Instructions

```bash
npm run build
```

Generates a `.zip` file in the `dist/` directory for installation in DeskThing server.

## Installation

1. Build the project using above instructions
2. Install generated zip file through DeskThing web interface
3. Configure settings as desired through DeskThing settings panel