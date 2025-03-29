import { IPoint } from "../interface/IPoint";

export type combination = {
    type: number,
    line: number,
    coords: IPoint[],
};

export class Finder
{
    protected matrix!: number[][];
    protected lines:number[][] = [
        [0,0,0],
        [1,1,1],
        [2,2,2],
    ];
    
    public find(matrix: number[][]): combination[]
    {
        this.matrix = matrix;
        const arr: combination[] = [];
        this.lines.forEach((v, i) => {
            const combi = this.tryFindLine({coord: v, index: i});
            if(combi) arr.push(combi);
        });
        return arr;
    }

    public tryFindLine(line: {coord: number[], index: number}): combination | undefined
    {
        const type = this.matrix[0][line.coord[0]];
        const coord: IPoint[] = [];
        
        line.coord.some((r, c) => {
            const equal = type === this.matrix[c][r];
            if(equal) coord.push({x: c, y: r});
            return !equal;
        });
        
        return coord.length === line.coord.length ? {
            type: type,
            line: line.index,
            coords: coord
        } : undefined;
    }
}