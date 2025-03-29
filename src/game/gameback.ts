import { Container, Sprite } from "pixi.js";
import IScene from "../interface/IScene";
import { app } from "../main";
import { center } from "../other/utils";

export class Background extends Container implements IScene
{
    public constructor()
    {
        super();

        const sprite = Sprite.from('background');
        sprite.anchor.set(0.5);
        sprite.position = center();
        sprite.width = app.screen.width;
        sprite.height = app.screen.height;
        this.addChild(sprite);
    }
}