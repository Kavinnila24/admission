package com.rasp.app.dto;

public class AdminValidationRequest {
    private String admin_registration_password;

    public AdminValidationRequest() {}

    public AdminValidationRequest(String admin_registration_password) {
        this.admin_registration_password = admin_registration_password;
    }

    public String getAdmin_registration_password() {
        return admin_registration_password;
    }

    public void setAdmin_registration_password(String admin_registration_password) {
        this.admin_registration_password = admin_registration_password;
    }
}
