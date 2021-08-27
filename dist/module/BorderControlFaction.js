import { defaultColors, dispositionKey, TOKEN_FACTIONS_FLAGS } from "./Hooks.js";
import { getCanvas, getGame, TOKEN_FACTIONS_MODULE_NAME } from "./settings.js";
/*
 * The allowed Token disposition types
 * HOSTILE - Displayed as an enemy with a red border
 * NEUTRAL - Displayed as neutral with a yellow border
 * FRIENDLY - Displayed as an ally with a cyan border
 */
const TOKEN_DISPOSITIONS = {
    HOSTILE: -1,
    NEUTRAL: 0,
    FRIENDLY: 1,
};
export class BCconfig {
    constructor() {
        // this.symbaroum = {
        //   value: 'actor.data.data.health.toughness.value',
        //   max: 'actor.data.data.health.toughness.max',
        //   tempMax: undefined,
        //   temp: undefined,
        // };
        // this.dnd5e = {
        //   value: 'actor.data.data.attributes.hp.value',
        //   max: 'actor.data.data.attributes.hp.max',
        //   tempMax: undefined,
        //   temp: 'actor.data.data.attributes.hp.temp',
        // };
        // this.pf2e = {
        //   value: 'actor.data.data.attributes.hp.value',
        //   max: 'actor.data.data.attributes.hp.max',
        //   tempMax: 'actor.data.data.attributes.hp.tempmax',
        //   temp: 'actor.data.data.attributes.hp.temp',
        // };
        // this.pf1 = {
        //   value: 'actor.data.data.attributes.hp.value',
        //   max: 'actor.data.data.attributes.hp.max',
        //   tempMax: undefined,
        //   temp: 'actor.data.data.attributes.hp.temp',
        // };
        // this.swade = {
        //   value: 'actor.data.data.wounds.value',
        //   max: 'actor.data.data.wounds.max',
        //   tempMax: undefined,
        //   temp: undefined,
        // };
        // this.stepLevel = <string>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'stepLevel');
        // this.endColor = hexToRGB(<number>colorStringToHex(<string>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientA")))
        // this.startColor = hexToRGB(<number>colorStringToHex(<string>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientB")))
        // this.tempColor = hexToRGB(<number>colorStringToHex(<string>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientC")))
        // this.colorArray = BorderFrameFaction.interpolateColors(`rgb(${this.startColor[0] * 255}, ${this.startColor[1] * 255}, ${this.startColor[2] * 255})`, `rgb(${this.endColor[0] * 255}, ${this.endColor[1] * 255}, ${this.endColor[2] * 255})`, this.stepLevel)
        // this.tempArray = BorderFrameFaction.interpolateColors(`rgb(${this.endColor[0] * 255}, ${this.endColor[1] * 255}, ${this.endColor[2] * 255})`, `rgb(${this.tempColor[0] * 255}, ${this.tempColor[1] * 255}, ${this.tempColor[2] * 255})`, this.stepLevel)
        // symbaroum = {};
        // dnd5e = {};
        // pf2e = {};
        // pf1 = {};
        // swade = {};
        // stepLevel = '';
        // endColor:[r: number, g: number, b: number];
        // startColor:[r: number, g: number, b: number];
        // tempColor:[r: number, g: number, b: number];
        // colorArray:number[][] = [];
        // tempArray:number[][] = [];
        this.currentSystem = '';
        this.currentSystem = this[getGame().system.id];
    }
}
export class BorderFrameFaction {
    static AddBorderToggle(app, html, data) {
        if (!getGame().user?.isGM) {
            return;
        }
        if (!getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'enableHud')) {
            return;
        }
        const buttonPos = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hudPos');
        const borderButton = `<div class="control-icon factionBorder ${app.object.getFlag(TOKEN_FACTIONS_MODULE_NAME, TOKEN_FACTIONS_FLAGS.FACTION_NO_BORDER) ? 'active' : ''}" title="Toggle Faction Border"> <i class="fas fa-angry"></i></div>`;
        const Pos = html.find(buttonPos);
        Pos.append(borderButton);
        html.find('.factionBorder').click(this.ToggleBorder.bind(app));
    }
    static async ToggleBorder(event) {
        //@ts-ignore
        const border = this.object.document.getFlag(TOKEN_FACTIONS_MODULE_NAME, TOKEN_FACTIONS_FLAGS.FACTION_NO_BORDER);
        //@ts-ignore
        await this.object.document.setFlag(TOKEN_FACTIONS_MODULE_NAME, TOKEN_FACTIONS_FLAGS.FACTION_NO_BORDER, !border);
        event.currentTarget.classList.toggle('active', !border);
    }
    static newBorder() {
        // if(!BCC) BCC = new BCconfig()
        //@ts-ignore
        // this.border.clear(); // is in drawBorderFaction
        //@ts-ignore
        const borderColor = this._getBorderColor();
        //@ts-ignore
        BorderFrameFaction.drawBorderFaction(this, borderColor);
        return;
    }
    static clamp(value, max, min) {
        return Math.min(Math.max(value, min), max);
    }
    static newBorderColor() {
        //@ts-ignore
        const token = this;
        // const colorFrom = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'color-from');
        // let color;
        // if (colorFrom === 'token-disposition') {
        //   const disposition = dispositionKey(token);
        //   if (disposition) {
        //     color = defaultColors[disposition];
        //   }
        // } else if (colorFrom === 'actor-folder-color') {
        //   if (token.actor && token.actor.folder && token.actor.folder.data && token.actor.folder.data.color) {
        //     color = token.actor.folder.data.color;
        //   }
        // } else {
        //   // colorFrom === 'custom-disposition'
        //   const disposition = dispositionKey(token);
        //   if (disposition) {
        //     color = <string>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, `custom-${disposition}-color`);
        //   }
        // }
        // const overrides = {
        //   CONTROLLED: {
        //     INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'controlledColor')).substr(1), 16),
        //     EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'controlledColorEx')).substr(1), 16),
        //   },
        //   FRIENDLY: {
        //     INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColor')).substr(1), 16),
        //     EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColorEx')).substr(1), 16),
        //   },
        //   NEUTRAL: {
        //     INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'neutralColor')).substr(1), 16),
        //     EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'neutralColorEx')).substr(1), 16),
        //   },
        //   HOSTILE: {
        //     INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hostileColor')).substr(1), 16),
        //     EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hostileColorEx')).substr(1), 16),
        //   },
        //   PARTY: {
        //     INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColor')).substr(1), 16),
        //     EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColorEx')).substr(1), 16),
        //   },
        //   ACTOR_FOLDER_COLOR: {
        //     INT: parseInt(String(color).substr(1), 16),
        //     EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'actorFolderColorEx')).substr(1), 16),
        //   },
        //   CUSTOM_DISPOSITION: {
        //     INT: parseInt(String(color).substr(1), 16),
        //     EX: parseInt(
        //       String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'customDispositionColorEx')).substr(1),
        //       16,
        //     ),
        //   },
        // };
        // if (colorFrom === 'token-disposition') {
        //   //@ts-ignore
        //   //if (token._controlled) return overrides.CONTROLLED;
        //   //@ts-ignore
        //   //else if (token._hover) {
        //   const disPath = isNewerVersion(getGame().data.version, '0.8.0') ? CONST.TOKEN_DISPOSITIONS : TOKEN_DISPOSITIONS;
        //   //@ts-ignore
        //   const d = parseInt(token.data.disposition);
        //   //@ts-ignore
        //   if (!getGame().user?.isGM && token.owner) return overrides.CONTROLLED;
        //   //@ts-ignore
        //   else if (token.actor?.hasPlayerOwner) return overrides.PARTY;
        //   else if (d === disPath.FRIENDLY) return overrides.FRIENDLY;
        //   else if (d === disPath.NEUTRAL) return overrides.NEUTRAL;
        //   else return overrides.HOSTILE;
        //   //}
        //   //else return null;
        // } else if (colorFrom === 'actor-folder-color') {
        //   return overrides.ACTOR_FOLDER_COLOR;
        // } else {
        //   // colorFrom === 'custom-disposition'
        //   return overrides.CUSTOM_DISPOSITION;
        // }
        return BorderFrameFaction.colorBorderFaction(token);
    }
    static componentToHex(c) {
        const hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }
    static rgbToHex(A) {
        if (A[0] === undefined || A[1] === undefined || A[2] === undefined)
            console.error('RGB color invalid');
        return ('#' +
            BorderFrameFaction.componentToHex(A[0]) +
            BorderFrameFaction.componentToHex(A[1]) +
            BorderFrameFaction.componentToHex(A[2]));
    }
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            }
            : null;
    }
    static interpolateColor(color1, color2, factor) {
        if (arguments.length < 3) {
            factor = 0.5;
        }
        const result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    }
    // My function to interpolate between two colors completely, returning an array
    static interpolateColors(color1, color2, steps) {
        const stepFactor = 1 / (steps - 1), interpolatedColorArray = [];
        color1 = color1.match(/\d+/g).map(Number);
        color2 = color2.match(/\d+/g).map(Number);
        for (let i = 0; i < steps; i++) {
            interpolatedColorArray.push(BorderFrameFaction.interpolateColor(color1, color2, stepFactor * i));
        }
        return interpolatedColorArray;
    }
    static refreshAll() {
        getCanvas().tokens?.placeables.forEach((t) => t.draw());
    }
    // ADDED
    static async updateTokensBorder(tokenData) {
        const currentTokenID = tokenData?.id ? tokenData?.id : tokenData?._id;
        const tokens = [];
        const tokenDoc = getCanvas().tokens?.get(currentTokenID)?.document;
        if (!tokenDoc) {
            const actorID = currentTokenID; // getGame().actors?.get(currentTokenID)?.id;
            const scene = getGame().scenes?.get(getGame().user?.viewedScene);
            if (scene) {
                scene.data.tokens.forEach((tokenTmp) => {
                    if ((tokenTmp.actor && tokenTmp.actor.id === actorID)) {
                        tokens.push(tokenTmp);
                    }
                });
            }
        }
        else {
            tokens.push(tokenDoc);
        }
        tokens.forEach((tokenDoc) => {
            if (tokenDoc) {
                const tokenID = tokenDoc.id;
                const sceneID = getCanvas().tokens?.get(tokenDoc.id).scene.id;
                const specifiedScene = getGame().scenes?.get(sceneID);
                if (specifiedScene) {
                    if (!specifiedScene) {
                        return;
                    }
                    tokenDoc = specifiedScene.data.tokens.find((tokenTmp) => {
                        return (tokenTmp.id === tokenID);
                    });
                }
                if (!tokenDoc) {
                    let foundToken = null;
                    getGame().scenes?.find((sceneTmp) => {
                        // getTokenForScene(scene, tokenID);
                        if (!sceneTmp) {
                            foundToken = null;
                        }
                        foundToken = sceneTmp.data.tokens.find((token) => {
                            return token.id === tokenID;
                        });
                        return !!foundToken;
                    });
                    //@ts-ignore
                    tokenDoc = foundToken;
                }
            }
            if (!tokenDoc) {
                // Is not in the current canvas
                return;
            }
            // TokenDocument to Token
            //@ts-ignore
            const token = tokenDoc._object;
            const borderColor = BorderFrameFaction.colorBorderFaction(token);
            BorderFrameFaction.drawBorderFaction(token, borderColor);
        });
        return;
    }
    static colorBorderFaction(token) {
        const colorFrom = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'color-from');
        let color;
        let icon;
        if (colorFrom === 'token-disposition') {
            const disposition = dispositionKey(token);
            if (disposition) {
                color = defaultColors[disposition];
            }
        }
        else if (colorFrom === 'actor-folder-color') {
            if (token.actor && token.actor.folder && token.actor.folder.data) {
                color = token.actor.folder.data.color;
                //@ts-ignore
                icon = token.actor.folder.data.icon;
            }
        }
        else {
            // colorFrom === 'custom-disposition'
            const disposition = dispositionKey(token);
            if (disposition) {
                color = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, `custom-${disposition}-color`);
            }
        }
        const overrides = {
            CONTROLLED: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'controlledColor')).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'controlledColorEx')).substr(1), 16),
                ICON: ""
            },
            FRIENDLY: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColor')).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColorEx')).substr(1), 16),
                ICON: ""
            },
            NEUTRAL: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'neutralColor')).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'neutralColorEx')).substr(1), 16),
                ICON: ""
            },
            HOSTILE: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hostileColor')).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hostileColorEx')).substr(1), 16),
                ICON: ""
            },
            PARTY: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColor')).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColorEx')).substr(1), 16),
                ICON: ""
            },
            ACTOR_FOLDER_COLOR: {
                INT: parseInt(String(color).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'actorFolderColorEx')).substr(1), 16),
                ICON: icon ? String(icon) : "",
            },
            CUSTOM_DISPOSITION: {
                INT: parseInt(String(color).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'customDispositionColorEx')).substr(1), 16),
                ICON: ""
            },
        };
        let borderColor = { INT: 0, EX: 0, ICON: "" };
        if (colorFrom === 'token-disposition') {
            //@ts-ignore
            //if (token._controlled) return overrides.CONTROLLED;
            //@ts-ignore
            //else if (token._hover) {
            const disPath = isNewerVersion(getGame().data.version, '0.8.0') ? CONST.TOKEN_DISPOSITIONS : TOKEN_DISPOSITIONS;
            //@ts-ignore
            const d = parseInt(token.data.disposition);
            //@ts-ignore
            if (!getGame().user?.isGM && token.owner)
                borderColor = overrides.CONTROLLED;
            //@ts-ignore
            else if (token.actor?.hasPlayerOwner)
                borderColor = overrides.PARTY;
            else if (d === disPath.FRIENDLY)
                borderColor = overrides.FRIENDLY;
            else if (d === disPath.NEUTRAL)
                borderColor = overrides.NEUTRAL;
            else
                borderColor = overrides.HOSTILE;
            //}
            //else return null;
        }
        else if (colorFrom === 'actor-folder-color') {
            borderColor = overrides.ACTOR_FOLDER_COLOR;
        }
        else {
            // colorFrom === 'custom-disposition'
            borderColor = overrides.CUSTOM_DISPOSITION;
        }
        return borderColor;
    }
    static drawBorderFaction(token, borderColor) {
        // SECOND PART
        // if(!BCC) BCC = new BCconfig()
        //@ts-ignore
        token.border.clear();
        if (!borderColor) {
            return;
        }
        switch (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'removeBorders')) {
            case '0':
                break;
            //@ts-ignore
            case '1':
                if (!token.owner)
                    return;
                break;
            case '2':
                return;
        }
        //@ts-ignore
        if (token.document.getFlag(TOKEN_FACTIONS_MODULE_NAME, TOKEN_FACTIONS_FLAGS.FACTION_NO_BORDER)) {
            return;
        }
        if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
            return;
        }
        const t = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderWidth') ||
            CONFIG.Canvas.objectBorderThickness;
        const baseOpacity = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'base-opacity');
        // TODO
        // Prepare texture for faction symbol
        // if(borderColor.ICON) {
        // }
        // Draw Hex border for size 1 tokens on a hex grid
        const gt = CONST.GRID_TYPES;
        const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'circleBorders')) {
            const p = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
            const h = Math.round(t / 2);
            const o = Math.round(h / 2);
            if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'fillTexture')) {
                //@ts-ignore
                token.border
                    .beginFill(borderColor.EX, baseOpacity)
                    .drawCircle(token.w / 2, token.h / 2, token.w / 2 + t + p)
                    .beginTextureFill({ texture: PIXI.Texture.EMPTY, color: borderColor.EX, alpha: 1 })
                    .lineStyle(t, borderColor.EX, 0.8)
                    .endFill()
                    .beginFill(borderColor.EX)
                    .lineStyle(t, borderColor.EX, 0.8)
                    .drawCircle(token.w / 2, token.h / 2, token.w / 2 + t + p)
                    .endFill();
                ;
                //@ts-ignore
                token.border
                    .beginFill(borderColor.INT, baseOpacity)
                    .drawCircle(token.w / 2, token.h / 2, token.w / 2 + h + t / 2 + p)
                    .beginTextureFill({ texture: PIXI.Texture.EMPTY, color: borderColor.INT, alpha: 1 })
                    .lineStyle(t / 2, borderColor.INT, 1.0)
                    .endFill()
                    .beginFill(borderColor.INT)
                    .lineStyle(h, borderColor.INT, 1.0)
                    .drawCircle(token.w / 2, token.h / 2, token.w / 2 + h + t / 2 + p)
                    .endFill();
                ;
            }
            else {
                //@ts-ignore
                token.border
                    .beginFill(borderColor.EX)
                    .lineStyle(t, borderColor.EX, 0.8)
                    .drawCircle(token.w / 2, token.h / 2, token.w / 2 + t + p)
                    .endFill();
                //@ts-ignore
                token.border
                    .beginFill(borderColor.INT)
                    .lineStyle(h, borderColor.INT, 1.0)
                    .drawCircle(token.w / 2, token.h / 2, token.w / 2 + h + t / 2 + p)
                    .endFill();
            }
        }
        //@ts-ignore
        else if (hexTypes.includes(getCanvas().grid?.type) && token.data.width === 1 && token.data.height === 1) {
            const p = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
            const q = Math.round(p / 2);
            //@ts-ignore
            const polygon = getCanvas().grid?.grid?.getPolygon(-1.5 - q, -1.5 - q, token.w + 2 + p, token.h + 2 + p);
            if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'fillTexture')) {
                //@ts-ignore
                token.border
                    .beginFill(borderColor.EX, baseOpacity)
                    .drawPolygon(polygon)
                    .beginTextureFill({ texture: PIXI.Texture.EMPTY, color: borderColor.EX, alpha: 1 })
                    .lineStyle(t, borderColor.EX, 0.8)
                    .endFill()
                    .beginFill(borderColor.EX)
                    .lineStyle(t, borderColor.EX, 0.8)
                    .drawPolygon(polygon)
                    .endFill();
                ;
                //@ts-ignore
                token.border
                    .beginFill(borderColor.INT, baseOpacity)
                    .drawPolygon(polygon)
                    .beginTextureFill({ texture: PIXI.Texture.EMPTY, color: borderColor.INT, alpha: 1 })
                    .lineStyle(t / 2, borderColor.INT, 1.0)
                    .endFill()
                    .beginFill(borderColor.INT)
                    .lineStyle(t / 2, borderColor.INT, 1.0)
                    .drawPolygon(polygon)
                    .endFill();
                ;
            }
            else {
                //@ts-ignore
                token.border
                    .beginFill(borderColor.EX)
                    .lineStyle(t, borderColor.EX, 0.8)
                    .drawPolygon(polygon)
                    .endFill();
                //@ts-ignore
                token.border
                    .beginFill(borderColor.INT)
                    .lineStyle(t / 2, borderColor.INT, 1.0)
                    .drawPolygon(polygon)
                    .endFill();
            }
        }
        // Otherwise Draw Square border
        else {
            const p = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
            const q = Math.round(p / 2);
            const h = Math.round(t / 2);
            const o = Math.round(h / 2);
            if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'fillTexture')) {
                //@ts-ignore
                token.border
                    .beginFill(borderColor.EX, baseOpacity)
                    .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3)
                    .beginTextureFill({ texture: PIXI.Texture.EMPTY, color: borderColor.EX, alpha: 1 })
                    .lineStyle(t, borderColor.EX, 0.8)
                    .endFill()
                    .lineStyle(t, borderColor.EX, 0.8)
                    .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3);
                //@ts-ignore
                token.border
                    .beginFill(borderColor.INT, baseOpacity)
                    .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3)
                    .beginTextureFill({ texture: PIXI.Texture.EMPTY, color: borderColor.INT, alpha: 1 })
                    .lineStyle(h, borderColor.INT, 1.0)
                    .endFill()
                    .lineStyle(h, borderColor.INT, 1.0)
                    .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3);
            }
            else {
                //@ts-ignore
                token.border
                    .lineStyle(t, borderColor.EX, 0.8)
                    .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3);
                //@ts-ignore
                token.border
                    .lineStyle(h, borderColor.INT, 1.0)
                    .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3);
            }
        }
    }
}
// export const TokenPrototypeRefreshBorderHandler = function (wrapped, ...args) {
//   const tokenData = this as TokenData;
//   BorderFrameFaction.updateTokensBorder(tokenData);
//   return wrapped(...args);
// };
