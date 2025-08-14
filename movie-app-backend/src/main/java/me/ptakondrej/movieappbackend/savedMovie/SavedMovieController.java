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
		List<SavedMovie> savedMovies = savedMovieService.getSavedMoviesByUserId(userId);
		List<SavedMovieDTO> savedMoviesDTO = savedMovies.stream()
				.map(this::convertToDTO)
				.toList();
		return ResponseEntity.ok(savedMoviesDTO);
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
	public ResponseEntity<SavedMovieDTO> getSavedMovieById(
			@RequestAttribute("userId") Long userId,
			@PathVariable Long movieId
	) {
		List<SavedMovie> savedMovies = savedMovieService.getSavedMoviesByUserId(userId);
		SavedMovie savedMovie = savedMovies.stream()
				.filter(movie -> movie.getMovieId().equals(movieId))
				.findFirst()
				.orElseThrow(() -> new RuntimeException("Saved movie not found with ID: " + movieId));
		SavedMovieDTO savedMovieDTO = convertToDTO(savedMovie);
		return ResponseEntity.ok(savedMovieDTO);
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
		return new SavedMovieDTO(
				savedMovie.getMovieId(),
				savedMovie.getTitle(),
				savedMovie.getPosterUrl(),
				savedMovie.getOverview(),
				savedMovie.getReleaseDate(),
				savedMovie.getRating()
		);
	}

	private SavedMovie convertToEntity(SavedMovieDTO savedMovieDTO, Long userId) {
		SavedMovie savedMovie = new SavedMovie();
		savedMovie.setMovieId(savedMovieDTO.getMovieId());
		savedMovie.setTitle(savedMovieDTO.getTitle());
		savedMovie.setPosterUrl(savedMovieDTO.getPosterUrl());
		savedMovie.setOverview(savedMovieDTO.getOverview());
		savedMovie.setReleaseDate(savedMovieDTO.getReleaseDate());
		savedMovie.setRating(savedMovieDTO.getRating());
		savedMovie.setUserId(userId);
		savedMovie.setCreatedAt(LocalDateTime.now());
		savedMovie.setUpdatedAt(LocalDateTime.now());
		return savedMovie;
	}
}
