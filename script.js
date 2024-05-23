import { getRandomId } from "./helpers.js";
import { movieCardTemplate, showSeatModal } from "./templates.js";

const loginNavbarBtn = document.getElementById("loginNavbarBtn");
const createMovieNavbarBtn = document.getElementById("createMovieNavbarBtn");
const movieListNavbarBtn = document.getElementById("movieListNavbarBtn");
const loginContainer = document.getElementById("loginContainer");
const listMoviesContainer = document.getElementById("listMoviesContainer");
const createMovieContainer = document.getElementById("createMovieContainer");
const chooseAdminBtn = document.getElementById("chooseAdminBtn");
const chooseUserBtn = document.getElementById("chooseUserBtn");
const moviesListHTML = document.getElementById("moviesList");
const movieTitleForm = document.getElementById("movieTitleForm");
const createMovieBtn = document.getElementById("createMovieBtn");
const deleteReservationModal = document.getElementById(
  "deleteReservationModal"
);
const saveReservationModal = document.getElementById("saveReservationModal");
const moviesListFromStorage = localStorage.getItem("moviesList");
const totalSeatsForm = document.getElementById("totalSeatsForm");

let modalMovieTitle = document.getElementById("modalMovieTitle");
let modalMovieDescription = document.getElementById("modalMovieDescription");
let movieCoverImgModal = document.querySelector(".movieCoverImgModal");
let seatsModal = document.getElementById("seatsModal");
const imgElement = movieCoverImgModal.querySelector("img");

let isUserAdmin = false;
let moviesList = [];
let selectedSeat = [];
let reservedSeat = JSON.parse(localStorage.getItem("reservedSeat")) || [];

if (moviesListFromStorage) {
  moviesList = JSON.parse(moviesListFromStorage);
} else {
  moviesList = [];
}

//click events
//create single movie click event
createMovieBtn.onclick = () => {
  const imageUrlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/i;

  if (
    movieTitleForm.value === "" ||
    movieDescriptionForm.value === "" ||
    totalSeatsForm.value === ""
  ) {
    alert("Please fill all the fields");
    return;
  }

  if (!imageUrlPattern.test(movieImageUrlForm.value)) {
    alert(
      "Please enter a valid image URL with one of the following extensions: .png, .jpg, .jpeg, .gif, .bmp, or .webp"
    );
    return;
  }

  const existingMovie = moviesList.find(
    (movie) =>
      movie.title === movieTitleForm.value ||
      movie.description === movieDescriptionForm.value
  );

  if (existingMovie) {
    alert("A movie with the same title or description already exists");
    return;
  }

  const totalSeats = parseInt(totalSeatsForm.value);

  if (isNaN(totalSeats) || totalSeats < 1 || totalSeats > 100) {
    alert("Please enter a valid number of seats between 1 and 100");
    return;
  }

  const newMovieId = getRandomId();

  moviesList.push({
    id: newMovieId,
    title: movieTitleForm.value,
    imageUrl: movieImageUrlForm.value,
    description: movieDescriptionForm.value,
    totalSeats: totalSeats,
    availableSeats: totalSeats,
  });

  localStorage.setItem("moviesList", JSON.stringify(moviesList));
  showListMovies();

  alert("Movie created successfully");
};

//navbar create movie onclick
createMovieNavbarBtn.onclick = () => {
  showCreateMovie();
};
//on click in bootstrap modal for deleting reservations, only for admin
seatsModal.addEventListener("click", (event) => {
  if (event.target.classList.contains("reserved") && isUserAdmin) {
    const seatId = event.target.id;
    const isReserved = event.target.classList.contains("reserved");

    const movie = moviesList.find(
      (m) =>
        m.title === modalMovieTitle.textContent ||
        m.description === modalMovieDescription.textContent
    );

    if (movie) {
      if (isReserved) {
        event.target.classList.remove("reserved");
        selectedSeat.push(seatId);
      } else {
        event.target.classList.add("reserved");
        selectedSeat = selectedSeat.filter((id) => id !== seatId);
      }
    } else {
      console.error("Movie not found");
    }
  }
});
//login bar button onclick
loginNavbarBtn.onclick = () => {
  loginContainer.classList.remove("d-none");
  listMoviesContainer.classList.add("d-none");
  createMovieContainer.classList.add("d-none");
  createMovieNavbarBtn.classList.add("d-none");
  movieListNavbarBtn.classList.add("d-none");
};
//navbar movie list onclick
movieListNavbarBtn.onclick = () => {
  showListMovies();
};
//choose admin button in login page
chooseAdminBtn.onclick = () => {
  isUserAdmin = true;
  showCreateMovie();
  checkAdmin();
};
//choose user button in login page
chooseUserBtn.onclick = () => {
  isUserAdmin = false;
  showListMovies();
  checkAdmin();
};

