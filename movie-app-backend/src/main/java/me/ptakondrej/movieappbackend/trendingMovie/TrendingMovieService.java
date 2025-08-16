package me.ptakondrej.movieappbackend.trendingMovie;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TrendingMovieService {

	private final TrendingMovieRepository trendingMovieRepository;

	public TrendingMovieService(TrendingMovieRepository trendingMovieRepository) {
		this.trendingMovieRepository = trendingMovieRepository;
	}

	public List<TrendingMovie> getAllTrendingMovies() {
		return trendingMovieRepository.findAll();
	}

	@Transactional
	public void updateTrendingMovies(TrendingMovie trendingMovie) {

		TrendingMovie existingMovie = trendingMovieRepository
				.findByMovieId(trendingMovie.getMovieId())
				.orElse(null);

		if (existingMovie == null) {
			trendingMovie.setSearchTerm(trendingMovie.getSearchTerm());
			trendingMovie.setCount(1);
			trendingMovieRepository.save(trendingMovie);
		} else {
			if (!existingMovie.getTitle().equals(trendingMovie.getTitle())) {
				existingMovie.setTitle(trendingMovie.getTitle());
			}
			if (!existingMovie.getPosterUrl().equals(trendingMovie.getPosterUrl())) {
				existingMovie.setPosterUrl(trendingMovie.getPosterUrl());
			}
			existingMovie.setCount(existingMovie.getCount() + 1);
			trendingMovieRepository.save(existingMovie);
		}
	}

	public List<TrendingMovie> getTop10TrendingMoviesByCount() {
		List<TrendingMovie> trendingMovies = trendingMovieRepository.findTop10ByOrderByCountDesc();
		return trendingMovies;
	}
}
