const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Article = require('../models/articles');
const { db } = require('../models/users');

router.get("/home", (req, res) => {
    let id = req.session.userId;
    User.findOne({ _id : id}, (err, user) => {
        if (user){
            User.find((err, users) => {
                if (users){
                    res.render('home', {users : users, user: user});
                } else{
                    res.send(err);
                }
            })
        } else{
            res.redirect('/login');
        }
    })
});

router.get('/home/new-article', (req, res) => {
    let id = req.session.userId;
    User.findOne({_id: id}, (err, user) => {
        if (user){
            res.render('newArticle', {article : new Article(), link : "/home", user: user});
        } else{
            res.send(err);
        }
    })
});

router.post('/home/new-article', (req, res) => {
    let newArticle = new Article({
        title : req.body.title,
        description : req.body.description,
        markdown : req.body.markdown
    })
    newArticle.save((err, article) => {
        if (err){
            res.render('newArticle', {article : article});
        } else{
            let id = req.session.userId;
            User.updateOne(
                { _id : id},
                { $push : {articles : article}}, () => {
                    res.redirect(`/show-article/${article.id}`);
                }
            );
        }
    })
});

router.get('/show-article/:id', (req, res) => {
    let sessionId = req.session.userId;
    let id = req.params.id;
    Article.findOne({_id: id}, (err, article) => {
        if (article){
            User.findOne({_id: sessionId}, (err, sessionUser) => {
                if (sessionUser){
                    res.render('showArticle', { article : article, sessionUser: sessionUser});
                } else{
                    res.send(err);
                }
            });
        } else{
            res.redirect('/home');
        }
    });
});

router.get('/profile/:id', (req, res) => {
    let sessionId = req.session.userId;
    let userId = req.params.id;
    User.findOne({ _id : sessionId}, (err, sessionUser) => {
        if (sessionUser){
            User.findOne({_id: userId}, (err, user) => {
                if (user){
                    res.render('profile', {user : user, sessionUser: sessionUser});
                } else{
                    res.send(err);
                }
            })
        } else{
            res.redirect('/login');
        }
    })
});

router.get('/all-articles/:id', (req, res) => {
    let sessionId = req.session.userId;
    let userId = req.params.id;
    User.findOne({_id : sessionId}, (err, sessionUser) => {
        if (sessionUser){
            User.findOne({_id: userId}, (err, user) => {
                if (user){
                    res.render('allArticles', {articles: user.articles, sessionUser: sessionUser, user: user});
                } else{
                    res.send(err);
                }
            })
        } else{
            res.send(err);
        }
    });
});

router.get('/edit-article/:id', (req, res) => {
    let id = req.params.id;
    let sessionId = req.session.userId;
    User.findOne({_id: sessionId}, (err, sessionUser) => {
        if (sessionUser){
            Article.findById({_id : id}, (err, article) => {
                if (article){
                    res.render('editArticle', {article: article, link: `/all-articles/${sessionId}`, user: sessionUser});
                } else{
                    res.send(err);
                }
            })
        } else{
            res.send(err);
        }
    })
});

router.put('/:id', (req, res) => {
    let userId = req.session.userId;
    let id = req.params.id;
    Article.findById({_id : id}, (err, article) => {
        if (article){
            article.title = req.body.title;
            article.description = req.body.description;
            article.markdown = req.body.markdown;

            article.save((err, model) => {
                if (model){
                    User.updateOne(
                        { _id: userId },
                        { $set: {
                           'articles.$.title' : req.body.title,
                           'articles.$.description' : req.body.description,
                           'articles.$.markdown' : req.body.markdown
                        } }, (err, result) => {
                            if (result){
                                res.redirect(`/all-articles/${userId}`);
                            } else{
                                res.render('editArticle', {article : article});
                            }
                        }
                    );
                } else{
                    res.send(err);
                }
            })
        } else{
            res.send(err);
        }
    })
})

router.delete('/:id', (req, res) => {
    let userId = req.session.userId;
    let id = req.params.id;
    User.findByIdAndUpdate({ _id: userId },
        { $pull: { articles: { _id: id } } }, { safe: true, multi:true },
        (err, result) => {
            if (result){
                console.log(result);
                Article.findByIdAndDelete({ _id : id }, (err, model) => {
                    if (model){
                        console.log(model);
                        res.redirect(`/all-articles/${userId}`);
                    } else{
                        res.send(err);
                    }                
                });
            } else{
                res.send(err);
            }
        }
    );
});

module.exports = router;