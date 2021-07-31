importScripts("complexCalculus.js", "./ScaleLinear/scaleLinearNoModule.js");

let iterations;

let HEIGHT;
let WIDTH;
let xSection;
let ySection;

let xScale;
let yScale;

onmessage = (e) => {
    if(e.data.setup) setup(e.data);
    else{
        const col = e.data.col;
        let results = [];
        
        const x = xScale(col);
        for(let i = 0; i < HEIGHT; i++){
            const y = yScale(i);
            results[i] = mandelbrot({x, y});
        }
        postMessage({col, results});
    }
}

function setup(e){
    ({HEIGHT, WIDTH, xSection, ySection, iterations} = e);
    xScale = scaleLinear([xSection.from, xSection.to], [0, WIDTH]);
    yScale = scaleLinear([ySection.from, ySection.to], [0, HEIGHT]);

}

function mandelbrot(c){ // c = {x, y}
    let z = {x: 0, y: 0}; // starting z value
    let modulus = 0; 
    let iterator;

    for(iterator = 0; iterator < iterations && modulus <= 2; iterator++){
        const zSquared = complexPow2(z); 
        z = complexSum(c, zSquared); // new complex result
        modulus = getModulus(z);
    }
    return [iterator, modulus <= 2]
}