import { warn, error, debug, i18n } from "../main";
import { BorderFrame } from "./libs/BorderControl";
import { MODULE_NAME } from "./settings";

import { TokenFactions, TokenFactiosHelper } from "./tokenFactions";

export let readyHooks = async () => {

  // setup all the hooks

  Hooks.on("closeSettingsConfig",  (token) => {
    if (game.settings.get(MODULE_NAME, "tokenFactionsEnabled")){
      TokenFactions.updateTokens(token);
    }
  });

  Hooks.on('renderTokenConfig', (config, html) => {
    if (game.settings.get(MODULE_NAME, "tokenFactionsEnabled")){
      TokenFactions.renderTokenConfig(config, html);
    }
  });

  if (game.settings.get(MODULE_NAME, "tokenFactionsEnabled")){
    //@ts-ignore
		libWrapper.register(MODULE_NAME, 'Token.prototype.refresh', TokenFactiosHelper.tokenRefreshHandler, 'MIXED');
    //@ts-ignore
    libWrapper.register(MODULE_NAME, 'Token.prototype._refreshBorder', BorderFrame.newBorder, 'OVERRIDE');
    //@ts-ignore
    libWrapper.register(MODULE_NAME, 'Token.prototype._getBorderColor', BorderFrame.newBorderColor, 'OVERRIDE');
    //@ts-ignore
    libWrapper.register('Border-Control', 'Token.prototype._refreshTarget', BorderFrame.newTarget, 'OVERRIDE')
	}

  Hooks.on('renderSettingsConfig', (sheet, html) => {
    if (game.settings.get(MODULE_NAME, "tokenFactionsEnabled")){
      TokenFactions.renderSettingsConfig(sheet, html);
    }
  });

  Hooks.on('updateActor', (tokenData) => {
    if (game.settings.get(MODULE_NAME, "tokenFactionsEnabled")){
      TokenFactions.updateTokens(tokenData);
    }
  });

  Hooks.on('updateToken', (tokenData) => {
    if (game.settings.get(MODULE_NAME, "tokenFactionsEnabled")){
      TokenFactions.updateTokens(tokenData);
    }
  });

  Hooks.on('updateFolder', (tokenData) => {
    if (game.settings.get(MODULE_NAME, "tokenFactionsEnabled")){
      TokenFactions.updateTokens(tokenData);
    }
  });

}

export let initHooks = () => {
  warn("Init Hooks processing");

  if (game.settings.get(MODULE_NAME, "tokenFactionsEnabled")){
    TokenFactions.onInit();
  }



}
