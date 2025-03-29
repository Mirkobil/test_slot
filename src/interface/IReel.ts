import { IPoint } from "./IPoint";

export interface IReelBase
{
    spacedTileSize: IPoint;
    calculatedSpacedTileSize(): IPoint;
}
export interface IReel<T, D> extends IReelBase
{
    stripes: T[];
    createReel(data: D): T[];
}

export interface IReelEvents<T extends IReelBase>
{
    onReelSpinStartedEvent:(sender: T) => void;
    onReelSpinEndedEvent:(sender: T) => void;
}