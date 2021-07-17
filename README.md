![](https://img.shields.io/badge/Foundry-v0.7.9-informational)
![alt text](./docs/module-on.png?raw=true)

Artwork and assets kindly provided by and used with permission of Caeora. [www.caeora.com](http://www.caeora.com)

# Faction Tokens

This module will allow you to assign tokens to factions by using the token's disposition colors, the token actor's folder color, or defining your own custom replacement colors for token dispositions.

## NOTE: If you are a javascript developer and not a typescript developer, you can just use the javascript files under the dist folder or rename the file from .ts to .js

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/Voldemalort/token-factions/master/src/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

## Known issue

- There is a incompatibility con the [Foundry VTT Mount Up](https://github.com/p4535992/MountUp ) when i "Mount Up" a faction token the PIXI Graphic go in conlict and launch a exception is not a grave exception but is annoying

## Configuration

![alt text](./docs/default-settings.png?raw=true)

### Generate Token Faction Color From

#### Default: A Token's Disposition

This option uses the default Token Disposition color to render the token base and frame. Token Disposition can be seen on a token's Character tab. Tokens with actors controlled by players are colored in a fourth, distinct color.

![alt text](./docs/token-disposition.png?raw=true)

#### An Actor's Folder Color

This option uses the color of the folder a token's actor belongs in. A color of **#000000**, or the default color of a new actor folder, is treated as if there is no folder that will prevent a base and frame from being rendered for contained actor tokens.

![alt text](./docs/actor-folder-color.png?raw=true)

#### A Custom Color Set For Token Disposition

This option reveals additional configuration options allowing you to customize colors associated with each token disposition.

![alt text](./docs/custom-settings.png?raw=true)

### Draw Token Frames By Default?

Token frames (rings) are layered above token graphics. Enable this if you primarily use round tokens. Disable it if you primarily use irregular-shaped tokens.

![alt text](./docs/draw-token-frame.png?raw=true)

You can override this setting on a per-token basis on a token's Image tab if you use a mix of round and irregular tokens.

![alt text](./docs/token-frame-override.png?raw=true)

### Frame Render Style

#### Default: Flat

This option renders the frame in a flat color.

![alt text](./docs/flat-frame-style.png?raw=true)

#### Beveled

This option renders the frame in a beveled style typically seen surrounding round tokens.

![alt text](./docs/beveled-frame-style.png?raw=true)

### Frame Width (Percent of Grid Unit)

This allows you to change the thickness of the rendered frame. The percentage is based on the width of a single grid unit, not the token width, so larger and smaller tokens will have a consistent frame size.

![alt text](./docs/token-sizes.png?raw=true)

### Base Opacity

Setting this value to anything lower than 1 will allow the map background to be seen through the base. Setting this value to 0 will disable drawing the base entirely.

### Frame Opacity

Setting this value to anything lower than 1 will allow the map background or token to be seen through the frame. Setting this value to 0 will disable drawing the frame entirely.

## [Changelog](./changelog.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/Voldemalort/token-factions/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).


## Acknowledgements

Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

Mad props to the 'League of Extraordinary FoundryVTT Developers' community which helped me figure out a lot.

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

- [Token Factions (original)](https://github.com/Voldemalort/token-factions) ty to [Voldemalort](https://github.com/Voldemalort)
- [Token Factions (fork)](https://github.com/erithtotl/token-factions) ty to [erithtotl](https://github.com/erithtotl)
- [Border-Control](https://github.com/kandashi/Border-Control) ty to [kandashi](https://github.com/kandashi)

