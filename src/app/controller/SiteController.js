import CourseRepository from '../repository/Course.js';

class SiteController {
  async index(req, res, next) {
    try {
      let { page = 1, size = 10, searchString = '' } = req.query;
      page = parseInt(page, 10);
      size = parseInt(size, 10);

      const { courses, totalItems, totalPages } = 
        await CourseRepository.getAllCourse({ page, size, searchString });

      res.render('home', {
        title: 'Home',
        courses,
        page,
        size,
        searchString,
        totalItems,
        totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages
      });
    } catch (err) {
      next(err);
    }
  }
}

export default SiteController;
