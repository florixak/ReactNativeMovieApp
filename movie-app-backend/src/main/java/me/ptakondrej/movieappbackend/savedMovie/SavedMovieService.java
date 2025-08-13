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

		if (userId == null) {
			throw new RuntimeException("User ID must not be null.");
		}

		return savedMovieRepository.findByUserId(userId);
	}

	public void saveMovie(SavedMovie savedMovie) {
		if (savedMovie.getMovieId() == null || savedMovie.getTitle() == null) {
			throw new RuntimeException("Movie ID and title must not be null.");
		}

		List<SavedMovie> existingMovies = savedMovieRepository.findByUserIdAndMovieId(savedMovie.getUserId(), savedMovie.getMovieId());
		if (!existingMovies.isEmpty()) {
			throw new RuntimeException("Movie with ID " + savedMovie.getMovieId() + " is already saved for user with ID " + savedMovie.getUserId());
		}

		savedMovieRepository.save(savedMovie);
	}

	public void deleteSavedMovie(
			Long userId,
			Long movieId
	) {
		if (userId == null || movieId == null) {
			throw new RuntimeException("User ID and movie ID must not be null.");
		}
		List<SavedMovie> existingMovies = savedMovieRepository.findByUserIdAndMovieId(userId, movieId);
		if (existingMovies.isEmpty()) {
			throw new RuntimeException("No saved movie found for user with ID " + userId + " and movie ID " + movieId);
		}
		savedMovieRepository.deleteByUserIdAndMovieId(userId, movieId);
	}
}
