package me.ptakondrej.movieappbackend.savedMovie;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

	public List<SavedMovie> getSavedMoviesByUserIdAndQuery(Long userId, String query) {
		try {
			if (userId == null || query == null || query.isBlank()) {
				throw new RuntimeException("User ID and query must not be null or empty.");
			}

			List<SavedMovie> savedMovies = savedMovieRepository.findByUserIdAndTitleContainingIgnoreCase(userId, query);
			if (savedMovies.isEmpty()) {
				return List.of();
			}

			return savedMovies;
		} catch (RuntimeException e) {
			throw new RuntimeException("Error retrieving saved movies for user with ID " + userId + ": " + e.getMessage());
		}
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

	@Transactional
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
