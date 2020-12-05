![alt text](https://github.com/Voldemalort/token-factions/blob/master/docs/module-on.png?raw=true)

# Faction Tokens

This module will allow you to assign tokens to factions by using the token's disposition colors, the token actor's folder color, or defining your own custom replacement colors for token dispositions.

## Configuration

![alt text](https://github.com/Voldemalort/token-factions/blob/master/docs/default-settings.png?raw=true)

### Generate Token Faction Color From

#### Default: A Token's Disposition

This option uses the default Token Disposition color to render the token base and frame. Token Disposition can be seen on a token's Character tab. Tokens with actors controlled by players are colored in a fourth, distinct color.

![alt text](https://github.com/Voldemalort/token-factions/blob/master/docs/token-disposition.png?raw=true)

#### An Actor's Folder Color

This option uses the color of the folder a token's actor belongs in. A color of **#000000**, or the default color of a new actor folder, is treated as if there is no folder that will prevent a base and frame from being rendered for contained actor tokens.

![alt text](https://github.com/Voldemalort/token-factions/blob/master/docs/actor-folder-color.png?raw=true)

#### A Custom Color Set For Token Disposition

This option reveals additional configuration options allowing you to customize colors associated with each token disposition.

![alt text](https://github.com/Voldemalort/token-factions/blob/master/docs/custom-settings.png?raw=true)

### Draw Token Frames By Default?

Token frames (rings) are layered above token graphics. Enable this if you primarily use round tokens. Disable it if you primarily use irregular-shaped tokens.

![alt text](https://github.com/Voldemalort/token-factions/blob/master/docs/draw-token-frame.png?raw=true)

You can override this setting on a per-token basis on a token's Image tab if you use a mix of round and irregular tokens.

![alt text](https://github.com/Voldemalort/token-factions/blob/master/docs/token-frame-override.png?raw=true)

### Frame Render Style

#### Default: Flat

This option renders the frame in a flat color.

![alt text](https://github.com/Voldemalort/token-factions/blob/master/docs/flat-frame-style.png?raw=true)

#### Beveled

This option renders the frame in a beveled style typically seen surrounding round tokens.

![alt text](https://github.com/Voldemalort/token-factions/blob/master/docs/beveled-frame-style.png?raw=true)

### Frame Width (Percent of Grid Unit)

This allows you to change the thickness of the rendered frame. The percentage is based on the width of a single grid unit, not the token width, so larger and smaller tokens will have a consistent frame size.

![alt text](https://github.com/Voldemalort/token-factions/blob/master/docs/token-sizes.png?raw=true)

### Base Opacity

Setting this value to anything lower than 1 will allow the map background to be seen through the base. Setting this value to 0 will disable drawing the base entirely.

### Frame Opacity

Setting this value to anything lower than 1 will allow the map background or token to be seen through the frame. Setting this value to 0 will disable drawing the frame entirely.
