import { IPoint } from '../interface/IPoint';

type ReelConfigOption = {
  gridSize: IPoint;
  extra: number;
  spacing: IPoint;
};

export class ReelConfig {
  public constructor(public option: ReelConfigOption) {}

  public get GridSize(): IPoint {
    return this.option.gridSize;
  }
  public get Extra(): number {
    return this.option.extra;
  }
  public get Spacing(): IPoint {
    return this.option.spacing;
  }
  public get Count(): number {
    return this.GridSize.y + this.Extra * 2;
  }

  public isRowInBound(row: number): boolean {
    return row >= 0 && row < this.GridSize.y;
  }

  public static Default(): ReelConfig {
    return new ReelConfig({
      gridSize: { x: 3, y: 3 },
      extra: 1,
      spacing: { x: 0, y: 0 },
    });
  }

  public ReelSize(tileSize: IPoint): IPoint {
    return {
      x: tileSize.x * config.GridSize.x,
      y: tileSize.y * config.GridSize.y,
    };
  }
}

export const config: ReelConfig = ReelConfig.Default();
