// src/app/controller/CourseController.js
import Course from '../model/Course.js'
import mongoose from 'mongoose'
import CourseRepository from '../repository/Course.js'

class CourseController { 

//GET /
  async getAllCourse(req, res, next){
    let { page = 1, size = 10, searchString} = req.query
    size = size >= 10 ? 10 : size
    const course = await CourseRepository.getAllCourse(page, size, searchString)
    res.render('home', {course, page, size, searchString})
  }

  show(req, res, next) {
    const param = `${req.params.slug}`
    Course.findOne({slug: param}).lean()
                                  .then(course => {
                                    if(course){
                                      res.render('course/coursesDetail', {course})
                                    }
                                  })
                                  .catch(next)
  }
  create(req,res){
    res.render('course/create')
  } 
  store(req, res){
    const formData = req.body
    formData.image = `https://picsum.photos/seed/${formData.image}/600/400`
    const course = new Course(formData)
    course.save()
          .then( () => {
            res.redirect('/')
          })
          .catch(err => {
            res.send(err)
          })
  }
  edit(req, res, next){
    Course.findById(req.params.id).lean()
          .then(course => {
            res.render('course/edit', {course})
          })
          .catch(next)
  }
  //PUT /course/:id/edit
  update(req,res, next){
    Course.findOneAndUpdate({ _id : req.params.id}, req.body)
          .then(() => {
            res.redirect('/me/store/course')
          })
          .catch(next)
  }

  //PATCH /course/:id/restore
  restoreCourse(req, res, next){
    Course.restore({ _id : req.params.id})
          .then(() => {
            res.redirect('/me/store/course')
          })
          .catch(next)
  }
  //DELETE /course/:id/delete
  delete(req, res, next){
    Course.delete({_id : req.params.id})
          .then(() => {
            res.redirect('/me/store/course')
          })
          .catch(next)
  }
  //DELETE /course/:id/deleteForce
  deleteForce(req, res, next){
    Course.deleteOne({_id : req.params.id})
          .then(() => {
            res.redirect('back')
          })
          .catch(next)
  }
}

export default  CourseController
