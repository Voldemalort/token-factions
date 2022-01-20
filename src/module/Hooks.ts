import { warn, error, debug, i18n } from '../main';
import { canvas, game, TOKEN_FACTIONS_MODULE_NAME } from './settings';

import { TokenFactions } from './tokenFactions';
import { TokenData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';

export const readyHooks = async () => {
  Hooks.on('renderSettingsConfig', (app, el, data) => {
    const nC = game.settings.get(TOKEN_FACTIONS_MODULE_NAME, 'neutralColor');
    const fC = game.settings.get(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColor');
    const hC = game.settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hostileColor');
    const cC = game.settings.get(TOKEN_FACTIONS_MODULE_NAME, 'controlledColor');
    const pC = game.settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColor');
    const nCE = game.settings.get(TOKEN_FACTIONS_MODULE_NAME, 'neutralColorEx');
    const fCE = game.settings.get(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColorEx');
    const hCE = game.settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hostileColorEx');
    const cCE = game.settings.get(TOKEN_FACTIONS_MODULE_NAME, 'controlledColorEx');
    const pCE = game.settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColorEx');
    const gS = game.settings.get(TOKEN_FACTIONS_MODULE_NAME, 'actorFolderColorEx');
    const gE = game.settings.get(TOKEN_FACTIONS_MODULE_NAME, 'customDispositionColorEx');
    // const gT = game.settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientC");
    el.find('[name="token-factions.neutralColor"]')
      .parent()
      .append(`<input type="color" value="${nC}" data-edit="token-factions.neutralColor">`);
    el.find('[name="token-factions.friendlyColor"]')
      .parent()
      .append(`<input type="color" value="${fC}" data-edit="token-factions.friendlyColor">`);
    el.find('[name="token-factions.hostileColor"]')
      .parent()
      .append(`<input type="color" value="${hC}" data-edit="token-factions.hostileColor">`);
    el.find('[name="token-factions.controlledColor"]')
      .parent()
      .append(`<input type="color"value="${cC}" data-edit="token-factions.controlledColor">`);
    el.find('[name="token-factions.partyColor"]')
      .parent()
      .append(`<input type="color"value="${pC}" data-edit="token-factions.partyColor">`);

    el.find('[name="token-factions.neutralColorEx"]')
      .parent()
      .append(`<input type="color" value="${nCE}" data-edit="token-factions.neutralColorEx">`);
    el.find('[name="token-factions.friendlyColorEx"]')
      .parent()
      .append(`<input type="color" value="${fCE}" data-edit="token-factions.friendlyColorEx">`);
    el.find('[name="token-factions.hostileColorEx"]')
      .parent()
      .append(`<input type="color" value="${hCE}" data-edit="token-factions.hostileColorEx">`);
    el.find('[name="token-factions.controlledColorEx"]')
      .parent()
      .append(`<input type="color"value="${cCE}" data-edit="token-factions.controlledColorEx">`);
    el.find('[name="token-factions.partyColorEx"]')
      .parent()
      .append(`<input type="color"value="${pCE}" data-edit="token-factions.partyColorEx">`);

    el.find('[name="token-factions.actorFolderColorEx"]')
      .parent()
      .append(`<input type="color"value="${gS}" data-edit="token-factions.actorFolderColorEx">`);
    el.find('[name="token-factions.customDispositionColorEx"]')
      .parent()
      .append(`<input type="color"value="${gE}" data-edit="token-factions.customDispositionColorEx">`);
    // el.find('[name="token-factions.healthGradientC"]')
    //  .parent()
    //  .append(`<input type="color"value="${gT}" data-edit="token-factions.healthGradientC">`)
  });

  if (game.settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
    // setup all the hooks

    Hooks.on('closeSettingsConfig', (token, data) => {
      TokenFactions.updateTokensAll();
    });

    Hooks.on('renderTokenConfig', (config, html) => {
      TokenFactions.renderTokenConfig(config, html);
    });

    Hooks.on('renderSettingsConfig', (sheet, html) => {
      TokenFactions.updateTokensAll();
    });

    // Hooks.on('updateActor', (tokenData:Actor, data) => {
    //   // TokenFactions.updateTokenDataFaction(tokenData);
    //   // token?.refresh();
    //   if(hasProperty(data,'flags') &&
    //     !hasProperty(data.flags[TOKEN_FACTIONS_MODULE_NAME],`${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`)){
    //     TokenFactions.updateTokenFaction(<TokenDocument>tokenData.token);
    //   }
    // });

    // Hooks.on('updateToken', (tokenData:TokenDocument, data) => {
    //   //TokenFactions.updateTokenDataFaction(tokenData);
    //   // token?.refresh();
    //   if(hasProperty(data,'flags') &&
    //     !hasProperty(data.flags[TOKEN_FACTIONS_MODULE_NAME],`${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`)){
    //     TokenFactions.updateTokenFaction(tokenData);
    //   }
    // });

    Hooks.on('updateFolder', (tokenData, data) => {
      TokenFactions.updateTokenDataFaction(tokenData);
    });

    // Hooks.on('preUpdateActor', (actor:Actor, updateData) => {
    //   TokenFactions._applyFactions(actor, updateData);
    // });
    // Hooks.on('preUpdateToken', (tokenDocument:TokenDocument, updateData) => {
    //   TokenFactions._applyFactions(tokenDocument,updateData);
    // });

    //@ts-ignore
    libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype.refresh', TokenPrototypeRefreshHandler, 'MIXED');

    //@ts-ignore
    libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype.draw', TokenPrototypeDrawHandler, 'MIXED');

    //@ts-ignore
    libWrapper.register(
      TOKEN_FACTIONS_MODULE_NAME,
      'Token.prototype._onUpdate',
      TokenPrototypeOnUpdateHandler,
      'MIXED',
    );

    //@ts-ignore
    libWrapper.register(
      TOKEN_FACTIONS_MODULE_NAME,
      'Actor.prototype._onUpdate',
      ActorPrototypeOnUpdateHandler,
      'MIXED',
    );

    Hooks.on('renderTokenHUD', (app, html, data) => {
      TokenFactions.AddBorderToggle(app, html, data);
    });

    Hooks.on('createToken', (data) => {
      const token = <Token>canvas.tokens?.get(data.id);
      if (!token.owner) {
        token.cursor = 'default';
      }
    });

    canvas.tokens?.placeables.forEach((t) => {
      if (!t.owner) {
        t.cursor = 'default';
      }
    });
  }
};

// export const setupHooks = async () => {

// };

export const initHooks = async () => {
  warn('Init Hooks processing');
  TokenFactions.onInit();
};

export const TokenPrototypeRefreshHandler = function (wrapped, ...args) {
  const tokenData = this as TokenData;
  TokenFactions.updateTokenDataFaction(tokenData);
  return wrapped(...args);
};

export const TokenPrototypeDrawHandler = function (wrapped, ...args) {
  const token = this as Token;
  TokenFactions.updateTokenDataFaction(token.data);
  // this.drawFactions();
  return wrapped(...args);
};

export const TokenPrototypeOnUpdateHandler = function (wrapped, ...args) {
  if (
    hasProperty(args[0], 'flags') &&
    !hasProperty(args[0].flags[TOKEN_FACTIONS_MODULE_NAME], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`)
  ) {
    const token = this as Token;
    TokenFactions.updateTokenDataFaction(token.data);
    // this.drawFactions();
  }
  return wrapped(...args);
};

export const ActorPrototypeOnUpdateHandler = function (wrapped, ...args) {
  if (
    hasProperty(args[0], 'flags') &&
    !hasProperty(args[0].flags[TOKEN_FACTIONS_MODULE_NAME], `${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`)
  ) {
    const actor = this as Actor;
    TokenFactions.updateTokenDataFaction(<TokenData>actor.token?.data);
    // this.drawFactions();
  }
  return wrapped(...args);
};

// export const TokenPrototypeRefreshBorderHandler = function (wrapped, ...args) {
//   //@ts-ignore
//   const token: Token = this as Token;
//   //@ts-ignore
//   TokenFactions.updateTokenDataFaction(token.data);
//   return;
//   // return wrapped(args);
// };

// export const TokenPrototypeGetBorderColorHandler = function (wrapped, ...args) {
//   //@ts-ignore
//   const token: Token = this as Token;
//   return TokenFactions.updateTokenDataFaction(token.data);
//   //return wrapped(args);
// };

//@ts-ignore
// Token.prototype.drawFactions = function () {
//   const token = this as Token;
//   TokenFactions.updateTokenDataFaction(token.data);
// };
