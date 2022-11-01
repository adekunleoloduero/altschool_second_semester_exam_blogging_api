const { Schema, model } = require('mongoose');


const articleSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "users"
        },
        state: {
            type: {String, enum: ["draft", "published"]},
            default: "draft",
        },
        read_count: Number,
        reading_time: Number,
        tags: Array,
        body: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: new Date().now()
        }
    }
);



module.exports = model("articles", articleSchema);