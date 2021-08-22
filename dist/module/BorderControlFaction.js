import { defaultColors } from "./Hooks.js";
import { getCanvas, getGame, TOKEN_FACTIONS_MODULE_NAME } from "./settings.js";
import { dispositionKey } from "./tokenFactions.js";
/*
* The allowed Token disposition types
* HOSTILE - Displayed as an enemy with a red border
* NEUTRAL - Displayed as neutral with a yellow border
* FRIENDLY - Displayed as an ally with a cyan border
*/
const TOKEN_DISPOSITIONS = {
    HOSTILE: -1,
    NEUTRAL: 0,
    FRIENDLY: 1
};
export class BCconfig {
    constructor() {
        this.symbaroum = {};
        this.dnd5e = {};
        this.pf2e = {};
        this.pf1 = {};
        this.swade = {};
        this.stepLevel = "";
        this.colorArray = [];
        this.tempArray = [];
        this.currentSystem = "";
        this.symbaroum = {
            value: "actor.data.data.health.toughness.value",
            max: "actor.data.data.health.toughness.max",
            tempMax: undefined,
            temp: undefined
        };
        this.dnd5e = {
            value: "actor.data.data.attributes.hp.value",
            max: "actor.data.data.attributes.hp.max",
            tempMax: undefined,
            temp: "actor.data.data.attributes.hp.temp"
        };
        this.pf2e = {
            value: "actor.data.data.attributes.hp.value",
            max: "actor.data.data.attributes.hp.max",
            tempMax: "actor.data.data.attributes.hp.tempmax",
            temp: "actor.data.data.attributes.hp.temp"
        };
        this.pf1 = {
            value: "actor.data.data.attributes.hp.value",
            max: "actor.data.data.attributes.hp.max",
            tempMax: undefined,
            temp: "actor.data.data.attributes.hp.temp"
        };
        this.swade = {
            value: "actor.data.data.wounds.value",
            max: "actor.data.data.wounds.max",
            tempMax: undefined,
            temp: undefined
        };
        this.stepLevel = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "stepLevel");
        this.endColor = hexToRGB(colorStringToHex(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientA")));
        this.startColor = hexToRGB(colorStringToHex(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientB")));
        this.tempColor = hexToRGB(colorStringToHex(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientC")));
        this.colorArray = BorderFrameFaction.interpolateColors(`rgb(${this.startColor[0] * 255}, ${this.startColor[1] * 255}, ${this.startColor[2] * 255})`, `rgb(${this.endColor[0] * 255}, ${this.endColor[1] * 255}, ${this.endColor[2] * 255})`, this.stepLevel);
        this.tempArray = BorderFrameFaction.interpolateColors(`rgb(${this.endColor[0] * 255}, ${this.endColor[1] * 255}, ${this.endColor[2] * 255})`, `rgb(${this.tempColor[0] * 255}, ${this.tempColor[1] * 255}, ${this.tempColor[2] * 255})`, this.stepLevel);
        this.currentSystem = this[getGame().system.id];
    }
}
export class BorderFrameFaction {
    static AddBorderToggle(app, html, data) {
        if (!getGame().user?.isGM)
            return;
        if (!getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "enableHud"))
            return;
        const buttonPos = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "hudPos");
        const borderButton = `<div class="control-icon border ${app.object.data.flags[TOKEN_FACTIONS_MODULE_NAME]?.noBorder ? "active" : ""}" title="Toggle Border"> <i class="fas fa-helmet-battle"></i></div>`;
        const Pos = html.find(buttonPos);
        Pos.append(borderButton);
        html.find('.border').click(this.ToggleBorder.bind(app));
    }
    static async ToggleBorder(event) {
        //@ts-ignore
        const border = this.object.document.getFlag(TOKEN_FACTIONS_MODULE_NAME, "noBorder");
        //@ts-ignore
        await this.object.document.setFlag(TOKEN_FACTIONS_MODULE_NAME, "noBorder", !border);
        event.currentTarget.classList.toggle("active", !border);
    }
    static newBorder() {
        // if(!BCC) BCC = new BCconfig()
        //@ts-ignore
        this.border.clear();
        //@ts-ignore
        const borderColor = this._getBorderColor();
        if (!borderColor)
            return;
        switch (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "removeBorders")) {
            case "0": break;
            //@ts-ignore
            case "1":
                if (!this.owner)
                    return;
                break;
            case "2": return;
        }
        //@ts-ignore
        if (this.data.flags[TOKEN_FACTIONS_MODULE_NAME]?.noBorder) {
            return;
        }
        if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
            return;
        }
        const t = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "borderWidth") || CONFIG.Canvas.objectBorderThickness;
        // DISABLED
        // if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradient")) {
        //     const systemPath = BCC.currentSystem
        //     const stepLevel = BCC.stepLevel
        //     const hpMax = getProperty(this, systemPath.max) + (getProperty(this, systemPath.tempMax) ?? 0)
        //     const hpValue = getProperty(this, systemPath.value)
        //     const hpDecimal = parseInt(String(BorderFrame.clamp((hpValue / hpMax) * stepLevel, stepLevel, 1))) || 1
        //     const color = BorderFrame.rgbToHex(BCC.colorArray[hpDecimal - 1])
        //     borderColor.INT = parseInt(color.substr(1), 16)
        //     if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tempHPgradient") && getProperty(this, systemPath.temp) > 0) {
        //         const tempValue = getProperty(this, systemPath.temp)
        //         const tempDecimal = parseInt(String(BorderFrame.clamp(tempValue / (hpMax / 2) * stepLevel, stepLevel, 1)))
        //         const tempEx = BorderFrame.rgbToHex(BCC.tempArray[tempDecimal - 1])
        //         borderColor.EX = parseInt(tempEx.substr(1), 16)
        //     }
        // }
        // Draw Hex border for size 1 tokens on a hex grid
        const gt = CONST.GRID_TYPES;
        const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "circleBorders")) {
            const p = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "borderOffset");
            const h = Math.round(t / 2);
            const o = Math.round(h / 2);
            //@ts-ignore
            this.border.lineStyle(t, borderColor.EX, 0.8).drawCircle(this.w / 2, this.h / 2, this.w / 2 + t + p);
            //@ts-ignore
            this.border.lineStyle(h, borderColor.INT, 1.0).drawCircle(this.w / 2, this.h / 2, this.w / 2 + h + t / 2 + p);
        }
        //@ts-ignore
        else if (hexTypes.includes(getCanvas().grid?.type) && (this.data.width === 1) && (this.data.height === 1)) {
            const p = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "borderOffset");
            const q = Math.round(p / 2);
            //@ts-ignore
            const polygon = getCanvas().grid?.grid?.getPolygon(-1.5 - q, -1.5 - q, this.w + 2 + p, this.h + 2 + p);
            //@ts-ignore
            this.border.lineStyle(t, borderColor.EX, 0.8).drawPolygon(polygon);
            //@ts-ignore
            this.border.lineStyle(t / 2, borderColor.INT, 1.0).drawPolygon(polygon);
        }
        // Otherwise Draw Square border
        else {
            const p = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "borderOffset");
            const q = Math.round(p / 2);
            const h = Math.round(t / 2);
            const o = Math.round(h / 2);
            //@ts-ignore
            this.border.lineStyle(t, borderColor.EX, 0.8).drawRoundedRect(-o - q, -o - q, this.w + h + p, this.h + h + p, 3);
            //@ts-ignore
            this.border.lineStyle(h, borderColor.INT, 1.0).drawRoundedRect(-o - q, -o - q, this.w + h + p, this.h + h + p, 3);
        }
        return;
    }
    static clamp(value, max, min) {
        return Math.min(Math.max(value, min), max);
    }
    static newBorderColor() {
        //@ts-ignore
        const token = this;
        const colorFrom = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'color-from');
        let color;
        if (colorFrom === 'token-disposition') {
            const disposition = dispositionKey(token);
            if (disposition) {
                color = defaultColors[disposition];
            }
        }
        else if (colorFrom === 'actor-folder-color') {
            if (token.actor && token.actor.folder && token.actor.folder.data && token.actor.folder.data.color) {
                color = token.actor.folder.data.color;
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
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "controlledColor")).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "controlledColorEx")).substr(1), 16),
            },
            FRIENDLY: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "friendlyColor")).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "friendlyColorEx")).substr(1), 16),
            },
            NEUTRAL: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "neutralColor")).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "neutralColorEx")).substr(1), 16),
            },
            HOSTILE: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "hostileColor")).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "hostileColorEx")).substr(1), 16),
            },
            PARTY: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "partyColor")).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "partyColorEx")).substr(1), 16),
            },
            ACTOR_FOLDER_COLOR: {
                INT: parseInt(String(color).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "actorFolderColorEx")).substr(1), 16)
            },
            CUSTOM_DISPOSITION: {
                INT: parseInt(String(color).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "customDispositionColorEx")).substr(1), 16),
            }
        };
        if (colorFrom === 'token-disposition') {
            //@ts-ignore
            //if (token._controlled) return overrides.CONTROLLED;
            //@ts-ignore
            //else if (token._hover) {
            const disPath = isNewerVersion(getGame().data.version, "0.8.0") ? CONST.TOKEN_DISPOSITIONS : TOKEN_DISPOSITIONS;
            //@ts-ignore
            const d = parseInt(token.data.disposition);
            //@ts-ignore
            if (!getGame().user?.isGM && token.owner)
                return overrides.CONTROLLED;
            //@ts-ignore
            else if (token.actor?.hasPlayerOwner)
                return overrides.PARTY;
            else if (d === disPath.FRIENDLY)
                return overrides.FRIENDLY;
            else if (d === disPath.NEUTRAL)
                return overrides.NEUTRAL;
            else
                return overrides.HOSTILE;
            //}
            //else return null;
        }
        else if (colorFrom === 'actor-folder-color') {
            return overrides.ACTOR_FOLDER_COLOR;
        }
        else {
            // colorFrom === 'custom-disposition'
            return overrides.CUSTOM_DISPOSITION;
        }
    }
    // static newTarget() {
    //     const multiplier = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "targetSize");
    //     const INT = parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "targetColor")).substr(1), 16);
    //     const EX = parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "targetColorEx")).substr(1), 16);
    //     //@ts-ignore
    //     this.target.clear();
    //     //@ts-ignore
    //     if (!this.targeted.size) return;
    //     // Determine whether the current user has target and any other users
    //     //@ts-ignore
    //     const [others, user] = Array.from(this.targeted).partition(u => u === getGame().user);
    //     const userTarget = user.length;
    //     // For the current user, draw the target arrows
    //     if (userTarget) {
    //         if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "internatTarget")) {
    //             let p:number = -4; // padding
    //             let aw:number = -12 * multiplier; // arrow width
    //             //@ts-ignore
    //             let h:number = this.h; // token height
    //             let hh:number = h / 2; // half height
    //             //@ts-ignore
    //             let w:number = this.w; // token width
    //             let hw:number = w / 2; // half width
    //             let ah:number = <number>getCanvas().dimensions?.size / 3 * multiplier;
    //             //@ts-ignore
    //             this.target.beginFill(INT, 1.0).lineStyle(1, EX)
    //                 .drawPolygon([
    //                     -p - aw, hh,
    //                     -p, hh - ah,
    //                     -p, hh + ah
    //                 ])
    //                 .drawPolygon([
    //                     w + p + aw, hh,
    //                     w + p, hh - ah,
    //                     w + p, hh + ah
    //                 ])
    //                 .drawPolygon([
    //                     hw, -p - aw,
    //                     hw - ah, -p,
    //                     hw + ah, -p
    //                 ])
    //                 .drawPolygon([
    //                     hw, h + p + aw,
    //                     hw - ah, h + p,
    //                     hw + ah, h + p
    //                 ]);
    //         }
    //         else {
    //             let p = 4; // padding
    //             let aw = 12 * multiplier; // arrow width
    //             let h = this.h; // token height
    //             let hh = h / 2; // half height
    //             let w = this.w; // token width
    //             let hw = w / 2; // half width
    //             let ah = getCanvas().dimensions.size / 3 * multiplier;
    //             this.target.beginFill(INT, 1.0).lineStyle(1, EX)
    //                 .drawPolygon([
    //                     -p, hh,
    //                     -p - aw, hh - ah,
    //                     -p - aw, hh + ah
    //                 ])
    //                 .drawPolygon([
    //                     w + p, hh,
    //                     w + p + aw, hh - ah,
    //                     w + p + aw, hh + ah
    //                 ])
    //                 .drawPolygon([
    //                     hw, -p, hw - ah,
    //                     -p - aw, hw + ah,
    //                     -p - aw
    //                 ])
    //                 .drawPolygon([
    //                     hw, h + p,
    //                     hw - ah, h + p + aw,
    //                     hw + ah, h + p + aw
    //                 ]);
    //         }
    //     }
    //     // For other users, draw offset pips
    //     for (let [i, u] of others.entries()) {
    //         let color = colorStringToHex(u.data.color);
    //         this.target.beginFill(color, 1.0).lineStyle(2, 0x0000000).drawCircle(2 + (i * 8), 0, 6);
    //     }
    // }
    static componentToHex(c) {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    static rgbToHex(A) {
        if (A[0] === undefined || A[1] === undefined || A[2] === undefined)
            console.error("RGB color invalid");
        return "#" + BorderFrameFaction.componentToHex(A[0]) + BorderFrameFaction.componentToHex(A[1]) + BorderFrameFaction.componentToHex(A[2]);
    }
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
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
    ;
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
    static getActorHpPath() {
        switch (getGame().system.id) {
            case "symbaroum": return {
                value: "actor.data.data.health.toughness.value",
                max: "actor.data.data.health.toughness.max",
                tempMax: undefined,
                temp: undefined
            };
            case "dnd5e": return {
                value: "actor.data.data.attributes.hp.value",
                max: "actor.data.data.attributes.hp.max",
                tempMax: "actor.data.data.attributes.hp.tempmax",
                temp: "actor.data.data.attributes.hp.temp"
            };
        }
    }
    static drawNameplate() {
        const offSet = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "borderOffset");
        const yOff = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "nameplateOffset");
        const bOff = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "borderWidth") / 2;
        const replaceFont = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "plateFont");
        const sizeMulti = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "sizeMultiplier");
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "circularNameplate")) {
            const style = CONFIG.canvasTextStyle.clone();
            const extraRad = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "circularNameplateRadius");
            if (!getGame().modules.get("custom-nameplates")?.active) {
                //@ts-ignore
                style.fontFamily = replaceFont;
                //@ts-ignore
                style.fontSize *= sizeMulti;
                //@ts-ignore
                if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "plateConsistency"))
                    style.fontSize *= getCanvas().grid?.size / 100;
            }
            const text = new PreciseText(this.name, style);
            text.resolution = 2;
            text.style.trim = true;
            //@ts-ignore
            text.updateText();
            //@ts-ignore
            const radius = this.w / 2 + text.texture.height + bOff + extraRad;
            const maxRopePoints = 100;
            const step = Math.PI / maxRopePoints;
            let ropePoints = maxRopePoints - Math.round((text.texture.width / (radius * Math.PI)) * maxRopePoints);
            ropePoints /= 2;
            const points = [];
            for (let i = maxRopePoints - ropePoints; i > ropePoints; i--) {
                const x = radius * Math.cos(step * i);
                const y = radius * Math.sin(step * i);
                points.push(new PIXI.Point(-x, -y));
            }
            const name = new PIXI.SimpleRope(text.texture, points);
            name.rotation = Math.PI;
            //@ts-ignore
            name.position.set(this.w / 2, this.h / 2 + yOff);
            return name;
        }
        else {
            //@ts-ignore
            const style = this._getTextStyle();
            if (!getGame().modules.get("custom-nameplates")?.active) {
                style.fontFamily = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "plateFont");
                style.fontSize *= sizeMulti;
            }
            //@ts-ignore
            const name = new PreciseText(this.data.name, style);
            name.anchor.set(0.5, 0);
            //@ts-ignore
            name.position.set(this.w / 2, this.h + bOff + yOff + offSet);
            return name;
        }
    }
    static refreshAll() {
        getCanvas().tokens?.placeables.forEach(t => t.draw());
    }
    // ADDED
    static async updateTokensBorder(tokenData) {
        const token = getCanvas().tokens?.placeables.find((tokenPlaceable) => tokenPlaceable.id === tokenData._id);
        const colorFrom = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'color-from');
        let color;
        if (colorFrom === 'token-disposition') {
            const disposition = dispositionKey(token);
            if (disposition) {
                color = defaultColors[disposition];
            }
        }
        else if (colorFrom === 'actor-folder-color') {
            if (token.actor && token.actor.folder && token.actor.folder.data && token.actor.folder.data.color) {
                color = token.actor.folder.data.color;
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
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "controlledColor")).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "controlledColorEx")).substr(1), 16),
            },
            FRIENDLY: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "friendlyColor")).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "friendlyColorEx")).substr(1), 16),
            },
            NEUTRAL: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "neutralColor")).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "neutralColorEx")).substr(1), 16),
            },
            HOSTILE: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "hostileColor")).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "hostileColorEx")).substr(1), 16),
            },
            PARTY: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "partyColor")).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "partyColorEx")).substr(1), 16),
            },
            ACTOR_FOLDER_COLOR: {
                INT: parseInt(String(color).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "actorFolderColorEx")).substr(1), 16)
            },
            CUSTOM_DISPOSITION: {
                INT: parseInt(String(color).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "customDispositionColorEx")).substr(1), 16),
            }
        };
        let borderColor = { INT: {}, EX: {} };
        if (colorFrom === 'token-disposition') {
            //@ts-ignore
            //if (token._controlled) return overrides.CONTROLLED;
            //@ts-ignore
            //else if (token._hover) {
            const disPath = isNewerVersion(getGame().data.version, "0.8.0") ? CONST.TOKEN_DISPOSITIONS : TOKEN_DISPOSITIONS;
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
        // SECOND PART 
        // if(!BCC) BCC = new BCconfig()
        //@ts-ignore
        token.border.clear();
        if (!borderColor)
            return;
        switch (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "removeBorders")) {
            case "0": break;
            //@ts-ignore
            case "1":
                if (!token.owner)
                    return;
                break;
            case "2": return;
        }
        //@ts-ignore
        if (token.data.flags[TOKEN_FACTIONS_MODULE_NAME]?.noBorder) {
            return;
        }
        if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
            return;
        }
        const t = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "borderWidth") || CONFIG.Canvas.objectBorderThickness;
        // DISABLED
        // if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradient")) {
        //     const systemPath = BCC.currentSystem
        //     const stepLevel = BCC.stepLevel
        //     const hpMax = getProperty(token, systemPath.max) + (getProperty(token, systemPath.tempMax) ?? 0)
        //     const hpValue = getProperty(token, systemPath.value)
        //     const hpDecimal = parseInt(String(BorderFrame.clamp((hpValue / hpMax) * stepLevel, stepLevel, 1))) || 1
        //     const color = BorderFrame.rgbToHex(BCC.colorArray[hpDecimal - 1])
        //     borderColor.INT = parseInt(color.substr(1), 16)
        //     if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "tempHPgradient") && getProperty(token, systemPath.temp) > 0) {
        //         const tempValue = getProperty(token, systemPath.temp)
        //         const tempDecimal = parseInt(String(BorderFrame.clamp(tempValue / (hpMax / 2) * stepLevel, stepLevel, 1)))
        //         const tempEx = BorderFrame.rgbToHex(BCC.tempArray[tempDecimal - 1])
        //         borderColor.EX = parseInt(tempEx.substr(1), 16)
        //     }
        // }
        // Draw Hex border for size 1 tokens on a hex grid
        const gt = CONST.GRID_TYPES;
        const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "circleBorders")) {
            const p = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "borderOffset");
            const h = Math.round(t / 2);
            const o = Math.round(h / 2);
            //@ts-ignore
            token.border.lineStyle(t, borderColor.EX, 0.8).drawCircle(token.w / 2, token.h / 2, token.w / 2 + t + p);
            //@ts-ignore
            token.border.lineStyle(h, borderColor.INT, 1.0).drawCircle(token.w / 2, token.h / 2, token.w / 2 + h + t / 2 + p);
        }
        //@ts-ignore
        else if (hexTypes.includes(getCanvas().grid?.type) && (token.data.width === 1) && (token.data.height === 1)) {
            const p = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "borderOffset");
            const q = Math.round(p / 2);
            //@ts-ignore
            const polygon = getCanvas().grid?.grid?.getPolygon(-1.5 - q, -1.5 - q, token.w + 2 + p, token.h + 2 + p);
            //@ts-ignore
            token.border.lineStyle(t, borderColor.EX, 0.8).drawPolygon(polygon);
            //@ts-ignore
            token.border.lineStyle(t / 2, borderColor.INT, 1.0).drawPolygon(polygon);
        }
        // Otherwise Draw Square border
        else {
            const p = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "borderOffset");
            const q = Math.round(p / 2);
            const h = Math.round(t / 2);
            const o = Math.round(h / 2);
            //@ts-ignore
            token.border.lineStyle(t, borderColor.EX, 0.8).drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3);
            //@ts-ignore
            token.border.lineStyle(h, borderColor.INT, 1.0).drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3);
        }
        return;
    }
}
export const TokenPrototypeRefreshBorderHandler = function (wrapped, ...args) {
    const tokenData = this;
    BorderFrameFaction.updateTokensBorder(tokenData);
    return wrapped(...args);
};
