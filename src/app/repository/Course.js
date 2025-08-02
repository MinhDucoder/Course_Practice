// repository/Course.js
import Course from '../model/Course.js';

class CourseRepository {
  
  static async getAllCourse({ page = 1, size = 10, searchString = '' }) {
    
    page = Math.max(parseInt(page, 10), 1);
    size = Math.max(Math.min(parseInt(size, 10), 50), 1); 

    
    const filter = {};
    if (searchString && typeof searchString === 'string') {
      filter.title = new RegExp(searchString.trim(), 'i');
    }

    
    const totalItems = await Course.countDocuments(filter);

    
    const totalPages = Math.ceil(totalItems / size) || 1;

    
    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })                  
      .skip((page - 1) * size)                 
      .limit(size)                              
      .lean();                                 

    return {
      courses,
      totalItems,
      totalPages
    };
  }

  
  static async getCourseBySlug(slug) {
    if (!slug) return null;
    return await Course.findOne({ slug }).lean();
  }

 
  static async createCourse(courseData) {
    const course = new Course(courseData);
    return await course.save();
  }

 
  static async updateCourse(id, updateData) {
    return await Course.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

 
  static async deleteCourse(id, permanent = false) {
    if (permanent) {
      return await Course.findByIdAndDelete(id);
    } else {
      return await Course.delete({ _id: id });
    }
  }
}

export default CourseRepository;
