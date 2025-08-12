package me.ptakondrej.movieappbackend.trendingMovie;

public class TrendingMovieRequest {
	private String searchTerm;
	private Long movieId;
	private String title;
	private String posterUrl;

	public TrendingMovieRequest() {}

	public TrendingMovieRequest(String searchTerm, Long movieId, String title, String posterUrl) {
		this.searchTerm = searchTerm;
		this.movieId = movieId;
		this.title = title;
		this.posterUrl = posterUrl;
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

	public String getPosterUrl() {
		return posterUrl;
	}

	public void setPosterUrl(String posterUrl) {
		this.posterUrl = posterUrl;
	}
}
