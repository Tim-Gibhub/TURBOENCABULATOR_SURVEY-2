/*\
 * Team: Turboencabulator
 * Class: COMP 229
 * Group: 2
 * Section: 3
 * File: ./controllers/survey.js
 * 
\*/

let express = require('express');
let router = express.Router;

//DB
let mongoose = require('mongoose');

let Survey = require('../models/survey');
let Question = require('../models/question');

module.exports.displaySurveyList = (req,res,next) => 
{
    //Find and list all the surveys
    Survey.find( (err, surveys) => {
        if (err) {
          return console.error(err);
        }
        else {
            console.log(surveys[0].title);
            console.log(surveys[0].questionlist);
            res.render('survey/index', { 
                title: 'Survey List', 
                surveys: surveys
            });
        }
      });
}

module.exports.displayCreateSurvey = (req,res,next) =>
{
    //Create new base objects for survey creation
    let newQuestion = new Question({
        text:"New Question",
        type:"text",
        options:[]
    });
    let newQuestion2 = new Question({
        text:"New Question",
        type:"text",
        options:[]
    });
    let newSurvey = new Survey({
        title:"New Survey",
        questionlist:[newQuestion,newQuestion2]
    });

    return res.render('survey/details', {title: 'Create Survey', survey: newSurvey});
}

module.exports.createSurvey = (req,res,next) => {

    let data = req.body;

    let newSurvey = new Survey({
        title: data.title,
        questionlist:[]
    });

    let questionTextArray = data.questionText;
    let questionTypeArray = data.questionType;

    for(let i = 0; i < questionTextArray.length; i++){
        let question = new Question({
            text:questionTextArray[i],
            type:questionTypeArray[i],
            options:[]
        });

        newSurvey.questionlist.push(question);
    }

    console.log(newSurvey);

    Survey.create(newSurvey, (err, Contact) => {
        if(err)
        {
            console.error(err);
            res.end(err);
        }
        else
        {
            res.redirect('/survey');
        }
    });
};

module.exports.displayEditSurvey = (req,res,next) =>
{
    let id = req.params.id;
  //Find the survey based on record id
  Survey.findById(id, (err, currentsurvey) => {
      if(err)
      {
          console.error(err);
          res.end(err);
      }
      else
      {
          //questons is sent as its own list
          let questions = currentsurvey.questionlist;
          res.render('survey/details', {title : "Edit Survey", survey : currentsurvey, questions : questions});
      }
  });
}


module.exports.editSurvey = (req,res,next) => {
    let id = req.params.id;
    let data = req.body;

    let updatedSurvey = new Survey({
        "_id": id,
        title: data.title,
        questionlist:[]
    });

    let questionTextArray = data.questionText;
    let questionTypeArray = data.questionType;

    for(let i = 0; i < questionTextArray.length; i++){
        let question = new Question({
            text:questionTextArray[i],
            type:questionTypeArray[i],
            options:[]
        });

        updatedSurvey.questionlist.push(question);
    }

    Survey.updateOne({_id:id}, updatedSurvey, (err) => {
        if(err)
        {
            console.error(err);
            res.end(err);
        }
        else
        {
            res.redirect('/survey');
        }
    });
}



module.exports.deleteSurvey = (req,res,next) => {
    let id = req.params.id;

    Survey.remove({_id:id}, (err)=>{
        if(err)
        {
            console.error(err);
            res.end(err);
        }
        else
        {
            res.redirect('/survey');
        }
    });

}