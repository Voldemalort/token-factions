import { warn } from "../main.js";
import { getGame, TOKEN_FACTIONS_MODULE_NAME } from "./settings.js";
import { TokenFactions, TokenPrototypeRefreshHandler } from "./tokenFactions.js";
export let readyHooks = async () => {
    // setup all the hooks
    Hooks.on("closeSettingsConfig", (token) => {
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")) {
            TokenFactions.updateTokens(token);
        }
    });
    Hooks.on('renderTokenConfig', (config, html) => {
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")) {
            TokenFactions.renderTokenConfig(config, html);
        }
    });
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")) {
        //@ts-ignore
        libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype.refresh', TokenPrototypeRefreshHandler, 'MIXED');
    }
    Hooks.on('renderSettingsConfig', (sheet, html) => {
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")) {
            TokenFactions.renderSettingsConfig(sheet, html);
        }
    });
    Hooks.on('updateActor', (tokenData) => {
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")) {
            TokenFactions.updateTokens(tokenData);
        }
    });
    Hooks.on('updateToken', (tokenData) => {
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")) {
            TokenFactions.updateTokens(tokenData);
        }
    });
    Hooks.on('updateFolder', (tokenData) => {
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")) {
            TokenFactions.updateTokens(tokenData);
        }
    });
};
export let initHooks = () => {
    warn("Init Hooks processing");
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled")) {
        TokenFactions.onInit();
    }
};
