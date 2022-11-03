const { Schema, model } = require('mongoose');


const articleSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: String,
        author: String,
        state: {
            type: String, 
            enum: ["draft", "published"],
            default: "draft",
        },
        body: {
            type: String,
            required: true
        },
        readCount: {
            type: Number,
            default: 0
        },
        readingTime: Number,
        tags: Array,
        timestamp: {
            type: Date,
            default: Date.now()
        }
    }
);



//Calculate article readingTime
articleSchema.methods.calculateReadingTime = function(content) {
    const wordCount = this.body.split(' ').length;
    const readingTime = wordCount / 250; //250 words per minute is average reading speed
    const readingTimeMinutes = Math.ceil(readingTime);
    return readingTimeMinutes;
};



module.exports = model("articles", articleSchema);