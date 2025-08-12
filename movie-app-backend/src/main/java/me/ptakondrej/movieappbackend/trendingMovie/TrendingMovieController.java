package me.ptakondrej.movieappbackend.trendingMovie;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trending-movies")
public class TrendingMovieController {

	private final TrendingMovieService trendingMovieService;

	public TrendingMovieController(TrendingMovieService trendingMovieService) {
		this.trendingMovieService = trendingMovieService;
	}

	@GetMapping
	public ResponseEntity<List<TrendingMovieDTO>> getAllTrendingMovies() {
		List<TrendingMovie> trendingMovies = trendingMovieService.getAllTrendingMovies();

		List<TrendingMovieDTO> trendingMovieDTOS = trendingMovies.stream()
				.map(this::convertToDTO).toList();

		return ResponseEntity.ok(trendingMovieDTOS);
	}

	@PutMapping
	public ResponseEntity<String> updateTrendingMovie(
			@RequestBody TrendingMovieRequest trendingMovieRequest
	) {
		TrendingMovie trendingMovie = new TrendingMovie();
		trendingMovie.setMovieId(trendingMovieRequest.getMovieId());
		trendingMovie.setTitle(trendingMovieRequest.getTitle());
		trendingMovie.setPosterUrl(trendingMovieRequest.getPosterUrl());
		trendingMovie.setSearchTerm(trendingMovieRequest.getSearchTerm());

		trendingMovieService.updateTrendingMovies(trendingMovie);
		return ResponseEntity.ok("Trending movies updated successfully");
	}

	@GetMapping("/top10")
	public ResponseEntity<List<TrendingMovieDTO>> getTop10TrendingMovies() {
		List<TrendingMovie> trendingMovies = trendingMovieService.getTop10TrendingMoviesByCount();
		List<TrendingMovieDTO> trendingMovieDTOS = trendingMovies.stream()
				.map(this::convertToDTO).toList();
		return ResponseEntity.ok(trendingMovieDTOS);
	}

	private TrendingMovieDTO convertToDTO(TrendingMovie entity) {
		return new TrendingMovieDTO(
				entity.getId(),
				entity.getSearchTerm(),
				entity.getMovieId(),
				entity.getTitle(),
				entity.getCount(),
				entity.getPosterUrl()
		);
	}
}
