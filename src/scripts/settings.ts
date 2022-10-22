import { debug, log, warn, i18n } from './lib/lib';
import CONSTANTS from './constants';

export const registerSettings = function () {
  // ==========================
  // TOKEN FACTIONS
  // ==========================

  game.settings.register(CONSTANTS.MODULE_NAME, 'tokenFactionsEnabled', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.tokenFactionsEnabled.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.tokenFactionsEnabled.hint'),
    default: true,
    type: Boolean,
    scope: 'world',
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'color-from', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.color-from.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.color-from.hint'),
    scope: 'world',
    config: true,
    default: 'token-disposition',
    type: String,
    choices: <any>{
      'token-disposition': i18n(CONSTANTS.MODULE_NAME + '.setting.color-from.opt.token-disposition'),
      'actor-folder-color': i18n(CONSTANTS.MODULE_NAME + '.setting.color-from.opt.actor-folder-color'),
      'custom-disposition': i18n(CONSTANTS.MODULE_NAME + '.setting.color-from.opt.custom-disposition'),
    },
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'base-opacity', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.base-opacity.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.base-opacity.hint'),
    scope: 'world',
    config: true,
    default: 0.5,
    type: Number,
    //@ts-ignore
    range: {
      min: 0,
      max: 1,
      step: 0.05,
    },
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'fillTexture', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.fillTexture.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.fillTexture.hint'),
    scope: 'world',
    type: Boolean,
    default: true,
    config: true,
  });

  // game.settings.register(CONSTANTS.MODULE_NAME, 'overrideBorderGraphic', {
  //   name: i18n(CONSTANTS.MODULE_NAME + '.setting.overrideBorderGraphic.name'),
  //   hint: i18n(CONSTANTS.MODULE_NAME + '.setting.overrideBorderGraphic.hint'),
  //   scope: 'world',
  //   type: Boolean,
  //   default: false,
  //   config: true,
  // });

  // ===============================
  // SUB FEATURE STANDARD
  // ===============================

  // game.settings.register(CONSTANTS.MODULE_NAME, 'pixiFactionsEnabled', {
  //   name: i18n(CONSTANTS.MODULE_NAME + '.setting.pixiFactionsEnabled.name'),
  //   hint: i18n(CONSTANTS.MODULE_NAME + '.setting.pixiFactionsEnabled.hint'),
  //   scope: 'world',
  //   type: Boolean,
  //   default: false,
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_NAME, 'draw-frames-by-default', {
  //   name: i18n(CONSTANTS.MODULE_NAME + '.setting.draw-frames-by-default.name'),
  //   hint: i18n(CONSTANTS.MODULE_NAME + '.setting.draw-frames-by-default.hint'),
  //   scope: 'world',
  //   config: true,
  //   default: true,
  //   type: Boolean,
  // });

  game.settings.register(CONSTANTS.MODULE_NAME, 'frame-style', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.frame-style.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.frame-style.hint'),
    scope: 'world',
    config: true,
    default: 'flat',
    type: String,
    choices: <any>{
      flat: i18n(CONSTANTS.MODULE_NAME + '.setting.frame-style.opt.flat'),
      beveled: i18n(CONSTANTS.MODULE_NAME + '.setting.frame-style.opt.beveled'),
      // border: i18n(CONSTANTS.MODULE_NAME + '.setting.frame-style.opt.border'),
    },
  });

  // game.settings.register(CONSTANTS.MODULE_NAME, 'frame-width', {
  //   name: i18n(CONSTANTS.MODULE_NAME + '.setting.frame-width.name'),
  //   hint: i18n(CONSTANTS.MODULE_NAME + '.setting.frame-width.hint'),
  //   scope: 'world',
  //   config: true,
  //   default: 7.5,
  //   type: Number,
  //   //@ts-ignore
  //   range: {
  //     min: 0,
  //     max: 10,
  //     step: 0.5,
  //   },
  // });

  // TODO MOVE THIS FOR BOTH THE FEATURE ????
  game.settings.register(CONSTANTS.MODULE_NAME, 'frame-opacity', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.frame-opacity.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.frame-opacity.hint'),
    scope: 'world',
    config: true,
    default: 1,
    type: Number,
    //@ts-ignore
    range: {
      min: 0,
      max: 1,
      step: 0.05,
    },
  });

  // ===============================
  // SUB FEATURE ALTERNATIVE BORDER
  // ===============================

  // game.settings.register(CONSTANTS.MODULE_NAME, 'borderFactionsEnabled', {
  //   name: i18n(CONSTANTS.MODULE_NAME + '.setting.borderFactionsEnabled.name'),
  //   hint: i18n(CONSTANTS.MODULE_NAME + '.setting.borderFactionsEnabled.hint'),
  //   scope: 'world',
  //   type: Boolean,
  //   default: true,
  //   config: true,
  // });

  game.settings.register(CONSTANTS.MODULE_NAME, 'removeBorders', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.removeBorders.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.removeBorders.hint'),
    scope: 'world',
    type: String,
    choices: <any>{
      0: 'None',
      1: 'Non Owned',
      2: 'All',
    },
    default: '0',
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'permanentBorder', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.permanentBorder.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.permanentBorder.hint'),
    default: false,
    type: Boolean,
    scope: 'world',
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'borderWidth', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.borderWidth.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.borderWidth.hint'),
    scope: 'world',
    type: Number,
    default: 4,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'borderGridScale', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.borderGridScale.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.borderGridScale.hint'),
    scope: 'world',
    type: Boolean,
    default: false,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'borderOffset', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.borderOffset.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.borderOffset.hint'),
    scope: 'world',
    type: Number,
    default: 0,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'circleBorders', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.circleBorders.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.circleBorders.hint'),
    scope: 'world',
    type: Boolean,
    default: false,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'scaleBorder', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.scaleBorder.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.scaleBorder.hint'),
    scope: 'world',
    type: Boolean,
    default: false,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'hudEnable', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.hudEnable.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.hudEnable.hint'),
    scope: 'world',
    type: Boolean,
    default: true,
    config: true,
  });

  /** Which column should the button be placed on */
  game.settings.register(CONSTANTS.MODULE_NAME, 'hudColumn', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudColumn.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudColumn.hint`),
    scope: 'world',
    config: true,
    type: String,
    default: 'Right',
    choices: <any>{
      Left: 'Left',
      Right: 'Right',
    },
  });

  /** Whether the button should be placed on the top or bottom of the column */
  game.settings.register(CONSTANTS.MODULE_NAME, 'hudTopBottom', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudTopBottom.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudTopBottom.hint`),
    scope: 'world',
    config: true,
    type: String,
    default: 'Bottom',
    choices: <any>{
      Top: 'Top',
      Bottom: 'Bottom',
    },
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'controlledColor', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.controlledColor.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.controlledColor.hint'),
    scope: 'world',
    type: String,
    default: '#FF9829',
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'controlledColorEx', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.controlledColorEx.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.controlledColorEx.hint'),
    scope: 'world',
    type: String,
    default: '#000000',
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'hostileColor', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.hostileColor.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.hostileColor.hint'),
    scope: 'world',
    type: String,
    default: '#E72124',
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'hostileColorEx', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.hostileColorEx.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.hostileColorEx.hint'),
    scope: 'world',
    type: String,
    default: '#000000',
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'friendlyColor', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.friendlyColor.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.friendlyColor.hint'),
    scope: 'world',
    type: String,
    default: '#43DFDF',
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'friendlyColorEx', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.friendlyColorEx.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.friendlyColorEx.hint'),
    scope: 'world',
    type: String,
    default: '#000000',
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'neutralColor', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.neutralColor.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.neutralColor.hint'),
    scope: 'world',
    type: String,
    default: '#F1D836',
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'neutralColorEx', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.neutralColorEx.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.neutralColorEx.hint'),
    scope: 'world',
    type: String,
    default: '#000000',
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'partyColor', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.partyColor.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.partyColor.hint'),
    scope: 'world',
    type: String,
    default: '#33BC4E',
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'partyColorEx', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.partyColorEx.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.partyColorEx.hint'),
    scope: 'world',
    type: String,
    default: '#000000',
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'actorFolderColorEx', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.actorFolderColorEx.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.actorFolderColorEx.hint'),
    scope: 'world',
    type: String,
    default: '#000000',
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'customDispositionColorEx', {
    name: i18n(CONSTANTS.MODULE_NAME + '.setting.customDispositionColorEx.name'),
    hint: i18n(CONSTANTS.MODULE_NAME + '.setting.customDispositionColorEx.hint'),
    scope: 'world',
    type: String,
    default: '#000000',
    config: true,
  });
};
