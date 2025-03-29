import { IPoint } from "../interface/IPoint";
import { config } from "./config";

export function findPositionForCell(cell: IPoint, spaced: IPoint): IPoint
{
    return { 
        x: cell.x * (spaced.x + config.Spacing.x), 
        y: cell.y * (spaced.y + config.Spacing.y) 
    };
}

export function findSpacedTileSize(tile: IPoint): IPoint
{
    return {
        x: ((tile.x * config.GridSize.x) - (config.GridSize.x - 1) * config.Spacing.x) / config.GridSize.x, 
        y: ((tile.y * config.GridSize.y) - (config.GridSize.y - 1) * config.Spacing.y) / config.GridSize.y
    };
}