import { debug, i18n } from "./lib/lib";
import { FactionGraphic } from "./TokenFactionsModels";
import CONSTANTS from "./constants";

export class TokenFactions {
	// /*
	//  * The allowed Token disposition types
	//  * HOSTILE - Displayed as an enemy with a red border
	//  * NEUTRAL - Displayed as neutral with a yellow border
	//  * FRIENDLY - Displayed as an ally with a cyan border
	//  */
	// static TOKEN_DISPOSITIONS = {
	//   HOSTILE: -1,
	//   NEUTRAL: 0,
	//   FRIENDLY: 1,
	// };

	static TOKEN_FACTIONS_FLAGS = {
		FACTION_DRAW_FRAME: "factionDrawFrame", //'draw-frame',
		FACTION_DISABLE: "factionDisable", // 'disable'
		// FACTION_NO_BORDER: 'factionNoBorder', // noBorder
		FACTION_CUSTOM_COLOR_INT: "factionCustomColorInt",
		FACTION_CUSTOM_COLOR_EXT: "factionCustomColorExt",
		FACTION_CUSTOM_FRAME_OPACITY: "factionCustomFrameOpacity",
		FACTION_CUSTOM_BASE_OPACITY: "factionCustomBaseOpacity",
	};

	static TOKEN_FACTIONS_FRAME_STYLE = {
		FLAT: "flat",
		BELEVELED: "beveled",
		BORDER: "border",
	};

	static dispositionKey = (token) => {
		const dispositionValue = parseInt(String(token.document.disposition), 10);
		let disposition;
		if (token.actor && token.actor.hasPlayerOwner && token.actor.type === "character") {
			disposition = "party-member";
		} else if (token.actor && token.actor.hasPlayerOwner) {
			disposition = "party-npc";
		} else if (dispositionValue === 1) {
			disposition = "friendly-npc";
		} else if (dispositionValue === 0) {
			disposition = "neutral-npc";
		} else if (dispositionValue === -1) {
			disposition = "hostile-npc";
		}
		return disposition;
	};

	static bevelGradient: PIXI.Texture;
	static bevelTexture: PIXI.Texture;

	static defaultColors;

	static dispositions;

