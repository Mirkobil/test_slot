import { IPopup } from "../interface/IPopup";
import IScene from "../interface/IScene";
import { app } from "../main";
import { loadBundle } from "./assets";

export class Scene
{
    private static _instance: Scene | null = null;
    private background: IScene | undefined = undefined;
    private scene: IScene | undefined = undefined;
    private popup: IPopup | undefined = undefined;

    public static get instance(): Scene
    {
        if(!Scene._instance)
        {
            Scene._instance = new Scene();
        }
        return Scene._instance;
    }

    private constructor() {}

    public static removeInstance(): void
    {
        Scene._instance = null;
    }

    public loadScene(scene: IScene): void
    {
        if(this.scene)
        {
            this.removeScene(this.scene);
        }
        this.addScene(scene);
    }

    public async loadSceneAsync(scene: IScene): Promise<void>
    {
        if(scene.assets)
        {
            await loadBundle(scene.assets);
            scene.init?.();
        }
        this.loadScene(scene);
    }

    private addScene(scene: IScene): void
    {
        this.scene = scene;
        app.stage.addChild(scene);
    }

    private removeScene(scene: IScene): void
    {
        scene.release?.();
        app.stage.removeChild(scene);
        scene.destroy();
    }

    public addPopup(popup: IPopup): void
    {
        this.popup = popup;
        app.stage.addChild(popup);
    }

    public removePopup(): void
    {
        if(this.popup)
        {
            this.removeScene(this.popup);
            this.popup = undefined;
        }
    }

    public addBackground(background: IScene): void
    {
        this.background = background;
        this.background.zIndex = -1;
        app.stage.addChild(background);
    }

    public removeBackground(): void
    {
        if(this.background)
        {
            this.removeScene(this.background);
            this.background = undefined;
        }
    }
}
