
*Warning: This ReadMe and project is still in development. Not recommended for production use.*

# @deskthing/cli

An emulator for the DeskThing Server that helps with local development.

## Installation

```
npm install @deskthing/cli
```

## Usage

The CLI provides the following commands:

### Development Server

Start a local development server:


deskthing dev [options]


Options:
- `--port`: Port for WebSocket server (default: 8891)

## Development

To build the project:


npm run build


This will:
1. Build the client
2. Build the server
3. Build the CLI
4. Copy necessary process files

## Requirements

- Node.js
- npm

## Dependencies

- react
- react-dom
- tsm
- ws
- yargs

## License

ISC © Riprod
