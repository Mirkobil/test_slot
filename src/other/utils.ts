import { IPoint } from "../interface/IPoint";
import { app } from "../main";

export const ratio = window.devicePixelRatio || 1;

export function center(): IPoint
{
    return {x: app.screen.width * 0.5, y: app.screen.height * 0.5};
}