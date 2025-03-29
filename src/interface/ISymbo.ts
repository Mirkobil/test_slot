export interface ISymbolBase
{
    type: number;
    cell: {x: number, y: number};
    setType(type: number, force: boolean): boolean;
}

export interface ISymbol<T, D> extends ISymbolBase
{
    item: T;
    createSymbol(data: D): T;
}