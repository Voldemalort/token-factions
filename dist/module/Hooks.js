import { BCconfig, BorderFrame } from "./BorderControlFaction.js";
import { warn } from "../main.js";
import { getCanvas, getGame, TOKEN_FACTIONS_MODULE_NAME } from "./settings.js";
import { TokenFactions, TokenPrototypeRefreshHandler } from "./tokenFactions.js";
export let BCC;
export let readyHooks = async () => {
    // setup all the hooks
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'pixiFactionsEnabled')) {
        Hooks.on('closeSettingsConfig', (token) => {
            if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
                TokenFactions.updateTokens(token);
            }
        });
        Hooks.on('renderTokenConfig', (config, html) => {
            if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
                TokenFactions.renderTokenConfig(config, html);
            }
        });
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
            //@ts-ignore
            libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype.refresh', TokenPrototypeRefreshHandler, 'MIXED');
        }
        Hooks.on('renderSettingsConfig', (sheet, html) => {
            if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
                TokenFactions.renderSettingsConfig(sheet, html);
            }
        });
        Hooks.on('updateActor', (tokenData) => {
            if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
                TokenFactions.updateTokens(tokenData);
            }
        });
        Hooks.on('updateToken', (tokenData) => {
            if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
                TokenFactions.updateTokens(tokenData);
            }
        });
        Hooks.on('updateFolder', (tokenData) => {
            if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
                TokenFactions.updateTokens(tokenData);
            }
        });
    }
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderFactionsEnabled')) {
        BCC = new BCconfig();
        Hooks.on('renderSettingsConfig', (app, el, data) => {
            let nC = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "neutralColor");
            let fC = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "friendlyColor");
            let hC = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "hostileColor");
            let cC = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "controlledColor");
            let pC = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "partyColor");
            let nCE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "neutralColorEx");
            let fCE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "friendlyColorEx");
            let hCE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "hostileColorEx");
            let cCE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "controlledColorEx");
            let pCE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "partyColorEx");
            let tC = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "targetColor");
            let tCE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "targetColorEx");
            let gS = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientA");
            let gE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientB");
            let gT = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientC");
            el.find('[name="token-factions.neutralColor"]').parent().append(`<input type="color" value="${nC}" data-edit="token-factions.neutralColor">`);
            el.find('[name="token-factions.friendlyColor"]').parent().append(`<input type="color" value="${fC}" data-edit="token-factions.friendlyColor">`);
            el.find('[name="token-factions.hostileColor"]').parent().append(`<input type="color" value="${hC}" data-edit="token-factions.hostileColor">`);
            el.find('[name="token-factions.controlledColor"]').parent().append(`<input type="color"value="${cC}" data-edit="token-factions.controlledColor">`);
            el.find('[name="token-factions.partyColor"]').parent().append(`<input type="color"value="${pC}" data-edit="token-factions.partyColor">`);
            el.find('[name="token-factions.targetColor"]').parent().append(`<input type="color"value="${tC}" data-edit="token-factions.targetColor">`);
            el.find('[name="token-factions.neutralColorEx"]').parent().append(`<input type="color" value="${nCE}" data-edit="token-factions.neutralColorEx">`);
            el.find('[name="token-factions.friendlyColorEx"]').parent().append(`<input type="color" value="${fCE}" data-edit="token-factions.friendlyColorEx">`);
            el.find('[name="token-factions.hostileColorEx"]').parent().append(`<input type="color" value="${hCE}" data-edit="token-factions.hostileColorEx">`);
            el.find('[name="token-factions.controlledColorEx"]').parent().append(`<input type="color"value="${cCE}" data-edit="token-factions.controlledColorEx">`);
            el.find('[name="token-factions.partyColorEx"]').parent().append(`<input type="color"value="${pCE}" data-edit="token-factions.partyColorEx">`);
            el.find('[name="token-factions.targetColorEx"]').parent().append(`<input type="color"value="${tCE}" data-edit="token-factions.targetColorEx">`);
            el.find('[name="token-factions.healthGradientA"]').parent().append(`<input type="color"value="${gS}" data-edit="token-factions.healthGradientA">`);
            el.find('[name="token-factions.healthGradientB"]').parent().append(`<input type="color"value="${gE}" data-edit="token-factions.healthGradientB">`);
            el.find('[name="token-factions.healthGradientC"]').parent().append(`<input type="color"value="${gT}" data-edit="token-factions.healthGradientC">`);
        });
        Hooks.on('renderTokenHUD', (app, html, data) => {
            BorderFrame.AddBorderToggle(app, html, data);
        });
        Hooks.on("createToken", (data) => {
            let token = getCanvas().tokens?.get(data._id);
            if (!token.owner)
                token.cursor = "default";
        });
        getCanvas().tokens?.placeables.forEach(t => {
            if (!t.owner)
                t.cursor = "default";
        });
    }
};
export let initHooks = () => {
    warn('Init Hooks processing');
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'pixiFactionsEnabled')) {
            TokenFactions.onInit();
        }
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderFactionsEnabled')) {
            //@ts-ignore
            libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype._refreshBorder', BorderFrame.newBorder, 'OVERRIDE');
            //@ts-ignore
            libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype._getBorderColor', BorderFrame.newBorderColor, 'MIXED');
            //@ts-ignore
            libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype._drawNameplate', BorderFrame.drawNameplate, 'MIXED');
        }
    }
};
