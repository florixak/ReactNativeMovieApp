package me.ptakondrej.movieappbackend.savedMovie;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavedMovieService {

	private final SavedMovieRepository savedMovieRepository;

	public SavedMovieService(SavedMovieRepository savedMovieRepository) {
		this.savedMovieRepository = savedMovieRepository;
	}

	public List<SavedMovie> getAllSavedMovies() {
	    return savedMovieRepository.findAll();
	}

	public List<SavedMovie> getSavedMoviesByUserId(Long userId) {
		return savedMovieRepository.findByUserId(userId);
	}

	public SavedMovie saveMovie(SavedMovie savedMovie) {
		return savedMovieRepository.save(savedMovie);
	}

	public void deleteSavedMovie(Long id) {
		savedMovieRepository.deleteById(id);
	}
}
