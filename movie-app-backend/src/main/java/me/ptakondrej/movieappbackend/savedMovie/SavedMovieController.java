package me.ptakondrej.movieappbackend.savedMovie;

import me.ptakondrej.movieappbackend.responses.SavedMovieResponse;
import me.ptakondrej.movieappbackend.responses.SavedMoviesResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/saved-movies")
public class SavedMovieController {

	private final SavedMovieService savedMovieService;

	public SavedMovieController(SavedMovieService savedMovieService) {
		this.savedMovieService = savedMovieService;
	}

	@GetMapping
	public ResponseEntity<SavedMoviesResponse> getSavedMovies(@RequestAttribute("userId") Long userId) {
		try {
			List<SavedMovie> savedMovies = savedMovieService.getSavedMoviesByUserId(userId);
			List<SavedMovieDTO> savedMoviesDTO = savedMovies.stream()
					.map(this::convertToDTO)
					.toList();
			return ResponseEntity.ok(new SavedMoviesResponse(true, savedMoviesDTO, "Saved movies retrieved successfully."));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new SavedMoviesResponse(false, null, e.getMessage()));
		}
	}

	@GetMapping("/all")
	public ResponseEntity<List<SavedMovieDTO>> getAllSavedMovies() {
		List<SavedMovie> savedMovies = savedMovieService.getAllSavedMovies();
		List<SavedMovieDTO> savedMoviesDTO = savedMovies.stream()
				.map(this::convertToDTO)
				.toList();
		return ResponseEntity.ok(savedMoviesDTO);
	}

	@GetMapping("/search")
	public ResponseEntity<SavedMoviesResponse> getSavedMoviesByQuery(
			@RequestAttribute("userId") Long userId,
			@RequestParam String query
	) {

		if (query == null || query.isBlank()) {
			return ResponseEntity.badRequest().body(new SavedMoviesResponse(false, null, "Query must not be null or empty."));
		}

		List<SavedMovie> savedMovies = savedMovieService.getSavedMoviesByUserIdAndQuery(userId, query);

		if (savedMovies == null) {
			return ResponseEntity.badRequest().body(new SavedMoviesResponse(false, null, "Error retrieving saved movies."));
		}

		if (savedMovies.isEmpty()) {
			return ResponseEntity.ok(new SavedMoviesResponse(true, null, "No saved movies found for the given query."));
		}

		List<SavedMovieDTO> savedMoviesDTO = savedMovies.stream()
				.map(this::convertToDTO)
				.toList();

		return ResponseEntity.ok(new SavedMoviesResponse(true, savedMoviesDTO, "Saved movies found for the given query."));
	}


	@PostMapping
	public ResponseEntity<SavedMovieResponse> saveMovie(
			@RequestAttribute("userId") Long userId,
			@RequestBody SavedMovieDTO savedMovieDTO
	) {
		try {
			SavedMovie savedMovie = convertToEntity(savedMovieDTO, userId);
			savedMovieService.saveMovie(savedMovie);
			return ResponseEntity.ok(new SavedMovieResponse(true, savedMovieDTO, "Saved movie successfully."));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new SavedMovieResponse(false, savedMovieDTO, e.getMessage()));
		}
	}

	@DeleteMapping("/{movieId}")
	public ResponseEntity<SavedMovieResponse> deleteSavedMovie(
			@RequestAttribute("userId") Long userId,
			@PathVariable Long movieId
	) {
		try {
			savedMovieService.deleteSavedMovie(userId, movieId);
			return ResponseEntity.ok(new SavedMovieResponse(true, null, "Deleted saved movie successfully."));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new SavedMovieResponse(false, null, e.getMessage()));
		}
	}

	private SavedMovieDTO convertToDTO(SavedMovie savedMovie) {
		if (savedMovie == null) {
			return null;
		}
		return new SavedMovieDTO(
				savedMovie.getMovieId(),
				savedMovie.getTitle(),
				savedMovie.getPosterPath(),
				savedMovie.getReleaseDate(),
				savedMovie.getVoteAverage(),
				savedMovie.getOriginalLanguage()
		);
	}

	private SavedMovie convertToEntity(SavedMovieDTO savedMovieDTO, Long userId) {
		return new SavedMovie(
				savedMovieDTO.getMovieId(),
				userId,
				savedMovieDTO.getTitle(),
				savedMovieDTO.getPosterPath(),
				savedMovieDTO.getReleaseDate(),
				savedMovieDTO.getVoteAverage(),
				savedMovieDTO.getOriginalLanguage(),
				LocalDateTime.now(),
				LocalDateTime.now()
		);
	}
}
