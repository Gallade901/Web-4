package com.example.backult.service;

public class LoginMesage {
    String message;
    Boolean status;
    String id;


    public LoginMesage(String message, Boolean status, String id) {
        this.message = message;
        this.status = status;
        this.id = id;

    }
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}