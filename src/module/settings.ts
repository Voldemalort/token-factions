import { debug, log, setDebugLevel, warn, i18n } from '../main';
//@ts-ignore
import ColorSetting from '../../colorsettings/colorSetting.js';

export const MODULE_NAME = 'token-factions';

/**
 * Because typescript doesn’t know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it’s typed as declare let canvas: Canvas | {ready: false}.
 * That’s why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because a „no canvas“ mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
 export function getCanvas(): Canvas {
  if (!(canvas instanceof Canvas) || !canvas.ready) {
      throw new Error("Canvas Is Not Initialized");
  }
  return canvas;
}

export const registerSettings = function () {

  // ==========================
  // TOKEN FACTIONS
  // ==========================

  game.settings.register(MODULE_NAME, "tokenFactionsEnabled", {
    name: i18n(MODULE_NAME+".tokenFactionsEnabled.name"),
    hint: i18n(MODULE_NAME+".tokenFactionsEnabled.hint"),
    default: true,
    type: Boolean,
    scope: 'world',
    config: true
  });

  game.settings.register(MODULE_NAME, 'color-from', {
      name: 'Generate Token Faction Color From',
      scope: 'world',
      config: true,
      default: 'token-disposition',
      type: String,
      choices: {
        'token-disposition': 'Default: A Token\'s Disposition',
        'actor-folder-color': 'An Actor\'s Folder Color',
        'custom-disposition': 'A Custom Color Set For Token Disposition',
      },
    });

    game.settings.register(MODULE_NAME, 'draw-frames-by-default', {
      name: 'Draw Token Frames By Default?',
      hint: 'Token frames (rings) are layered above token graphics. Enable this if you primarily use round tokens. Disable it if you primarily use irregularly-shaped tokens.',
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });

    game.settings.register(MODULE_NAME, 'frame-style', {
      name: 'Frame Render Style',
      scope: 'world',
      config: true,
      default: 'flat',
      type: String,
      choices: {
        flat: 'Default: Flat',
        beveled: 'Beveled',
      },
    });

    game.settings.register(MODULE_NAME, 'frame-width', {
      name: 'Frame Width (Percent of Grid Unit)',
      scope: 'world',
      config: true,
      default: 7.5,
      type: Number,
      range: {
        min: 0,
        max: 10,
        step: 0.5,
      },
    });

    game.settings.register(MODULE_NAME, 'base-opacity', {
      name: 'Base Opacity',
      scope: 'world',
      config: true,
      default: 1,
      type: Number,
      range: {
        min: 0,
        max: 1,
        step: 0.05,
      },
    });

    game.settings.register(MODULE_NAME, 'frame-opacity', {
      name: 'Frame Opacity',
      scope: 'world',
      config: true,
      default: 1,
      type: Number,
      range: {
        min: 0,
        max: 1,
        step: 0.05,
      },
    });

    // =================================================
    // BORDER COLORS
    // =================================================

    game.settings.register(MODULE_NAME, "removeBorders", {
      name: 'Remove Borders',
      hint: 'Remove the border from specific tokens',
      scope: 'world',
      type: String,
      choices: {
          "0": "None",
          "1": "Non Owned",
          "2": "All",
      },
      default: "0",
      config: true,
    });
    game.settings.register(MODULE_NAME, "borderWidth", {
        name: 'Border Width',
        hint: 'Override border width',
        scope: 'client',
        type: Number,
        default: 4,
        config: true,
    });

    game.settings.register(MODULE_NAME, "circleBorders", {
        name: 'Circular Borders',
        scope: 'client',
        type: Boolean,
        default: false,
        config: true,
    });

    game.settings.register(MODULE_NAME, "controlledColor", {
        name: 'Color: Controlled',
        scope: 'client',
        type: String,
        default: "#FF9829",
        config: true,
    });
    game.settings.register(MODULE_NAME, "controlledColorEx", {
        name: 'Color: Controlled External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
    game.settings.register(MODULE_NAME, "hostileColor", {
        name: 'Color: Hostile',
        scope: 'client',
        type: String,
        default: "#E72124",
        config: true,
    });
    game.settings.register(MODULE_NAME, "hostileColorEx", {
        name: 'Color: Hostile External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
    game.settings.register(MODULE_NAME, "friendlyColor", {
        name: 'Color: Friendly',
        scope: 'client',
        type: String,
        default: "#43DFDF",
        config: true,
    });
    game.settings.register(MODULE_NAME, "friendlyColorEx", {
        name: 'Color: Friendly External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
    game.settings.register(MODULE_NAME, "neutralColor", {
        name: 'Color: Neutral',
        scope: 'client',
        type: String,
        default: "#F1D836",
        config: true,
    });
    game.settings.register(MODULE_NAME, "neutralColorEx", {
        name: 'Color: Neutral External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
    game.settings.register(MODULE_NAME, "partyColor", {
        name: 'Color: Party',
        scope: 'client',
        type: String,
        default: "#33BC4E",
        config: true,
    });
    game.settings.register(MODULE_NAME, "partyColorEx", {
        name: 'Color: Party External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
}

// function setup(templateSettings) {
// 	templateSettings.settings().forEach(setting => {
// 		let options = {
// 			name: i18n(templateSettings.name()+"."+setting.name+'.Name'),
// 			hint: i18n(`${templateSettings.name()}.${setting.name}.Hint`),
// 			scope: setting.scope,
// 			config: true,
// 			default: setting.default,
// 			type: setting.type,
// 			choices: {}
// 		};
// 		if (setting.choices) options.choices = setting.choices;
// 		game.settings.register(templateSettings.name(), setting.name, options);
// 	});
// }
