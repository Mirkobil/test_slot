import { gsap } from "gsap";
import { IPoint } from "../interface/IPoint";
import { config } from "../other/config";
import EventController from "../other/eventhandler";
import { StripeOption } from "./stripe";
import Symbol from "./symbol";

export type ParallaxOption = StripeOption & {
    tiles: Symbol[],
    event: IParallaxEvents
};

const spinConfig = {
    spin: 10,
    length: 1000,
    extra: 1,
    delay: 0,
    ease: 'back.inOut(1)',
};

export interface IParallaxEvents
{
    onStarted(): void;
    onCompleted(): void;
    onChangeType(item: Symbol, last: boolean): void;
    positionToCell(cell: IPoint): IPoint
}

type ParallaxEvents = {
    [K in keyof IParallaxEvents]: IParallaxEvents[K];
};

export default class Parallax
{
    public event: EventController<ParallaxEvents> = new EventController<ParallaxEvents>();

    protected min: number;
    protected max: number;
    protected tileSizeAxis: number;
    protected tween: gsap.core.Tween | null = null;

    public constructor(protected options: ParallaxOption)
    {
        this.tileSizeAxis = options.spaced.y + config.Spacing.y;
        [this.min, this.max] = this.minMax();  
    }

    protected minMax(): [number, number]
    {
        return [-this.tileSizeAxis * 0.5, 
            this.tileSizeAxis * config.Count - this.tileSizeAxis * 0.5];
    }

    public spin(): void
    {
        this.tween = this.action();
    }

    public action(): gsap.core.Tween
    {
        const height = Math.abs(this.min) + Math.abs(this.max);
        const { length, time } = this.calculateSpinParams();
        const obj = {value: 0};
        let prev = 0;

        return gsap.to(obj, {
            value: length,
            duration: time,
            delay: spinConfig.delay * this.options.index,
            ease: spinConfig.ease,
            onStart: () => this.onStart(),
            onComplete: () => this.onComplete(),
            onUpdate: () =>  {
                this.Step(obj.value - prev, obj.value, length, height);
                prev = obj.value;
            },
        });
    }

    private calculateSpinParams(): { length: number, time: number } {
        const count = spinConfig.spin + spinConfig.extra * this.options.index;
        const length = this.tileSizeAxis * count;
        const time = length / spinConfig.length;
    
        return { length, time };
    }
    
    protected onStart(): void
    {
        this.options.event.onStarted();
    }
    
    protected onComplete(): void
    {
        this.options.event.onCompleted();
    }

    protected Step(step: number, value: number, total: number, height: number): void
    {
        this.options.tiles.forEach(i => {
            const position = {x: i.position.x, y: i.position.y + step};
            const axis = position.y;
            const isMaxEdge = axis > this.max;
            const isMinEdge = axis < this.min;
            
            if(isMaxEdge) position.y = this.min - ((this.min - axis) % height);
            else if(isMinEdge) position.y = this.max - ((this.min - axis) % height);
            
            if((isMaxEdge || isMinEdge)) this.changeType(i, this.isLast(value, position, total, height));
            this.setPosition(i, position);
        });
    }

    protected changeType(tile: Symbol, isLast: { last: boolean, row: number } | null): void
    {
        if (isLast) {
            tile.updateCell({ x: tile.option.cell.x, y: isLast.row });
        }
        this.options.event.onChangeType(tile, isLast?.last ?? false);
    }

    protected isLast(value: number, position: IPoint, total: number, height: number): { last: boolean, row: number } | null
    {
        const last = total - height;
        const islast = value >= last;

        if(islast)
        {
            const final = {x: 0, y: position.y + (total - value) % height};
            const axis = this.options.event.positionToCell(final).y;
            const isLast = config.isRowInBound(axis);
            return {last: isLast, row: axis};
        }
        
        return null;
    }

    protected setPosition(tile: Symbol, value: IPoint): void
    {
        tile.position = value;
    }
}