// copied!
/**
 *  autor: foqc
 *  github: foqc
 */
// noprotect

const lagrange = ([X1, Y1], [X2, Y2], x) =>
   (((Y1 * (x - X2)) / (X1 - X2)) + ((Y2 * (x - X1)) / (X2 - X1)))

const makeRGB = (r, g, b, k) => {
    const calculate = pair => parseInt(lagrange(pair[0], pair[1], k))
    if (isNaN(r)) r = calculate(r)
    if (isNaN(g)) g = calculate(g)
    if (isNaN(b)) b = calculate(b)

    return rgbToHex([r, g, b]);
}

function rgbToHex(rgb){
    return "#" + rgb.map((col) => {
       let hexDigit = col.toString(16);
       hexDigit = hexDigit.length < 2 ? hexDigit.padStart(2,0) : hexDigit;
       return hexDigit 
    }).join("");
    
} 

export const palette = (size = 250) => {
    const range = parseInt(size / 6)
    const colors = []
    let c
    for (let k = 0; k < size; k++) {
        if (k <= range)//red to yellow
            c = makeRGB(255, [[0, 0], [range, 255]], 0, k)
        else if (k <= range * 2)//yellow to green
            c = makeRGB([[range + 1, 255], [range * 2, 0]], 255, 0, k)
        else if (k <= range * 3)//green to cyan
            c = makeRGB(0, 255, [[range * 2 + 1, 0], [range * 3, 255]], k)
        else if (k <= range * 4)//cyan to blue
            c = makeRGB(0, [[range * 3 + 1, 255], [range * 4, 0]], 255, k)
        else if (k <= range * 5)//blue to purple
            c = makeRGB([[range * 4 + 1, 0], [range * 5, 255]], 0, 255, k)
        else//purple to red
            c = makeRGB(255, 0, [[range * 5 + 1, 255], [size - 1, 0]], k)

        colors.push(c)
    }
    return colors
}