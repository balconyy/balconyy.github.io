export function blendColors(color1: string, color2: string, ratio: number) {
    const hexToRgb = (hex: string) => {
        hex = hex.replace('#', '');

        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16),
        };
    };

    const rgbToHex = ({r, g, b}: { r: number; g: number; b: number }) =>
        `#${[r, g, b]
            .map(v => Math.round(v).toString(16).padStart(2, '0'))
            .join('')}`;

    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    return rgbToHex({
        r: c1.r * (1 - ratio) + c2.r * ratio,
        g: c1.g * (1 - ratio) + c2.g * ratio,
        b: c1.b * (1 - ratio) + c2.b * ratio,
    });
}