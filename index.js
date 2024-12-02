let nm = 0;

for (let n = 0; n <= 2015; n++) {
    let str = n.toString(); // Convert the number to a string
    for (let char of str) { // Loop through each character in the string
        if (char === '9') {
            nm++; // Increment the counter for each '9'
        }
    }
}

console.log(nm);
