import { warn, error, debug, i18n } from '../main';
import { getCanvas, getGame, TOKEN_FACTIONS_MODULE_NAME } from './settings';

import { TokenFactions } from './tokenFactions';
import { TokenData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';

export const readyHooks = async () => {
  Hooks.on('renderSettingsConfig', (app, el, data) => {
    const nC = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'neutralColor');
    const fC = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColor');
    const hC = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hostileColor');
    const cC = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'controlledColor');
    const pC = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColor');
    const nCE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'neutralColorEx');
    const fCE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColorEx');
    const hCE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hostileColorEx');
    const cCE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'controlledColorEx');
    const pCE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColorEx');
    const gS = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'actorFolderColorEx');
    const gE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'customDispositionColorEx');
    // const gT = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientC");
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

  if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
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

    Hooks.on('updateActor', (tokenData, data) => {
      TokenFactions.updateTokenDataFaction(tokenData);
    });

    Hooks.on('updateToken', (tokenData, data) => {
      TokenFactions.updateTokenDataFaction(tokenData);
    });

    Hooks.on('updateFolder', (tokenData, data) => {
      TokenFactions.updateTokenDataFaction(tokenData);
    });

    //@ts-ignore
    libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype.refresh', TokenPrototypeRefreshHandler, 'MIXED');

    // if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'overrideBorderGraphic')) {
    //   //@ts-ignore
    //   libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype._refreshBorder', TokenPrototypeRefreshBorderHandler, 'MIXED');

    //   //@ts-ignore
    //   libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype._getBorderColor', TokenPrototypeGetBorderColorHandler, 'MIXED');
    // } else {
    //@ts-ignore
    libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype.draw', TokenPrototypeDrawHandler, 'MIXED');
    // }

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
      const token = <Token>getCanvas().tokens?.get(data._id);
      if (!token.owner) {
        token.cursor = 'default';
      }
    });

    getCanvas().tokens?.placeables.forEach((t) => {
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
  const token = this as Token;
  TokenFactions.updateTokenDataFaction(token.data);
  // this.drawFactions();
  return wrapped(...args);
};

export const ActorPrototypeOnUpdateHandler = function (wrapped, ...args) {
  // const [data, options, userId] = args;
  const actor = this as Actor;
  TokenFactions.updateTokenDataFaction(<TokenData>actor.token?.data);
  // this.drawFactions();
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
