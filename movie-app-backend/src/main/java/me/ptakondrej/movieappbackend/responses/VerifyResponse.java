package me.ptakondrej.movieappbackend.responses;

public class VerifyResponse extends Response{

	public VerifyResponse(boolean success, String message) {
		super(success, message);
	}
}
