package me.ptakondrej.movieappbackend.responses;

import me.ptakondrej.movieappbackend.savedMovie.SavedMovieDTO;

public class SavedMovieResponse extends Response {

	private SavedMovieDTO savedMovie;

	public SavedMovieResponse(boolean success, SavedMovieDTO savedMovieDTO, String message) {
		super(success, message);
		this.savedMovie = savedMovieDTO;
	}

	public SavedMovieDTO getSavedMovie() {
		return savedMovie;
	}

	public void setSavedMovie(SavedMovieDTO savedMovie) {
		this.savedMovie = savedMovie;
	}

}
