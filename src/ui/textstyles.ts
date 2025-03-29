import { TextStyle, TextStyleOptions } from "pixi.js";

const defaultArialStyle: TextStyleOptions = {
    fontFamily: 'Arial',
    fontSize: 30,
    fill: "white",
    wordWrap: false,
};

export function arialStyle(overrides: Partial<TextStyleOptions> = {}): TextStyle {
    return new TextStyle({ ...defaultArialStyle, ...overrides });
}