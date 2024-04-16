[![LTS+sub-branches](https://img.shields.io/badge/submodule-LTS+sub--branches-informational?style=flat-square&logo=git)](https://github.com/IndigoMultimediaTeam/lts-driven-git-submodules)
# CBoxLine
Web component `<c-box-line>` represents a text “box” and “arrow” connected a line, see
[example](https://indigomultimediateam.github.io/c-box-line/examples.html).

## Options
- **ESM Component can be found in [./CBoxLine.js](./CBoxLine.js)**
- UMD alternative see [./lib/CBoxLine.umd.js](./lib/CBoxLine.umd.js)
- [CEI](https://github.com/IndigoMultimediaTeam/customElementsInitiator?tab=readme-ov-file#v0) alternative see [./lib/CBoxLine.cei.js](./lib/CBoxLine.cei.js)

## Usage
Web Component `<c-box-line position-bubble position-circle><*></*></c-box-line>`:

- The “image caption” component, i.e. the line from `<*>` to the pointer (circle)
- The component is expanded to 100% and placed in the top left
- box and wheel (and line) are positioned percentage-wise within the component using the `position-*` attributes
- partially treated if, the box and wheel are in the horizontal/vertical plane
- by default the box is moved to `0 0` and the wheel to `100 100` (see `attributes`)
- all configuration options see `getComponentConfig` (and type `config` and `attributes`)

## Development
- see [./bs](./bs)
