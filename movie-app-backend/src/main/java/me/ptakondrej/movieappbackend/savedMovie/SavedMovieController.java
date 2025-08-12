package me.ptakondrej.movieappbackend.savedMovie;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-movies")
public class SavedMovieController {

	private final SavedMovieService savedMovieService;

	public SavedMovieController(SavedMovieService savedMovieService) {
		this.savedMovieService = savedMovieService;
	}

	@GetMapping
	public ResponseEntity<List<SavedMovie>> getSavedMovies(@RequestAttribute("userId") Long userId) {
		List<SavedMovie> savedMovies = savedMovieService.getSavedMoviesByUserId(userId);
		return ResponseEntity.ok(savedMovies);
	}

	@PostMapping
	public ResponseEntity<String> saveMovie(
			@RequestAttribute("userId") Long userId,
			@RequestBody SavedMovie savedMovie
	) {
		savedMovie.setUserId(userId);
		SavedMovie saved = savedMovieService.saveMovie(savedMovie);
		return ResponseEntity.ok("Saved movie with ID: " + saved.getId() + " for user with ID: " + userId);
	}

	@DeleteMapping("/{movieId}")
	public ResponseEntity<String> deleteSavedMovie(
			@RequestAttribute("userId") Long userId,
			@PathVariable Long movieId
	) {
		return ResponseEntity.ok("Deleted saved movie with ID: " + movieId + " for user with ID: " + userId);
	}
}
