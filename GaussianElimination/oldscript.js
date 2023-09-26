// Create a new Picker instance and set the parent element.
// By default, the color picker is a popup which appears when you click the parent.
let parent = document.querySelector('#parent');
let picker = new Picker(parent);

// You can do what you want with the chosen color using two callbacks: onChange and onDone.
picker.onChange = function(color) {
    parent.style.background = color.rgbaString;
};

  // onDone is similar to onChange, but only called when you click 'Ok'.