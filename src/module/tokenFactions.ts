import type { TokenData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import { i18n } from './lib/lib';
import { FactionGraphic } from './TokenFactionsModels';
import CONSTANTS from './constants';

export class TokenFactions {
  /*
   * The allowed Token disposition types
   * HOSTILE - Displayed as an enemy with a red border
   * NEUTRAL - Displayed as neutral with a yellow border
   * FRIENDLY - Displayed as an ally with a cyan border
   */
  static TOKEN_DISPOSITIONS = {
    HOSTILE: -1,
    NEUTRAL: 0,
    FRIENDLY: 1,
  };

  static TOKEN_FACTIONS_FLAGS = {
    FACTION_DRAW_FRAME: 'factionDrawFrame', //'draw-frame',
    FACTION_DISABLE: 'factionDisable', // 'disable'
    // FACTION_NO_BORDER: 'factionNoBorder', // noBorder
  };

  static TOKEN_FACTIONS_FRAME_STYLE = {
    FLAT: 'flat',
    BELEVELED: 'beveled',
    BORDER: 'border',
  };

  static dispositionKey = (token) => {
    const dispositionValue = parseInt(String(token.data.disposition), 10);
    let disposition;
    if (token.actor && token.actor.hasPlayerOwner && token.actor.type === 'character') {
      disposition = 'party-member';
    } else if (token.actor && token.actor.hasPlayerOwner) {
      disposition = 'party-npc';
    } else if (dispositionValue === 1) {
      disposition = 'friendly-npc';
    } else if (dispositionValue === 0) {
      disposition = 'neutral-npc';
    } else if (dispositionValue === -1) {
      disposition = 'hostile-npc';
    }
    return disposition;
  };

  static bevelGradient: PIXI.Texture;
  static bevelTexture: PIXI.Texture;

  static defaultColors;

  static dispositions;

  static async onInit() {
    TokenFactions.defaultColors = {
      'party-member': game.settings.get(CONSTANTS.MODULE_NAME, 'partyColor'), //'#33bc4e',
      'party-npc': game.settings.get(CONSTANTS.MODULE_NAME, 'partyColor'), //'#33bc4e',
      'friendly-npc': game.settings.get(CONSTANTS.MODULE_NAME, 'friendlyColor'), //'#43dfdf',
      'neutral-npc': game.settings.get(CONSTANTS.MODULE_NAME, 'neutralColor'), //'#f1d836',
      'hostile-npc': game.settings.get(CONSTANTS.MODULE_NAME, 'hostileColor'), //'#e72124',

      'controlled-npc': game.settings.get(CONSTANTS.MODULE_NAME, 'controlledColor'),
      'neutral-external-npc': game.settings.get(CONSTANTS.MODULE_NAME, 'neutralColorEx'),
      'friendly-external-npc': game.settings.get(CONSTANTS.MODULE_NAME, 'friendlyColorEx'),
      'hostile-external-npc': game.settings.get(CONSTANTS.MODULE_NAME, 'hostileColorEx'),
      'controlled-external-npc': game.settings.get(CONSTANTS.MODULE_NAME, 'controlledColorEx'),
      'party-external-member': game.settings.get(CONSTANTS.MODULE_NAME, 'partyColorEx'),
      'party-external-npc': game.settings.get(CONSTANTS.MODULE_NAME, 'partyColorEx'),
      //'target-npc' :  game.settings.get(CONSTANTS.MODULE_NAME, "targetColor"),
      //'target-external-npc' :  game.settings.get(CONSTANTS.MODULE_NAME, "targetColorEx"),
    };

    TokenFactions.dispositions = Object.keys(TokenFactions.defaultColors);

    TokenFactions.bevelGradient = <PIXI.Texture>(
      await loadTexture(`modules/${CONSTANTS.MODULE_NAME}/assets/bevel-gradient.jpg`)
    );
    TokenFactions.bevelTexture = <PIXI.Texture>(
      await loadTexture(`modules/${CONSTANTS.MODULE_NAME}/assets/bevel-texture.png`)
    );
  }

  static renderTokenConfig = async function (config, html) {
    const tokenDocument = config.object as TokenDocument;
    // const factions = token.factions;
    // let skipDraw = tokenDocument.getFlag(
    //   CONSTANTS.MODULE_NAME,
    //   TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE,
    // );
    // if(!skipDraw){
    //   skipDraw = false;
    // }
    if (!game.user?.isGM) {
      return;
    }
    if (!html) {
      return;
    }
    // const relevantDocument = config?.object?._object?.document ?? config?.object?._object;
    // const factionDisableValue =
    //   config?.object instanceof Actor
    //     ? getProperty(
    //         config?.object,
    //         `data.token.flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`,
    //       )
    //     : relevantDocument?.getFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE) ??
    //       false;
    const factionDisableValue = config.object.getFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE,
    )
      ? 'checked'
      : '';
    /*
    const drawFramesByDefault = game.settings.get(CONSTANTS.MODULE_NAME, 'draw-frames-by-default');
    const drawFrameOverride = token.getFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DRAW_FRAME,
    );
    const drawFrame = drawFrameOverride === undefined ? drawFramesByDefault : drawFrameOverride;
    const checked = drawFrame ? ' checked="checked"' : '';

    html.find('input[name="mirrorY"]').parent().after(`\
      <div class="form-group">
        <label>Disable Faction Disposition Visualization</label>
        <input type="checkbox" name="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}" data-dtype="Boolean"${isDisabled}>
      </div>
        <div class="form-group">
          <label>Overlay A Faction-Based Frame</label>
          <input type="checkbox" name="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DRAW_FRAME}" data-dtype="Boolean"${checked}>
        </div>`);
    */
    // Expand the width
    config.position.width = 540;
    config.setPosition(config.position);

    const nav = html.find('nav.sheet-tabs.tabs');
    nav.append(
      $(`
			<a class="item" data-tab="factions">
        <i class="fas fa-user-circle"></i>
				${i18n('token-factions.label.factions')}
			</a>
		`),
    );

    const formConfig = `
      <div class="form-group">
        <label>${i18n('token-factions.label.factionsCustomDisable')}</label>
        <input type="checkbox"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}"
          name="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}"
          data-dtype="Boolean" ${factionDisableValue}>
      </div>`;

    nav
      .parent()
      .find('footer')
      .before(
        $(`
			<div class="tab" data-tab="factions">
				${formConfig}
			</div>
		`),
      );

    // if(!factionDisableValue){
    //   //@ts-ignore
    //   const token = <Token>tokenDocument?._object;
    //   token.refresh();
    //   await TokenFactions.updateTokenDataFaction(token.data);
    //   token.draw();
    // }

    nav
      .parent()
      .find('.tab[data-tab="factions"] input[type="checkbox"][data-edit]')
      .change(config._onChangeInput.bind(config));
    // nav
    //   .parent()
    //   .find('.tab[data-tab="factions"] input[type="color"][data-edit]')
    //   .change(config._onChangeInput.bind(config));
  };

  static _applyFactions = async function (document: TokenDocument | Actor, updateData): Promise<void> {
    // Set the disable flag
    let propertyNameDisable = `flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}`;
    if (document instanceof Actor) {
      propertyNameDisable = 'token.' + propertyNameDisable;
    }
    const factionDisableValue = getProperty(updateData, propertyNameDisable);
    if (factionDisableValue !== undefined && factionDisableValue !== null) {
      setProperty(updateData, propertyNameDisable, factionDisableValue);
      if (!factionDisableValue) {
        if (document instanceof Actor) {
          const actor = <Actor>document;
          //@ts-ignore
          const token = <Token>actor.token?._object;
          // token.refresh();
          await TokenFactions.updateTokenDataFaction(token.data);
          // token.draw();
        } else {
          const tokenDocument = <TokenDocument>document;
          //@ts-ignore
          const token = <Token>tokenDocument?._object;
          // token.refresh();
          await TokenFactions.updateTokenDataFaction(token.data);
          // token.draw();
        }
      }
    }
  };

  static async updateTokenDataFaction(tokenData: TokenData): Promise<any> {
    let tokens: Token[];
    try {
      tokens = <Token[]>canvas.tokens?.placeables;
    } catch (e) {
      return;
    }
    if (!TokenFactions.bevelGradient || !TokenFactions.bevelGradient.baseTexture) {
      TokenFactions.bevelGradient = <PIXI.Texture>(
        await loadTexture(`modules/${CONSTANTS.MODULE_NAME}/assets/bevel-gradient.jpg`)
      );
      TokenFactions.bevelTexture = <PIXI.Texture>(
        await loadTexture(`modules/${CONSTANTS.MODULE_NAME}/assets/bevel-texture.png`)
      );
    }

    if (tokenData?._id) {
      const token = canvas.tokens?.placeables.find((tokenPlaceable) => tokenPlaceable.id === tokenData._id);
      if (token) {
        tokens = [token];
      }
    }

    tokens.forEach((token) => {
      TokenFactions.updateTokenFaction(token);
    });
  }

  static updateTokenFaction(token: Token | TokenDocument): Token {
    if (token instanceof TokenDocument) {
      token = <Token>(<TokenDocument>token)?.object;
    }
    //@ts-ignore
    if (token instanceof Token) {
      // && token.icon && TokenFactions.bevelTexture && TokenFactions.bevelTexture.baseTexture
      //@ts-ignore
      if (!token.factions || token.factions.destroyed) {
        //@ts-ignore
        token.factions = token.addChildAt(new PIXI.Container(), 0);
      }
      token.sortableChildren = true;
      //@ts-ignore
      TokenFactions.drawBorderFaction(token, token.factions);

      // Final mangement of the z-index
      //@ts-ignore
      if (!token.factions) {
        //@ts-ignore
        if (token.icon?.zIndex) {
          //@ts-ignore
          token.factions = token.icon.zIndex;
        }
        if (token.zIndex) {
          //@ts-ignore
          token.factions = token.zIndex;
        }
      }
      //@ts-ignore
      if (token.icon) {
        //@ts-ignore
        if (token.border) {
          //@ts-ignore
          if (token.icon.zIndex > token.border.zIndex) {
            //@ts-ignore
            token.icon.zIndex = token.border.zIndex - 1;
            //@ts-ignore
            if (token.factions.zIndex > token.icon.zIndex) {
              //@ts-ignore
              token.factions.zIndex = token.icon.zIndex - 1;
            }
          }
        } else {
          //@ts-ignore
          if (token.factions.zIndex > token.icon.zIndex) {
            //@ts-ignore
            token.factions.zIndex = token.icon.zIndex - 1;
          }
        }
      } else {
        //@ts-ignore
        if (token.border) {
          //@ts-ignore
          if (token.zIndex > token.border.zIndex) {
            //@ts-ignore
            token.zIndex = token.border.zIndex - 1;
            //@ts-ignore
            if (token.factions.zIndex > token.zIndex) {
              //@ts-ignore
              token.factions.zIndex = token.zIndex - 1;
            }
          }
        } else {
          //@ts-ignore
          if (token.factions.zIndex > token.zIndex) {
            //@ts-ignore
            token.factions.zIndex = token.zIndex - 1;
          }
        }
      }
    }
    return token;
  }

  // START NEW MANAGE

  static AddBorderToggle(app, html, data) {
    if (!game.user?.isGM) {
      return;
    }
    if (!game.settings.get(CONSTANTS.MODULE_NAME, 'hudEnable')) {
      return;
    }
    if (!app?.object?.document) {
      return;
    }

    const borderButton = `<div class="control-icon factionBorder ${
      app.object.document.getFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE)
        ? 'active'
        : ''
    }" title="Toggle Faction Border"> <i class="fas fa-angry"></i></div>`;
    /*
    const buttonPos = game.settings.get(CONSTANTS.MODULE_NAME, 'hudPos');
    const Pos = html.find(buttonPos);
    Pos.append(borderButton);
    */
    const settingHudColClass = <string>game.settings.get(CONSTANTS.MODULE_NAME, 'hudColumn') ?? '.right';
    const settingHudTopBottomClass = <string>game.settings.get(CONSTANTS.MODULE_NAME, 'hudTopBottom') ?? 'bottom';

    const buttonPos = '.' + settingHudColClass.toLowerCase();

    const col = html.find(buttonPos);
    if (settingHudTopBottomClass.toLowerCase() === 'top') {
      col.prepend(borderButton);
    } else {
      col.append(borderButton);
    }

    html.find('.factionBorder').click(this.ToggleBorder.bind(app));
  }

  static async ToggleBorder(event) {
    //@ts-ignore
    const border = this.object.document.getFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE,
    );
    //@ts-ignore
    await this.object.document.setFlag(
      CONSTANTS.MODULE_NAME,
      TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE,
      !border,
    );
    event.currentTarget.classList.toggle('active', !border);
    //@ts-ignore
    // TokenFactions.updateToken(this.object);
  }

  private static clamp(value, max, min) {
    return Math.min(Math.max(value, min), max);
  }

  private static componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  private static rgbToHex(A) {
    if (A[0] === undefined || A[1] === undefined || A[2] === undefined) console.error('RGB color invalid');
    return (
      '#' + TokenFactions.componentToHex(A[0]) + TokenFactions.componentToHex(A[1]) + TokenFactions.componentToHex(A[2])
    );
  }

  private static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(<string>result[1], 16),
          g: parseInt(<string>result[2], 16),
          b: parseInt(<string>result[3], 16),
        }
      : null;
  }

  private static interpolateColor(color1, color2, factor): number[] {
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
  private static interpolateColors(color1, color2, steps) {
    const stepFactor = 1 / (steps - 1),
      interpolatedColorArray: number[][] = [];

    color1 = color1.match(/\d+/g).map(Number);
    color2 = color2.match(/\d+/g).map(Number);

    for (let i = 0; i < steps; i++) {
      interpolatedColorArray.push(TokenFactions.interpolateColor(color1, color2, stepFactor * i));
    }

    return interpolatedColorArray;
  }

  static refreshAll() {
    canvas.tokens?.placeables.forEach((t) => t.draw());
  }

  // ADDED

  static async updateTokensAll() {
    canvas.tokens?.placeables.forEach((tokenDoc: Token) => {
      TokenFactions.updateTokensBorder(tokenDoc.data);
    });
  }

  private static async updateTokensBorder(tokenData) {
    const currentTokenID = tokenData?.id ? tokenData?.id : tokenData?._id;
    const tokens: TokenDocument[] = [];
    const tokenDoc: TokenDocument = <TokenDocument>canvas.tokens?.get(currentTokenID)?.document;
    if (!tokenDoc) {
      const actorID = currentTokenID; // game.actors?.get(currentTokenID)?.id;
      const scene = game.scenes?.get(<string>game.user?.viewedScene);
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

    tokens.forEach((tokenDoc: TokenDocument) => {
      if (tokenDoc) {
        const tokenID = tokenDoc.id;
        const sceneID = <string>(<Token>canvas.tokens?.get(<string>tokenDoc.id)).scene.id;
        const specifiedScene = game.scenes?.get(sceneID);
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
          game.scenes?.find((sceneTmp) => {
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
      // //@ts-ignore
      // if (!token.factionFrame) {
      //   //@ts-ignore
      //   token.factionFrame = token.addChildAt(new PIXI.Container(), token.getChildIndex(token.icon) + 1);
      // } else {
      //   //@ts-ignore
      //   token.factionFrame.removeChildren().forEach((c) => c.destroy());
      // }

      //@ts-ignore
      if (!token.factions || token.factions.destroyed) {
        //@ts-ignore
        token.factions = token.addChildAt(new PIXI.Container(), 0);
      }
      token.sortableChildren = true;
      //@ts-ignore
      TokenFactions.drawBorderFaction(token, token.factions);
      //@ts-ignore
      token.icon.zIndex = token.border.zIndex - 1;
      //@ts-ignore
      if (token.factions) {
        //@ts-ignore
        token.factions.zIndex = token.icon.zIndex - 1;
      }
    });
    return;
  }

  private static colorBorderFaction(token: Token): FactionGraphic {
    const colorFrom = game.settings.get(CONSTANTS.MODULE_NAME, 'color-from');
    let color;
    let icon;
    if (colorFrom === 'token-disposition') {
      const disposition = TokenFactions.dispositionKey(token);
      if (disposition) {
        color = TokenFactions.defaultColors[disposition];
      }
    } else if (colorFrom === 'actor-folder-color') {
      if (token.actor && token.actor.folder && token.actor.folder.data) {
        color = token.actor.folder.data.color;
        //@ts-ignore
        icon = token.actor.folder.data.icon;
      }
    } else {
      // colorFrom === 'custom-disposition'
      // TODO PUT SOME NEW FLAG ON THE TOKEN
      const disposition = TokenFactions.dispositionKey(token);
      if (disposition) {
        color = <string>game.settings.get(CONSTANTS.MODULE_NAME, `custom-${disposition}-color`);
      }
    }

    const overrides = {
      CONTROLLED: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, 'controlledColor')).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, 'controlledColorEx')).substr(1), 16),
        ICON: '',
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
      } as FactionGraphic,
      FRIENDLY: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, 'friendlyColor')).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, 'friendlyColorEx')).substr(1), 16),
        ICON: '',
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
      } as FactionGraphic,
      NEUTRAL: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, 'neutralColor')).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, 'neutralColorEx')).substr(1), 16),
        ICON: '',
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
      } as FactionGraphic,
      HOSTILE: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, 'hostileColor')).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, 'hostileColorEx')).substr(1), 16),
        ICON: '',
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
      } as FactionGraphic,
      PARTY: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, 'partyColor')).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, 'partyColorEx')).substr(1), 16),
        ICON: '',
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
      } as FactionGraphic,
      ACTOR_FOLDER_COLOR: {
        INT: parseInt(String(color).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, 'actorFolderColorEx')).substr(1), 16),
        ICON: icon ? String(icon) : '',
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
      },
      CUSTOM_DISPOSITION: {
        INT: parseInt(String(color).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, 'customDispositionColorEx')).substr(1), 16),
        ICON: '',
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
      },
    };

    let borderColor = new FactionGraphic();
    if (colorFrom === 'token-disposition') {
      //@ts-ignore
      //if (token._controlled) return overrides.CONTROLLED;
      //@ts-ignore
      //else if (token._hover || game.settings.get(CONSTANTS.MODULE_NAME, 'permanentBorder')) {
      const disPath = isNewerVersion(game.version ?? game.data.version, '0.8.0')
        ? CONST.TOKEN_DISPOSITIONS
        : TokenFactions.TOKEN_DISPOSITIONS;
      //@ts-ignore
      const d = parseInt(token.data.disposition);
      //@ts-ignore
      if (!game.user?.isGM && token.owner) borderColor = overrides.CONTROLLED;
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

    return borderColor;
  }

  private static async drawBorderFaction(token: Token, container: PIXI.Container): Promise<void> {
    //@ts-ignore
    //container.removeChildren().forEach((c) => c.destroy());

    container.children.forEach((c) => c.clear());

    // let factionBorder = game.settings.get(CONSTANTS.MODULE_NAME, 'overrideBorderGraphic')
    // //@ts-ignore
    // ? token.border
    // //@ts-ignore
    // : token.factionFrame;

    const borderColor = TokenFactions.colorBorderFaction(token);
    if (!borderColor) {
      return;
    }
    if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
      return;
    }
    switch (game.settings.get(CONSTANTS.MODULE_NAME, 'removeBorders')) {
      case '0':
        break;
      case '1':
        //@ts-ignore
        if (!token.owner) {
          return;
        }
        break;
      case '2':
        return;
    }

    //@ts-ignore
    let skipDraw;
    try {
      skipDraw = token.document.getFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE);
    } catch (e) {
      //@ts-ignore
      await token.document.setFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE, false);
      skipDraw = token.document.getFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE);
    }
    //@ts-ignore
    if (skipDraw) {
      return;
    }

    //@ts-ignore
    container.border = container.border ?? container.addChild(new PIXI.Graphics());
    //@ts-ignore
    const factionBorder = container.border;

    const frameStyle = String(game.settings.get(CONSTANTS.MODULE_NAME, 'frame-style'));

    token.sortableChildren = true;

    if (frameStyle == TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.FLAT) {
      // frameStyle === 'flat'
      const fillTexture = <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'fillTexture');
      TokenFactions.drawBorder(token, borderColor, factionBorder, fillTexture);
    } else if (frameStyle == TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.BELEVELED) {
      // frameStyle === 'bevelled'

      const fillTexture = <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'fillTexture');
      // const ringTexture = new PIXI.Sprite(TokenFactions.bevelTexture);
      // ringTexture.tint = borderColor.INT;
      // ringTexture.alpha = <number>frameOpacity;
      // container.addChild(ringTexture);
      // const factionBorder = new PIXI.Graphics();

      const borderColorBeleveled = borderColor;
      borderColorBeleveled.TEXTURE_INT = TokenFactions.bevelTexture;
      borderColorBeleveled.TEXTURE_EX = TokenFactions.bevelGradient;
      TokenFactions.drawBorder(token, borderColorBeleveled, factionBorder, fillTexture);

      // ringTexture.mask = factionBorder;

      /*
      const fillTexture = <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'fillTexture');
      if (fillTexture) {
        // TODO FILL TEXTURE
      }

      const outerRing = new PIXI.Sprite(TokenFactions.bevelGradient);
      outerRing.anchor.set(0.0, 0.0);
      outerRing.width = token.w;
      outerRing.height = token.h;
      outerRing.tint = borderColor.INT;

      const innerRing = new PIXI.Sprite(TokenFactions.bevelGradient);
      innerRing.anchor.set(0.0, 0.0);
      innerRing.width = token.w;
      innerRing.height = token.h;
      innerRing.tint = borderColor.INT;

      const ringTexture = new PIXI.Sprite(TokenFactions.bevelTexture);
      ringTexture.anchor.set(0.0, 0.0);
      ringTexture.width = 400;
      ringTexture.height = 400;
      ringTexture.tint = borderColor.INT;

      const outerRingMask = new PIXI.Graphics();
      const innerRingMask = new PIXI.Graphics();
      const ringTextureMask = new PIXI.Graphics();

      outerRing.alpha = <number>frameOpacity;
      innerRing.alpha = <number>frameOpacity;
      ringTexture.alpha = <number>frameOpacity;

      innerRing.pivot.set(1000.0, 1000.0);
      innerRing.angle = 180;

      // outerRingMask
      //   .lineStyle(t / 2, 0xffffff, 1.0, 0)
      //   .beginFill(0xffffff, 0.0)
      //   .drawCircle(token.w / 2, token.h / 2, token.w / 2);

      const borderColorOuterRingMask = borderColor;
      borderColorOuterRingMask.INT = 0xffffff;
      TokenFactions.drawBorder(token,borderColorOuterRingMask,outerRingMask,false);

      // innerRingMask
      //   .lineStyle(t / 2, 0xffffff, 1.0, 0)
      //   .beginFill(0xffffff, 0.0)
      //   .drawCircle(token.w / 2, token.h / 2, token.w / 2 - t / 2);

      const borderColorInnerRingMask = borderColor;
      borderColorInnerRingMask.INT = 0xffffff;
      TokenFactions.drawBorder(token,borderColorInnerRingMask,innerRingMask,false);

      // ringTextureMask
      //   .lineStyle(t, 0xffffff, 1.0, 0)
      //   .beginFill(0xffffff, 0.0)
      //   .drawCircle(token.w / 2, token.h / 2, token.w / 2);

      const borderColorRingTextureMask = borderColor;
      borderColorRingTextureMask.INT = 0xffffff;
      TokenFactions.drawBorder(token,borderColorRingTextureMask,ringTextureMask,false);

      container.addChild(outerRing);
      container.addChild(outerRingMask);
      outerRing.mask = outerRingMask;

      container.addChild(innerRing);
      container.addChild(innerRingMask);
      innerRing.mask = innerRingMask;

      container.addChild(ringTexture);
      container.addChild(ringTextureMask);
      ringTexture.mask = ringTextureMask;
      */
      //}else if(frameStyle == TOKEN_FACTIONS_FRAME_STYLE.BORDER){
    } else {
      const fillTexture = <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'fillTexture');
      TokenFactions.drawBorder(token, borderColor, factionBorder, fillTexture);
    }
  }

  private static drawBorder(
    token: Token,
    borderColor: FactionGraphic,
    factionBorder: PIXI.Graphics,
    fillTexture: boolean,
  ) {
    let t = <number>game.settings.get(CONSTANTS.MODULE_NAME, 'borderWidth') || CONFIG.Canvas.objectBorderThickness;

    //@ts-ignore
    if (game.settings.get(CONSTANTS.MODULE_NAME, 'permanentBorder') && token._controlled) {
      t = t * 2;
    }
    const sB = game.settings.get(CONSTANTS.MODULE_NAME, 'scaleBorder');
    const bS = game.settings.get(CONSTANTS.MODULE_NAME, 'borderGridScale');
    const nBS = bS ? (<Canvas.Dimensions>canvas.dimensions)?.size / 100 : 1;

    const s = sB ? token.data.scale : 1;
    const sW = sB ? (token.w - token.w * s) / 2 : 0;
    const sH = sB ? (token.h - token.h * s) / 2 : 0;

    const frameOpacity = <number>game.settings.get(CONSTANTS.MODULE_NAME, 'frame-opacity') || 0.5;
    const baseOpacity = <number>game.settings.get(CONSTANTS.MODULE_NAME, 'base-opacity') || 0.5;

    const textureINT = borderColor.TEXTURE_INT || PIXI.Texture.EMPTY; //await PIXI.Texture.fromURL(<string>token.data.img) || PIXI.Texture.EMPTY;
    const textureEX = borderColor.TEXTURE_EX || PIXI.Texture.EMPTY;

    factionBorder.alpha = frameOpacity;

    // Draw Hex border for size 1 tokens on a hex grid
    const gt = CONST.GRID_TYPES;
    const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];

    if (game.settings.get(CONSTANTS.MODULE_NAME, 'circleBorders')) {
      const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, 'borderOffset');
      const h = Math.round(t / 2);
      const o = Math.round(h / 2);

      if (fillTexture) {
        //@ts-ignore
        factionBorder
          .beginFill(borderColor.EX, baseOpacity)
          .lineStyle(t * nBS, borderColor.EX, 0.8)
          .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p)
          .beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity })
          .endFill();
        // .lineStyle(t*nBS, borderColor.EX, 0.8)
        // .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p);

        //@ts-ignore
        factionBorder
          .beginFill(borderColor.INT, baseOpacity)
          .lineStyle(h * nBS, borderColor.INT, 1.0)
          .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p)
          .beginTextureFill({ texture: textureINT, color: borderColor.INT, alpha: baseOpacity })
          .endFill();
        // .lineStyle(h*nBS, borderColor.INT, 1.0)
        // .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p);
      }
      //@ts-ignore
      factionBorder
        .lineStyle(t * nBS, borderColor.EX, 0.8)
        .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p);

      //@ts-ignore
      factionBorder
        .lineStyle(h * nBS, borderColor.INT, 1.0)
        .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p);
    }
    //@ts-ignore
    else if (hexTypes.includes(canvas.grid?.type) && token.data.width === 1 && token.data.height === 1) {
      const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, 'borderOffset');
      const q = Math.round(p / 2);
      //@ts-ignore
      const polygon = canvas.grid?.grid?.getPolygon(
        -1.5 - q + sW,
        -1.5 - q + sH,
        (token.w + 2) * s + p,
        (token.h + 2) * s + p,
      );

      if (fillTexture) {
        //@ts-ignore
        factionBorder
          .beginFill(borderColor.EX, baseOpacity)
          .lineStyle(t * nBS, borderColor.EX, 0.8)
          .drawPolygon(polygon)
          .beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity })
          .endFill();
        // .lineStyle(t*nBS, borderColor.EX, 0.8)
        // .drawPolygon(polygon);

        //@ts-ignore
        factionBorder
          .beginFill(borderColor.INT, baseOpacity)
          .lineStyle((t * nBS) / 2, borderColor.INT, 1.0)
          .drawPolygon(polygon)
          .beginTextureFill({ texture: textureINT, color: borderColor.INT, alpha: baseOpacity })
          .endFill();
        // .lineStyle(t*nBS / 2, borderColor.INT, 1.0)
        // .drawPolygon(polygon);
      }
      //@ts-ignore
      factionBorder.lineStyle(t * nBS, borderColor.EX, 0.8).drawPolygon(polygon);

      //@ts-ignore
      factionBorder.lineStyle((t * nBS) / 2, borderColor.INT, 1.0).drawPolygon(polygon);
    }

    // Otherwise Draw Square border
    else {
      const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, 'borderOffset');
      const q = Math.round(p / 2);
      const h = Math.round(t / 2);
      const o = Math.round(h / 2);

      if (fillTexture) {
        //@ts-ignore
        factionBorder
          .beginFill(borderColor.EX, baseOpacity)
          .lineStyle(t * nBS, borderColor.EX, 0.8)
          .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3)
          .beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity })
          .endFill();
        // .lineStyle(t*nBS, borderColor.EX, 0.8)
        // .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);

        //@ts-ignore
        factionBorder
          .beginFill(borderColor.INT, baseOpacity)
          .lineStyle(h * nBS, borderColor.INT, 1.0)
          .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3)
          .beginTextureFill({ texture: textureINT, color: borderColor.INT, alpha: baseOpacity })
          .endFill();
        // .lineStyle(h*nBS, borderColor.INT, 1.0)
        // .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);
      }
      //@ts-ignore
      factionBorder
        .lineStyle(t * nBS, borderColor.EX, 0.8)
        .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);

      //@ts-ignore
      factionBorder
        .lineStyle(h * nBS, borderColor.INT, 1.0)
        .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);
    }
  }
}
