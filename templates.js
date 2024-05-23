import { truncateText } from "./helpers.js";
//Template to use in showMoviesList() in script.js
export function movieCardTemplate(movie, isUserAdmin) {
  return `<div id="${movie.id}" class="card" style="width: 18rem;">
                <img src="${movie.imageUrl}" class="card-img-top">
                <div class="card-body d-flex flex-column justify-content-between">
                    <h5 class="card-title">${truncateText(movie.title, 50)}</h5>
                    <p class="card-text">${truncateText(
                      movie.description,
                      100
                    )}</p>
                    <h3>Seats Available: ${movie.availableSeats}</h3>
                    <div class="d-flex">
                      <button class="selectMovieBtn btn btn-primary" data-bs-toggle="modal"
                          data-bs-target="#exampleModal">Select Movie</button>
                      <button class="deleteMovieBtn d-flex btn btn-danger ${
                        isUserAdmin ? "d-block" : "d-none"
                      }">Delete Movie</button>
                    </div>
                </div>
              </div>`;
}
//Template to use in showMoviesList() in script.js
export function showSeatModal(id, seatNumber) {
  return `<div id="${id}" class="seat">${seatNumber}</div>`;
}
