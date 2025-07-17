package com.rasp.app.dto;

public class AdminValidationResponse {
    private boolean isAdmin;
    private String message;

    public AdminValidationResponse() {}

    public AdminValidationResponse(boolean isAdmin) {
        this.isAdmin = isAdmin;
        this.message = isAdmin ? "Valid admin credentials" : "Invalid admin credentials";
    }

    public AdminValidationResponse(boolean isAdmin, String message) {
        this.isAdmin = isAdmin;
        this.message = message;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
