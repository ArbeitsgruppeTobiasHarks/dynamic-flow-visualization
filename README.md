# Dynamic Flow Visualization

This repo contains JS-based tools for visualizing dynamic traffic flows.

It consists of four sub-repos:

- [library](./library): Contains all necessary React components to render an SVG based on a network flow instance.
- [render-svg](./render-svg): A sample repo that shows how to use the library to create static svgs for use in LaTeX.
- [samples](./samples): Contains sample flow instances including samples of dynamic equilibria, dynamic prediction equilibria, and more.
- [viewer](./viewer): A UI wrapper around `library` that allows to visualize and explore flows interactively.

## Viewer

The viewer is deployed at [arbeitsgruppetobiasharks.github.io/dynamic-flow-visualization](https://arbeitsgruppetobiasharks.github.io/dynamic-flow-visualization).

## Usage example in an HTML file

You can embed the library in an HTML file using `unpkg.com`.
In [single-file.html](./single-file.html), there is a sample setup showing how you could use the package in your JS-based presentation.

## Usage in LaTeX documents

For a short tutorial on how to create and embed SVG files into your LaTeX project, see [latex-tutorial/README.md](latex-tutorial/README.md).
