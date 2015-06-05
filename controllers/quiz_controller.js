var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {

  if(req.query.search)
  {
     /* Si hay busqueda: */

    /* Delimitamos el string contenido en search con el comodín % antes y
       después y cambiamos también los espacios en blanco por %.
       De esta forma, si busca "uno dos" ("%uno%dos%"), mostrará todas las
       preguntas que tengan "uno" seguido de "dos", independientemente de
       lo que haya entre "uno" y "dos".*/
    var isearch = "%" + req.query.search.replace(/\x20/g,'%') + "%";
    models.Quiz.findAll({where:["pregunta like ?", isearch], order: "pregunta ASC"}).then(
       function(quizes) {
          /* Se envía también un resumen del resultado de la búsqueda.*/
          var strResult = '['+req.query.search+']: '+quizes.length+' item(s) found.';
          res.render('quizes/index',
                            { quizes: quizes,
                             searched: strResult
                             });
       }
    ).catch(function(error) { next(error);})
  }
  else
  {
      /* Si no hay busqueda, se listan todas las preguntas. */
      models.Quiz.findAll().then(
         function(quizes) {
            res.render('quizes/index', { quizes: quizes, searched: ''});
         }
      ).catch(function(error) { next(error);})
  }


};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
