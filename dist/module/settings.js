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
        throw new Error("Canvas Is Not Initialized");
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
        throw new Error("Game Is Not Initialized");
    }
    return game;
}
export const registerSettings = function () {
    // ==========================
    // TOKEN FACTIONS
    // ==========================
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, "tokenFactionsEnabled", {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + ".tokenFactionsEnabled.name"),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + ".tokenFactionsEnabled.hint"),
        default: true,
        type: Boolean,
        scope: 'world',
        config: true
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'color-from', {
        name: 'Generate Token Faction Color From',
        scope: 'world',
        config: true,
        default: 'token-disposition',
        type: String,
        choices: {
            'token-disposition': 'Default: A Token\'s Disposition',
            'actor-folder-color': 'An Actor\'s Folder Color',
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
};
