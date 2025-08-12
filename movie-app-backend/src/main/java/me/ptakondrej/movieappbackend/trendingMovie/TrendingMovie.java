package me.ptakondrej.movieappbackend.trendingMovie;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "trending_movies")
public class TrendingMovie {

	/*searchTerm: string;
	movie_id: number;
	title: string;
	count: number;
	poster_url: string;*/

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name = "search_term")
	private String searchTerm;
	@Column(name = "movie_id")
	private Long movieId;
	private String title;
	private Integer count;
	@Column(name = "poster_url")
	private String posterUrl;
	@CreationTimestamp
	@Column(name = "created_at")
	private LocalDateTime createdAt;
	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	public TrendingMovie() {}

	public TrendingMovie(Long id, String searchTerm, Long movieId, String title, Integer count, String posterUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
		this.id = id;
		this.searchTerm = searchTerm;
		this.movieId = movieId;
		this.title = title;
		this.count = count;
		this.posterUrl = posterUrl;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPosterUrl() {
		return posterUrl;
	}

	public void setPosterUrl(String posterUrl) {
		this.posterUrl = posterUrl;
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	public String getSearchTerm() {
		return searchTerm;
	}

	public void setSearchTerm(String searchTerm) {
		this.searchTerm = searchTerm;
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
}
