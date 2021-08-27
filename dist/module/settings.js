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
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.tokenFactionsEnabled.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.tokenFactionsEnabled.hint'),
        default: true,
        type: Boolean,
        scope: 'world',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'color-from', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.color-from.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.color-from.hint'),
        scope: 'world',
        config: true,
        default: 'token-disposition',
        type: String,
        choices: {
            'token-disposition': i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.color-from.opt.token-disposition'),
            'actor-folder-color': i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.color-from.opt.actor-folder-color'),
            'custom-disposition': i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.color-from.opt.custom-disposition'),
        },
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'base-opacity', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.base-opacity.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.base-opacity.hint'),
        scope: 'world',
        config: true,
        default: 0.5,
        type: Number,
        //@ts-ignore
        range: {
            min: 0,
            max: 1,
            step: 0.05,
        },
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'fillTexture', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.fillTexture.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.fillTexture.hint'),
        scope: 'world',
        type: Boolean,
        default: true,
        config: true,
    });
    // ===============================
    // SUB FEATURE STANDARD
    // ===============================
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'pixiFactionsEnabled', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.pixiFactionsEnabled.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.pixiFactionsEnabled.hint'),
        scope: 'world',
        type: Boolean,
        default: false,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'draw-frames-by-default', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.draw-frames-by-default.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.draw-frames-by-default.hint'),
        scope: 'world',
        config: true,
        default: true,
        type: Boolean,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'frame-style', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.frame-style.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.frame-style.hint'),
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
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.frame-width.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.frame-width.hint'),
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
    // TODO MOVE THIS FOR BOTH THE FEATURE ????
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'frame-opacity', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.frame-opacity.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.frame-opacity.hint'),
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
    // ===============================
    // SUB FEATURE ALTERNATIVE BORDER
    // ===============================
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'borderFactionsEnabled', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.borderFactionsEnabled.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.borderFactionsEnabled.hint'),
        scope: 'world',
        type: Boolean,
        default: true,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME + '', 'removeBorders', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.removeBorders.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.removeBorders.hint'),
        scope: 'world',
        type: String,
        choices: {
            0: 'None',
            1: 'Non Owned',
            2: 'All',
        },
        default: '0',
        config: true,
    });
    // getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME + '', 'stepLevel', {
    //   name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.stepLevel.name'),
    //   hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.stepLevel.hint'),
    //   scope: 'world',
    //   type: Number,
    //   default: 10,
    //   config: true,
    // });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME + '', 'borderWidth', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.borderWidth.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.borderWidth.hint'),
        scope: 'client',
        type: Number,
        default: 4,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME + '', 'borderOffset', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.borderOffset.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.borderOffset.hint'),
        scope: 'client',
        type: Number,
        default: 0,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME + '', 'circleBorders', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.circleBorders.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.circleBorders.hint'),
        scope: 'client',
        type: Boolean,
        default: false,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME + '', 'enableHud', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.enableHud.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.enableHud.hint'),
        scope: 'world',
        type: Boolean,
        default: true,
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME + '', 'hudPos', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.hudPos.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.hudPos.hint'),
        scope: 'world',
        type: String,
        default: '.right',
        choices: {
            '.right': 'Right',
            '.left': 'Left',
        },
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'controlledColor', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.controlledColor.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.controlledColor.hint'),
        scope: 'client',
        type: String,
        default: '#FF9829',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'controlledColorEx', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.controlledColorEx.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.controlledColorEx.hint'),
        scope: 'client',
        type: String,
        default: '#000000',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'hostileColor', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.hostileColor.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.hostileColor.hint'),
        scope: 'client',
        type: String,
        default: '#E72124',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'hostileColorEx', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.hostileColorEx.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.hostileColorEx.hint'),
        scope: 'client',
        type: String,
        default: '#000000',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColor', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.friendlyColor.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.friendlyColor.hint'),
        scope: 'client',
        type: String,
        default: '#43DFDF',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColorEx', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.friendlyColorEx.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.friendlyColorEx.hint'),
        scope: 'client',
        type: String,
        default: '#000000',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'neutralColor', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.neutralColor.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.neutralColor.hint'),
        scope: 'client',
        type: String,
        default: '#F1D836',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'neutralColorEx', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.neutralColorEx.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.neutralColorEx.hint'),
        scope: 'client',
        type: String,
        default: '#000000',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'partyColor', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.partyColor.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.partyColor.hint'),
        scope: 'client',
        type: String,
        default: '#33BC4E',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'partyColorEx', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.partyColorEx.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.partyColorEx.hint'),
        scope: 'client',
        type: String,
        default: '#000000',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'targetColor', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.targetColor.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.targetColor.hint'),
        scope: 'client',
        type: String,
        default: '#FF9829',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'targetColorEx', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.targetColorEx.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.targetColorEx.hint'),
        scope: 'client',
        type: String,
        default: '#000000',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'actorFolderColorEx', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.actorFolderColorEx.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.actorFolderColorEx.hint'),
        scope: 'client',
        type: String,
        default: '#000000',
        config: true,
    });
    getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, 'customDispositionColorEx', {
        name: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.customDispositionColorEx.name'),
        hint: i18n(TOKEN_FACTIONS_MODULE_NAME + '.setting.customDispositionColorEx.hint'),
        scope: 'client',
        type: String,
        default: '#000000',
        config: true,
    });
};
