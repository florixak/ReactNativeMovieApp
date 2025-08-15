package me.ptakondrej.movieappbackend.savedMovie;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SavedMovieDTO {
	@JsonProperty("id")
	private Long movieId;
	private String title;
	@JsonProperty("poster_path")
	private String posterPath;
	@JsonProperty("release_date")
	private String releaseDate;
	@JsonProperty("vote_average")
	private Double voteAverage;
	@JsonProperty("original_language")
	private String originalLanguage;

	public SavedMovieDTO() {}

	public SavedMovieDTO(Long movieId, String title, String posterPath, String releaseDate, Double voteAverage, String originalLanguage) {
		this.movieId = movieId;
		this.title = title;
		this.posterPath = posterPath;
		this.releaseDate = releaseDate;
		this.voteAverage = voteAverage;
		this.originalLanguage = originalLanguage;
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

	public String getPosterPath() {
		return posterPath;
	}

	public void setPosterPath(String poster_path) {
		this.posterPath = poster_path;
	}

	public String getReleaseDate() {
		return releaseDate;
	}

	public void setReleaseDate(String release_date) {
		this.releaseDate = release_date;
	}

	public Double getVoteAverage() {
		return voteAverage;
	}

	public void setVoteAverage(Double voteAverage) {
		this.voteAverage = voteAverage;
	}

	public String getOriginalLanguage() {
		return originalLanguage;
	}

	public void setOriginalLanguage(String originalLanguage) {
		this.originalLanguage = originalLanguage;
	}
}
