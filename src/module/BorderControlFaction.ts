import { TokenData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import { defaultColors, TOKEN_FACTIONS_FLAGS } from './Hooks';
import { getCanvas, getGame, TOKEN_FACTIONS_MODULE_NAME } from './settings';
import { dispositionKey } from './tokenFactions';

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
  symbaroum = {};
  dnd5e = {};
  pf2e = {};
  pf1 = {};
  swade = {};
  stepLevel = '';
  // endColor:[r: number, g: number, b: number];
  // startColor:[r: number, g: number, b: number];
  // tempColor:[r: number, g: number, b: number];
  // colorArray:number[][] = [];
  // tempArray:number[][] = [];

  currentSystem = '';

  constructor() {
    this.symbaroum = {
      value: 'actor.data.data.health.toughness.value',
      max: 'actor.data.data.health.toughness.max',
      tempMax: undefined,
      temp: undefined,
    };
    this.dnd5e = {
      value: 'actor.data.data.attributes.hp.value',
      max: 'actor.data.data.attributes.hp.max',
      tempMax: undefined,
      temp: 'actor.data.data.attributes.hp.temp',
    };
    this.pf2e = {
      value: 'actor.data.data.attributes.hp.value',
      max: 'actor.data.data.attributes.hp.max',
      tempMax: 'actor.data.data.attributes.hp.tempmax',
      temp: 'actor.data.data.attributes.hp.temp',
    };
    this.pf1 = {
      value: 'actor.data.data.attributes.hp.value',
      max: 'actor.data.data.attributes.hp.max',
      tempMax: undefined,
      temp: 'actor.data.data.attributes.hp.temp',
    };
    this.swade = {
      value: 'actor.data.data.wounds.value',
      max: 'actor.data.data.wounds.max',
      tempMax: undefined,
      temp: undefined,
    };
    this.stepLevel = <string>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'stepLevel');
    // this.endColor = hexToRGB(<number>colorStringToHex(<string>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientA")))
    // this.startColor = hexToRGB(<number>colorStringToHex(<string>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientB")))
    // this.tempColor = hexToRGB(<number>colorStringToHex(<string>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "healthGradientC")))
    // this.colorArray = BorderFrameFaction.interpolateColors(`rgb(${this.startColor[0] * 255}, ${this.startColor[1] * 255}, ${this.startColor[2] * 255})`, `rgb(${this.endColor[0] * 255}, ${this.endColor[1] * 255}, ${this.endColor[2] * 255})`, this.stepLevel)
    // this.tempArray = BorderFrameFaction.interpolateColors(`rgb(${this.endColor[0] * 255}, ${this.endColor[1] * 255}, ${this.endColor[2] * 255})`, `rgb(${this.tempColor[0] * 255}, ${this.tempColor[1] * 255}, ${this.tempColor[2] * 255})`, this.stepLevel)

    this.currentSystem = this[getGame().system.id];
  }
}

