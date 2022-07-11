import CONSTANTS from './constants';
import { isStringEquals, warn } from './lib/lib';
import { TokenFactions } from './tokenFactions';
import type { FactionGraphic } from './TokenFactionsModels';

const API = {
  async disableDrawBorderFactionsFromTokens(tokenIdsOrNames: string[]) {
    for (const tokenIdOrName of tokenIdsOrNames) {
      this.disableDrawBorderFactionsFromToken(tokenIdOrName);
    }
  },

  async disableDrawBorderFactionsFromToken(tokenIdOrName: string) {
    const token = canvas.tokens?.placeables.find((t) => {
      return isStringEquals(t.id, tokenIdOrName) || isStringEquals(t.name, tokenIdOrName);
    });
    if(!token){
      warn(`No token is been found with reference '${tokenIdOrName}'`, true);
      return;
    }
    //@ts-ignore
    await token.document.setFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE, true);
  },

  async enableDrawBorderFactionsFromTokens(tokenIdsOrNames: string[]) {
    for (const tokenIdOrName of tokenIdsOrNames) {
      this.enableDrawBorderFactionsFromToken(tokenIdOrName);
    }
  },

  async enableDrawBorderFactionsFromToken(tokenIdOrName: string) {
    const token = canvas.tokens?.placeables.find((t) => {
      return isStringEquals(t.id, tokenIdOrName) || isStringEquals(t.name, tokenIdOrName);
    });
    if(!token){
      warn(`No token is been found with reference '${tokenIdOrName}'`, true);
      return;
    }
    //@ts-ignore
    await token.document.setFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE, false);
  },


  async retrieveBorderFactionsColorFromToken(tokenIdOrName:string): string {
    const token = canvas.tokens?.placeables.find((t) => {
      return isStringEquals(t.id, tokenIdOrName) || isStringEquals(t.name, tokenIdOrName);
    });

    const factionGraphicDefaultS = '#000000';

    if(!token){
      warn(`No token is been found with reference '${tokenIdOrName}'`, true);
      return factionGraphicDefaultS;
    }

    const borderColor = TokenFactions.colorBorderFaction(token);

    if (!borderColor) {
      return factionGraphicDefaultS;
    }
    if (!borderColor.INT || Number.isNaN(borderColor.INT)) {
      return factionGraphicDefaultS;
    }
    switch (game.settings.get(CONSTANTS.MODULE_NAME, 'removeBorders')) {
      case '0':{
        break;
      }
      case '1': {
        //@ts-ignore
        if (!token.owner) {
          return factionGraphicDefaultS;
        }
        break;
      }
      case '2': {
        return factionGraphicDefaultS;
      }
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
      return factionGraphicDefaultS;
    }
    return borderColor.INT_S;
  }
};

export default API;
