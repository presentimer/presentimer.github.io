# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Presentimer is a static web-based presentation timer for academic research talks. It is written in vanilla JavaScript, HTML, and CSS with zero dependencies and no build step. The site is deployed directly to GitHub Pages at https://presentimer.github.io/.

## Development

No build tools, package manager, or test framework are used. To develop locally, serve the project root with any static file server (e.g., `python3 -m http.server`). There is no compilation, bundling, or linting step.

## Architecture

The entire application is three source files in the repository root:

- **index.html** — Structure with three sections: `#main` (timer display), `#controller` (buttons and config inputs), `#wrapWrapper` (lap time list)
- **script.js** — All application logic: timer state, countdown loop (100ms interval), URL query parameter reading/writing, bell sound triggers, lap recording, full-width-to-half-width number conversion
- **style.css** — Dark theme layout using CSS table centering for the timer display; wrap list absolutely positioned on the right

Key state in `script.js`: `limitTime` (presentation duration in minutes), `passTime` (elapsed seconds), `minutes[3]` (bell trigger times), `wrapList[]` (lap history).

Timer configuration is shareable via URL query parameters (e.g., `?limit=10&bell1=8&bell2=10`). Text field changes also update the URL query string.

## Conventions

- The UI and documentation are in Japanese.
- Sound assets are in `sounds/` (bell1.mp3, bell2.mp3, bell3.mp3).
- OG metadata images must use absolute URLs (not relative paths) for GitHub Pages.
- Coding style must follow `.agents/coding_guidelines.md`.
