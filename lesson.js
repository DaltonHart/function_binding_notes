/** 
 * @repo https://github.com/DaltonHart/function_binding_notes
 */

/**
 * === BONUS ===
 * Want to learn how to style logs? Check out the following link
 * @url https://css-tricks.com/a-guide-to-console-commands/#aa-styling-the-output
 */
console.log("%cFunction Binding ⚙️", "padding: 10px; background: rebeccapurple; border-bottom: 3px solid orchid; font-weight: bold; color: whitesmoke;");

/* === Function Binding === */

/*
  == GAMEPLAN == 
  1. Review `this` 
  2. The case for binding 
  3. Implementing a bind function* 

  *example purpose only, js has a built in .bind
*/

// The process by which a function can be permanently bound to an object, such that every time the new, bound function is called, `this` will refer to that context object.

// This is such a common necessity that .bind() is a method available on all functions in JavaScript.

/* == 1. Review: Dynamic Assignment of the Keyword `this` == */

// what is the default value of `this`

console.log(this);
// value will be the windows obj (chrome) global/module (node)


// these vars will be on the window object 
var name = "window";
var age = 1;

// obj for context 

var alice = {
  name: "Alice 🃏",
  age: 7
}


// define a free function in the global scope 
function speak(greeting, property){
  // defaults for the arguments 
  greeting = greeting || "Hi";
  property = property || "name";

  // output 
  console.log(greeting + "! My " + property + " is " + this[property]);
}

// == Various `this` values based on invocation pattern:


// Free function invocation (ffi).
// `this` refers to global/window object.
speak();


// object decoration.
alice.speak = speak;

// method invocation
alice.speak();

// NOTE: Think of it as a noun and a verb. Noun being the object that is doing the verb (method)
// alice (noun) 
// speak (verb) ==> the context of the noun will be refrenced as this 

// Explict binding 

// .call -> arbitray amount of arguments 
speak.call(alice, "Hello", "age");
// alice.speak("Hello","age")

// .apply -> array of arguments
speak.apply(alice, ["Hello", "age"]);


// BUT WHY

/* == 2. The Case for Binding == */



setTimeout = function(func, wait){
  // magic wait time 🪄
  func(); // ran as a free function 
}

setTimeout(alice.speak, 2000); // this => window 


// another example 
$("#submit").on("click", function(){
  alice.speak();
});

// setTimeout doesn't see the name "alice.speak", only "func".
// This is the case with almost every callback, including async requests or I/O, component/object constructors etc.


// how do we fix `this`?

setTimeout(function(){
  speak.call(alice);
},1000);


// What if we had a function which permanently connects
// a given method to a given context object?
// Consider the following example usage:

// EXAMPLE of a bind function 

setTimeout(bind(alice.speak, alice),2000);



// common pattern 

var boundSpeak = bind(alice.speak, alice, "Hey");

setTimeout(function () {
  boundSpeak(age);
});


/* == 3. Implementing a `bind` function == */

// This is the simple version of a bind function.
// - Arguments: a function to invoke later and a context-object.
// - It returns a function (decorator pattern) which will .call()
//   the original function in the correct context.

var bind = function(func,context){
  return function(){
    func.call(context);
  }
}

// Although a global function `bind` is good to have,
// it would make much more sense to make .bind a method of all functions.
// To do so, we'd have to extend the Function.prototype object
// (the object that all functions inherit their methods from).
speak.bind(alice); // Performs the same functionality as `bind(speak, alice)`

setTimeout(speak.bind(alice), 2000);

// polyfil 



// Extend the Function prototype
Function.prototype.bind = function(context){
  // collect any extra arguments that were passed to .bind()
  // slice `arguments` without the context argument (from index 1 onward).
  var args = [].slice.call(arguments, 1);

  // Save a reference to this (the function itself)!
  // If we try to use this within the returned function, below,
  // it will refer to window, since the return function, wherever it is used,
  // will be called as a free-function-invocation.
  var that = this;

  // Return the "decorator" function
  return function(){

    // Capture any arguments that are passed to the decorator function.
    // Note that we do not need to slice any arguments off the front here.
    var args2 = [].slice.call(arguments);

    // Finally, when the returned function is called,
    // we should call the original function in the context
    // of the original `context` argument.
    // Note the use of apply here because args and args2 are arrays.
    that.apply(context, args.concat(args2));
  }
}


/**
 *
 * Voila! We now have function binding in JavaScript.
 *
 * The good news is that you'll never have to write the above code in real projects.
 * .bind() is included in JavaScript from the get-go,
 * because it is such a common pattern.
 *
 * You can find a full polyfill and more info here:
 * https://mdn.io/bind
 *
 */