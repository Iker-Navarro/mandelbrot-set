//unused

export function getRandomHexColor(){
    return "#" + Array.from(new Array(3), () => gethexSection()).join("");
}

function gethexSection(){
    let hexDigit = Math.round(Math.random() * 255).toString(16);
    hexDigit = hexDigit.length < 2 ? hexDigit.padStart(2,0) : hexDigit;
    return hexDigit
}