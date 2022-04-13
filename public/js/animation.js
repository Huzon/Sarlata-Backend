function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    var revealsLeft = document.querySelectorAll(".reveal-left");
    console.log(reveals.length);
    for (var i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight; //height of the window
        let elementTop = reveals[i].getBoundingClientRect().top; //shows distance of element from top of the window
        let elementVisible = 10;
        console.log(elementTop);
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        } else {
            reveals[i].classList.remove("active");
        }
    }
    for (var i = 0; i < revealsLeft.length; i++) {
        let windowHeight = window.innerHeight; //height of the window
        let elementTop = revealsLeft[i].getBoundingClientRect().top; //shows distance of element from top of the window
        let elementVisible = 10;
        if (elementTop < windowHeight - elementVisible) {
            revealsLeft[i].classList.add("active");
        } else {
            revealsLeft[i].classList.remove("active");
        }
    }
}

window.addEventListener("scroll", reveal);
// console.log("reveals animation");