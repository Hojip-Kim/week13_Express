const express = require('express');

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Posts',
    },
    createdBy: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comments', commentSchema);
