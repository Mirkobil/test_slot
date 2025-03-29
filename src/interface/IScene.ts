import { Container } from "pixi.js";

export default interface IScene extends Container
{
    assets?: string[];
    init?(): void;
    release?(): void;
}