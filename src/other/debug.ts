import { ColorSource, Graphics, Rectangle } from "pixi.js";

const DefaultOutlineOption = {
    color: 'green' as ColorSource,
    width: 1,
    zIndex: 0
};

export type OutlineOption = Partial<typeof DefaultOutlineOption> & {
    rect: Rectangle,
};

export function drawOutline(options: OutlineOption): Graphics
{
    const { rect, ...other } = options;
    const { color, width, zIndex } = { ...DefaultOutlineOption, ...other };

    const outline = new Graphics();
    outline.rect(rect.x, rect.y, rect.width, rect.height);
    outline.stroke({ width: width, color: color });
    outline.zIndex = zIndex;
    return outline;
}