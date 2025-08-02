import express from 'express';
import CourseController from '../app/controller/CourseController.js';

const router = express.Router();
const controller = new CourseController();



// CREATE & STORE

router.get('/create', controller.create);
router.post('/store', controller.store);

// EDIT & UPDATE
router.get('/:id/edit', controller.edit);
router.put('/:id/edit', controller.update);

// SOFT DELETE (move to trash)
router.delete('/:id/delete', controller.delete);

// RESTORE from trash
router.patch('/:id/restore', controller.restoreCourse);

// FORCE DELETE (xóa vĩnh viễn)
router.delete('/:id/forceDelete', controller.deleteForce);

//getAllCourse
router.get('/getAllCourse', controller.getAllCourse)

// SHOW DETAIL BY SLUG (đặt sau để không bị bắt hết)
/* 
   Ví dụ /course/create sẽ match route /create, 
   /course/:slug mới vào đây, nên phải đặt cuối
*/
router.get('/:slug', controller.show);

export default router;
