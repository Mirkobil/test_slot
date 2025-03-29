import { Assets, AssetsManifest } from "pixi.js";

interface Asset {
    alias: string[];
}

export let manifest: AssetsManifest = { bundles: [] };
let allBundles: string[] = [];
const loaded: string[] = [];

export async function assetsInit(path: string): Promise<void>
{
    manifest = await fetchFromPath(path);
    allBundles = manifest.bundles.map(i => i.name);
    await Assets.init({manifest: manifest, basePath: './assets'});
}

export function isBundleValid(bundles: string | string[]): boolean
{
    if (typeof bundles === 'string') bundles = [bundles];
    return bundles.every(i => allBundles.includes(i));
}

export function isBundleLoaded(bundles: string | string[]): boolean
{
    if (typeof bundles === 'string') bundles = [bundles];
    return bundles.every(i => loaded.includes(i));
}

export function filterUnloaded(bundles: string[]): string[]
{
    return bundles.filter((i) => !loaded.includes(i));
}

export async function loadBundle(bundles: string[]): Promise<void>
{
    const unloaded = filterUnloaded(bundles);
    if(unloaded.length !== 0 && isBundleValid(unloaded))
    {
        await Assets.loadBundle(unloaded);
        loaded.push(...unloaded);
    }
    else
    {
        throw new Error(`[Assets] Invalid bundle: ${bundles}`);
    }
}

export async function fetchFromPath(url: string): Promise<any>
{
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load settings: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading ${url}`);
      throw error;
    }
}

export function spineSymbols(): string[]
{
    const bundle = manifest.bundles.find(b => b.name === 'game');
    if (!bundle) return [];
    
    const set = new Set<string>();
    (bundle.assets as Asset[]).forEach(i => {
        i.alias.forEach(alias => {
        const parts = alias.split('/');
        const baseName = parts[parts.length - 1].split('.')[0];
        set.add(baseName);
        });
    });
    return [...set];
}