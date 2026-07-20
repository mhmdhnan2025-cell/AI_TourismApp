



// const user = { name: "Ali" };
// const updated = { ...user, age: 20 }
// console.log(updated)

// const sum = (...nums) => {
//     return nums.reduce((a, b) => a + b);
// };
// console.log(sum(3, 2));

// const name="Hannan";
// console.log(`Hello ${name}`);


// const str='Hannan';
// const str2="Hello";
// const str3= str2.concat(" ",str);
// console.log(str3);


// let text = "I love cats. Cats are very easy to love. Cats are very popular."
// const iterator = text.matchAll("Cats");

// console.log(Array.from(iterator));



const fruits = ["Banana", "Orange", "Apple", "Mango"];

let text = "";

for (let x of fruits.entries()) {
    text += x
}

console.log(text);
