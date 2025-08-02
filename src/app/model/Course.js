// src/model/Course.js
import mongoose from 'mongoose';
import slugify from 'slugify';
import mongooseDelete from 'mongoose-delete';

const instructorSchema = new mongoose.Schema({
  name: String,
  // thêm các field khác nếu có
}, { _id: false });

const Course = new mongoose.Schema({
  courseId:        { type: String, required: true, unique: true },
  title:           { type: String, required: true },
  description:     String,
  instructor:      instructorSchema,
  category:        String,
  level:           String,
  durationHours:   Number,
  price:           Number,
  tags:            [String],
  studentsEnrolled:{ type: Number, default: 0 },
  slug:            { type: String, required: true, unique: true }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

//them sort 
Course.query.sortable = function(req){
  if('_sort' in req.query){
    const isValidType = ['asc', 'desc'].includes(req.query.type)
    return this.sort({
      [req.query.column] : isValidType ? req.query.type : 'desc'
    })
  }
  return this 
}

// Middleware tự động sinh slug từ title trước validate
Course.pre('validate', function(next) {
  if (this.title && (this.isNew || this.isModified('title'))) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

Course.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all'
})

export default mongoose.model('Course', Course);
