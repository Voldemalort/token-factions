import { BCconfig, BorderFrameFaction } from "./BorderControlFaction.js";
import { warn } from "../main.js";
import { getCanvas, getGame, TOKEN_FACTIONS_MODULE_NAME } from "./settings.js";
import { TokenFactions } from "./tokenFactions.js";
export var TOKEN_FACTIONS_FLAGS;
(function (TOKEN_FACTIONS_FLAGS) {
    TOKEN_FACTIONS_FLAGS["FACTION_DRAW_FRAME"] = "factionDrawFrame";
    TOKEN_FACTIONS_FLAGS["FACTION_DISABLE"] = "factionDisable";
    TOKEN_FACTIONS_FLAGS["FACTION_NO_BORDER"] = "factionNoBorder"; // noBorder
})(TOKEN_FACTIONS_FLAGS || (TOKEN_FACTIONS_FLAGS = {}));
export let BCC;
export let defaultColors;
export let dispositions;
export const readyHooks = async () => {
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
        // setup all the hooks
        defaultColors = {
            'party-member': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColor'),
            'party-npc': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColor'),
            'friendly-npc': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColor'),
            'neutral-npc': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'neutralColor'),
            'hostile-npc': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hostileColor'),
            'controlled-npc': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'controlledColor'),
            'neutral-external-npc': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'neutralColorEx'),
            'friendly-external-npc': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColorEx'),
            'hostile-external-npc': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hostileColorEx'),
            'controlled-external-npc': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'controlledColorEx'),
            'party-external-member': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColorEx'),
            'party-external-npc': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColorEx'),
            //'target-npc' :  getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "targetColor"),
            //'target-external-npc' :  getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "targetColorEx"),
        };
        dispositions = Object.keys(defaultColors);
        Hooks.on('renderSettingsConfig', (sheet, html) => {
            TokenFactions.renderSettingsConfig(sheet, html);
        });
        //@ts-ignore
        libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype.refresh', TokenPrototypeRefreshHandler, 'MIXED');
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'pixiFactionsEnabled')) {
            TokenFactions.onInit(defaultColors, dispositions);
            Hooks.on('closeSettingsConfig', (token, data) => {
                if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'pixiFactionsEnabled')) {
                    TokenFactions.updateTokens(token);
                }
            });
            Hooks.on('renderTokenConfig', (config, html) => {
                if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'pixiFactionsEnabled')) {
                    TokenFactions.renderTokenConfig(config, html);
                }
            });
            Hooks.on('updateActor', (tokenData, data) => {
                if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'pixiFactionsEnabled')) {
                    TokenFactions.updateTokens(tokenData);
                }
            });
            Hooks.on('updateToken', (tokenData, data) => {
                if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'pixiFactionsEnabled')) {
                    TokenFactions.updateTokens(tokenData);
                }
            });
            Hooks.on('updateFolder', (tokenData, data) => {
                if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'pixiFactionsEnabled')) {
                    TokenFactions.updateTokens(tokenData);
                }
            });
        }
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderFactionsEnabled')) {
            Hooks.on('closeSettingsConfig', (token, data) => {
                if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
                    BorderFrameFaction.updateTokensBorder(token.data);
                }
            });
            Hooks.on('renderTokenConfig', (config, html) => {
                if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
                    TokenFactions.renderTokenConfig(config, html);
                }
            });
            Hooks.on('renderSettingsConfig', (sheet, html) => {
                if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
                    // TokenFactions.renderSettingsConfig(sheet, html);
                }
            });
            Hooks.on('updateActor', (tokenData, data) => {
                if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
                    BorderFrameFaction.updateTokensBorder(tokenData);
                }
            });
            Hooks.on('updateToken', (tokenData, data) => {
                if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
                    BorderFrameFaction.updateTokensBorder(tokenData);
                }
            });
            Hooks.on('updateFolder', (tokenData, data) => {
                if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled')) {
                    BorderFrameFaction.updateTokensBorder(tokenData);
                }
            });
            //@ts-ignore
            libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype._refreshBorder', BorderFrameFaction.newBorder, 'MIXED'); // OVERRRIDE
            //@ts-ignore
            libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype._getBorderColor', BorderFrameFaction.newBorderColor, 'MIXED'); // OVERRRIDE
            //@ts-ignore
            // libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype._drawNameplate', BorderFrameFaction.drawNameplate, 'MIXED') // OVERRRIDE
            BCC = new BCconfig();
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
                const tC = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'targetColor');
                const tCE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'targetColorEx');
                // const gS = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientA");
                // const gE = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientB");
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
                el.find('[name="token-factions.targetColor"]')
                    .parent()
                    .append(`<input type="color"value="${tC}" data-edit="token-factions.targetColor">`);
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
                el.find('[name="token-factions.targetColorEx"]')
                    .parent()
                    .append(`<input type="color"value="${tCE}" data-edit="token-factions.targetColorEx">`);
                // el.find('[name="token-factions.healthGradientA"]').parent().append(`<input type="color"value="${gS}" data-edit="token-factions.healthGradientA">`)
                // el.find('[name="token-factions.healthGradientB"]').parent().append(`<input type="color"value="${gE}" data-edit="token-factions.healthGradientB">`)
                // el.find('[name="token-factions.healthGradientC"]').parent().append(`<input type="color"value="${gT}" data-edit="token-factions.healthGradientC">`)
            });
            Hooks.on('renderTokenHUD', (app, html, data) => {
                BorderFrameFaction.AddBorderToggle(app, html, data);
            });
            Hooks.on('createToken', (data) => {
                const token = getCanvas().tokens?.get(data._id);
                if (!token.owner)
                    token.cursor = 'default';
            });
            getCanvas().tokens?.placeables.forEach((t) => {
                if (!t.owner)
                    t.cursor = 'default';
            });
        }
    }
};
// export const setupHooks = async () => {
// };
export const initHooks = async () => {
    warn('Init Hooks processing');
};
export const TokenPrototypeRefreshHandler = function (wrapped, ...args) {
    const tokenData = this;
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'pixiFactionsEnabled')) {
        TokenFactions.updateTokens(tokenData);
    }
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderFactionsEnabled')) {
        BorderFrameFaction.updateTokensBorder(tokenData);
    }
    return wrapped(...args);
};
