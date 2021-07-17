import { warn, error, debug, i18n } from "../main";
import { getGame, TOKEN_FACTIONS_MODULE_NAME } from "./settings";

import { TokenFactions, TokenFactiosHelper } from "./tokenFactions";

export let readyHooks = async () => {

  // setup all the hooks

  Hooks.on("closeSettingsConfig",  (token) => {
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")){
      TokenFactions.updateTokens(token);
    }
  });

  Hooks.on('renderTokenConfig', (config, html) => {
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")){
      TokenFactions.renderTokenConfig(config, html);
    }
  });

  if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")){
    //@ts-ignore
		libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype.refresh', TokenFactiosHelper.tokenRefreshHandler, 'MIXED');
    //@ts-ignore
    libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype._refreshBorder', BorderControl.newBorder, 'OVERRIDE')
    //@ts-ignore
    libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype._getBorderColor', BorderControl.newBorderColor, 'OVERRIDE')
    //@ts-ignore
    libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype._refreshTarget', BorderControl.newTarget, 'OVERRIDE')

	}

  Hooks.on('renderSettingsConfig', (sheet, html) => {
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")){
      TokenFactions.renderSettingsConfig(sheet, html);
    }
  });

  Hooks.on('updateActor', (tokenData) => {
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")){
      TokenFactions.updateTokens(tokenData);
    }
  });

  Hooks.on('updateToken', (tokenData) => {
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")){
      TokenFactions.updateTokens(tokenData);
    }
  });

  Hooks.on('updateFolder', (tokenData) => {
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")){
      TokenFactions.updateTokens(tokenData);
    }
  });

}

export let initHooks = () => {
  warn("Init Hooks processing");

  if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")){
    TokenFactions.onInit();
  }



}
