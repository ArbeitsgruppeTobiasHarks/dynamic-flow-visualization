# Creating figures for LaTeX

You can embed dynamic flows created with this library in LaTeX:
This is a short Tutorial that shows you how you could achieve this.

In short:

1. Create SVG files from the dynamic flow JSON file using a Javascript/Typescript script.
2. Embed the SVG files using the [`svg` LaTeX-package](https://ctan.org/pkg/svg) which itself uses [Inkscape](https://inkscape.org) underneath.

## Prerequisites:

- A JSON file containing the dynamic flow (and its corresponding network)
- An Inkscape installation [Skip if you're using Overleaf]. Make sure that it is available from the command line:
  - Open a terminal and run `inkscape --version`.
  - If you can see a nicely formatted message telling you which Inkscape you are running, you are fine.
  - If you see a message similar to `Could not find executable 'inkscape'`, then you have to add it to your PATH.
- A [`NodeJS`](https://nodejs.org) installation. This enables you to run JavaScript files locally.

In this tutorial, we will use the flow found in `samples/json/DPEFourNodes.json` for demonstration purposes.

## Step 1: Create SVG file(s)

- Copy this directory a new local directory on your machine and run `npm install`.
- Inspect `build.tsx`: Read & understand it.
- Run `npm run build`. This will execute `build.tsx` and create several svg files to the subfolder `build`.

## Step 2: Embed SVGs into LaTeX

To embed an SVG file into your LaTeX project:

1. Add `\usepackage{svg}` to the preamble of your document
2. Use the `\includesvg` command, e.g.:
   `\includesvg[width=0.5\textwidth]{path/to/svg}
3. Add the option `-shell-escape` to your `pdflatex` call (see e.g. the `.latexmkrc` file in this directory). This enables the `svg` LaTeX package to call Inkscape and create `.pdf` and `.tex` files from the svg.

For an example minimal setup in a LaTeX Beamer project, please refer to `main.tex`.
Running `latexmk` (given you have installed `latexmk`) in this directory should produce the `main.pdf`.
