package me.ptakondrej.movieappbackend.savedMovie;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedMovieRepository extends JpaRepository<SavedMovie, Long> {
	List<SavedMovie> findByUserId(Long userId);
}