	static async onInit() {
		TokenFactions.defaultColors = {
			"party-member": game.settings.get(CONSTANTS.MODULE_NAME, "partyColor"), //'#33bc4e',
			"party-npc": game.settings.get(CONSTANTS.MODULE_NAME, "partyColor"), //'#33bc4e',
			"friendly-npc": game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColor"), //'#43dfdf',
			"neutral-npc": game.settings.get(CONSTANTS.MODULE_NAME, "neutralColor"), //'#f1d836',
			"hostile-npc": game.settings.get(CONSTANTS.MODULE_NAME, "hostileColor"), //'#e72124',

			"controlled-npc": game.settings.get(CONSTANTS.MODULE_NAME, "controlledColor"),
			"neutral-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "neutralColorEx"),
			"friendly-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColorEx"),
			"hostile-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "hostileColorEx"),
			"controlled-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "controlledColorEx"),
			"party-external-member": game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx"),
			"party-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx"),
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
			TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
		)
			? "checked"
			: "";

		const currentCustomColorTokenInt =
			config.object.getFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT) ||
			"#000000";

		const currentCustomColorTokenExt =
			config.object.getFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT) ||
			"#000000";

		const currentCustomColorTokenFrameOpacity =
			config.object.getFlag(
				CONSTANTS.MODULE_NAME,
				TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY
			) || 0.5;

		const currentCustomColorTokenBaseOpacity =
			config.object.getFlag(
				CONSTANTS.MODULE_NAME,
				TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY
			) || 0.5;

		// Expand the width
		config.position.width = 540;
		config.setPosition(config.position);

		const nav = html.find("nav.sheet-tabs.tabs");
		nav.append(
			$(`
			<a class="item" data-tab="factions">
        <i class="fas fa-user-circle"></i>
				${i18n("token-factions.label.factions")}
			</a>
		`)
		);

		const formConfig = `
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomDisable")}</label>
        <input type="checkbox"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}"
          name="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE}"
          data-dtype="Boolean" ${factionDisableValue}>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenInt")}</label>
        <input type="color"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT}"
          name="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT}"
          data-dtype="String" value="${currentCustomColorTokenInt}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenExt")}</label>
        <input type="color"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT}"
          name="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT}"
          data-dtype="String" value="${currentCustomColorTokenExt}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenFrameOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY}"
          name="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY}"
          data-dtype="Number" value="${currentCustomColorTokenFrameOpacity}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenBaseOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY}"
          name="flags.${CONSTANTS.MODULE_NAME}.${TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY}"
          data-dtype="Number" value="${currentCustomColorTokenBaseOpacity}"></input>
      </div>
    `;

		nav.parent()
			.find("footer")
			.before(
				$(`
			<div class="tab" data-tab="factions">
				${formConfig}
			</div>
		`)
			);

		// if(!factionDisableValue){
		//   //@ts-ignore
		//   const token = <Token>tokenDocument?._object;
		//   token.refresh();
		//   await TokenFactions.updateTokenDataFaction(token.document);
		//   token.draw();
		// }

		nav.parent()
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
			propertyNameDisable = "token." + propertyNameDisable;
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
					await TokenFactions.updateTokenDataFaction(token.document);
					// token.draw();
				} else {
					const tokenDocument = <TokenDocument>document;
					//@ts-ignore
					const token = <Token>tokenDocument?._object;
					// token.refresh();
					await TokenFactions.updateTokenDataFaction(token.document);
					// token.draw();
				}
			}
		}
	};

	static async updateTokenDataFaction(tokenData: TokenDocument): Promise<any> {
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

		if (tokenData?.id) {
			const token = canvas.tokens?.placeables.find((tokenPlaceable) => tokenPlaceable.id === tokenData.id);
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
		// OLD FVTT 9
		/*
		//@ts-ignore
		if (!token.factions || token.factions.destroyed) {
			//@ts-ignore
			token.factions = token.addChildAt(new PIXI.Container(), 0);
		}
		token.sortableChildren = true;
		// token.sortDirty = true;
		*/

		//@ts-ignore
		if (!canvas.grid.faction) {
			//@ts-ignore
			canvas.grid.faction = new PIXI.Container();
			//@ts-ignore
			canvas.grid.addChild(canvas.grid.faction);
		}
		//@ts-ignore
		if (!canvas.grid.faction.geometry) {
			//@ts-ignore
			canvas.grid.removeChild(canvas.grid.faction);
			//@ts-ignore
			canvas.grid.faction = new PIXI.Container();
			//@ts-ignore
			canvas.grid.addChild(canvas.grid.faction);
		}
		//@ts-ignore
		let factionBorder: PIXI.Container = canvas.grid.faction;
		// factionBorder.clear();

		//@ts-ignore
		if (token instanceof Token) {
			//@ts-ignore
			TokenFactions.drawBorderFaction(token, factionBorder);

			// Final mangement of the z-index
			//@ts-ignore
			if (!factionBorder) {
				//@ts-ignore
				if (token.mesh?.zIndex) {
					//@ts-ignore
					factionBorder.zIndex = token.mesh.zIndex;
				}
				if (token.zIndex) {
					//@ts-ignore
					factionBorder.zIndex = token.zIndex;
				}
			}
			//@ts-ignore
			if (token.mesh) {
				//@ts-ignore
				if (factionBorder) {
					//@ts-ignore
					if (token.mesh.zIndex >= factionBorder.zIndex) {
						//@ts-ignore
						token.mesh.zIndex = factionBorder.zIndex - 1;
						//@ts-ignore
						if (factionBorder.zIndex >= token.mesh.zIndex) {
							//@ts-ignore
							factionBorder.zIndex = token.mesh.zIndex - 1;
						}
					}
				} else {
					//@ts-ignore
					if (factionBorder.zIndex >= token.mesh.zIndex) {
						//@ts-ignore
						factionBorder.zIndex = token.mesh.zIndex - 1;
					}
				}
			} else {
				//@ts-ignore
				if (factionBorder) {
					//@ts-ignore
					if (token.zIndex >= factionBorder.zIndex) {
						//@ts-ignore
						token.zIndex = factionBorder.zIndex - 1;
						//@ts-ignore
						if (factionBorder.zIndex >= token.zIndex) {
							//@ts-ignore
							factionBorder.zIndex = token.zIndex - 1;
						}
					}
				} else {
					//@ts-ignore
					if (factionBorder.zIndex >= token.zIndex) {
						//@ts-ignore
						factionBorder.zIndex = token.zIndex - 1;
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
		if (!game.settings.get(CONSTANTS.MODULE_NAME, "hudEnable")) {
			return;
		}
		if (!app?.object?.document) {
			return;
		}

		const factionDisableFlag = app.object.document.getFlag(
			CONSTANTS.MODULE_NAME,
			TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
		);

		const borderButton = `
    <div class="control-icon factionBorder
      ${factionDisableFlag ? "active" : ""}"
      title="Toggle Faction Border"> <i class="fas fa-angry"></i>
    </div>`;

		/*
    const buttonPos = game.settings.get(CONSTANTS.MODULE_NAME, 'hudPos');
    const Pos = html.find(buttonPos);
    Pos.append(borderButton);
    */
		const settingHudColClass = <string>game.settings.get(CONSTANTS.MODULE_NAME, "hudColumn") ?? "right";
		const settingHudTopBottomClass = <string>game.settings.get(CONSTANTS.MODULE_NAME, "hudTopBottom") ?? "bottom";

		const buttonPos = "." + settingHudColClass.toLowerCase();

		const col = html.find(buttonPos);
		if (settingHudTopBottomClass.toLowerCase() === "top") {
			col.prepend(borderButton);
		} else {
			col.append(borderButton);
		}

		html.find(".factionBorder").click(this.ToggleBorder.bind(app));
		html.find(".factionBorder").contextmenu(this.ToggleCustomBorder.bind(app));
	}

	static async ToggleBorder(event) {
		//@ts-ignore
		const borderIsDisabled = this.object.document.getFlag(
			CONSTANTS.MODULE_NAME,
			TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
		);

		for (const token of <Token[]>canvas.tokens?.controlled) {
			//@ts-ignore
			await token.document.setFlag(
				CONSTANTS.MODULE_NAME,
				TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE,
				!borderIsDisabled
			);
			if (borderIsDisabled) {
				await token.document.unsetFlag(
					CONSTANTS.MODULE_NAME,
					TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT
				);
				await token.document.unsetFlag(
					CONSTANTS.MODULE_NAME,
					TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT
				);
				await token.document.unsetFlag(
					CONSTANTS.MODULE_NAME,
					TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY
				);
				await token.document.unsetFlag(
					CONSTANTS.MODULE_NAME,
					TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY
				);
			}
		}

		event.currentTarget.classList.toggle("active", !borderIsDisabled);
	}

	static async ToggleCustomBorder(event) {
		//@ts-ignore
		const tokenTmp = <Token>this.object;

		const currentCustomColorTokenInt =
			tokenTmp.document.getFlag(
				CONSTANTS.MODULE_NAME,
				TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT
			) || "#000000";

		const currentCustomColorTokenExt =
			tokenTmp.document.getFlag(
				CONSTANTS.MODULE_NAME,
				TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT
			) || "#000000";

		const currentCustomColorTokenFrameOpacity =
			tokenTmp.document.getFlag(
				CONSTANTS.MODULE_NAME,
				TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY
			) || 0.5;

		const currentCustomColorTokenBaseOpacity =
			tokenTmp.document.getFlag(
				CONSTANTS.MODULE_NAME,
				TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY
			) || 0.5;

		const dialogContent = `
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenInt")}</label>
        <input type="color"
          value="${currentCustomColorTokenInt}"
          data-edit="token-factions.currentCustomColorTokenInt"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenExt")}</label>
        <input type="color"
          value="${currentCustomColorTokenExt}"
          data-edit="token-factions.currentCustomColorTokenExt"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenFrameOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          value="${currentCustomColorTokenFrameOpacity}"
          data-edit="token-factions.currentCustomColorTokenFrameOpacity"></input>
      </div>
      <div class="form-group">
        <label>${i18n("token-factions.label.factionsCustomColorTokenBaseOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          value="${currentCustomColorTokenBaseOpacity}"
          data-edit="token-factions.currentCustomColorTokenBaseOpacity"></input>
      </div>
      `;

		const d = new Dialog({
			title: i18n("token-factions.label.chooseCustomColorToken"),
			content: dialogContent,
			buttons: {
				yes: {
					label: i18n("token-factions.label.applyCustomColor"),
					//@ts-ignore
					callback: async (html: JQuery<HTMLElement>) => {
						const newCurrentCustomColorTokenInt = <string>(
							$(
								<HTMLElement>(
									html.find(`input[data-edit='token-factions.currentCustomColorTokenInt']`)[0]
								)
							).val()
						);
						const newCurrentCustomColorTokenExt = <string>(
							$(
								<HTMLElement>(
									html.find(`input[data-edit='token-factions.currentCustomColorTokenExt']`)[0]
								)
							).val()
						);
						const newCurrentCustomColorTokenFrameOpacity = <string>(
							$(
								<HTMLElement>(
									html.find(
										`input[data-edit='token-factions.currentCustomColorTokenFrameOpacity']`
									)[0]
								)
							).val()
						);
						const newCurrentCustomColorTokenBaseOpacity = <string>(
							$(
								<HTMLElement>(
									html.find(`input[data-edit='token-factions.currentCustomColorTokenBaseOpacity']`)[0]
								)
							).val()
						);
						for (const token of <Token[]>canvas.tokens?.controlled) {
							token.document.setFlag(
								CONSTANTS.MODULE_NAME,
								TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT,
								newCurrentCustomColorTokenInt
							);
							token.document.setFlag(
								CONSTANTS.MODULE_NAME,
								TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT,
								newCurrentCustomColorTokenExt
							);
							token.document.setFlag(
								CONSTANTS.MODULE_NAME,
								TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY,
								newCurrentCustomColorTokenFrameOpacity
							);
							token.document.setFlag(
								CONSTANTS.MODULE_NAME,
								TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY,
								newCurrentCustomColorTokenBaseOpacity
							);
						}
					},
				},
				no: {
					label: i18n("token-factions.label.doNothing"),
					callback: (html) => {
						// Do nothing
					},
				},
			},
			default: "no",
		});
		d.render(true);
	}

	private static clamp(value, max, min) {
		return Math.min(Math.max(value, min), max);
	}

	private static componentToHex(c) {
		const hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	private static rgbToHex(A) {
		if (A[0] === undefined || A[1] === undefined || A[2] === undefined) console.error("RGB color invalid");
		return (
			"#" +
			TokenFactions.componentToHex(A[0]) +
			TokenFactions.componentToHex(A[1]) +
			TokenFactions.componentToHex(A[2])
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
			TokenFactions.updateTokensBorder(tokenDoc.document);
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
				scene.tokens.forEach((tokenTmp) => {
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
					tokenDoc = <TokenDocument>specifiedScene.tokens.find((tokenTmp) => {
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
						foundToken = <TokenDocument>sceneTmp.tokens.find((token) => {
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

			//@ts-ignore
			if (!canvas.grid.faction) {
				//@ts-ignore
				canvas.grid.faction = new PIXI.Container();
				//@ts-ignore
				canvas.grid.addChild(canvas.grid.faction);
			}
			// OLD FVTT 9
			/*
			token.sortableChildren = true;
			// token.sortDirty = true;
			*/

			//@ts-ignore
			if (!canvas.grid.faction.geometry) {
				//@ts-ignore
				canvas.grid.removeChild(canvas.grid.faction);
				//@ts-ignore
				canvas.grid.faction = new PIXI.Container();
				//@ts-ignore
				canvas.grid.addChild(canvas.grid.faction);
			}
			//@ts-ignore
			let factionBorder: PIXI.Container = canvas.grid.faction;
			// factionBorder.clear();

			//@ts-ignore
			TokenFactions.drawBorderFaction(token, factionBorder);

			//@ts-ignore
			token.mesh.zIndex = factionBorder.zIndex - 1;

			//@ts-ignore
			if (factionBorder) {
				//@ts-ignore
				factionBorder.zIndex = token.mesh.zIndex - 1;
			}
		});
		return;
	}

	public static colorBorderFaction(token: Token): FactionGraphic {
		const colorFrom = game.settings.get(CONSTANTS.MODULE_NAME, "color-from");
		let color;
		let icon;
		if (colorFrom === "token-disposition") {
			const disposition = TokenFactions.dispositionKey(token);
			if (disposition) {
				color = TokenFactions.defaultColors[disposition];
			}
		} else if (colorFrom === "actor-folder-color") {
			if (token.actor && token.actor.folder && token.actor.folder) {
				//@ts-ignore
				color = token.actor.folder.color;
				//@ts-ignore
				icon = token.actor.folder.icon;
			}
		} else {
			// colorFrom === 'custom-disposition'
			// TODO PUT SOME NEW FLAG ON THE TOKEN
			const disposition = TokenFactions.dispositionKey(token);
			if (disposition) {
				color = <string>game.settings.get(CONSTANTS.MODULE_NAME, `custom-${disposition}-color`);
			}
		}

		const currentCustomColorTokenInt = <string>(
			token.document.getFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_INT)
		);
		const currentCustomColorTokenExt = <string>(
			token.document.getFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_COLOR_EXT)
		);

		if (currentCustomColorTokenInt && currentCustomColorTokenInt != "#000000") {
			return {
				INT: parseInt(String(currentCustomColorTokenInt).substr(1), 16),
				EX: parseInt(String(currentCustomColorTokenExt).substr(1), 16),
				ICON: "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(currentCustomColorTokenInt),
				EX_S: String(currentCustomColorTokenExt),
			} as FactionGraphic;
		}

		const overrides = {
			CONTROLLED: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "controlledColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "controlledColorEx")).substr(1), 16),
				ICON: "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "controlledColor")),
				EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "controlledColorEx")),
			} as FactionGraphic,
			FRIENDLY: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColorEx")).substr(1), 16),
				ICON: "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColor")),
				EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColorEx")),
			} as FactionGraphic,
			NEUTRAL: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "neutralColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "neutralColorEx")).substr(1), 16),
				ICON: "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "neutralColor")),
				EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "neutralColorEx")),
			} as FactionGraphic,
			HOSTILE: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "hostileColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "hostileColorEx")).substr(1), 16),
				ICON: "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "hostileColor")),
				EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "hostileColorEx")),
			} as FactionGraphic,
			PARTY: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "partyColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx")).substr(1), 16),
				ICON: "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "partyColor")),
				EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx")),
			} as FactionGraphic,
			ACTOR_FOLDER_COLOR: {
				INT: parseInt(String(color).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "actorFolderColorEx")).substr(1), 16),
				ICON: icon ? String(icon) : "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(color),
				EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "actorFolderColorEx")),
			},
			CUSTOM_DISPOSITION: {
				INT: parseInt(String(color).substr(1), 16),
				EX: parseInt(
					String(game.settings.get(CONSTANTS.MODULE_NAME, "customDispositionColorEx")).substr(1),
					16
				),
				ICON: "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(color),
				EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "customDispositionColorEx")),
			},
		};

		let borderColor = new FactionGraphic();
		if (colorFrom === "token-disposition") {
			// const disPath = isNewerVersion(game.version, '0.8.0')
			//   ? CONST.TOKEN_DISPOSITIONS
			//   : TokenFactions.TOKEN_DISPOSITIONS;
			const disPath = CONST.TOKEN_DISPOSITIONS;

			//@ts-ignore
			const d = parseInt(token.document.disposition);
			//@ts-ignore
			if (!game.user?.isGM && token.owner) borderColor = overrides.CONTROLLED;
			//@ts-ignore
			else if (token.actor?.hasPlayerOwner) borderColor = overrides.PARTY;
			else if (d === disPath.FRIENDLY) borderColor = overrides.FRIENDLY;
			else if (d === disPath.NEUTRAL) borderColor = overrides.NEUTRAL;
			else borderColor = overrides.HOSTILE;
			//}
			//else return null;
		} else if (colorFrom === "actor-folder-color") {
			borderColor = overrides.ACTOR_FOLDER_COLOR;
		} else {
			// colorFrom === 'custom-disposition'
			borderColor = overrides.CUSTOM_DISPOSITION;
		}

		return borderColor;
	}

	private static async drawBorderFaction(token: Token, container: PIXI.Graphics): Promise<void> {
		// if (!factionBorder) {
		// 	debug(`No factionBorder is founded or passed`);
		// 	return;
		// }
		if (!token) {
			debug(`No token is founded or passed`);
			return;
		}
		if (token.x === 0 && token.y === 0) {
			debug(`No token is founded or passed`);
			return;
		}

		// OLD FVTT 9
		//@ts-ignore
		container.children.forEach((c) => c.clear());

		const borderColor = TokenFactions.colorBorderFaction(token);
		if (!borderColor) {
			return;
		}
		if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
			return;
		}
		switch (game.settings.get(CONSTANTS.MODULE_NAME, "removeBorders")) {
			case "0":
				break;
			case "1":
				//@ts-ignore
				if (!token.owner) {
					return;
				}
				break;
			case "2":
				return;
		}

		//@ts-ignore
		let skipDraw;
		try {
			skipDraw = token.document.getFlag(
				CONSTANTS.MODULE_NAME,
				TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
			);
		} catch (e) {
			//@ts-ignore
			await token.document.setFlag(
				CONSTANTS.MODULE_NAME,
				TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE,
				false
			);
			skipDraw = token.document.getFlag(
				CONSTANTS.MODULE_NAME,
				TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE
			);
		}
		//@ts-ignore
		if (skipDraw) {
			return;
		}

		const frameStyle = String(game.settings.get(CONSTANTS.MODULE_NAME, "frame-style"));

		// token.sortableChildren = true;
		// token.sortDirty = true;

		if (frameStyle == TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.FLAT) {
			// frameStyle === 'flat'
			//@ts-ignore
			container.border = container.border ?? container.addChild(new PIXI.Graphics());
			//@ts-ignore
			const factionBorder = container.border;
			const fillTexture = <boolean>game.settings.get(CONSTANTS.MODULE_NAME, "fillTexture");
			TokenFactions.drawBorder(token, borderColor, factionBorder, fillTexture);
		} else if (frameStyle == TokenFactions.TOKEN_FACTIONS_FRAME_STYLE.BELEVELED) {
			// frameStyle === 'bevelled'
			const fillTexture = <boolean>game.settings.get(CONSTANTS.MODULE_NAME, "fillTexture");
			const frameWidth =
				<number>canvas.grid?.grid?.w *
				<number>(<any>game.settings.get(CONSTANTS.MODULE_NAME, "borderWidth") / 100);

			// BASE CONFIG
			let t =
				<number>game.settings.get(CONSTANTS.MODULE_NAME, "borderWidth") || CONFIG.Canvas.objectBorderThickness;
			const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
			//@ts-ignore
			if (game.settings.get(CONSTANTS.MODULE_NAME, "permanentBorder") && token._controlled) {
				t = t * 2;
			}
			const sB = game.settings.get(CONSTANTS.MODULE_NAME, "scaleBorder");
			const bS = game.settings.get(CONSTANTS.MODULE_NAME, "borderGridScale");
			const nBS = bS ? (<Canvas.Dimensions>canvas.dimensions)?.size / 100 : 1;
			//@ts-ignore
			const s = sB ? token.document.scale : 1;
			const sW = sB ? (token.w - token.w * s) / 2 : 0;
			const sH = sB ? (token.h - token.h * s) / 2 : 0;

			let frameOpacity = <number>game.settings.get(CONSTANTS.MODULE_NAME, "frame-opacity") || 0.5;
			let baseOpacity = <number>game.settings.get(CONSTANTS.MODULE_NAME, "base-opacity") || 0.5;

			const customFrameOpacity = <number>(
				token.document.getFlag(
					CONSTANTS.MODULE_NAME,
					TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY
				)
			);
			const customBaseOpacity = <number>(
				token.document.getFlag(
					CONSTANTS.MODULE_NAME,
					TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY
				)
			);

			if (customFrameOpacity && customFrameOpacity != 0.5) {
				frameOpacity = customFrameOpacity;
			}
			if (customBaseOpacity && customBaseOpacity != 0.5) {
				baseOpacity = customBaseOpacity;
			}

			const textureINT = borderColor.TEXTURE_INT || PIXI.Texture.EMPTY; //await PIXI.Texture.fromURL(<string>token.document.texture.src) || PIXI.Texture.EMPTY;
			const textureEX = borderColor.TEXTURE_EX || PIXI.Texture.EMPTY;

			const h = Math.round(t / 2);
			const o = Math.round(h / 2);

			// const ringTexture = new PIXI.Sprite(TokenFactions.bevelTexture);
			// ringTexture.tint = borderColor.INT;
			// ringTexture.alpha = <number>frameOpacity;
			// container.addChild(ringTexture);
			// const factionBorder = new PIXI.Graphics();
			/*
			const borderColorBeleveled = borderColor;
			borderColorBeleveled.TEXTURE_INT = TokenFactions.bevelTexture;
			borderColorBeleveled.TEXTURE_EX = TokenFactions.bevelGradient;
			TokenFactions.drawBorder(token, borderColorBeleveled, factionBorder, fillTexture);
			*/
			// ringTexture.mask = factionBorder;

			const outerRing = TokenFactions.drawGradient(token, borderColor.INT, TokenFactions.bevelGradient);
			const innerRing = TokenFactions.drawGradient(token, borderColor.INT, TokenFactions.bevelGradient);
			const ringTexture = TokenFactions.drawTexture(token, borderColor.INT, TokenFactions.bevelTexture);
			const outerRingMask = new PIXI.Graphics();
			const innerRingMask = new PIXI.Graphics();
			const ringTextureMask = new PIXI.Graphics();

			outerRing.alpha = frameOpacity;
			innerRing.alpha = frameOpacity;
			ringTexture.alpha = frameOpacity;

			innerRing.pivot.set(1000.0, 1000.0);
			innerRing.angle = 180;

			outerRingMask
				.lineStyle(h * nBS, borderColor.EX, 1.0)
				.beginFill(0xffffff, 0.0)
				.drawCircle(token.w / 2, token.h / 2, token.w / 2)
				.endFill();

			innerRingMask
				.lineStyle(h * nBS, borderColor.EX, 1.0)
				.beginFill(0xffffff, 0.0)
				.drawCircle(token.w / 2, token.h / 2, token.w / 2 - frameWidth / 2)
				.endFill();

			ringTextureMask
				.lineStyle(h * nBS, borderColor.EX, 1.0)
				.beginFill(0xffffff, 0.0)
				.drawCircle(token.w / 2, token.h / 2, token.w / 2)
				.endFill();

			container.addChild(outerRing);
			container.addChild(outerRingMask);
			outerRing.mask = outerRingMask;

			container.addChild(innerRing);
			container.addChild(innerRingMask);
			innerRing.mask = innerRingMask;

			container.addChild(ringTexture);
			container.addChild(ringTextureMask);
			ringTexture.mask = ringTextureMask;

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
			//@ts-ignore
			container.border = container.border ?? container.addChild(new PIXI.Graphics());
			//@ts-ignore
			const factionBorder = container.border;
			const fillTexture = <boolean>game.settings.get(CONSTANTS.MODULE_NAME, "fillTexture");
			TokenFactions.drawBorder(token, borderColor, factionBorder, fillTexture);
		}
	}

	private static drawBorder(
		token: Token,
		borderColor: FactionGraphic,
		factionBorder: PIXI.Graphics,
		fillTexture: boolean
	) {
		let t = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderWidth") || CONFIG.Canvas.objectBorderThickness;
		const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
		//@ts-ignore
		if (game.settings.get(CONSTANTS.MODULE_NAME, "permanentBorder") && token._controlled) {
			t = t * 2;
		}
		const sB = game.settings.get(CONSTANTS.MODULE_NAME, "scaleBorder");
		const bS = game.settings.get(CONSTANTS.MODULE_NAME, "borderGridScale");
		const nBS = bS ? (<Canvas.Dimensions>canvas.dimensions)?.size / 100 : 1;
		//@ts-ignore
		const s = sB ? token.document.scale : 1;
		const sW = sB ? (token.w - token.w * s) / 2 : 0;
		const sH = sB ? (token.h - token.h * s) / 2 : 0;

		let frameOpacity = <number>game.settings.get(CONSTANTS.MODULE_NAME, "frame-opacity") || 0.5;
		let baseOpacity = <number>game.settings.get(CONSTANTS.MODULE_NAME, "base-opacity") || 0.5;

		const customFrameOpacity = <number>(
			token.document.getFlag(
				CONSTANTS.MODULE_NAME,
				TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_FRAME_OPACITY
			)
		);
		const customBaseOpacity = <number>(
			token.document.getFlag(
				CONSTANTS.MODULE_NAME,
				TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_CUSTOM_BASE_OPACITY
			)
		);

		if (customFrameOpacity && customFrameOpacity != 0.5) {
			frameOpacity = customFrameOpacity;
		}
		if (customBaseOpacity && customBaseOpacity != 0.5) {
			baseOpacity = customBaseOpacity;
		}

		const textureINT = borderColor.TEXTURE_INT || PIXI.Texture.EMPTY; //await PIXI.Texture.fromURL(<string>token.document.texture.src) || PIXI.Texture.EMPTY;
		const textureEX = borderColor.TEXTURE_EX || PIXI.Texture.EMPTY;

		factionBorder.alpha = frameOpacity;

		// Draw Hex border for size 1 tokens on a hex grid
		const gt = CONST.GRID_TYPES;
		const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];

		if (game.settings.get(CONSTANTS.MODULE_NAME, "circleBorders")) {
			// const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
			const h = Math.round(t / 2);
			const o = Math.round(h / 2);

			if (fillTexture) {
				//@ts-ignore
				factionBorder
					.beginFill(borderColor.EX, baseOpacity)
					.lineStyle(t * nBS, borderColor.EX, 0.8)
					.drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * s + t + p)
					// .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p)
					.beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity })
					.endFill();
				// .lineStyle(t*nBS, borderColor.EX, 0.8)
				// .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p);

				//@ts-ignore
				factionBorder
					.beginFill(borderColor.INT, baseOpacity)
					.lineStyle(h * nBS, borderColor.INT, 1.0)
					.drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * s + h + t / 2 + p)
					// .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p)
					.beginTextureFill({ texture: textureINT, color: borderColor.INT, alpha: baseOpacity })
					.endFill();
				// .lineStyle(h*nBS, borderColor.INT, 1.0)
				// .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p);
			}
			//@ts-ignore
			factionBorder
				.lineStyle(t * nBS, borderColor.EX, 0.8)
				.drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * s + t + p);
			// .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p);

			//@ts-ignore
			factionBorder
				.lineStyle(h * nBS, borderColor.INT, 1.0)
				.drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * s + h + t / 2 + p);
			// .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p);
		}
		//@ts-ignore
		else if (hexTypes.includes(canvas.grid?.type) && token.width === 1 && token.height === 1) {
			// const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
			const q = Math.round(p / 2);
			//@ts-ignore
			const polygon = canvas.grid?.grid?.getPolygon(
				-1.5 - q + sW,
				-1.5 - q + sH,
				(token.w + 2) * s + p,
				(token.h + 2) * s + p
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
			// const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
			const q = Math.round(p / 2);
			const h = Math.round(t / 2);
			const o = Math.round(h / 2);

			if (fillTexture) {
				//@ts-ignore
				factionBorder
					.beginFill(borderColor.EX, baseOpacity)
					.lineStyle(t * nBS, borderColor.EX, 0.8)
					.drawRoundedRect(token.x, token.y, token.w, token.h, 3)
					// .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3)
					.beginTextureFill({ texture: textureEX, color: borderColor.EX, alpha: baseOpacity })
					.endFill();
				// .lineStyle(t*nBS, borderColor.EX, 0.8)
				// .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);

				//@ts-ignore
				factionBorder
					.beginFill(borderColor.INT, baseOpacity)
					.lineStyle(h * nBS, borderColor.INT, 1.0)
					.drawRoundedRect(token.x, token.y, token.w, token.h, 3)
					// .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3)
					.beginTextureFill({ texture: textureINT, color: borderColor.INT, alpha: baseOpacity })
					.endFill();
				// .lineStyle(h*nBS, borderColor.INT, 1.0)
				// .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);
			}
			//@ts-ignore
			factionBorder
				.lineStyle(t * nBS, borderColor.EX, 0.8)
				.drawRoundedRect(token.x, token.y, token.w, token.h, 3);
			// .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);

			//@ts-ignore
			factionBorder
				.lineStyle(h * nBS, borderColor.INT, 1.0)
				.drawRoundedRect(token.x, token.y, token.w, token.h, 3);
			// .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);
		}
	}

	public static clearGridFaction() {
		//@ts-ignore
		const factionBorder = canvas?.grid?.faction;
		if (factionBorder && !factionBorder._destroyed) {
			//@ts-ignore
			factionBorder?.clear();
		}
	}

	private static drawGradient(token, color, bevelGradient) {
		const bg = new PIXI.Sprite(bevelGradient);

		bg.anchor.set(0.0, 0.0);
		bg.width = token.w;
		bg.height = token.h;
		bg.tint = color;
		// bg.x = token.x;
		// bg.y = token.y;

		return bg;
	}

	private static drawTexture(token, color, bevelTexture) {
		const bg = new PIXI.Sprite(bevelTexture);

		bg.anchor.set(0.0, 0.0);
		bg.width = 400;
		bg.height = 400;
		bg.tint = color;
		// bg.x = token.x;
		// bg.y = token.y;

		return bg;
	}
}
