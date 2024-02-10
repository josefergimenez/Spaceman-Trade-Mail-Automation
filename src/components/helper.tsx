

export const calculateColor = (percentage: number): string => {

    const blue = 100;

    const newRed = percentage > 80 ? Math.floor(248 - (248 * (percentage - 80) / 20)) : 248;
    const newGreen = percentage > 80 ? Math.floor((255 * percentage) / 80) : 115;

    return `rgb(${newRed},${newGreen},${blue})`;
    }
