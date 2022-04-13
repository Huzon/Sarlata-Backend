const courses = [];
const viewCourses = () => {
  $.ajax({
    url: "/courses",
    type: "GET",
    headers: {
      Authorization: "Bearer " + $("#token").val(),
    },

    error: function (err) {
      console.log("Error!", err);
    },
    success: function (data) {
      console.log("Success!");
      console.log(data);
      getDataView(data);
      //  localStorage.setItem('token', data.id_token);
    },
    async: false,
  });
};
const addCourse = () => {
  // console.log("clicked");
  // console.log($("#parent-course").val());
  console.log($("#image").val());
  $.ajax({
    url: "/course-form",
    type: "POST",
    // contentType: "multipart/form-data",
    headers: {
      Authorization: "Bearer " + $("#token").val(),

      mimeType: "multipart/form-data",
      contentType: false,
      Accept: "application/json",
    },
    data: {
      name: $("#name").val(),
      parent: $("#parent-course").val(),
      level: $("#level").val(),
      target: $("#target").val(),
      period: $("#period").val(),
      image: $("#image").val(),
      desc: $("#desc").val(),
    },
    error: function (err) {
      console.log("Error!", err);
      $("#message").text("Error: " + err.responseText);
    },
    success: function (data) {
      console.log(data);

      const template = courseCard.content.cloneNode(true).children[0];
      template.querySelector(".title").textContent = data.name;
      template.querySelector(".desc").textContent = data.period;

      document.querySelector("#course-data").prepend(template);
    },
    async: false,
  });
};

const courseCard = document.querySelector("[data-user-template]");
const courseName = courseCard.querySelector(".title");
const info = courseCard.querySelector(".desc");
// const coursesView = (data) => {
// data.forEach((e) => {
const getDataView = (data) => {
  console.log(data.length);
  document.querySelector("#course-data").innerHTML = "";

  data.forEach((e) => {
    courses.push(e);

    const template = courseCard.content.cloneNode(true).children[0];

    // console.log(e.name);
    template.querySelector(
      "img"
    ).src = `http://localhost:3000/course/image/${e._id}`;
    template.querySelector(".id").textContent = e._id;

    template.querySelector(".title").textContent = e.name;
    template.querySelector(".desc").textContent = e.desc ?? "   ";
    template.querySelector(".upload-btn").setAttribute("data-id", e._id);
    template.querySelector(".period").textContent =
      `${e.period} months` ?? "   ";

    // template.querySelector(".edit").setAttribute("onclick", `editCourse(${e})`);
    document.querySelector("#course-data").append(template);
  });

  console.log(courses);
};

//selecting course
var selectedCourse;
const select = function (e) {
  e = $(e);
  let id = e.find(".id").text();
  console.log(courses);
  if (courses.length > 0) {
    selectedCourse = courses.find((i) => {
      return i._id == id;
    });
  }
  // console.log(someval);
  console.log("Selected course is ", selectedCourse);
  console.log($(".selected"));
  $(".selected").removeClass("selected");
  // $(".selected").remove(".selected");
  e.addClass("selected");
}; // });
//editing a course
const editModal = document.getElementById("edit-modal");
const editCourse = () => {
  editModal.style.display = "grid";
  // $.ajax({
  //   url: "/course-form",
  //   type: "POST",
  //   // contentType: "multipart/form-data",
  //   headers: {
  //     Authorization: "Bearer " + $("#token").val(),
  //     mimeType: "multipart/form-data",
  //     contentType: false,
  //     Accept: "application/json",
  //   },
  //   data: {
  //     name: $("#name").val(),
  //     parent: $("#parent-course").val(),
  //     level: $("#level").val(),
  //     target: $("#target").val(),
  //     period: $("#period").val(),
  //     image: $("#image").val(),
  //     desc: $("#desc").val(),
  //   },
  //   error: function (err) {
  //     console.log("Error!", err);
  //     $("#message").text("Error: " + err.responseText);
  //   },
  //   success: function (data) {
  //     console.log(data);
  //     const template = courseCard.content.cloneNode(true).children[0];
  //     template.querySelector(".title").textContent = data.name;
  //     template.querySelector(".desc").textContent = data.period;
  //     document.querySelector("#course-data").prepend(template);
  //   },
  //   async: false,
  // });
};
//uploading image
const uploadModal = document.getElementById("upload-modal");

const uploadImage = (data) => {
  console.log("data id", data.getAttribute("data-id"));
  // $('#upload-course-image').attr('action') = `/upload-course/${data.getAttribute('data-id')}`;
  document
    .getElementById("upload-course-image")
    .setAttribute("action", `/upload-course/${data.getAttribute("data-id")}`);
  uploadModal.style.display = "grid";
};
// };
