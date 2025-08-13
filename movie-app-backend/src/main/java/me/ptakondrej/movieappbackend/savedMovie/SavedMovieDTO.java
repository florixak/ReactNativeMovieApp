package me.ptakondrej.movieappbackend.savedMovie;

public class SavedMovieDTO {
	private Long movieId;
	private String title;
	private String posterUrl;
	private String overview;
	private String releaseDate;
	private Double rating;

	public SavedMovieDTO() {}

	public SavedMovieDTO(Long movieId, String title, String posterUrl, String overview, String releaseDate, Double rating) {
		this.movieId = movieId;
		this.title = title;
		this.posterUrl = posterUrl;
		this.overview = overview;
		this.releaseDate = releaseDate;
		this.rating = rating;
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
}
