import { i18n } from "../main.js";
import { getCanvas, getGame, TOKEN_FACTIONS_MODULE_NAME } from "./settings.js";
import { FactionGraphic } from "./TokenFactionsModels.js";
export class TokenFactions {
    static async onInit() {
        TokenFactions.defaultColors = {
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
        TokenFactions.dispositions = Object.keys(TokenFactions.defaultColors);
        TokenFactions.bevelGradient = await loadTexture(`modules/${TOKEN_FACTIONS_MODULE_NAME}/assets/bevel-gradient.jpg`);
        TokenFactions.bevelTexture = await loadTexture(`modules/${TOKEN_FACTIONS_MODULE_NAME}/assets/bevel-texture.png`);
        // dispositions.forEach((disposition) => {
        //   getGame().settings.register(TOKEN_FACTIONS_MODULE_NAME, `custom-${disposition}-color`, {
        //     name: `Custom ${disposition.charAt(0).toUpperCase()}${disposition
        //       .slice(1)
        //       .replace(/-/g, ' ')
        //       .replace(/npc/g, 'NPC')
        //       .replace(/member/g, 'Member')} Color`,
        //     scope: 'world',
        //     config: true,
        //     type: String,
        //     default: defaultColors[disposition],
        //   });
        // });
        // currentSystem = getGame().system.id;
    }
    // static renderSettingsConfig(sheet, html) {
    //   dispositions.forEach((disposition) => {
    //     const colorInput = document.createElement('input');
    //     colorInput.setAttribute('type', 'color');
    //     colorInput.setAttribute(
    //       'value',
    //       html.find(`input[name="${TOKEN_FACTIONS_MODULE_NAME}.custom-${disposition}-color"]`).val(),
    //     );
    //     colorInput.setAttribute('data-edit', `${TOKEN_FACTIONS_MODULE_NAME}.custom-${disposition}-color`);
    //     html.find(`input[name="${TOKEN_FACTIONS_MODULE_NAME}.custom-${disposition}-color"]`).after(colorInput);
    //     $(colorInput).on('change', sheet._onChangeInput.bind(sheet));
    //   });
    //   html.find(`input[name="${TOKEN_FACTIONS_MODULE_NAME}.custom-hostile-npc-color"]`).parent().parent().after(`\
    //       <div class="form-group submenu">
    //         <label></label>
    //         <button name="${TOKEN_FACTIONS_MODULE_NAME}-colors-reset" type="button">
    //           <i class="fas fa-undo"></i>
    //           <label>Reset Colors</label>
    //         </button>
    //       </div>`);
    //   const resetColors = () => {
    //     dispositions.forEach((disposition) => {
    //       const $input = html.find(`input[name="${TOKEN_FACTIONS_MODULE_NAME}.custom-${disposition}-color"]`);
    //       const $color = $input.next();
    //       $input.val(defaultColors[disposition]);
    //       $color.val($input.val());
    //     });
    //   };
    //   const update = () => {
    //     const colorFrom = html.find(`select[name="${TOKEN_FACTIONS_MODULE_NAME}.color-from"]`).val();
    //     const customColorsEnabled = colorFrom === 'custom-disposition';
    //     dispositions.forEach((disposition) => {
    //       const $input = html.find(`input[name="${TOKEN_FACTIONS_MODULE_NAME}.custom-${disposition}-color"]`);
    //       const $color = $input.next();
    //       const $fieldGroup = $input.parent().parent();
    //       $input.prop('disabled', !customColorsEnabled).attr('class', 'color');
    //       $color.prop('disabled', !customColorsEnabled);
    //       if (!customColorsEnabled) {
    //         $fieldGroup.hide();
    //       } else {
    //         $fieldGroup.show();
    //       }
    //       $input.val($input.val() || defaultColors[disposition]);
    //       $color.val($input.val());
    //     });
    //     const $resetButton = html.find(`button[name="${TOKEN_FACTIONS_MODULE_NAME}-colors-reset"]`);
    //     if (!customColorsEnabled) {
    //       $resetButton.parent().hide();
    //     } else {
    //       $resetButton.parent().show();
    //     }
    //   };
    //   update();
    //   html.find(`select[name="${TOKEN_FACTIONS_MODULE_NAME}.color-from"]`).change(update);
    //   html.find(`button[name="${TOKEN_FACTIONS_MODULE_NAME}-colors-reset"]`).click(resetColors);
    // }
    static renderTokenConfig(config, html) {
        const token = config.object;
        const factions = token.factions;
        const skipDraw = token.getFlag(TOKEN_FACTIONS_MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE);
        /*
        const drawFramesByDefault = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'draw-frames-by-default');
        const drawFrameOverride = token.getFlag(
          TOKEN_FACTIONS_MODULE_NAME,
          TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DRAW_FRAME,
        );
        const drawFrame = drawFrameOverride === undefined ? drawFramesByDefault : drawFrameOverride;
        const checked = drawFrame ? ' checked="checked"' : '';
       
        html.find('input[name="mirrorY"]').parent().after(`\
          <div class="form-group">
            <label>Disable Faction Disposition Visualization</label>
            <input type="checkbox" name="flags.${TOKEN_FACTIONS_MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}" data-dtype="Boolean"${isDisabled}>
          </div>
            <div class="form-group">
              <label>Overlay A Faction-Based Frame</label>
              <input type="checkbox" name="flags.${TOKEN_FACTIONS_MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DRAW_FRAME}" data-dtype="Boolean"${checked}>
            </div>`);
        */
        // Expand the width
        config.position.width = 540;
        config.setPosition(config.position);
        const nav = html.find('nav.sheet-tabs.tabs');
        nav.append($(`
			<a class="item" data-tab="factions">
				<i class="far fa-dot-angry"></i>
				${i18n('token-factions.label.factions')}
			</a>
		`));
        const formConfig = ``;
        //   <div class="form-group">
        //     <label>${i18n('token-factions.label.factions.customDisable')}</label>
        //     <input type="checkbox" name="flags.${TOKEN_FACTIONS_MODULE_NAME}"."${
        //   TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
        // }" 
        //       data-dtype="Boolean" ${skipDraw ? 'checked' : ''}>
        //   </div>`;
        // const auraConfig = factions.map((faction, idx) => `
        //   <div class="form-group">
        //     <label>${i18n('token-factions.label.factions.customColor')}</label>
        //     <div class="form-fields">
        //       <input class="color" type="text" value="${faction.colour}"
        //             name="flags.token-auras.aura${idx + 1}.colour">
        //       <input type="color" value="${faction.colour}"
        //             data-edit="flags.token-auras.aura${idx + 1}.colour">
        //     </div>
        // </div>`
        nav
            .parent()
            .find('footer')
            .before($(`
			<div class="tab" data-tab="factions">
				${formConfig}
			</div>
		`));
        nav
            .parent()
            .find('.tab[data-tab="factions"] input[type="checkbox"][data-edit]')
            .change(config._onChangeInput.bind(config));
        nav
            .parent()
            .find('.tab[data-tab="factions"] input[type="color"][data-edit]')
            .change(config._onChangeInput.bind(config));
    }
    static async updateTokenData(tokenData) {
        let tokens;
        try {
            tokens = getCanvas().tokens?.placeables;
        }
        catch (e) {
            return;
        }
        if (!TokenFactions.bevelGradient || !TokenFactions.bevelGradient.baseTexture) {
            TokenFactions.bevelGradient = await loadTexture(`modules/${TOKEN_FACTIONS_MODULE_NAME}/assets/bevel-gradient.jpg`);
            TokenFactions.bevelTexture = await loadTexture(`modules/${TOKEN_FACTIONS_MODULE_NAME}/assets/bevel-texture.png`);
        }
        if (tokenData?._id) {
            const token = getCanvas().tokens?.placeables.find((tokenPlaceable) => tokenPlaceable.id === tokenData._id);
            if (token) {
                tokens = [token];
            }
        }
        tokens.forEach((token) => {
            TokenFactions.updateToken(token);
        });
    }
    static updateToken(token) {
        //@ts-ignore
        if (token instanceof Token && token.icon && TokenFactions.bevelTexture && TokenFactions.bevelTexture.baseTexture) {
            // const color = TokenFactions.colorBorderFaction(token);
            // if (!color.INT) {
            //   //@ts-ignore
            //   if (token.factions) {
            //     //@ts-ignore
            //     token.factions.removeChildren().forEach((c) => c.destroy());
            //   }
            //   return;
            // }
            // const skipDraw = token.document.getFlag(TOKEN_FACTIONS_MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE);
            // if (skipDraw) {
            //   return;
            // }
            // const drawFramesByDefault = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'draw-frames-by-default');
            // const drawFrameOverride = token.document.getFlag(
            //   TOKEN_FACTIONS_MODULE_NAME,
            //   TOKEN_FACTIONS_FLAGS.FACTION_DRAW_FRAME,
            // );
            // const drawFrame = drawFrameOverride === undefined ? drawFramesByDefault : drawFrameOverride;
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
            // //@ts-ignore
            // if (!token.factionBase) {
            //   //@ts-ignore
            //   token.factionBase = token.addChildAt(new PIXI.Container(), token.getChildIndex(token.icon) - 1);
            // } else {
            //   //@ts-ignore
            //   token.factionBase.removeChildren().forEach((c) => c.destroy());
            // }
            // //@ts-ignore
            // if (!token.factionFrame) {
            //   //@ts-ignore
            //   token.factionFrame = token.addChildAt(new PIXI.Container(), token.getChildIndex(token.icon) + 1);
            // } else {
            //   //@ts-ignore
            //   token.factionFrame.removeChildren().forEach((c) => c.destroy());
            // }
            //@ts-ignore
            if (!token.factions) {
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
        }
    }
    // private static drawBase(color: number, container, token: Token) {
    //   const base = container.addChild(new PIXI.Graphics());
    //   const frameWidth =
    //     <number>getCanvas().grid?.grid?.w *
    //     (<number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'frame-width') / 100);
    //   const baseOpacity = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'base-opacity');
    //   base.alpha = baseOpacity;
    //   base
    //     .lineStyle(0)
    //     .beginFill(color, 1.0)
    //     .drawCircle(token.w / 2, token.h / 2, token.w / 2 - frameWidth)
    //     .beginFill(0x000000, 0.25 * baseOpacity)
    //     .drawCircle(token.w / 2, token.h / 2, token.w / 2 - frameWidth);
    // }
    // static drawFrame(color: number, container:PIXI.Container, token: Token) {
    //   const frameWidth =
    //     <number>getCanvas().grid?.grid?.w *
    //     (<number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'frame-width') / 100);
    //   const frameStyle = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'frame-style');
    //   const frameOpacity = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'frame-opacity');
    //   function drawGradient() {
    //     const bg = new PIXI.Sprite(bevelGradient);
    //     bg.anchor.set(0.0, 0.0);
    //     bg.width = token.w;
    //     bg.height = token.h;
    //     bg.tint = color;
    //     return bg;
    //   }
    //   function drawTexture() {
    //     const bg = new PIXI.Sprite(TokenFactions.bevelTexture);
    //     bg.anchor.set(0.0, 0.0);
    //     bg.width = 400;
    //     bg.height = 400;
    //     bg.tint = color;
    //     return bg;
    //   }
    //   if (frameWidth) {
    //     if (frameStyle === TOKEN_FACTIONS_FRAME_STYLE.FLAT) {
    //       const frame = container.addChild(new PIXI.Graphics());
    //       frame
    //         .lineStyle(frameWidth, color, 1.0, 0)
    //         .drawCircle(token.w / 2, token.h / 2, token.w / 2);
    //       frame.alpha = frameOpacity;
    //     } else if( TOKEN_FACTIONS_FRAME_STYLE.BELEVELED){
    //       // frameStyle === 'bevelled'
    //       const outerRing = drawGradient();
    //       const innerRing = drawGradient();
    //       const ringTexture = drawTexture();
    //       const outerRingMask = new PIXI.Graphics();
    //       const innerRingMask = new PIXI.Graphics();
    //       const ringTextureMask = new PIXI.Graphics();
    //       outerRing.alpha = <number>frameOpacity;
    //       innerRing.alpha = <number>frameOpacity;
    //       ringTexture.alpha = <number>frameOpacity;
    //       innerRing.pivot.set(1000.0, 1000.0);
    //       innerRing.angle = 180;
    //       outerRingMask
    //         .lineStyle(frameWidth / 2, 0xffffff, 1.0, 0)
    //         .beginFill(0xffffff, 0.0)
    //         .drawCircle(token.w / 2, token.h / 2, token.w / 2);
    //       innerRingMask
    //         .lineStyle(frameWidth / 2, 0xffffff, 1.0, 0)
    //         .beginFill(0xffffff, 0.0)
    //         .drawCircle(token.w / 2, token.h / 2, token.w / 2 - frameWidth / 2);
    //       ringTextureMask
    //         .lineStyle(frameWidth, 0xffffff, 1.0, 0)
    //         .beginFill(0xffffff, 0.0)
    //         .drawCircle(token.w / 2, token.h / 2, token.w / 2);
    //       container.addChild(outerRing);
    //       container.addChild(outerRingMask);
    //       outerRing.mask = outerRingMask;
    //       container.addChild(innerRing);
    //       container.addChild(innerRingMask);
    //       innerRing.mask = innerRingMask;
    //       container.addChild(ringTexture);
    //       container.addChild(ringTextureMask);
    //       ringTexture.mask = ringTextureMask;
    //     }
    //   }
    // }
    // START NEW MANAGE
    static AddBorderToggle(app, html, data) {
        if (!getGame().user?.isGM) {
            return;
        }
        if (!getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'enableHud')) {
            return;
        }
        const buttonPos = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hudPos');
        const borderButton = `<div class="control-icon factionBorder ${app.object.getFlag(TOKEN_FACTIONS_MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE) ? 'active' : ''}" title="Toggle Faction Border"> <i class="fas fa-angry"></i></div>`;
        const Pos = html.find(buttonPos);
        Pos.append(borderButton);
        html.find('.factionBorder').click(this.ToggleBorder.bind(app));
    }
    static async ToggleBorder(event) {
        //@ts-ignore
        const border = this.object.document.getFlag(TOKEN_FACTIONS_MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE);
        //@ts-ignore
        await this.object.document.setFlag(TOKEN_FACTIONS_MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE, !border);
        event.currentTarget.classList.toggle('active', !border);
        //@ts-ignore
        // TokenFactions.updateToken(this.object);
    }
    static clamp(value, max, min) {
        return Math.min(Math.max(value, min), max);
    }
    static componentToHex(c) {
        const hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }
    static rgbToHex(A) {
        if (A[0] === undefined || A[1] === undefined || A[2] === undefined)
            console.error('RGB color invalid');
        return ('#' + TokenFactions.componentToHex(A[0]) + TokenFactions.componentToHex(A[1]) + TokenFactions.componentToHex(A[2]));
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
            interpolatedColorArray.push(TokenFactions.interpolateColor(color1, color2, stepFactor * i));
        }
        return interpolatedColorArray;
    }
    static refreshAll() {
        getCanvas().tokens?.placeables.forEach((t) => t.draw());
    }
    // ADDED
    static async updateTokensAll() {
        getCanvas().tokens?.placeables.forEach((tokenDoc) => {
            TokenFactions.updateTokensBorder(tokenDoc.data);
        });
    }
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
            // //@ts-ignore
            // if (!token.factionFrame) {
            //   //@ts-ignore
            //   token.factionFrame = token.addChildAt(new PIXI.Container(), token.getChildIndex(token.icon) + 1);
            // } else {
            //   //@ts-ignore
            //   token.factionFrame.removeChildren().forEach((c) => c.destroy());
            // }
            //@ts-ignore
            if (!token.factions) {
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
    static colorBorderFaction(token) {
        const colorFrom = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'color-from');
        let color;
        let icon;
        if (colorFrom === 'token-disposition') {
            const disposition = TokenFactions.dispositionKey(token);
            if (disposition) {
                color = TokenFactions.defaultColors[disposition];
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
            // TODO PUT SOME NEW FLAG ON THE TOKEN
            const disposition = TokenFactions.dispositionKey(token);
            if (disposition) {
                color = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, `custom-${disposition}-color`);
            }
        }
        const overrides = {
            CONTROLLED: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'controlledColor')).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'controlledColorEx')).substr(1), 16),
                ICON: '',
            },
            FRIENDLY: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColor')).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'friendlyColorEx')).substr(1), 16),
                ICON: '',
            },
            NEUTRAL: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'neutralColor')).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'neutralColorEx')).substr(1), 16),
                ICON: '',
            },
            HOSTILE: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hostileColor')).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'hostileColorEx')).substr(1), 16),
                ICON: '',
            },
            PARTY: {
                INT: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColor')).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'partyColorEx')).substr(1), 16),
                ICON: '',
            },
            ACTOR_FOLDER_COLOR: {
                INT: parseInt(String(color).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'actorFolderColorEx')).substr(1), 16),
                ICON: icon ? String(icon) : '',
            },
            CUSTOM_DISPOSITION: {
                INT: parseInt(String(color).substr(1), 16),
                EX: parseInt(String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'customDispositionColorEx')).substr(1), 16),
                ICON: '',
            },
        };
        let borderColor = new FactionGraphic();
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
    // static moveArrayItemToNewIndex(arr, old_index, new_index) {
    //   if (new_index >= arr.length) {
    //       let k = new_index - arr.length + 1;
    //       while (k--) {
    //           arr.push(undefined);
    //       }
    //   }
    //   arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    //   return arr;
    // }
    static async drawBorderFaction(token, container) {
        //@ts-ignore
        container.removeChildren().forEach((c) => c.destroy());
        // let factionBorder = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'overrideBorderGraphic')
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
        switch (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'removeBorders')) {
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
            skipDraw = token.document.getFlag(TOKEN_FACTIONS_MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE);
        }
        catch (e) {
            //@ts-ignore
            await token.document.setFlag(TOKEN_FACTIONS_MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE, false);
            skipDraw = token.document.getFlag(TOKEN_FACTIONS_MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE);
        }
        //@ts-ignore
        if (skipDraw) {
            return;
        }
        //@ts-ignore
        let factionBorder = container.addChild(new PIXI.Graphics());
        const frameStyle = String(getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'frame-style'));
        token.sortableChildren = true;
        if (frameStyle == TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.FLAT) {
            // frameStyle === 'flat'
            if (!factionBorder) {
                factionBorder = container.addChild(new PIXI.Graphics());
            }
            const fillTexture = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'fillTexture');
            TokenFactions.drawBorder(token, borderColor, factionBorder, fillTexture);
        }
        else if (frameStyle == TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.BELEVELED) {
            // frameStyle === 'bevelled'
            if (!factionBorder) {
                factionBorder = container.addChild(new PIXI.Graphics());
            }
            const fillTexture = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'fillTexture');
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
            const fillTexture = <boolean>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'fillTexture');
            if (fillTexture) {
              // const base = container.addChild(new PIXI.Graphics());
              // base.alpha = baseOpacity;
              // base
              //   .lineStyle(0)
              //   .beginFill(borderTextureMask.INT, 1.0)
              //   .drawCircle(token.w / 2, token.h / 2, token.w / 2 - t)
              //   .beginFill(0x000000, 0.25 * baseOpacity)
              //   .drawCircle(token.w / 2, token.h / 2, token.w / 2 - t);
      
              const borderTextureMask = borderColor;
              borderTextureMask.EX = 0x000000;
      
              const factionBorder = container.addChild(new PIXI.Graphics());
              factionBorder.alpha = baseOpacity;
      
              // Draw Hex border for size 1 tokens on a hex grid
              const gt = CONST.GRID_TYPES;
              const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];
      
              if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'circleBorders')) {
                const p = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
                const h = Math.round(t / 2);
                const o = Math.round(h / 2);
          
                //@ts-ignore
                factionBorder
                  .beginFill(borderTextureMask.EX, baseOpacity)
                  .drawCircle(token.w / 2, token.h / 2, token.w / 2 + t + p)
                  .beginTextureFill({ texture: PIXI.Texture.EMPTY, color: borderTextureMask.EX, alpha: baseOpacity })
                  .lineStyle(t, borderTextureMask.EX, 0)
                  .endFill()
                  .lineStyle(t, borderTextureMask.EX, 0.8)
                  .drawCircle(token.w / 2, token.h / 2, token.w / 2 + t + p);
        
                //@ts-ignore
                factionBorder
                  .beginFill(borderTextureMask.INT, baseOpacity)
                  .drawCircle(token.w / 2, token.h / 2, token.w / 2 + h + t / 2 + p)
                  .beginTextureFill({ texture: PIXI.Texture.EMPTY, color: borderTextureMask.INT, alpha: baseOpacity })
                  .lineStyle(h, borderTextureMask.INT, 0)
                  .endFill()
                  .lineStyle(h, borderTextureMask.INT, 1.0)
                  .drawCircle(token.w / 2, token.h / 2, token.w / 2 + h + t / 2 + p);
                
              }
              //@ts-ignore
              else if (hexTypes.includes(getCanvas().grid?.type) && token.data.width === 1 && token.data.height === 1) {
                const p = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
                const q = Math.round(p / 2);
                //@ts-ignore
                const polygon = getCanvas().grid?.grid?.getPolygon(-1.5 - q, -1.5 - q, token.w + 2 + p, token.h + 2 + p);
          
                //@ts-ignore
                factionBorder
                  .beginFill(borderTextureMask.EX, baseOpacity)
                  .drawPolygon(polygon)
                  .beginTextureFill({ texture: PIXI.Texture.EMPTY, color: borderTextureMask.EX, alpha: baseOpacity })
                  .lineStyle(t, borderTextureMask.EX, 0)
                  .endFill()
                  .lineStyle(t, borderTextureMask.EX, 0.8)
                  .drawPolygon(polygon);
        
                //@ts-ignore
                factionBorder
                  .beginFill(borderTextureMask.INT, baseOpacity)
                  .drawPolygon(polygon)
                  .beginTextureFill({ texture: PIXI.Texture.EMPTY, color: borderTextureMask.INT, alpha: baseOpacity })
                  .lineStyle(t / 2, borderTextureMask.INT, 0)
                  .endFill()
                  .lineStyle(t / 2, borderTextureMask.INT, 1.0)
                  .drawPolygon(polygon);
                
              }
              // Otherwise Draw Square border
              else {
                const p = <number>getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
                const q = Math.round(p / 2);
                const h = Math.round(t / 2);
                const o = Math.round(h / 2);
          
                //@ts-ignore
                factionBorder
                  .beginFill(borderTextureMask.EX, baseOpacity)
                  .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3)
                  .beginTextureFill({ texture: PIXI.Texture.EMPTY, color: borderTextureMask.EX, alpha: baseOpacity })
                  .lineStyle(t, borderTextureMask.EX, 0)
                  .endFill()
                  .lineStyle(t, borderTextureMask.EX, 0.8)
                  .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3);
        
                //@ts-ignore
                factionBorder
                  .beginFill(borderTextureMask.INT, baseOpacity)
                  .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3)
                  .beginTextureFill({ texture: PIXI.Texture.EMPTY, color: borderTextureMask.INT, alpha: baseOpacity })
                  .lineStyle(h, borderTextureMask.INT, 0)
                  .endFill()
                  .lineStyle(h, borderTextureMask.INT, 1.0)
                  .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3);
                
              }
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
        }
        else {
            if (!factionBorder) {
                factionBorder = container.addChild(new PIXI.Graphics());
            }
            const fillTexture = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'fillTexture');
            TokenFactions.drawBorder(token, borderColor, factionBorder, fillTexture);
        }
    }
    static drawBorder(token, borderColor, factionBorder, fillTexture) {
        const t = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderWidth') || CONFIG.Canvas.objectBorderThickness;
        const frameOpacity = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'frame-opacity') || 0.5;
        const baseOpacity = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'base-opacity') || 0.5;
        const textureINT = borderColor.TEXTURE_INT || PIXI.Texture.EMPTY; //await PIXI.Texture.fromURL(<string>token.data.img) || PIXI.Texture.EMPTY;
        const textureEX = borderColor.TEXTURE_EX || PIXI.Texture.EMPTY;
        factionBorder.alpha = frameOpacity;
        // Draw Hex border for size 1 tokens on a hex grid
        const gt = CONST.GRID_TYPES;
        const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];
        if (getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'circleBorders')) {
            const p = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
            const h = Math.round(t / 2);
            const o = Math.round(h / 2);
            if (fillTexture) {
                //@ts-ignore
                factionBorder
                    .beginFill(borderColor.EX, baseOpacity)
                    .drawCircle(token.w / 2, token.h / 2, token.w / 2 + t + p)
                    .beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity })
                    .lineStyle(t, borderColor.EX, 0.8)
                    .endFill();
                // .lineStyle(t, borderColor.EX, 0.8)
                // .drawCircle(token.w / 2, token.h / 2, token.w / 2 + t + p);
                //@ts-ignore
                factionBorder
                    .beginFill(borderColor.INT, baseOpacity)
                    .drawCircle(token.w / 2, token.h / 2, token.w / 2 + h + t / 2 + p)
                    .beginTextureFill({ texture: textureINT, color: borderColor.INT, alpha: baseOpacity })
                    .lineStyle(h, borderColor.INT, 1.0)
                    .endFill();
                // .lineStyle(h, borderColor.INT, 1.0)
                // .drawCircle(token.w / 2, token.h / 2, token.w / 2 + h + t / 2 + p);
            }
            //@ts-ignore
            factionBorder.lineStyle(t, borderColor.EX, 0.8).drawCircle(token.w / 2, token.h / 2, token.w / 2 + t + p);
            //@ts-ignore
            factionBorder
                .lineStyle(h, borderColor.INT, 1.0)
                .drawCircle(token.w / 2, token.h / 2, token.w / 2 + h + t / 2 + p);
        }
        //@ts-ignore
        else if (hexTypes.includes(getCanvas().grid?.type) && token.data.width === 1 && token.data.height === 1) {
            const p = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
            const q = Math.round(p / 2);
            //@ts-ignore
            const polygon = getCanvas().grid?.grid?.getPolygon(-1.5 - q, -1.5 - q, token.w + 2 + p, token.h + 2 + p);
            if (fillTexture) {
                //@ts-ignore
                factionBorder
                    .beginFill(borderColor.EX, baseOpacity)
                    .drawPolygon(polygon)
                    .beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity })
                    .lineStyle(t, borderColor.EX, 0.8)
                    .endFill();
                // .lineStyle(t, borderColor.EX, 0.8)
                // .drawPolygon(polygon);
                //@ts-ignore
                factionBorder
                    .beginFill(borderColor.INT, baseOpacity)
                    .drawPolygon(polygon)
                    .beginTextureFill({ texture: textureINT, color: borderColor.INT, alpha: baseOpacity })
                    .lineStyle(t / 2, borderColor.INT, 1.0)
                    .endFill();
                // .lineStyle(t / 2, borderColor.INT, 1.0)
                // .drawPolygon(polygon);
            }
            //@ts-ignore
            factionBorder.lineStyle(t, borderColor.EX, 0.8).drawPolygon(polygon);
            //@ts-ignore
            factionBorder.lineStyle(t / 2, borderColor.INT, 1.0).drawPolygon(polygon);
        }
        // Otherwise Draw Square border
        else {
            const p = getGame().settings.get(TOKEN_FACTIONS_MODULE_NAME, 'borderOffset');
            const q = Math.round(p / 2);
            const h = Math.round(t / 2);
            const o = Math.round(h / 2);
            if (fillTexture) {
                //@ts-ignore
                factionBorder
                    .beginFill(borderColor.EX, baseOpacity)
                    .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3)
                    .beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity })
                    .lineStyle(t, borderColor.EX, 0.8)
                    .endFill();
                // .lineStyle(t, borderColor.EX, 0.8)
                // .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3);
                //@ts-ignore
                factionBorder
                    .beginFill(borderColor.INT, baseOpacity)
                    .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3)
                    .beginTextureFill({ texture: textureINT, color: borderColor.INT, alpha: baseOpacity })
                    .lineStyle(h, borderColor.INT, 1.0)
                    .endFill();
                // .lineStyle(h, borderColor.INT, 1.0)
                // .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3);
            }
            //@ts-ignore
            factionBorder
                .lineStyle(t, borderColor.EX, 0.8)
                .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3);
            //@ts-ignore
            factionBorder
                .lineStyle(h, borderColor.INT, 1.0)
                .drawRoundedRect(-o - q, -o - q, token.w + h + p, token.h + h + p, 3);
        }
    }
}
/*
 * The allowed Token disposition types
 * HOSTILE - Displayed as an enemy with a red border
 * NEUTRAL - Displayed as neutral with a yellow border
 * FRIENDLY - Displayed as an ally with a cyan border
 */
TokenFactions.TOKEN_DISPOSITIONS = {
    HOSTILE: -1,
    NEUTRAL: 0,
    FRIENDLY: 1,
};
TokenFactions.TOKEN_FACTIONS_FLAGS = {
    FACTION_DRAW_FRAME: 'factionDrawFrame',
    FACTION_DISABLE: 'factionDisable', // 'disable'
    // FACTION_NO_BORDER: 'factionNoBorder', // noBorder
};
TokenFactions.TOKEN_FACTIONS_FRAME_STYLE = {
    FLAT: 'flat',
    BELEVELED: 'beveled',
    BORDER: 'border',
};
TokenFactions.dispositionKey = (token) => {
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
