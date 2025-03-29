import { ButtonOptions, FancyButton } from "@pixi/ui";

export type SizeButtonOptions = ButtonOptions & {
    width?: number,
    height?: number,
};

const defaultGreenButton:SizeButtonOptions = {
    defaultView: "green_button/button_bet_normal.png",
    hoverView: "green_button/button_bet_hover.png",
    pressedView: "green_button/button_bet_clicked.png",
    disabledView: "green_button/button_bet_disabled.png",
    textOffset: { pressed: { y:3} },
    anchor: 0.5,
    nineSliceSprite: [10, 10, 10, 10],
    width: 20,
    height: 50,
};

const defaultOrangeButton: SizeButtonOptions = {
    defaultView: "orange_button/button_withdrawl_normal.png",
    hoverView: "orange_button/button_withdrawl_hover.png",
    pressedView: "orange_button/button_withdrawl_clicked.png",
    textOffset: { y:-2, pressed: { y:1} },
    anchor: 0.5,
    nineSliceSprite: [10, 10, 10, 10],
    width: 120,
    height: 50,
};

export function greenButton(overrides: Partial<SizeButtonOptions> = {}): FancyButton
{
    return button({...defaultGreenButton, ...overrides});
}

export function orangeButton(overrides: Partial<SizeButtonOptions> = {}): FancyButton
{
    return button({...defaultOrangeButton, ...overrides});
}

export function button(opt: Partial<SizeButtonOptions>): FancyButton
{
    const button = new FancyButton(opt);
    if(opt.width) button.width = opt.width;
    if(opt.height) button.height = opt.height;
    return button;
}