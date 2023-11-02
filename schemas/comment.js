const express = require('express');

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required : true
    },
    detail: {
        type : String
    }},
    { timestamps: true }
);

module.exports = mongoose.model("Comments", commentSchema);
