package com.example.backult.entity;

import jakarta.persistence.*;


@Entity
@Table(name="task")
public class TaskBD {
    @Id
    @Column(length = 45)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int taskId;
    @Column(name = "x")
    private String x;
    @Column(name = "y")
    private String y;
    @Column(name = "r")
    private String r;
    @Column(name = "ans")
    private String ans;
    @Column
    private String name;

    public TaskBD(String x, String y, String r, String ans, String name) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.ans = ans;
        this.name = name;
    }

    public TaskBD() {}

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
