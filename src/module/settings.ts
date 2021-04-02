import { debug, log, setDebugLevel, warn, i18n } from '../main';
//@ts-ignore
import ColorSetting from '../../colorsettings/colorSetting.js';
export const MODULE_NAME = 'token-factions';

export const registerSettings = function () {

  // ==========================
  // TOKEN FACTIONS
  // ==========================

  game.settings.register(MODULE_NAME, "tokenFactionsEnabled", {
    name: i18n(MODULE_NAME+".tokenFactionsEnabled.name"),
    hint: i18n(MODULE_NAME+".tokenFactionsEnabled.hint"),
    default: false,
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
        'custom-disposition': 'A Cusom Color Set For Token Disposition',
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
