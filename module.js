const TokenFactions = (() => {
  const moduleKey = 'faction-based-tokens';

  const defaultColors = {
    'party-member': '#33bc4e',
    'friendly-npc': '#43dfdf',
    'neutral-npc': '#f1d836',
    'hostile-npc': '#e72124',
  };

  const dispositions = Object.keys(defaultColors);

  const dispositionKey = (token) => {
    const dispositionValue = parseInt(token.data.disposition, 10);
    let disposition;

    if (token.actor && token.actor.hasPlayerOwner) {
      disposition = 'party-member';
    } else if (dispositionValue === 1) {
      disposition = 'friendly-npc';
    } else if (dispositionValue === 0) {
      disposition = 'neutral-npc';
    } else if (dispositionValue === -1) {
      disposition = 'hostile-npc';
    }

    return disposition;
  };

  class TokenFactions {
    static onInit() {
      game.settings.register(moduleKey, 'color-from', {
        name: game.i18n.localize(`${moduleKey}.options.color-from.name`),
        scope: 'world',
        config: true,
        default: 'token-disposition',
        type: String,
        choices: {
          'token-disposition': game.i18n.localize(`${moduleKey}.options.color-from.choices.token-disposition`),
          'actor-folder-color': game.i18n.localize(`${moduleKey}.options.color-from.choices.actor-folder-color`),
          'custom-disposition': game.i18n.localize(`${moduleKey}.options.color-from.choices.custom-disposition`),
        },
      });

      dispositions.forEach((disposition) => {
        game.settings.register(moduleKey, `custom-${disposition}-color`, {
          name: game.i18n.localize(`${moduleKey}.options.custom-${disposition}-color.name`),
          scope: 'world',
          config: true,
          type: String,
          default: defaultColors[disposition],
        });
      });
    }

    static onCloseSettingsConfig() {
      TokenFactions.updateTokens();
    }

    static onUpdateActor() {
      TokenFactions.updateTokens();
    }

    static onUpdateFolder() {
      TokenFactions.updateTokens();
    }

    static onRenderSettingsConfig(sheet, html) {
      dispositions.forEach((disposition) => {
        const colorInput = document.createElement('input');

        colorInput.setAttribute('type', 'color');
        colorInput.setAttribute('value', html.find(`input[name='${moduleKey}.custom-${disposition}-color']`).val());
        colorInput.setAttribute('data-edit', `${moduleKey}.custom-${disposition}-color`);
        html.find(`input[name='${moduleKey}.custom-${disposition}-color']`).after(colorInput);

        $(colorInput).on('change', sheet._onChangeInput.bind(sheet));
      });

      const update = () => {
        const colorFrom = html.find(`select[name='${moduleKey}.color-from']`).val();
        const customColorsEnabled = (colorFrom === 'custom-disposition');

        dispositions.forEach((disposition) => {
          const $input = html.find(`input[name='${moduleKey}.custom-${disposition}-color']`);
          const $color = $input.next();
          const $fieldGroup = $input.parent().parent();

          $input.prop('disabled', !customColorsEnabled).attr('class', 'color');
          $color.prop('disabled', !customColorsEnabled);

          if (!customColorsEnabled) {
            $input.val(defaultColors[disposition]);
            $fieldGroup.hide();
          } else {
            $fieldGroup.show();
          }

          $color.val($input.val());
        });
      };

      update();

      html.find(`select[name="${moduleKey}.color-from"]`).change(update);
      html.find('button[name="reset"]').click(update);
    }

    static onRenderTokenConfig(sheet, html) {
      const token = sheet.object;
      const flags = token.data.flags[moduleKey];
      const label = game.i18n.localize(`${moduleKey}.options.token-frame-overlay.name`);
      const checked = (flags && flags['draw-frame']) ? ' checked="checked"' : '';

      html.find('input[name="mirrorY"]').parent().after(`\
        <div class="form-group">
          <label>${label}</label>
          <input type="checkbox" name="flags.${moduleKey}.draw-frame" data-dtype="Boolean"${checked}>
        </div>`);
    }

    static updateTokens(tokenData) {
      let tokens = canvas.tokens.placeables;

      if (tokenData && tokenData._id) {
        const token = canvas.tokens.placeables.find(
          (tokenPlaceable) => tokenPlaceable.id === tokenData._id,
        );

        if (token) {
          tokens = [token];
        }
      }

      tokens.forEach((token) => {
        TokenFactions.updateTokenBase(token);
      });
    }

    static updateTokenBase(token) {
      if ((token instanceof Token) && token.icon) {
        if (token.factionBase && token.factionBase._geometry) {
          token.factionBase.clear();
        } else {
          token.factionBase = token.addChildAt(new PIXI.Graphics(), 0);
        }

        if (token.factionFrame && token.factionFrame._geometry) {
          token.factionFrame.clear();
        } else {
          token.factionFrame = token.addChildAt(
            new PIXI.Graphics(), token.getChildIndex(token.icon) + 1,
          );
        }

        const flags = token.data.flags[moduleKey];
        const drawFrame = flags ? flags['draw-frame'] : false;
        const colorFrom = game.settings.get(moduleKey, 'color-from');

        let color;

        if (colorFrom === 'token-disposition') {
          color = TokenFactions.getDispositionColor(token);
        } else if (colorFrom === 'actor-folder-color') {
          color = TokenFactions.getFolderColor(token);
        } else { // colorFrom === 'custom-disposition'
          color = TokenFactions.getCustomDispositionColor(token);
        }

        if (color) {
          const frameWidth = canvas.grid.grid.w * 0.075;

          token.factionBase
            .lineStyle(frameWidth, color, 1.0, 0)
            .beginFill(color, 1.0)
            .drawCircle(token.w / 2, token.h / 2, token.w / 2)
            .beginFill(0x000000, 0.4)
            .drawCircle(token.w / 2, token.h / 2, token.w / 2);

          if (drawFrame) {
            token.factionFrame
              .lineStyle(frameWidth, color, 1.0, 0)
              .drawCircle(token.w / 2, token.h / 2, token.w / 2);
          }
        }
      }
    }

    static getFolderColor(token) {
      let color;

      if (
        token.actor
        && token.actor.folder
        && token.actor.folder.data
        && token.actor.folder.data.color
      ) {
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
        color = colorStringToHex(game.settings.get(moduleKey, `custom-${disposition}-color`));
      }

      return color;
    }
  }

  TokenFactions.tokenRefresh = Token.prototype.refresh;

  return TokenFactions;
})();

Token.prototype.refresh = function refresh() {
  TokenFactions.tokenRefresh.bind(this)();
  TokenFactions.updateTokens(this);
};

Hooks.once('init', TokenFactions.onInit);

Hooks.on('renderSettingsConfig', TokenFactions.onRenderSettingsConfig);
Hooks.on('renderTokenConfig', TokenFactions.onRenderTokenConfig);
Hooks.on('updateActor', TokenFactions.onUpdateActor);
Hooks.on('updateFolder', TokenFactions.onUpdateFolder);

Hooks.on('ready', () => {
  Hooks.on('closeSettingsConfig', TokenFactions.onCloseSettingsConfig);
});
