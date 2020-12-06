const TokenFactions = (() => {
  const MODULE = 'token-factions';

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

  let bevelGradient;
  let bevelTexture;

  class TokenFactions {
    static async onInit() {
      bevelGradient = await loadTexture('modules/token-factions/assets/bevel-gradient.jpg');
      bevelTexture = await loadTexture('modules/token-factions/assets/bevel-texture.png');

      game.settings.register(MODULE, 'color-from', {
        name: 'Generate Token Faction Color From',
        scope: 'world',
        config: true,
        default: 'token-disposition',
        type: String,
        choices: {
          'token-disposition': 'Default: A Token\'s Disposition',
          'actor-folder-color': 'An Actor\'s Folder Color',
          'custom-disposition': 'A Cusom Color Set For Token Disposition',
        },
      });

      game.settings.register(MODULE, 'draw-frames-by-default', {
        name: 'Draw Token Frames By Default?',
        hint: 'Token frames (rings) are layered above token graphics. Enable this if you primarily use round tokens. Disable it if you primarily use irregularly-shaped tokens.',
        scope: 'world',
        config: true,
        default: true,
        type: Boolean,
      });

      game.settings.register(MODULE, 'frame-style', {
        name: 'Frame Render Style',
        scope: 'world',
        config: true,
        default: 'flat',
        type: String,
        choices: {
          flat: 'Default: Flat',
          beveled: 'Beveled',
        },
      });

      game.settings.register(MODULE, 'frame-width', {
        name: 'Frame Width (Percent of Grid Unit)',
        scope: 'world',
        config: true,
        default: 7.5,
        type: Number,
        range: {
          min: 0,
          max: 10,
          step: 0.5,
        },
      });

      game.settings.register(MODULE, 'base-opacity', {
        name: 'Base Opacity',
        scope: 'world',
        config: true,
        default: 1,
        type: Number,
        range: {
          min: 0,
          max: 1,
          step: 0.05,
        },
      });

      game.settings.register(MODULE, 'frame-opacity', {
        name: 'Frame Opacity',
        scope: 'world',
        config: true,
        default: 1,
        type: Number,
        range: {
          min: 0,
          max: 1,
          step: 0.05,
        },
      });

      dispositions.forEach((disposition) => {
        game.settings.register(MODULE, `custom-${disposition}-color`, {
          name: `Custom ${disposition.charAt(0).toUpperCase()}${disposition.slice(1).replace(/-/g, ' ').replace(/npc/g, 'NPC').replace(/member/g, 'Member')} Color`,
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
        colorInput.setAttribute('value', html.find(`input[name="${MODULE}.custom-${disposition}-color"]`).val());
        colorInput.setAttribute('data-edit', `${MODULE}.custom-${disposition}-color`);
        html.find(`input[name="${MODULE}.custom-${disposition}-color"]`).after(colorInput);
        $(colorInput).on('change', sheet._onChangeInput.bind(sheet));
      });

      html.find(`input[name="${MODULE}.custom-hostile-npc-color"]`).parent().parent().after(`\
        <div class="form-group submenu">
          <label></label>
          <button name="${MODULE}-colors-reset" type="button">
            <i class="fas fa-undo"></i>
            <label>Reset Colors</label>
          </button>
        </div>`);

      const resetColors = () => {
        dispositions.forEach((disposition) => {
          const $input = html.find(`input[name="${MODULE}.custom-${disposition}-color"]`);
          const $color = $input.next();

          $input.val(defaultColors[disposition]);
          $color.val($input.val());
        });
      };

      const update = () => {
        const colorFrom = html.find(`select[name="${MODULE}.color-from"]`).val();
        const customColorsEnabled = (colorFrom === 'custom-disposition');

        dispositions.forEach((disposition) => {
          const $input = html.find(`input[name="${MODULE}.custom-${disposition}-color"]`);
          const $color = $input.next();
          const $fieldGroup = $input.parent().parent();

          $input.prop('disabled', !customColorsEnabled).attr('class', 'color');
          $color.prop('disabled', !customColorsEnabled);

          if (!customColorsEnabled) {
            $fieldGroup.hide();
          } else {
            $fieldGroup.show();
          }

          $input.val($input.val() || defaultColors[disposition]);
          $color.val($input.val());
        });
        const $resetButton = html.find(`button[name="${MODULE}-colors-reset"]`);
        if (!customColorsEnabled) {
          $resetButton.parent().hide();
        } else {
          $resetButton.parent().show();
        }
      };

      update();

      html.find(`select[name="${MODULE}.color-from"]`).change(update);
      html.find(`button[name="${MODULE}-colors-reset"]`).click(resetColors);
    }

    static renderTokenConfig(sheet, html) {
      const token = sheet.object;
      const flags = token.data.flags[MODULE];
      const drawFramesByDefault = game.settings.get(MODULE, 'draw-frames-by-default');
      const drawFrameOverride = flags ? flags['draw-frame'] : undefined;
      const drawFrame = drawFrameOverride === undefined ? drawFramesByDefault : drawFrameOverride;
      const checked = drawFrame ? ' checked="checked"' : '';

      html.find('input[name="mirrorY"]').parent().after(`\
        <div class="form-group">
          <label>Overlay A Faction-Based Frame</label>
          <input type="checkbox" name="flags.${MODULE}.draw-frame" data-dtype="Boolean"${checked}>
        </div>`);
    }

    static async updateTokens(tokenData) {
      let tokens = canvas.tokens.placeables;

      if (!bevelGradient || !bevelGradient.baseTexture) {
        bevelGradient = await loadTexture('modules/token-factions/assets/bevel-gradient.jpg');
        bevelTexture = await loadTexture('modules/token-factions/assets/bevel-texture.png');
      }

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
      if ((token instanceof Token) && token.icon && bevelTexture && bevelTexture.baseTexture) {
        const flags = token.data.flags[MODULE];
        const drawFramesByDefault = game.settings.get(MODULE, 'draw-frames-by-default');
        const drawFrameOverride = flags ? flags['draw-frame'] : undefined;
        const drawFrame = drawFrameOverride === undefined ? drawFramesByDefault : drawFrameOverride;
        const colorFrom = game.settings.get(MODULE, 'color-from');
        let color;

        if (token.factionBase) {
          token.factionBase.destroy();
        }

        token.factionBase = token.addChildAt(
          new PIXI.Container(), token.getChildIndex(token.icon) - 1,
        );

        if (token.factionFrame) {
          token.factionFrame.destroy();
        }

        token.factionFrame = token.addChildAt(
          new PIXI.Container(), token.getChildIndex(token.icon) + (drawFrame ? 1 : -1),
        );

        if (colorFrom === 'token-disposition') {
          color = TokenFactions.getDispositionColor(token);
        } else if (colorFrom === 'actor-folder-color') {
          color = TokenFactions.getFolderColor(token);
        } else { // colorFrom === 'custom-disposition'
          color = TokenFactions.getCustomDispositionColor(token);
        }

        if (color) {
          TokenFactions.drawBase({ color, container: token.factionBase, token });
          if (drawFrame) {
            TokenFactions.drawFrame({ color, container: token.factionFrame, token });
          } else {
            TokenFactions.drawFrame({ color, container: token.factionBase, token });
          }
        }
      }
    }

    static drawBase({ color, container, token }) {
      const base = container.addChild(new PIXI.Graphics());
      const frameWidth = canvas.grid.grid.w * (game.settings.get(MODULE, 'frame-width') / 100);
      const baseOpacity = game.settings.get(MODULE, 'base-opacity');

      base.alpha = baseOpacity;

      base
        .lineStyle(0)
        .beginFill(color, 1.0)
        .drawCircle(token.w / 2, token.h / 2, (token.w / 2) - frameWidth)
        .beginFill(0x000000, 0.25 * baseOpacity)
        .drawCircle(token.w / 2, token.h / 2, (token.w / 2) - frameWidth);
    }

    static drawFrame({ color, container, token }) {
      const frameWidth = canvas.grid.grid.w * (game.settings.get(MODULE, 'frame-width') / 100);
      const frameStyle = game.settings.get(MODULE, 'frame-style');
      const frame = container.addChild(new PIXI.Graphics());
      const frameOpacity = game.settings.get(MODULE, 'frame-opacity');

      frame.alpha = frameOpacity;

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
          frame
            .lineStyle(frameWidth, color, 1.0, 0)
            .drawCircle(token.w / 2, token.h / 2, token.w / 2);
        } else { // frameStyle === 'bevelled'
          const outerRing = drawGradient();
          const innerRing = drawGradient();
          const ringTexture = drawTexture();
          const outerRingMask = new PIXI.Graphics();
          const innerRingMask = new PIXI.Graphics();
          const ringTextureMask = new PIXI.Graphics();

          innerRing.pivot.set(1000.0, 1000.0);
          innerRing.angle = 180;

          outerRingMask
            .lineStyle(frameWidth / 2, 0xFFFFFF, 1.0, 0)
            .beginFill(0xFFFFFF, 0.0)
            .drawCircle(token.w / 2, token.h / 2, token.w / 2);

          innerRingMask
            .lineStyle(frameWidth / 2, 0xFFFFFF, 1.0, 0)
            .beginFill(0xFFFFFF, 0.0)
            .drawCircle(token.w / 2, token.h / 2, token.w / 2 - (frameWidth / 2));

          ringTextureMask
            .lineStyle(frameWidth, 0xFFFFFF, 1.0, 0)
            .beginFill(0xFFFFFF, 0.0)
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
        color = colorStringToHex(game.settings.get(MODULE, `custom-${disposition}-color`));
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

Hooks.on('renderSettingsConfig', TokenFactions.renderSettingsConfig);
Hooks.on('renderTokenConfig', TokenFactions.renderTokenConfig);
Hooks.on('updateActor', TokenFactions.updateTokens);
Hooks.on('updateFolder', TokenFactions.updateTokens);

Hooks.on('ready', () => {
  Hooks.on('closeSettingsConfig', TokenFactions.updateTokens);
});
