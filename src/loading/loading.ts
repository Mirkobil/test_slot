import { Assets, Container, Sprite } from "pixi.js";
import Game from "../game/game";
import { Background } from "../game/gameback";
import IScene from "../interface/IScene";
import { Scene } from "../other/scene";
import { center } from "../other/utils";

export default class Loading extends Container implements IScene
{
    public assets: string[] = ['loading'];

    public init(): void
    {
        this.createScene();
        this.load().then(() => this.loadCompleted());
    }

    protected createScene(): void
    {
        const sprite = Sprite.from("loading/loading_text_01");
        sprite.anchor.set(0.5);
        sprite.position = center();
        this.addChild(sprite);
    }

    protected async load() : Promise<void>
    {
        await Assets.loadBundle(["game", "ui", "background"]);
    }

    protected loadCompleted(): void
    {
        Scene.instance.loadScene(new Game());
        Scene.instance.addBackground(new Background());
    }
}