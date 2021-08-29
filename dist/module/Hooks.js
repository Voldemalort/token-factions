import { warn } from "../main.js";
import { getCanvas, getGame, TOKEN_FACTIONS_MODULE_NAME } from "./settings.js";
import { TokenFactions } from "./tokenFactions.js";
export var TOKEN_FACTIONS_FLAGS;
(function (TOKEN_FACTIONS_FLAGS) {
    TOKEN_FACTIONS_FLAGS["FACTION_DRAW_FRAME"] = "factionDrawFrame";
    TOKEN_FACTIONS_FLAGS["FACTION_DISABLE"] = "factionDisable";
    TOKEN_FACTIONS_FLAGS["FACTION_NO_BORDER"] = "factionNoBorder";
})(TOKEN_FACTIONS_FLAGS || (TOKEN_FACTIONS_FLAGS = {}));
export var TOKEN_FACTIONS_FRAME_STYLE;
(function (TOKEN_FACTIONS_FRAME_STYLE) {
    TOKEN_FACTIONS_FRAME_STYLE["FLAT"] = "flat";
    TOKEN_FACTIONS_FRAME_STYLE["BELEVELED"] = "beveled";
    TOKEN_FACTIONS_FRAME_STYLE["BORDER"] = "border";
})(TOKEN_FACTIONS_FRAME_STYLE || (TOKEN_FACTIONS_FRAME_STYLE = {}));
export const dispositionKey = (token) => {
    const dispositionValue = parseInt(String(token.data.disposition), 10);
    let disposition;
    if (token.actor && token.actor.hasPlayerOwner && token.actor.type === 'character') {
        disposition = 'party-member';
    }
    else if (token.actor && token.actor.hasPlayerOwner) {
        disposition = 'party-npc';
    }
    else if (dispositionValue === 1) {
        disposition = 'friendly-npc';
    }
    else if (dispositionValue === 0) {
        disposition = 'neutral-npc';
    }
    else if (dispositionValue === -1) {
        disposition = 'hostile-npc';
    }
    return disposition;
};
export let BCC;
export let defaultColors;
export let dispositions;
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
        //@ts-ignore
        libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype.refresh', TokenPrototypeRefreshHandler, 'MIXED');
        TokenFactions.onInit(defaultColors, dispositions);
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
            TokenFactions.updateTokenFaction(tokenData);
        });
        Hooks.on('updateToken', (tokenData, data) => {
            TokenFactions.updateTokenFaction(tokenData);
        });
        Hooks.on('updateFolder', (tokenData, data) => {
            TokenFactions.updateTokenFaction(tokenData);
        });
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'overrideBorderGraphic')) {
            //@ts-ignore
            libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype._refreshBorder', newBorder, 'MIXED');
            //@ts-ignore
            libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype._getBorderColor', newBorderColor, 'MIXED');
        }
        else {
            //@ts-ignore
            libWrapper.register(TOKEN_FACTIONS_MODULE_NAME, 'Token.prototype.draw', TokenPrototypeDrawHandler, 'MIXED');
        }
        Hooks.on('renderTokenHUD', (app, html, data) => {
            TokenFactions.AddBorderToggle(app, html, data);
        });
        Hooks.on('createToken', (data) => {
            const token = getCanvas().tokens?.get(data._id);
            if (!token.owner) {
                token.cursor = 'default';
            }
        });
        getCanvas().tokens?.placeables.forEach((t) => {
            if (!t.owner)
                t.cursor = 'default';
        });
    }
};
// export const setupHooks = async () => {
// };
export const initHooks = async () => {
    warn('Init Hooks processing');
};
export const TokenPrototypeRefreshHandler = function (wrapped, ...args) {
    const tokenData = this;
    TokenFactions.updateTokenFaction(tokenData);
    return wrapped(...args);
};
export const TokenPrototypeDrawHandler = function (wrapped, ...args) {
    const token = this;
    TokenFactions.updateTokenFaction(token.data);
    return wrapped(...args);
};
export const newBorder = function (wrapped, ...args) {
    //@ts-ignore
    const token = this;
    //@ts-ignore
    const borderColor = this._getBorderColor();
    //@ts-ignore
    TokenFactions.updateTokenFaction(token.data);
    return;
    // return wrapped(args);
};
export const newBorderColor = function (wrapped, ...args) {
    //@ts-ignore
    const token = this;
    return TokenFactions.updateTokenFaction(token.data);
    //return wrapped(args);
};
