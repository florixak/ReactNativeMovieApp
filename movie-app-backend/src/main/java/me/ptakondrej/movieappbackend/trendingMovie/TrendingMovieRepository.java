package me.ptakondrej.movieappbackend.trendingMovie;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrendingMovieRepository extends JpaRepository<TrendingMovie, Long> {
	List<TrendingMovie> findTop10ByOrderByCountDesc();
	Optional<TrendingMovie> findByMovieIdAndSearchTerm(Long movieId, String searchTerm);
}
