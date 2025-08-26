const COLORS = [
    "ff4c4c",
    "34bf49",
    "fbb034",
    "00a4e4",
    "371777",
    "efdf00"
];

const __colors: {[uuid: string]: string;} = {};
    
/**
 * It uses definied colors list and specified pointUUID to get next unused color,
 * and cache it in memory
 * 
 */
export function getChartLineColor(pointUUID: string): string {
    let color = '';
    if (__colors[pointUUID]) {
        color = __colors[pointUUID];
    } else {
        const usedColors = Object.values(__colors);
        const lastUsedColor= usedColors[usedColors.length - 1];
        const lastUsedColorIndex = COLORS.indexOf(lastUsedColor);
        const nextColorIndex = lastUsedColorIndex < COLORS.length - 1 ? lastUsedColorIndex + 1 : 0;
        color = COLORS[nextColorIndex] || "6a737b";
        __colors[pointUUID] = color;
    }
     
    return `#${color}`;
}