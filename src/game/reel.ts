import { Container, Rectangle } from "pixi.js";
import { IPoint } from "../interface/IPoint";
import { IReel, IReelBase, IReelEvents } from "../interface/IReel";
import { IStripeEvents } from "../interface/IStripe";
import { config, ReelConfig } from "../other/config";
import { drawOutline } from "../other/debug";
import EventController from "../other/eventhandler";
import { findPositionForCell, findSpacedTileSize } from "../other/reelutils";
import Stripe, { Data, ITypeForCoordinate } from "./stripe";
import Symbol from "./symbol";

export type ReelOptions = {
    tileSize: IPoint, 
    data: Data[];
    getMatrix: () => number[][];
};

export type ReelEventsType<T extends IReelBase> = {
    [K in keyof IReelEvents<T>]: IReelEvents<T>[K];
};

export default class Reel implements IReel<Stripe, ReelConfig>, IStripeEvents, ITypeForCoordinate
{
    public stripes!: Stripe[];
    public spacedTileSize: IPoint;
    public option: ReelOptions;
    public view: Container;
    protected totalSize: IPoint;
    protected actionCount: number;
    public event: EventController<ReelEventsType<Reel>>;
    public matrix: number[][];
    protected temp: boolean;

    public constructor(option: ReelOptions) {
        this.event = new EventController<ReelEventsType<Reel>>();
        this.totalSize = config.ReelSize(option.tileSize);
        this.view = this.createView();
        this.option = option;
        this.actionCount = 0;
        this.temp = false;

        this.spacedTileSize = this.calculatedSpacedTileSize();
        this.matrix = option.getMatrix();
    }

    public load(): void {
        this.stripes = this.createReel();
        
        this.view.addChild(drawOutline({
            rect: new Rectangle(0, 0, this.totalSize.x, this.totalSize.y),
            width: 2,
            zIndex: 10
        }));
    }

    public spin(): void {
        if(this.temp) return;
        this.temp = true;
        this.stripes.forEach(i => i.spin());
        this.matrix = this.option.getMatrix();
    }

    protected createView(): Container {
        const container = new Container();
        container.pivot = {x: this.totalSize.x * 0.5, y: this.totalSize.y * 0.5};
        return container;
    }
    
    public createReel(): Stripe[] {
        const array: Stripe[] = [];
        for (let i = 0; i < config.GridSize.x; i++) {
            array.push(this.createStripe(i));
        }
        return array;
    }

    protected createStripe(index: number): Stripe {
        const stripe = new Stripe({
            index: index, 
            tile: this.option.tileSize,
            spaced: this.spacedTileSize,
            datas: this.option.data,
            delegate: this,
        });
        stripe.view.position = this.positionForIndex(index);
        stripe.event.on('onStripeSpinStartedEvent', this.onStripeSpinStartedEvent.bind(this));
        stripe.event.on('onStripeSpinEndedEvent', this.onStripeSpinEndedEvent.bind(this));
        stripe.load();
        this.view.addChild(stripe.view);
        return stripe;
    }

    protected positionForIndex(col: number): IPoint {
        return findPositionForCell({x: col, y: -config.Extra}, this.spacedTileSize);
    }

    public calculatedSpacedTileSize(): IPoint {
        return findSpacedTileSize(this.option.tileSize);
    }

    public onStripeSpinStartedEvent(_index: number, _sender: Stripe): void {
        if(this.actionCount++ === 0) this.onReelSpinStarted();
    }
    
    public onStripeSpinEndedEvent(_index: number, _sender: Stripe): void {
        if(--this.actionCount === 0) this.onReelSpinEnded();
    }

    public typeForCoordinate(symbol: IPoint | Symbol, _sender: Stripe): number
    {
        const cell = symbol instanceof Symbol ? symbol.option.cell : symbol;
        return this.matrix[cell.x][cell.y];
    }

    protected onReelSpinStarted(): void {
        this.event.emit("onReelSpinStartedEvent", this);
    }

    protected onReelSpinEnded(): void {
        this.temp = false;
        this.event.emit("onReelSpinEndedEvent", this);       
    }

    public coordinateToSymbol(coord: IPoint): Symbol
    {
        return this.stripes[coord.x].symbols.find(i => i.option.cell.y === coord.y)!;
    }
}