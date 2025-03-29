import { Container } from "pixi.js";
import Game from "../game/game";
import { app } from "../main";
import { orangeButton } from "./greenbutton";
import { arialStyle } from "./textstyles";

export class UI extends Container
{
    public constructor(protected game: Game) {
        super();
        this.spinButton();
    }

    protected spinButton(): void {
        const button = orangeButton({text: "spin"});
        button.textView!.style = arialStyle();
        button.onPress.connect(() => this.onSpin());
        button.position = {x: app.screen.width * 0.5, y: app.screen.height * 0.9};
        this.addChild(button);
    }

    protected onSpin(): void {
        this.game.reel.spin();
    }
}