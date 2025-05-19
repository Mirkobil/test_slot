import { Spine, TrackEntry } from '@esotericsoftware/spine-pixi-v8';
import { Container, Rectangle, Text } from 'pixi.js';
import { IPoint } from '../interface/IPoint';
import { drawOutline } from '../other/debug';
import { arialStyle } from '../ui/textstyles';
import { Data } from './stripe';

//export type state = 'none' | 'win' | 'idle';
export type state = 'none' | 'run' | 'idle';

export type SymbolOption = {
  type: number;
  spacedTileSize: IPoint;
  cell: IPoint;
  details: Data[];
};

export default class Symbol extends Container {
  public option: SymbolOption;
  protected state: state = 'none';
  protected spine!: Spine;
  protected text: Text;

  public get Data(): Data {
    return this.option.details[this.option.type];
  }

  constructor(option: SymbolOption) {
    super();
    this.option = option;
    this.text = this.tempText();
    this.tempUpdateCoord();
  }

  public load(): void {
    this.spine = this.createSymbol({
      x: this.option.spacedTileSize.x * 0.5,
      y: this.option.spacedTileSize.y,
    });

    this.addChild(
      drawOutline({
        rect: new Rectangle(
          0,
          0,
          this.option.spacedTileSize.x,
          this.option.spacedTileSize.y
        ),
        width: 1,
        color: 'red',
        zIndex: 10,
      })
    );
  }

  protected tempText(): Text {
    const label = new Text({ style: arialStyle({ fontSize: 15 }) });
    // label.visible = false;
    this.addChild(label);
    return label;
  }

  public tempUpdateCoord(): void {
    this.text.text = `${this.option.cell.x},${this.option.cell.y}`;
  }

  public createSymbol(position: IPoint): Spine {
    const spine = this.spineForType(this.option.type, position);
    this.addChild(spine);
    return spine;
  }

  protected ScaleSize(spine: Spine): number {
    return this.option.spacedTileSize.y / spine.getBounds().height;
  }

  public setStateWithoutNotify(state: state): void {
    this.state = state;
  }

  public setState(
    state: state,
    force: boolean = false
  ): TrackEntry | undefined {
    let track: TrackEntry | undefined = undefined;
    if ((this.state !== state || force) && this.validAnimation(state)) {
      this.setStateWithoutNotify(state);
      track = this.setAnimation(state);
      if (state === 'run') this.setDesiredDuration(1.2, track);
    }
    return track;
  }

  protected setDesiredDuration(duration: number, track: TrackEntry): void {
    track.timeScale = track.animation!.duration / duration;
  }

  public setType(type: number, force: boolean): boolean {
    const isDiffer = this.option.type !== type;
    if (isDiffer || force) {
      this.option.type = type;
      this.removeChild(this.spine);
      this.spine = this.createSymbol(this.spine.position);
    }

    return isDiffer;
  }

  public resetAnimation(): void {
    this.spine.state.clearTrack(0);
    this.spine.state.setEmptyAnimation(0, 0);
    // this.item.update(0);
  }

  protected spineForType(type: number, position: IPoint): Spine {
    const data = this.option.details[type];
    const spine = Spine.from({ skeleton: data.skeleton, atlas: data.atlas });
    spine.scale.set(this.ScaleSize(spine));
    spine.position = position;
    spine.state.addListener({ complete: this.onAnimationComplete.bind(this) });
    return spine;
  }

  protected onAnimationComplete(_entry: TrackEntry): void {
    // console.log("entry: ", entry.animation?.name);
  }

  protected setAnimation(state: state): TrackEntry {
    return this.spine.state.setAnimation(0, state, true);
  }

  protected validAnimation(value: state): boolean {
    return this.spine.skeleton.data.animations
      .map((i) => i.name)
      .includes(value);
  }

  public spin(started: boolean): void {
    if (started) this.setStateWithoutNotify('none');
  }

  public updateCell(cell: IPoint): void {
    this.option.cell = cell;
    this.tempUpdateCoord();
  }
}
