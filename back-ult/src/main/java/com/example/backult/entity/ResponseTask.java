package com.example.backult.entity;

import jakarta.persistence.*;


public class ResponseTask {

    private int taskId;

    private String x;

    private String y;

    private String r;
    @Column(name = "ans")
    private String ans;

    public ResponseTask(String x, String y, String r, String ans) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.ans = ans;
    }

    public ResponseTask() {}

    public int getTaskId() {
        return taskId;
    }

    public void setTaskId(int taskId) {
        this.taskId = taskId;
    }

    public String getX() {
        return x;
    }

    public void setX(String x) {
        this.x = x;
    }

    public String getY() {
        return y;
    }

    public void setY(String y) {
        this.y = y;
    }

    public String getR() {
        return r;
    }

    public void setR(String r) {
        this.r = r;
    }

    public String getAns() {
        return ans;
    }

    public void setAns(String ans) {
        this.ans = ans;
    }
}