// Save reservation when saveReservationModal is clicked
saveReservationModal.onclick = () => {
  const movie = moviesList.find(
    (m) =>
      m.title === modalMovieTitle.textContent ||
      m.description === modalMovieDescription.textContent
  );

  if (!movie) {
    console.error("Movie not found");
    return;
  }

  const reservedSeatsInSelection = selectedSeat.filter((seatId) =>
    reservedSeat.includes(seatId)
  );

  if (reservedSeatsInSelection.length > 0) {
    alert(
      "Some of the selected seats are already reserved. Please clear those reservations first."
    );
    return;
  }

  if (selectedSeat.length > movie.availableSeats) {
    alert("Not enough available seats.");
    return;
  }

  movie.availableSeats -= selectedSeat.length;
  localStorage.setItem("moviesList", JSON.stringify(moviesList));

  const newReservedSeats = selectedSeat.slice(); // Create a copy of selectedSeat
  reservedSeat = reservedSeat.concat(newReservedSeats);
  localStorage.setItem("reservedSeat", JSON.stringify(reservedSeat));

  document.querySelectorAll(".selected").forEach((seat) => {
    seat.classList.add("reserved");
    seat.classList.remove("selected");
  });

  selectedSeat = [];
  showListMovies();
};

// Delete reservation when deleteReservationModal is clicked
deleteReservationModal.onclick = () => {
  if (selectedSeat.length === 0) {
    alert("No seats selected for deletion");
    return;
  }

  const movie = moviesList.find(
    (m) =>
      m.title === modalMovieTitle.textContent ||
      m.description === modalMovieDescription.textContent
  );

  if (!movie) {
    console.error("Movie not found");
    return;
  }

  const seatsToDelete = selectedSeat.filter((seatId) =>
    reservedSeat.includes(seatId)
  );

  if (seatsToDelete.length === 0) {
    alert("No reserved seats selected for deletion");
    return;
  }

  movie.availableSeats += seatsToDelete.length;
  reservedSeat = reservedSeat.filter((id) => !seatsToDelete.includes(id));

  localStorage.setItem("moviesList", JSON.stringify(moviesList));
  localStorage.setItem("reservedSeat", JSON.stringify(reservedSeat));

  document.querySelectorAll(".reserved").forEach((seat) => {
    if (seatsToDelete.includes(seat.id)) {
      seat.classList.remove("reserved");
    }
  });

  selectedSeat = [];
  showListMovies();
};

seatsModal.addEventListener("hidden.bs.modal", () => {
  selectedSeat = [];
});

//click events ends

// Functions
// ugly main app function
function showMoviesList() {
  moviesListHTML.innerHTML = "";
  moviesList.forEach((movie) => {
    moviesListHTML.innerHTML += movieCardTemplate(movie, isUserAdmin);
    const deleteMovieBtns = document.querySelectorAll(".deleteMovieBtn");
    deleteMovieBtns.forEach((deleteMovieBtn) => {
      deleteMovieBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this movie?")) {
          const movieCardId = Number(deleteMovieBtn.closest(".card").id);

          moviesList = moviesList.filter((movie) => movie.id !== movieCardId);
          localStorage.setItem("moviesList", JSON.stringify(moviesList));
          deleteMovieBtn.closest(".card").remove();
          alert("Movie deleted successfully");
        }
      });
    });
  });
  const selectMovieBtn = document.querySelectorAll(".selectMovieBtn");
  selectMovieBtn.forEach((selectMovieBtn) => {
    selectMovieBtn.addEventListener("click", () => {
      selectedSeat = [];
      modalMovieTitle.textContent = selectMovieBtn
        .closest(".card-body")
        .querySelector(".card-title").textContent;
      modalMovieDescription.textContent = selectMovieBtn
        .closest(".card-body")
        .querySelector(".card-text").textContent;
      imgElement.src = selectMovieBtn
        .closest(".card")
        .querySelector(".card-img-top").src;

      seatsModal.innerHTML = "";
      let movieID = selectMovieBtn.closest(".card").id;

      const movie = moviesList.find((movie) => movie.id == movieID);
      for (let i = 0; i < movie.totalSeats; i++) {
        const seatId = `${movieID}-${i}`;
        const seatNumber = i + 1;
        const seatHtml = showSeatModal(seatId, seatNumber);
        seatsModal.innerHTML += seatHtml;

        if (reservedSeat.includes(seatId)) {
          document.getElementById(seatId).classList.add("reserved");
        }
      }

      const seatBtns = document.querySelectorAll(".seat");
      seatBtns.forEach((seatBtn) => {
        seatBtn.addEventListener("click", () => {
          if (!seatBtn.classList.contains("reserved")) {
            if (!seatBtn.classList.contains("selected")) {
              if (!selectedSeat.includes(seatBtn.id)) {
                selectedSeat.push(seatBtn.id);
              }
            } else {
              selectedSeat = selectedSeat.filter((id) => id !== seatBtn.id);
              console.log(selectedSeat);
            }
            seatBtn.classList.toggle("selected");
          }
        });
      });
    });
  });
}
// function to check is user logged in as admin
function checkAdmin() {
  if (isUserAdmin) {
    createMovieNavbarBtn.classList.remove("d-none");
    movieListNavbarBtn.classList.remove("d-none");
    deleteReservationModal.classList.remove("d-none");
  } else {
    createMovieNavbarBtn.classList.add("d-none");
    movieListNavbarBtn.classList.remove("d-none");
    deleteReservationModal.classList.add("d-none");
  }
}
//function to hide certain elements on HTML when onclick is clicked
function showCreateMovie() {
  loginContainer.classList.add("d-none");
  listMoviesContainer.classList.add("d-none");
  createMovieContainer.classList.remove("d-none");
}
//function to hide certain elements on HTML when onclick is clicked
function showListMovies() {
  loginContainer.classList.add("d-none");
  listMoviesContainer.classList.remove("d-none");
  createMovieContainer.classList.add("d-none");
  moviesListHTML.innerHTML = "";
  showMoviesList();
}
//functions ends
