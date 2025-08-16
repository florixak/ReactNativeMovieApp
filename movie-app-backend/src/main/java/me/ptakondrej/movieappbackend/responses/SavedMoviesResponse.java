package me.ptakondrej.movieappbackend.responses;

import me.ptakondrej.movieappbackend.savedMovie.SavedMovieDTO;

import java.util.List;

public class SavedMoviesResponse extends Response {
	private List<SavedMovieDTO> savedMovies;

	public SavedMoviesResponse(boolean success, List<SavedMovieDTO> savedMovieDTO, String message) {
		super(success, message);
		this.savedMovies = savedMovieDTO;
	}

	public List<SavedMovieDTO> getSavedMovies() {
		return savedMovies;
	}

	public void setSavedMovies(List<SavedMovieDTO> savedMovies) {
		this.savedMovies = savedMovies;
	}
}
