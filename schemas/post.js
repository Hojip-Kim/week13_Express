const express = require('express');

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model('Posts', postSchema);
