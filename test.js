const toto = new Map([[1, 2]]);
const tata = new Map([[2, 3]]);

console.log(new Map([...toto, ...tata]));
