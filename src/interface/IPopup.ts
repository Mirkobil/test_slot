import IScene from "./IScene";

export interface IPopup extends IScene
{
    show(): void;
    hide(): void;
    showCompleted(): void;
    hideCompleted(): void;
}