export class BorderFrameFaction {
  static AddBorderToggle(app, html, data) {
    if (!getGame().user?.isGM){
      return;
    }
    if (!getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'enableHud')){
       return;
    }
    const buttonPos = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hudPos');
    const borderButton = `<div class="control-icon factionBorder ${
      app.object.getFlag(TOKEN_FACTIONS_MODULE_NAME,TOKEN_FACTIONS_FLAGS.FACTION_NO_BORDER) ? 'active' : ''
    }" title="Toggle Faction Border"> <i class="fas fa-helmet-battle"></i></div>`;
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
    this.border.clear();
    //@ts-ignore
    const borderColor = this._getBorderColor();
    if (!borderColor){
      return;
    }
    switch (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'removeBorders')) {
      case '0':
        break;

      case '1':
        //@ts-ignore
        if (!this.owner){
           return;
        }
        break;
      case '2':
        return;
    }
    //@ts-ignore
    if (this.getFlag(TOKEN_FACTIONS_MODULE_NAME,TOKEN_FACTIONS_FLAGS.FACTION_NO_BORDER)) {
      return;
    }
    if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
      return;
    }
    const t =
      <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderWidth') || CONFIG.Canvas.objectBorderThickness;
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
    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'circleBorders')) {
      const p = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
      const h = Math.round(t / 2);
      const o = Math.round(h / 2);
      //@ts-ignore
      this.border
        .lineStyle(t, borderColor.EX, 0.8)
        //@ts-ignore
        .drawCircle(this.w / 2, this.h / 2, this.w / 2 + t + p);
      //@ts-ignore
      this.border
        .lineStyle(h, borderColor.INT, 1.0)
        //@ts-ignore
        .drawCircle(this.w / 2, this.h / 2, this.w / 2 + h + t / 2 + p);
    }
    //@ts-ignore
    else if (hexTypes.includes(getCanvas().grid?.type) && this.data.width === 1 && this.data.height === 1) {
      const p = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
      const q = Math.round(p / 2);
      //@ts-ignore
      const polygon = getCanvas().grid?.grid?.getPolygon(-1.5 - q, -1.5 - q, this.w + 2 + p, this.h + 2 + p);
      //@ts-ignore
      this.border
        .lineStyle(t, borderColor.EX, 0.8).drawPolygon(polygon);
      //@ts-ignore
      this.border
        .lineStyle(t / 2, borderColor.INT, 1.0).drawPolygon(polygon);
    }

    // Otherwise Draw Square border
    else {
      const p = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
      const q = Math.round(p / 2);
      const h = Math.round(t / 2);
      const o = Math.round(h / 2);
      //@ts-ignore
      this.border
        .lineStyle(t, borderColor.EX, 0.8)
        //@ts-ignore
        .drawRoundedRect(-o - q, -o - q, this.w + h + p, this.h + h + p, 3);
      //@ts-ignore
      this.border
        .lineStyle(h, borderColor.INT, 1.0)
        //@ts-ignore
        .drawRoundedRect(-o - q, -o - q, this.w + h + p, this.h + h + p, 3);
    }
    return;
  }

  static clamp(value, max, min) {
    return Math.min(Math.max(value, min), max);
  }

  static newBorderColor() {
    //@ts-ignore
    const token: Token = this as Token;
    const colorFrom = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'color-from');
    let color;
    if (colorFrom === 'token-disposition') {
      const disposition = dispositionKey(token);
      if (disposition) {
        color = defaultColors[disposition];
      }
    } else if (colorFrom === 'actor-folder-color') {
      if (token.actor && token.actor.folder && token.actor.folder.data && token.actor.folder.data.color) {
        color = token.actor.folder.data.color;
      }
    } else {
      // colorFrom === 'custom-disposition'
      const disposition = dispositionKey(token);
      if (disposition) {
        color = <string>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, `custom-${disposition}-color`);
      }
    }

    const overrides = {
      CONTROLLED: {
        INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'controlledColor')).substr(1), 16),
        EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'controlledColorEx')).substr(1), 16),
      },
      FRIENDLY: {
        INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColor')).substr(1), 16),
        EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColorEx')).substr(1), 16),
      },
      NEUTRAL: {
        INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'neutralColor')).substr(1), 16),
        EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'neutralColorEx')).substr(1), 16),
      },
      HOSTILE: {
        INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hostileColor')).substr(1), 16),
        EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hostileColorEx')).substr(1), 16),
      },
      PARTY: {
        INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColor')).substr(1), 16),
        EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColorEx')).substr(1), 16),
      },
      ACTOR_FOLDER_COLOR: {
        INT: parseInt(String(color).substr(1), 16),
        EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'actorFolderColorEx')).substr(1), 16),
      },
      CUSTOM_DISPOSITION: {
        INT: parseInt(String(color).substr(1), 16),
        EX: parseInt(
          String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'customDispositionColorEx')).substr(1),
          16,
        ),
      },
    };
    if (colorFrom === 'token-disposition') {
      //@ts-ignore
      //if (token._controlled) return overrides.CONTROLLED;
      //@ts-ignore
      //else if (token._hover) {
      const disPath = isNewerVersion(getGame().data.version, '0.8.0') ? CONST.TOKEN_DISPOSITIONS : TOKEN_DISPOSITIONS;
      //@ts-ignore
      const d = parseInt(token.data.disposition);
      //@ts-ignore
      if (!getGame().user?.isGM && token.owner) return overrides.CONTROLLED;
      //@ts-ignore
      else if (token.actor?.hasPlayerOwner) return overrides.PARTY;
      else if (d === disPath.FRIENDLY) return overrides.FRIENDLY;
      else if (d === disPath.NEUTRAL) return overrides.NEUTRAL;
      else return overrides.HOSTILE;
      //}
      //else return null;
    } else if (colorFrom === 'actor-folder-color') {
      return overrides.ACTOR_FOLDER_COLOR;
    } else {
      // colorFrom === 'custom-disposition'
      return overrides.CUSTOM_DISPOSITION;
    }
  }

  static componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  static rgbToHex(A) {
    if (A[0] === undefined || A[1] === undefined || A[2] === undefined) console.error('RGB color invalid');
    return (
      '#' +
      BorderFrameFaction.componentToHex(A[0]) +
      BorderFrameFaction.componentToHex(A[1]) +
      BorderFrameFaction.componentToHex(A[2])
    );
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

  static interpolateColor(color1, color2, factor): number[] {
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
    const stepFactor = 1 / (steps - 1),
      interpolatedColorArray: number[][] = [];

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
    const tokens: TokenDocument[] = [];
    const tokenDoc: TokenDocument = <TokenDocument>getCanvas().tokens?.get(currentTokenID)?.document;
    if (!tokenDoc) {
      const actorID = currentTokenID; // getGame().actors?.get(currentTokenID)?.id;
      const scene = getGame().scenes?.get(<string>getGame().user?.viewedScene);
      if (scene) {
        scene.data.tokens.forEach((tokenTmp) => {
          if (<boolean>(tokenTmp.actor && tokenTmp.actor.id === actorID)) {
            tokens.push(tokenTmp);
          }
        });
      }
    } else {
      tokens.push(tokenDoc);
    }

    tokens.forEach((tokenDoc) => {
      if (tokenDoc) {
        const tokenID = tokenDoc.id;
        const sceneID = <string>(<Token>getCanvas().tokens?.get(<string>tokenDoc.id)).scene.id;
        const specifiedScene = getGame().scenes?.get(sceneID);
        if (specifiedScene) {
          if (!specifiedScene) {
            return;
          }
          tokenDoc = <TokenDocument>specifiedScene.data.tokens.find((tokenTmp) => {
            return <boolean>(tokenTmp.id === tokenID);
          });
        }
        if (!tokenDoc) {
          let foundToken: TokenDocument | null = null;
          getGame().scenes?.find((sceneTmp) => {
            // getTokenForScene(scene, tokenID);
            if (!sceneTmp) {
              foundToken = null;
            }
            foundToken = <TokenDocument>sceneTmp.data.tokens.find((token) => {
              return token.id === tokenID;
            });
            return !!foundToken;
          });
          //@ts-ignore
          tokenDoc = <TokenDocument>foundToken;
        }
      }

      if (!tokenDoc) {
        // Is not in the current canvas
        return;
      }
      // TokenDocument to Token
      //@ts-ignore
      const token: Token = tokenDoc._object;

      const colorFrom = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'color-from');
      let color;
      let icon;
      if (colorFrom === 'token-disposition') {
        const disposition = dispositionKey(token);
        if (disposition) {
          color = defaultColors[disposition];
        }
      } else if (colorFrom === 'actor-folder-color') {
        if (token.actor && token.actor.folder && token.actor.folder.data) {
          color = token.actor.folder.data.color;
          //@ts-ignore
          icon = token.actor.folder.data.icon;
        }
      } else {
        // colorFrom === 'custom-disposition'
        const disposition = dispositionKey(token);
        if (disposition) {
          color = <string>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, `custom-${disposition}-color`);
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
          EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'customDispositionColorEx')).substr(1),16),
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
        if (!getGame().user?.isGM && token.owner) borderColor = overrides.CONTROLLED;
        //@ts-ignore
        else if (token.actor?.hasPlayerOwner) borderColor = overrides.PARTY;
        else if (d === disPath.FRIENDLY) borderColor = overrides.FRIENDLY;
        else if (d === disPath.NEUTRAL) borderColor = overrides.NEUTRAL;
        else borderColor = overrides.HOSTILE;
        //}
        //else return null;
      } else if (colorFrom === 'actor-folder-color') {
        borderColor = overrides.ACTOR_FOLDER_COLOR;
      } else {
        // colorFrom === 'custom-disposition'
        borderColor = overrides.CUSTOM_DISPOSITION;
      }

      // SECOND PART
      // if(!BCC) BCC = new BCconfig()
      //@ts-ignore
      token.border.clear();
      if (!borderColor){
        return;
      }
      switch (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'removeBorders')) {
        case '0':
          break;
        //@ts-ignore
        case '1':
          if (!token.owner) return;
          break;
        case '2':
          return;
      }
      //@ts-ignore
      if (token.document.getFlag(TOKEN_FACTIONS_MODULE_NAME,TOKEN_FACTIONS_FLAGS.FACTION_NO_BORDER)) {
        return;
      }
      if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
        return;
      }
      const t =
        <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderWidth') ||
        CONFIG.Canvas.objectBorderThickness;

      // TODO
      // Prepare texture for faction symbol
      // if(borderColor.ICON) {

      // }


      // Draw Hex border for size 1 tokens on a hex grid
      const gt = CONST.GRID_TYPES;
      const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];

      if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'circleBorders')) {

        const p = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
        const h = Math.round(t / 2);
        const o = Math.round(h / 2);

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
      //@ts-ignore
      else if (hexTypes.includes(getCanvas().grid?.type) && token.data.width === 1 && token.data.height === 1) {

        const p = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
        const q = Math.round(p / 2);
        //@ts-ignore
        const polygon = getCanvas().grid?.grid?.getPolygon(-1.5 - q, -1.5 - q, token.w + 2 + p, token.h + 2 + p);

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

      // Otherwise Draw Square border
      else {

        const p = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
        const q = Math.round(p / 2);
        const h = Math.round(t / 2);
        const o = Math.round(h / 2);
        //@ts-ignore
        token.border
          .beginFill(borderColor.EX)
          .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3)
          .beginTextureFill({ texture: PIXI.Texture.EMPTY, color: borderColor.EX, alpha: 1 })
          .lineStyle(t, borderColor.EX, 0.8)
          .endFill()
          ;

        //@ts-ignore
        token.border
          .beginFill(borderColor.INT)
          .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3)
          .beginTextureFill({ texture: PIXI.Texture.EMPTY, color: borderColor.INT, alpha: 1 })
          .lineStyle(h, borderColor.INT, 1.0)
          .endFill()
          ;
      }
    });
    return;
  }

  // /**
  //  * Creates a sprite from the selected factions icon and positions around the container
  //  * @param {string} color -- the user to get
  //  * @param {string} pTex  -- the url path to the texture image
  //  * @param {token} target -- PIXI.js container for height & width (the token)
  //  */
  //  static async buildFactionPortrait(color:string, pTex:string, token:Token) {
  //   const i = 0; // TODO Multiple factions feature ?????
  //   const circleR = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "pipScale") || 12;
  //   const circleOffsetMult = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "pipOffset") || 16;
  //   const scaleMulti = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "pipImgScale") || 1;
  //   const insidePip = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "insidePips") ? circleR : 0;
  //   const texture = await PIXI.Texture.fromURL(pTex);
  //   const newTexW = scaleMulti * (2 * circleR);
  //   const newTexH = scaleMulti * (2 * circleR);
  //   const borderThic = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "borderThicc");
  //   let portraitCenterOffset = scaleMulti >= 1 ? (16 + circleR / 12) * Math.log2(scaleMulti) : 0;
  //   portraitCenterOffset += <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "pipOffsetManualY") || 0;
  //   const portraitXoffset = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "pipOffsetManualX") || 0;
  //   const matrix = new PIXI.Matrix(
  //     (scaleMulti * (2 * circleR + 2)) / texture.width,
  //     0,
  //     0,
  //     (scaleMulti * (2 * circleR + 2)) / texture.height,
  //     newTexW / 2 + 4 + i * circleOffsetMult + portraitXoffset + insidePip,
  //     newTexH / 2 + portraitCenterOffset + insidePip
  //   );
  //   //@ts-ignore
  //   token.factionSymbol
  //     .beginFill(color)
  //     .drawCircle(2 + i * circleOffsetMult + insidePip, 0 + insidePip, circleR)
  //     .beginTextureFill({
  //       texture: texture,
  //       alpha: 1,
  //       matrix: matrix,
  //     })
  //     .lineStyle(borderThic, 0x0000000)
  //     .drawCircle(2 + i * circleOffsetMult + insidePip, 0 + insidePip, circleR)
  //     .endFill()
  //     .lineStyle(borderThic / 2, color)
  //     .drawCircle(2 + i * circleOffsetMult + insidePip, 0 + insidePip, circleR);
  // }

}

export const TokenPrototypeRefreshBorderHandler = function (wrapped, ...args) {
  const tokenData = this as TokenData;
  BorderFrameFaction.updateTokensBorder(tokenData);
  return wrapped(...args);
};
