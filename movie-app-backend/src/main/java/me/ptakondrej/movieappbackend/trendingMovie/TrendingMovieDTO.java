package me.ptakondrej.movieappbackend.trendingMovie;

public class TrendingMovieDTO {

	private Long id;
	private String searchTerm;
	private Long movieId;
	private String title;
	private Integer count;
	private String posterUrl;

	public TrendingMovieDTO() {}

	public TrendingMovieDTO(Long id, String searchTerm, Long movieId, String title, Integer count, String posterUrl) {
		this.id = id;
		this.searchTerm = searchTerm;
		this.movieId = movieId;
		this.title = title;
		this.count = count;
		this.posterUrl = posterUrl;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	public String getPosterUrl() {
		return posterUrl;
	}

	public void setPosterUrl(String posterUrl) {
		this.posterUrl = posterUrl;
	}
}