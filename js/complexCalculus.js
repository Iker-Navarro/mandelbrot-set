function complexPow2(complexN){
    const {x, y} = complexN;
    return {
        x: (Math.pow(x, 2) - Math.pow(y, 2)),
        y: (2 * x * y)
    }
}

function complexSum(n1, n2){
    return {
        x: n1.x + n2.x,
        y: n1.y + n2.y
    }
}

function getModulus(complexN){
    const {x, y} = complexN;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

