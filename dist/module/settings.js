import { i18n } from "../main.js";
export const TOKEN_FACTIONS_MODULE_NAME = 'token-factions';
/**
 * Because typescript doesn’t know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it’s typed as declare let canvas: Canvas | {ready: false}.
 * That’s why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because a „no canvas“ mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
export function getCanvas() {
    if (!(canvas instanceof Canvas) || !canvas.ready) {
        throw new Error('Canvas Is Not Initialized');
    }
    return canvas;
}
/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
export function getGame() {
    if (!(game instanceof Game)) {
        throw new Error('Game Is Not Initialized');
    }
    return game;
}
export const registerSettings = function () {
    // ==========================
    // TOKEN FACTIONS
    // ==========================
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'tokenFactionsEnabled', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.tokenFactionsEnabled.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.tokenFactionsEnabled.hint'),
        default: true,
        type: Boolean,
        scope: 'world',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "pixiFactionsEnabled", {
        name: 'Enable the sub feature with pixi texture',
        hint: 'Standard use, customize the pixi texture of the token (there can be some module conflict), need reload',
        scope: 'world',
        type: Boolean,
        default: true,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'color-from', {
        name: 'Generate Token Faction Color From',
        scope: 'world',
        config: true,
        default: 'token-disposition',
        type: String,
        choices: {
            'token-disposition': "Default: A Token's Disposition",
            'actor-folder-color': "An Actor's Folder Color",
            'custom-disposition': 'A Custom Color Set For Token Disposition',
        },
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'draw-frames-by-default', {
        name: 'Draw Token Frames By Default?',
        hint: 'Token frames (rings) are layered above token graphics. Enable this if you primarily use round tokens. Disable it if you primarily use irregularly-shaped tokens.',
        scope: 'world',
        config: true,
        default: true,
        type: Boolean,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'frame-style', {
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
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'frame-width', {
        name: 'Frame Width (Percent of Grid Unit)',
        scope: 'world',
        config: true,
        default: 7.5,
        type: Number,
        //@ts-ignore
        range: {
            min: 0,
            max: 10,
            step: 0.5,
        },
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'base-opacity', {
        name: 'Base Opacity',
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
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'frame-opacity', {
        name: 'Frame Opacity',
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
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "borderFactionsEnabled", {
        name: 'Enable the sub feature with border',
        hint: 'Customize the border of the token (avoid many module conflict), need reload',
        scope: 'world',
        type: Boolean,
        default: false,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "stepLevel", {
        name: 'Gradient Step Level',
        hint: 'How many individual colors are part of the gradient',
        scope: 'world',
        type: Number,
        default: 10,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "borderWidth", {
        name: 'Border Width',
        hint: 'Override border width',
        scope: 'client',
        type: Number,
        default: 4,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "borderOffset", {
        name: 'Border Offset',
        hint: 'Customize border offset',
        scope: 'client',
        type: Number,
        default: 0,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "circleBorders", {
        name: 'Circular Borders',
        scope: 'client',
        type: Boolean,
        default: false,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "enableHud", {
        name: 'Border HUD element',
        hint: 'Add Token HUD element to disable/enable borders',
        scope: 'world',
        type: Boolean,
        default: true,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "hudPos", {
        name: 'Border Control HUD Position',
        scope: 'world',
        type: String,
        default: ".right",
        choices: {
            ".right": "Right",
            ".left": "Left",
        },
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "circularNameplate", {
        name: 'Circular Nameplates',
        hint: "Requires a refresh",
        scope: 'world',
        type: Boolean,
        default: false,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "circularNameplateRadius", {
        name: 'Circular Nameplates Radius',
        hint: "Requires a refresh",
        scope: 'world',
        type: Number,
        default: 0,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "nameplateOffset", {
        name: 'Nameplate Y Offset',
        hint: "Requires a refresh",
        scope: 'world',
        type: Number,
        default: 0,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "plateFont", {
        name: 'Nameplate Font',
        hint: "Requires a refresh",
        scope: 'world',
        type: String,
        choices: {
            "arial": "Arial",
            "arial black": "Arial Black",
            "comic sans ms": "Comic Sans MS",
            "courier new": "Courier New",
            "georgia": "Georgia",
            "helvetica": "Helvetica",
            "impact": "Impact",
            "signika": "Signika",
            "tahoma": "Tahoma",
            "times new roman": "Times New Roman",
            "verdana": "Verdana"
        },
        default: "signika",
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "sizeMultiplier", {
        name: 'Nameplate Font Size',
        hint: "Requires a refresh",
        scope: 'world',
        type: Number,
        default: 1,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "plateConsistency", {
        name: 'Nameplate Consistency',
        hint: "Attempts to keep nameplates the same size across different grid sizes",
        scope: 'world',
        type: Boolean,
        default: false,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "controlledColor", {
        name: 'Color: Controlled',
        scope: 'client',
        type: String,
        default: "#FF9829",
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "controlledColorEx", {
        name: 'Color: Controlled External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "hostileColor", {
        name: 'Color: Hostile',
        scope: 'client',
        type: String,
        default: "#E72124",
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "hostileColorEx", {
        name: 'Color: Hostile External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "friendlyColor", {
        name: 'Color: Friendly',
        scope: 'client',
        type: String,
        default: "#43DFDF",
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "friendlyColorEx", {
        name: 'Color: Friendly External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "neutralColor", {
        name: 'Color: Neutral',
        scope: 'client',
        type: String,
        default: "#F1D836",
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "neutralColorEx", {
        name: 'Color: Neutral External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "partyColor", {
        name: 'Color: Party',
        scope: 'client',
        type: String,
        default: "#33BC4E",
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "partyColorEx", {
        name: 'Color: Party External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
};
