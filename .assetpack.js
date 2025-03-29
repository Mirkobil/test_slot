import { mipmap } from "@assetpack/core/image";
import { pixiManifest } from "@assetpack/core/manifest";
import { spineAtlasManifestMod, spineAtlasMipmap } from "@assetpack/core/spine";
import { texturePacker } from "@assetpack/core/texture-packer";

const option = {
    template: "@%%x",
    resolutions: { high: 2, default: 1, low: 0.5 },
    fixedResolution: "default",
};

export default {
    entry: './raw-assets',
    output: './public/assets',
    pipes: [
        mipmap(option),
        spineAtlasMipmap(option),
        pixiManifest({
            output: "manifest.json",
            nameStyle: 'relative',
            trimExtensions: true,
            createShortcuts: true,
        }),
        texturePacker({
            texturePacker: {
                padding: 2,
                nameStyle: 'relative',
                removeFileExtension: false,
            },
            resolutionOptions: option
        }),
        spineAtlasManifestMod(),
        // cacheBuster(),
        // texturePackerCacheBuster(),
        // spineAtlasCacheBuster(),
    ]
};