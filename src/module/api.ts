import CONSTANTS from './constants';
import { isStringEquals } from './lib/lib';
import { TokenFactions } from './tokenFactions';

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
    //@ts-ignore
    await token.document.setFlag(CONSTANTS.MODULE_NAME, TokenFactions.TOKEN_FACTIONS_FLAGS.FACTION_DISABLE, false);
  },
};

export default API;
