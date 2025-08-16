package me.ptakondrej.movieappbackend.savedMovie;

import me.ptakondrej.movieappbackend.responses.SavedMovieResponse;
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
	public ResponseEntity<List<SavedMovieDTO>> getSavedMovies(@RequestAttribute("userId") Long userId) {
		try {
			List<SavedMovie> savedMovies = savedMovieService.getSavedMoviesByUserId(userId);
			List<SavedMovieDTO> savedMoviesDTO = savedMovies.stream()
					.map(this::convertToDTO)
					.toList();
			return ResponseEntity.ok(savedMoviesDTO);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(List.of());
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

	@GetMapping("/{movieId}")
	public ResponseEntity<SavedMovieResponse> getSavedMovieById(
			@RequestAttribute("userId") Long userId,
			@PathVariable Long movieId
	) {
		List<SavedMovie> savedMovies = savedMovieService.getSavedMoviesByUserId(userId);
		SavedMovie savedMovie = savedMovies.stream()
				.filter(movie -> movie.getMovieId().equals(movieId))
				.findFirst()
				.orElse(null);
		if (savedMovie == null) {
			return ResponseEntity.ok(new SavedMovieResponse(false, null, "Movie not found in saved movies."));
		}

		SavedMovieDTO savedMovieDTO = convertToDTO(savedMovie);
		return ResponseEntity.ok(new SavedMovieResponse(true, savedMovieDTO, "Movie found."));
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
