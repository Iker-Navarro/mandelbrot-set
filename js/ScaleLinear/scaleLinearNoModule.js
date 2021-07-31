// used on the Worker

function scaleLinear(domain, range){
    const [dStart, dEnd] = domain;
    const [rStart, rEnd] = range;

    return (pixelValue) => {
        return dStart + (pixelValue / (rEnd - rStart)) * (dEnd - dStart)
    }
}