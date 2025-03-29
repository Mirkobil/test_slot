import { initDevtools } from '@pixi/devtools';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { PixiPlugin } from "gsap/PixiPlugin";
import { Application } from "pixi.js";
import Loading from './loading/loading';
import { assetsInit } from './other/assets';
import { Scene } from './other/scene';
import { ratio } from './other/utils';

export let app: Application;

(async (): Promise<void> => {
  app = await application();
  initDevtools({ app });
  gsapSettings();
  await assets();
  await load();
})();

async function application(): Promise<Application> {
  const app = new Application();
  await app.init({
      backgroundColor: '#000000',
      resolution: ratio,
      resizeTo: window,
      autoDensity: true,
  });

  document.getElementById("pixi-container")!.appendChild(app.canvas);
  return app;
};

function gsapSettings(): void {
    app.ticker.stop();
    gsap.ticker.add(() => {
        app.ticker.update();
    });

    gsap.registerPlugin(CustomEase);
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(app);
}

async function assets(): Promise<void> {
    await assetsInit('./assets/manifest.json');
}

async function load(): Promise<void> {
  await Scene.instance.loadSceneAsync(new Loading());
}