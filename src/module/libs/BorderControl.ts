import { getCanvas, MODULE_NAME } from "../settings";

Hooks.on('renderTokenHUD', (app, html, data) => {
    BorderFrame.AddBorderToggle(app, html, data)
})
Hooks.on('renderSettingsConfig', (app, el, data) => {
    let nC = game.settings.get(MODULE_NAME, "neutralColor");
    let fC = game.settings.get(MODULE_NAME, "friendlyColor");
    let hC = game.settings.get(MODULE_NAME, "hostileColor");
    let cC = game.settings.get(MODULE_NAME, "controlledColor");
    let pC = game.settings.get(MODULE_NAME, "partyColor");
    let nCE = game.settings.get(MODULE_NAME, "neutralColorEx");
    let fCE = game.settings.get(MODULE_NAME, "friendlyColorEx");
    let hCE = game.settings.get(MODULE_NAME, "hostileColorEx");
    let cCE = game.settings.get(MODULE_NAME, "controlledColorEx");
    let pCE = game.settings.get(MODULE_NAME, "partyColorEx");
    el.find('[name="token-factions.neutralColor"]').parent().append(`<input type="color" value="${nC}" data-edit="token-factions.neutralColor">`)
    el.find('[name="token-factions.friendlyColor"]').parent().append(`<input type="color" value="${fC}" data-edit="token-factions.friendlyColor">`)
    el.find('[name="token-factions.hostileColor"]').parent().append(`<input type="color" value="${hC}" data-edit="token-factions.hostileColor">`)
    el.find('[name="token-factions.controlledColor"]').parent().append(`<input type="color"value="${cC}" data-edit="token-factions.controlledColor">`)
    el.find('[name="token-factions.partyColor"]').parent().append(`<input type="color"value="${pC}" data-edit="token-factions.partyColor">`)
    el.find('[name="token-factions.neutralColorEx"]').parent().append(`<input type="color" value="${nCE}" data-edit="token-factions.neutralColorEx">`)
    el.find('[name="token-factions.friendlyColorEx"]').parent().append(`<input type="color" value="${fCE}" data-edit="token-factions.friendlyColorEx">`)
    el.find('[name="token-factions.hostileColorEx"]').parent().append(`<input type="color" value="${hCE}" data-edit="token-factions.hostileColorEx">`)
    el.find('[name="token-factions.controlledColorEx"]').parent().append(`<input type="color"value="${cCE}" data-edit="token-factions.controlledColorEx">`)
    el.find('[name="token-factions.partyColorEx"]').parent().append(`<input type="color"value="${pCE}" data-edit="token-factions.partyColorEx">`)

});


Hooks.on("createToken", (_scene, data) => {
    setTimeout(function () {
        let token = getCanvas().tokens.get(data._id)
        if (!token.owner) token.cursor = "default"
    }, 500)
})

Hooks.once("ready", () => {
    getCanvas().tokens.placeables.forEach(t => {
        if (!t.owner) t.cursor = "default"
    })
})



export class BorderFrame {
    static AddBorderToggle(app, html, data) {
        if(!game.user.isGM) return;
        const borderButton = `<div class="control-icon border ${app.object.data.flags[MODULE_NAME]?.noBorder ? "active" : ""}" title="Toggle Border"> <i class="fas fa-border-style"></i></div>`
        let rightCol = html.find('.right')
        rightCol.append(borderButton)
        html.find('.border').click(this.ToggleBorder.bind(app))
    }

    static async ToggleBorder(event) {
        const border = this.object.getFlag(MODULE_NAME, "noBorder")
        await this.object.setFlag(MODULE_NAME, "noBorder", !border)
        event.currentTarget.classList.toggle("active", !border);

    }
    static newBorder() {
        this.border.clear();
        const borderColor = this._getBorderColor();
        if (!borderColor) return;
        switch (game.settings.get(MODULE_NAME, "removeBorders")) {
            case "0": {
              break;
            }
            case "1": {
              if (!this.owner){
                return;
              }
              break;
            }
            case "2": {
              return;
            }
        }
        if (this.getFlag(MODULE_NAME, "noBorder")){
          return;
        }
        const t = game.settings.get(MODULE_NAME, "borderWidth") || CONFIG.Canvas.objectBorderThickness;

        // Draw Hex border for size 1 tokens on a hex grid
        const gt = CONST.GRID_TYPES;
        const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];
        if(game.settings.get(MODULE_NAME, "circleBorders")){
            const h = Math.round(t / 2);
            const o = Math.round(h / 2);
            this.border.lineStyle(t, borderColor.EX, 0.8).drawCircle(this.w/2, this.h/2, this.w/2 + t);
            this.border.lineStyle(h, borderColor.INT, 1.0).drawCircle(this.w/2, this.h/2, this.w/2 + h+t/2);
        }
        else if (hexTypes.includes(canvas.grid.type) && (this.data.width === 1) && (this.data.height === 1)) {
            const polygon = canvas.grid.grid.getPolygon(-1, -1, this.w + 2, this.h + 2);
            this.border.lineStyle(t, borderColor.EX, 0.8).drawPolygon(polygon);
            this.border.lineStyle(t / 2, borderColor.INT, 1.0).drawPolygon(polygon);
        }

        // Otherwise Draw Square border
        else {
            const h = Math.round(t / 2);
            const o = Math.round(h / 2);
            this.border.lineStyle(t, borderColor.EX, 0.8).drawRoundedRect(-o, -o, this.w + h, this.h + h, 3);
            this.border.lineStyle(h, borderColor.INT, 1.0).drawRoundedRect(-o, -o, this.w + h, this.h + h, 3);
        }
        return;
    }

    static newBorderColor() {

        const overrides = {
            CONTROLLED: {
                INT: parseInt(game.settings.get(MODULE_NAME, "controlledColor").substr(1),16),
                EX : parseInt(game.settings.get(MODULE_NAME, "controlledColorEx").substr(1),16),
            },
            FRIENDLY: {
                INT: parseInt(game.settings.get(MODULE_NAME, "friendlyColor").substr(1),16),
                EX: parseInt(game.settings.get(MODULE_NAME, "friendlyColorEx").substr(1),16),
            },
            NEUTRAL: {
                INT: parseInt(game.settings.get(MODULE_NAME, "neutralColor").substr(1),16),
                EXT: parseInt(game.settings.get(MODULE_NAME, "neutralColorEx").substr(1),16),
            },
            HOSTILE: {
                INT: parseInt(game.settings.get(MODULE_NAME, "hostileColor").substr(1),16),
                EX: parseInt(game.settings.get(MODULE_NAME, "hostileColorEx").substr(1),16),
            },
            PARTY: {
                INT: parseInt(game.settings.get(MODULE_NAME, "partyColor").substr(1),16),
                EXT: parseInt(game.settings.get(MODULE_NAME, "partyColorEx").substr(1),16),
            },
        }
        if (this._controlled) return overrides.CONTROLLED;
        else if (this._hover) {
            let d = parseInt(this.data.disposition);
            if (!game.user.isGM && this.owner){
              return overrides.CONTROLLED;
            }
            else if (this.actor?.hasPlayerOwner){
              return overrides.PARTY;
            }
            else if (d === TOKEN_DISPOSITIONS.FRIENDLY){
              return overrides.FRIENDLY;
            }
            else if (d === TOKEN_DISPOSITIONS.NEUTRAL){
              return overrides.NEUTRAL;
            }
            else{
              return overrides.HOSTILE;
            }
        }
        else return null;
    }
}
