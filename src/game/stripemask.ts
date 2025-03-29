import { Container, Graphics } from "pixi.js";

import { IPoint } from "../interface/IPoint";
import { config } from "../other/config";
import { StripeOption } from "./stripe";
import Symbol from "./symbol";

export default class StripeMask
{
    public view: Container;
    protected maskedContaner: Container;
    protected unMaskedContaner: Container;
    protected masked: boolean;

    constructor(public option: StripeOption)
    {
        this.masked = false;
        this.view = new Container();

        this.maskedContaner = this.createMaskedContainer();
        this.view.addChild(this.maskedContaner);
        this.unMaskedContaner = new Container();
        this.view.addChild(this.unMaskedContaner);
    }

    public Container(bound: boolean): Container
    {
        return bound ? this.unMaskedContaner : this.maskedContaner;
    }

    protected createMaskedContainer(): Container
    {
        const container = new Container();
        container.mask = this.mask();
        this.view.addChild(container.mask);
        return container;
    }

    protected mask(): Graphics
    {
        const { tile, spaced} = this.option;
        const mask = new Graphics()
            .rect(0, 0, spaced.x, tile.y * config.GridSize.y).fill(0xffffff);
        mask.position = this.positionForIndex();
        return mask;
    }

    protected positionForIndex(): IPoint
    {
        return { x: 0, y: (this.option.spaced.y + config.Spacing.y) * config.Extra };
    }

    public setMasked(value: boolean): void
    {
        if(this.masked !== value)
        {
            this.masked = value;
            const from = this.Container(value);
            const to = this.Container(!value);
            const children = from.children.slice() as Symbol[];

            children.forEach(i => {
                if(config.isRowInBound(i.option.cell.y)) {
                    from.removeChild(i);
                    to.addChild(i);
                }
            });
        }
    }
}