import { Container } from "pixi.js";
import IScene from "../interface/IScene";
import { spineSymbols } from "../other/assets";
import { config } from "../other/config";
import { center, ratio } from "../other/utils";
import { UI } from "../ui/ui";
import { combination, Finder } from "./finder";
import { matrix } from "./matrix";
import Reel from "./reel";
import { Data } from "./stripe";

export default class Game extends Container implements IScene
{
    public reel: Reel;
    public ui: UI;
    public finder: Finder;
    protected combi: combination[];

    public constructor()
    {
        super();
        this.reel = this.createReel();
        this.ui = this.createUI();
        this.finder = new Finder();
        this.combi = [];
        // Scene.instance.addBackground(new Background());
    }

    protected createUI(): UI {
        const ui = new UI(this);
        this.addChild(ui);
        return ui;
    }

    protected createReel(): Reel {
        const reel = new Reel({
            tileSize: {x: 75 * ratio, y: 75 * ratio},
            data: this.createData(spineSymbols()),
            getMatrix: this.matrix.bind(this)
        });
        reel.event.on('onReelSpinStartedEvent', this.onReelSpinStartedEvent.bind(this));
        reel.event.on('onReelSpinEndedEvent', this.onReelSpinEndedEvent.bind(this));
        reel.view.position = center();
        reel.load();
        this.addChild(reel.view);

        
        return reel;
    }

    protected onReelSpinStartedEvent(_sender: Reel): void
    {
        if(this.combi.length !== 0)
        {
            console.log(this.combi);
            this.combi.forEach(i => 
                i.coords.map(i => this.reel.coordinateToSymbol(i))
                    .forEach(i => i.resetAnimation()));
        }
    }

    protected onReelSpinEndedEvent(_sender: Reel): void
    {
        this.combi = this.finder.find(this.reel.matrix);
        console.log(this.combi.length);
        if(this.combi.length !== 0)
        {
            console.log(this.combi);
            this.combi.forEach(i => 
                i.coords.map(i => this.reel.coordinateToSymbol(i))
                    .forEach(i => i.setState('run')));
        }
    }

    protected createData(alias: string[]): Data[]
    {
        return alias.map((v) => ({skeleton: `${v}.skel`, atlas: `${v}.atlas`}));
    }

    protected matrix(): number[][]
    {
        return matrix(config.GridSize, /*[1,1,0]*/);
    }
}