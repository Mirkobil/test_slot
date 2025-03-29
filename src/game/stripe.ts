import { Container } from "pixi.js";
import { IPoint } from "../interface/IPoint";
import { IStripeEvents } from "../interface/IStripe";
import { config } from "../other/config";
import EventController from "../other/eventhandler";
import { findPositionForCell } from "../other/reelutils";
import { randomType } from "./matrix";
import Parallax, { IParallaxEvents } from "./parallax";
import StripeMask from "./stripemask";
import Symbol from "./symbol";

export type StripeEventsType = {
    [K in keyof IStripeEvents]: IStripeEvents[K];
};

export interface ITypeForCoordinate {
    typeForCoordinate(symbol: IPoint | Symbol, sender: Stripe): number;
}

export type Data = {skeleton: string, atlas: string};

export type StripeOption = {
    index: number,
    tile: IPoint,
    spaced: IPoint, 
    datas: Data[],
    delegate: ITypeForCoordinate,
};

export default class Stripe implements IParallaxEvents
{
    public symbols!: Symbol[];
    public event: EventController<StripeEventsType>;
    public option: StripeOption;
    public view: Container;
    protected mask: StripeMask;
    protected parallax!: Parallax;
    
    public constructor(option: StripeOption)
    {
        this.view = new Container();
        this.option = option;
        this.event = new EventController<StripeEventsType>;
        this.mask = new StripeMask(option);
        this.view.addChild(this.mask.view);
    }

    public load(): void
    {
        this.symbols = this.createStrip();
        this.parallax = new Parallax({
            ...this.option,
            tiles: this.symbols,
            event: this
        });
    }

    public spin(): void
    {   
        this.parallax.spin();
    }

    protected createStrip(): Symbol[]
    {
        const array:Symbol[] = [];
        for (let i = 0; i < config.Count; i++)
        {
            array.push(this.createTile(this.option.datas, i - config.Extra));
        }
        return array;
    }

    public createTile(data: Data[], row: number): Symbol
    {
        const cell = {x: this.option.index, y: row};
        const symbol = new Symbol({
            type: this.typeForValue(cell, config.isRowInBound(row)), 
            spacedTileSize: this.option.spaced, 
            cell: cell, 
            details: data 
        });

        symbol.position = this.positionForCell(cell);
        symbol.load();
        this.mask.Container(config.isRowInBound(row)).addChild(symbol);
        
        return symbol;
    }

    protected typeForValue(coord: Symbol | IPoint, inBound: boolean): number
    {
        return inBound ? this.option.delegate.typeForCoordinate(coord, this) : randomType();
    }

    protected onStripeSpinStarted(): void
    {
        this.event.emit("onStripeSpinStartedEvent", this.option.index, this);
    }

    protected onStripeSpinEnded(): void
    {
        this.event.emit("onStripeSpinEndedEvent", this.option.index, this);
    }

    public positionForCell(cell: IPoint): IPoint
    {
        const newCell = {x: cell.x, y: cell.y + config.Extra};
        const position = findPositionForCell(newCell, this.option.spaced);
        return {x: 0, y: position.y};
    }

    public positionToCell(position: IPoint): IPoint
    {
        const tileSize = {
            x: this.option.spaced.x + config.Spacing.x,
            y: this.option.spaced.y + config.Spacing.y
        };
        const offset = { x: 0, y: tileSize.y * config.Extra };
        
        return {
            x: this.round((position.x - offset.x) / tileSize.x), 
            y: this.round((position.y - offset.y) / tileSize.y)
        };
    }

    protected round(value: number): number
    {
        return value < 0 ? -Math.round(-value): Math.round(value);
    }

    public onStarted(): void {
        this.mask.setMasked(true);
        this.symbols.forEach(i => i.spin(true));
        this.onStripeSpinStarted();
    }
    public onCompleted(): void {
        this.mask.setMasked(false);
        this.symbols.forEach(i => i.spin(false));
        this.onStripeSpinEnded();
    }
    public onChangeType(item: Symbol, last: boolean): void {
        item.setType(this.typeForValue(item, last), last);
    }
}