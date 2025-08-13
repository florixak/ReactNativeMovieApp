package me.ptakondrej.movieappbackend.savedMovie;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_movies")
public class SavedMovie {
	@Id
	@GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
	private Long id;
	@Column(name = "movie_id", unique = true, nullable = false)
	private Long movieId;
	private String title;
	@Column(name = "user_id")
	private Long userId;
	@Column(name = "poster_url")
	private String posterUrl;
	private String overview;
	@Column(name = "release_date")
	private String releaseDate;
	private Double rating;
	@CreationTimestamp
	@Column(name = "created_at")
	private LocalDateTime createdAt;
	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	public SavedMovie() {}

	public SavedMovie(Long movieId, String title, String posterUrl, String overview, String releaseDate, Double rating, LocalDateTime createdAt, LocalDateTime updatedAt) {
		this.movieId = movieId;
		this.title = title;
		this.posterUrl = posterUrl;
		this.overview = overview;
		this.releaseDate = releaseDate;
		this.rating = rating;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getMovieId() {
		return movieId;
	}

	public void setMovieId(Long movieId) {
		this.movieId = movieId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getPosterUrl() {
		return posterUrl;
	}

	public void setPosterUrl(String posterUrl) {
		this.posterUrl = posterUrl;
	}

	public String getOverview() {
		return overview;
	}

	public void setOverview(String overview) {
		this.overview = overview;
	}

	public String getReleaseDate() {
		return releaseDate;
	}

	public void setReleaseDate(String releaseDate) {
		this.releaseDate = releaseDate;
	}

	public Double getRating() {
		return rating;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
}
