// // for lazy load
// var observer = new IntersectionObserver(lazyLoad, {
//   rootMargin: "100px",
//   threshold: 1.0,
// });

// function lazyLoad(elements) {
//   console.log(elements.length);

//   elements.forEach((image) => {
//     if (image.intersectionRation > 0) {
//       image.src = image.dataset.src;
//       observer.unobserve(item.target);
//     }
//   });
// }

// var lazyImgs = document.querySelectorAll("img.lazy");
// lazyImgs.forEach((img) => {
//   console.log("found image");
//   observer.observe(img);
// });
//code fr modal
// function openSideNav() {
//     $("#mySidenav").height("450px");
//     $("#closedivbutton").show();
// }

// modal js
// Get the modal
const modal = document.getElementById("myModal");
const addModal = document.getElementById("add-modal");

// Get the button that opens the modal
const btn = document.getElementById("myBtn");
const addBtn = document.getElementById("add-course");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
addBtn.onclick = function () {
  addModal.style.display = "grid";
};

// When the user clicks on <span> (x), close the modal
// span.onclick = function () {
//   addModal.style.display = "none";
// };

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//   if (event.target != addModal) {
//     console.log("outside");
//     // addModal.style.display = "none";
//   } else {
//     console.log("inside");
//   }
// };

window.addEventListener("click", function (event) {
  console.log(event.target);
  if (event.target == addModal) {
    addModal.style.display = "none";
  } else if (event.target == uploadModal) {
    uploadModal.style.display = "none";
  } else if (event.target == editModal) {
    editModal.style.display = "none";
  }
});
