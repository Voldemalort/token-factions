import { defaultColors, dispositions, TOKEN_FACTIONS_FLAGS } from "./Hooks.js";
import { getCanvas, getGame, TOKEN_FACTIONS_MODULE_NAME } from "./settings.js";
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
export const TokenFactions = ((canvas) => {
    // const defaultColors = {
    //   'party-member': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "partyColor"), //'#33bc4e',
    //   'party-npc': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "partyColor"), //'#33bc4e',
    //   'friendly-npc': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "friendlyColor"), //'#43dfdf',
    //   'neutral-npc': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "neutralColor"), //'#f1d836',
    //   'hostile-npc': getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "hostileColor"), //'#e72124',
    //   'controlled-npc' : getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "controlledColor"),
    //   'neutral-external-npc' : getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "neutralColorEx"),
    //   'friendly-external-npc' :  getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "friendlyColorEx"),
    //   'hostile-external-npc' :  getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "hostileColorEx"),
    //   'controlled-external-npc' :  getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "controlledColorEx"),
    //   'party-external-member' :  getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "partyColorEx"),
    //   'party-external-npc' :  getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "partyColorEx"),
    //   'target-npc' :  getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "targetColor"),
    //   'target-external-npc' :  getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, "targetColorEx"),
    // };
    // let dispositions = Object.keys(defaultColors);
    let bevelGradient;
    let bevelTexture;
    class TokenFactions {
        static async onInit(defaultColors, dispositions) {
            bevelGradient = await loadTexture(`modules/${TOKEN_FACTIONS_MODULE_NAME}/assets/bevel-gradient.jpg`);
            bevelTexture = await loadTexture(`modules/${TOKEN_FACTIONS_MODULE_NAME}/assets/bevel-texture.png`);
            dispositions.forEach((disposition) => {
                getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, `custom-${disposition}-color`, {
                    name: `Custom ${disposition.charAt(0).toUpperCase()}${disposition
                        .slice(1)
                        .replace(/-/g, ' ')
                        .replace(/npc/g, 'NPC')
                        .replace(/member/g, 'Member')} Color`,
                    scope: 'world',
                    config: true,
                    type: String,
                    default: defaultColors[disposition],
                });
            });
        }
        static renderSettingsConfig(sheet, html) {
            dispositions.forEach((disposition) => {
                const colorInput = document.createElement('input');
                colorInput.setAttribute('type', 'color');
                colorInput.setAttribute('value', html.find(`input[name="${TOKEN_FACTIONS_MODULE_NAME}.custom-${disposition}-color"]`).val());
                colorInput.setAttribute('data-edit', `${TOKEN_FACTIONS_MODULE_NAME}.custom-${disposition}-color`);
                html.find(`input[name="${TOKEN_FACTIONS_MODULE_NAME}.custom-${disposition}-color"]`).after(colorInput);
                $(colorInput).on('change', sheet._onChangeInput.bind(sheet));
            });
            html.find(`input[name="${TOKEN_FACTIONS_MODULE_NAME}.custom-hostile-npc-color"]`).parent().parent().after(`\
          <div class="form-group submenu">
            <label></label>
            <button name="${TOKEN_FACTIONS_MODULE_NAME}-colors-reset" type="button">
              <i class="fas fa-undo"></i>
              <label>Reset Colors</label>
            </button>
          </div>`);
            const resetColors = () => {
                dispositions.forEach((disposition) => {
                    const $input = html.find(`input[name="${TOKEN_FACTIONS_MODULE_NAME}.custom-${disposition}-color"]`);
                    const $color = $input.next();
                    $input.val(defaultColors[disposition]);
                    $color.val($input.val());
                });
            };
            const update = () => {
                const colorFrom = html.find(`select[name="${TOKEN_FACTIONS_MODULE_NAME}.color-from"]`).val();
                const customColorsEnabled = colorFrom === 'custom-disposition';
                dispositions.forEach((disposition) => {
                    const $input = html.find(`input[name="${TOKEN_FACTIONS_MODULE_NAME}.custom-${disposition}-color"]`);
                    const $color = $input.next();
                    const $fieldGroup = $input.parent().parent();
                    $input.prop('disabled', !customColorsEnabled).attr('class', 'color');
                    $color.prop('disabled', !customColorsEnabled);
                    if (!customColorsEnabled) {
                        $fieldGroup.hide();
                    }
                    else {
                        $fieldGroup.show();
                    }
                    $input.val($input.val() || defaultColors[disposition]);
                    $color.val($input.val());
                });
                const $resetButton = html.find(`button[name="${TOKEN_FACTIONS_MODULE_NAME}-colors-reset"]`);
                if (!customColorsEnabled) {
                    $resetButton.parent().hide();
                }
                else {
                    $resetButton.parent().show();
                }
            };
            update();
            html.find(`select[name="${TOKEN_FACTIONS_MODULE_NAME}.color-from"]`).change(update);
            html.find(`button[name="${TOKEN_FACTIONS_MODULE_NAME}-colors-reset"]`).click(resetColors);
        }
        static renderTokenConfig(sheet, html) {
            const token = sheet.object;
            //const flags = token.data.flags[TOKEN_FACTIONS_MODULE_NAME];
            const drawFramesByDefault = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'draw-frames-by-default');
            const drawFrameOverride = token.document.getFlag(TOKEN_FACTIONS_MODULE_NAME, TOKEN_FACTIONS_FLAGS.FACTION_DRAW_FRAME); // flags ? flags[TOKEN_FACTIONS_FLAGS.DRAW_FRAME] : undefined;
            const drawFrame = drawFrameOverride === undefined ? drawFramesByDefault : drawFrameOverride;
            const checked = drawFrame ? ' checked="checked"' : '';
            const skipDraw = token.document.getFlag(TOKEN_FACTIONS_MODULE_NAME, TOKEN_FACTIONS_FLAGS.FACTION_DISABLE); // flags ? flags[TOKEN_FACTIONS_FLAGS.FACTION_DISABLE] : undefined;
            const isDisabled = skipDraw ? ' checked="checked"' : '';
            html.find('input[name="mirrorY"]').parent().after(`\
        <div class="form-group">
          <label>Disable Faction Disposition Visualization</label>
          <input type="checkbox" name="flags.${TOKEN_FACTIONS_MODULE_NAME}.${TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}" data-dtype="Boolean"${isDisabled}>
        </div>
          <div class="form-group">
            <label>Overlay A Faction-Based Frame</label>
            <input type="checkbox" name="flags.${TOKEN_FACTIONS_MODULE_NAME}.${TOKEN_FACTIONS_FLAGS.FACTION_DRAW_FRAME}" data-dtype="Boolean"${checked}>
          </div>`);
        }
        static async updateTokens(tokenData) {
            let tokens;
            try {
                tokens = getCanvas().tokens?.placeables;
            }
            catch (e) {
                return;
            }
            if (!bevelGradient || !bevelGradient.baseTexture) {
                bevelGradient = await loadTexture(`modules/${TOKEN_FACTIONS_MODULE_NAME}/assets/bevel-gradient.jpg`);
                bevelTexture = await loadTexture(`modules/${TOKEN_FACTIONS_MODULE_NAME}/assets/bevel-texture.png`);
            }
            if (tokenData?._id) {
                const token = getCanvas().tokens?.placeables.find((tokenPlaceable) => tokenPlaceable.id === tokenData._id);
                if (token) {
                    tokens = [token];
                }
            }
            tokens.forEach((token) => {
                TokenFactions.updateTokenBase(token);
            });
        }
        static updateTokenBase(token) {
            //@ts-ignore
            if (token instanceof Token && token.icon && bevelTexture && bevelTexture.baseTexture) {
                // const flags = <Record<string, unknown>>token.data.flags[TOKEN_FACTIONS_MODULE_NAME];
                const skipDraw = token.document.getFlag(TOKEN_FACTIONS_MODULE_NAME, TOKEN_FACTIONS_FLAGS.FACTION_DISABLE); // flags ? flags[TOKEN_FACTIONS_FLAGS.FACTION_DISABLE] : undefined;
                if (skipDraw) {
                    return;
                }
                const drawFramesByDefault = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'draw-frames-by-default');
                const drawFrameOverride = token.document.getFlag(TOKEN_FACTIONS_MODULE_NAME, TOKEN_FACTIONS_FLAGS.FACTION_DRAW_FRAME); // flags ? flags[TOKEN_FACTIONS_FLAGS.DRAW_FRAME] : undefined;
                const drawFrame = drawFrameOverride === undefined ? drawFramesByDefault : drawFrameOverride;
                const colorFrom = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'color-from');
                let color;
                // let child = 0;
                // try {
                //   //@ts-ignore
                //   child = token.getChildIndex(token.icon); // token['icon']
                // } catch (e) {
                //   // WHY THIS ???????????????
                // }
                // if (child) {
                //   //@ts-ignore
                //   token.factionBase.clear();
                //   // if (token.factionBase) {
                //   //   //@ts-ignore
                //   //   token.factionBase.destroy({ children: true });
                //   // }
                //   //@ts-ignore
                //   token.factionBase = token.addChildAt(new PIXI.Container(), child - 1);
                //   //@ts-ignore
                //   token.factionFrame.clear();
                //   // if (token.factionFrame) {
                //   //   //@ts-ignore
                //   //   token.factionFrame.destroy({ children: true });
                //   // }
                //   //@ts-ignore
                //   token.factionFrame = token.addChildAt(new PIXI.Container(), child + (drawFrame ? 1 : -1));
                // }
                //@ts-ignore
                if (!token.factionBase) {
                    //@ts-ignore
                    token.factionBase = token.addChildAt(new PIXI.Container(), token.getChildIndex(token.icon) - 1);
                }
                else {
                    //@ts-ignore
                    token.factionBase.removeChildren().forEach(c => c.destroy());
                }
                //@ts-ignore
                if (!token.factionFrame) {
                    //@ts-ignore
                    token.factionFrame = token.addChildAt(new PIXI.Container(), token.getChildIndex(token.icon) + 1);
                }
                else {
                    //@ts-ignore
                    token.factionFrame.removeChildren().forEach(c => c.destroy());
                }
                if (colorFrom === 'token-disposition') {
                    color = TokenFactions.getDispositionColor(token);
                }
                else if (colorFrom === 'actor-folder-color') {
                    color = TokenFactions.getFolderColor(token);
                }
                else {
                    // colorFrom === 'custom-disposition'
                    color = TokenFactions.getCustomDispositionColor(token);
                }
                if (color) {
                    if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'fillTexture')) {
                        //@ts-ignore
                        TokenFactions.drawBase(color, token.factionBase, token);
                    }
                    if (drawFrame) {
                        //@ts-ignore
                        TokenFactions.drawFrame(color, token.factionFrame, token);
                    }
                    else {
                        //@ts-ignore
                        TokenFactions.drawFrame(color, token.factionBase, token);
                    }
                }
            }
        }
        static drawBase(color, container, token) {
            const base = container.addChild(new PIXI.Graphics());
            const frameWidth = getCanvas().grid?.grid?.w *
                (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'frame-width') / 100);
            const baseOpacity = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'base-opacity');
            base.alpha = baseOpacity;
            base
                .lineStyle(0)
                .beginFill(color, 1.0)
                .drawCircle(token.w / 2, token.h / 2, token.w / 2 - frameWidth)
                .beginFill(0x000000, 0.25 * baseOpacity)
                .drawCircle(token.w / 2, token.h / 2, token.w / 2 - frameWidth);
        }
        static drawFrame(color, container, token) {
            const frameWidth = getCanvas().grid?.grid?.w *
                (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'frame-width') / 100);
            const frameStyle = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'frame-style');
            const frameOpacity = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'frame-opacity');
            function drawGradient() {
                const bg = new PIXI.Sprite(bevelGradient);
                bg.anchor.set(0.0, 0.0);
                bg.width = token.w;
                bg.height = token.h;
                bg.tint = color;
                return bg;
            }
            function drawTexture() {
                const bg = new PIXI.Sprite(bevelTexture);
                bg.anchor.set(0.0, 0.0);
                bg.width = 400;
                bg.height = 400;
                bg.tint = color;
                return bg;
            }
            if (frameWidth) {
                if (frameStyle === 'flat') {
                    const frame = container.addChild(new PIXI.Graphics());
                    frame.lineStyle(frameWidth, color, 1.0, 0).drawCircle(token.w / 2, token.h / 2, token.w / 2);
                    frame.alpha = frameOpacity;
                }
                else {
                    // frameStyle === 'bevelled'
                    const outerRing = drawGradient();
                    const innerRing = drawGradient();
                    const ringTexture = drawTexture();
                    const outerRingMask = new PIXI.Graphics();
                    const innerRingMask = new PIXI.Graphics();
                    const ringTextureMask = new PIXI.Graphics();
                    outerRing.alpha = frameOpacity;
                    innerRing.alpha = frameOpacity;
                    ringTexture.alpha = frameOpacity;
                    innerRing.pivot.set(1000.0, 1000.0);
                    innerRing.angle = 180;
                    outerRingMask
                        .lineStyle(frameWidth / 2, 0xffffff, 1.0, 0)
                        .beginFill(0xffffff, 0.0)
                        .drawCircle(token.w / 2, token.h / 2, token.w / 2);
                    innerRingMask
                        .lineStyle(frameWidth / 2, 0xffffff, 1.0, 0)
                        .beginFill(0xffffff, 0.0)
                        .drawCircle(token.w / 2, token.h / 2, token.w / 2 - frameWidth / 2);
                    ringTextureMask
                        .lineStyle(frameWidth, 0xffffff, 1.0, 0)
                        .beginFill(0xffffff, 0.0)
                        .drawCircle(token.w / 2, token.h / 2, token.w / 2);
                    container.addChild(outerRing);
                    container.addChild(outerRingMask);
                    outerRing.mask = outerRingMask;
                    container.addChild(innerRing);
                    container.addChild(innerRingMask);
                    innerRing.mask = innerRingMask;
                    container.addChild(ringTexture);
                    container.addChild(ringTextureMask);
                    ringTexture.mask = ringTextureMask;
                }
            }
        }
        static getFolderColor(token) {
            let color;
            if (token.actor && token.actor.folder && token.actor.folder.data && token.actor.folder.data.color) {
                color = colorStringToHex(token.actor.folder.data.color);
            }
            return color;
        }
        static getDispositionColor(token) {
            const disposition = dispositionKey(token);
            let color;
            if (disposition) {
                color = colorStringToHex(defaultColors[disposition]);
            }
            return color;
        }
        static getCustomDispositionColor(token) {
            const disposition = dispositionKey(token);
            let color;
            if (disposition) {
                color = colorStringToHex(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, `custom-${disposition}-color`));
            }
            return color;
        }
    }
    // REMOVED
    //TokenFactions['tokenRefresh'] = Token.prototype.refresh;
    return TokenFactions;
})();
//   Token.prototype.refresh = function refresh() {
//     TokenFactions.tokenRefresh.bind(this)();
//     TokenFactions.updateTokens(this);
//   };
//   Hooks.once('init', TokenFactions.onInit);
//   Hooks.on('renderSettingsConfig', TokenFactions.renderSettingsConfig);
//   Hooks.on('renderTokenConfig', TokenFactions.renderTokenConfig);
//   Hooks.on('updateActor', TokenFactions.updateTokens);
//   Hooks.on('updateFolder', TokenFactions.updateTokens);
//   Hooks.on('ready', () => {
//     Hooks.on('closeSettingsConfig', TokenFactions.updateTokens);
//   });
// export const TokenPrototypeRefreshHandler = function (wrapped, ...args) {
//   const tokenData = this as TokenData;
//   TokenFactions.updateTokens(tokenData);
//   return wrapped(...args);
// };
