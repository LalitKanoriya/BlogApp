const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Article = require('../models/articles');
const { db } = require('../models/users');

router.get("/home", async (req, res) => {
    let id = req.session.userId;
    User.findOne({ _id : id}, (err, sessionUser) => {
        if (sessionUser){
            User.find((err, users) => {
                if (users){
                    let articles = []
                    users.forEach((user, index) => {
                        let allArticles = user.articles;
                        let length = allArticles.length;
                        let articleId = allArticles[length-1];
                        Article.findOne({_id: articleId}, (err, article)=>{
                            if (article){
                                articles.push(article);
                                if (index + 1 === users.length){
                                    res.render('home', { user: sessionUser, articles: articles });
                                }
                            } else{
                                res.render('home', { user: sessionUser, articles: articles });
                            }
                        })
                    })
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
            res.render('newArticle',
            {
                article : new Article(),
                link : "/home",
                user: user
            });
        } else{
            res.send(err);
        }
    })
});

router.post('/home/new-article', (req, res) => {
    let newArticle = new Article({
        title : req.body.title,
        description : req.body.description,
        markdown : req.body.markdown,
        createdBy : req.session.userId
    })
    newArticle.save((err, article) => {
        if (err){
            res.render('newArticle', {article : article});
        } else{
            let id = req.session.userId;
            User.updateOne(
                { _id : id},
                { $push : {articles : article._id}}, () => {
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
                    res.render('showArticle',
                    { 
                        article : article,
                        sessionUser: sessionUser
                    });
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
                    res.render('profile',
                    {
                        user : user,
                        sessionUser: sessionUser
                    });
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
                    let articlesId = user.articles;
                    console.log(articlesId);
                    let userArticles = [];
                    if (articlesId.length !== 0){
                        articlesId.forEach((id, index)=>{
                            Article.findOne({_id: id}, (err, article)=>{
                                if (article){
                                    userArticles.push(article);
                                    if (index + 1 === articlesId.length){
                                        console.log('Article founded in both schemas');
                                        res.render('allArticles', 
                                        {
                                            articles: userArticles,
                                            sessionUser: sessionUser,
                                            user: user
                                        });
                                    }
                                } else{
                                    console.log('Article founded in userSchema but not in articleSchema!');
                                }
                            })
                        })
                    } else{
                        console.log('Article not found in both schemas!');
                        res.render('allArticles', 
                        {
                            articles: userArticles,
                            sessionUser: sessionUser,
                            user: user
                        });
                    }
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
                    res.render('editArticle',
                    {
                        article: article,
                        link: `/all-articles/${sessionId}`,
                        user: sessionUser
                    });
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
    let articleId = req.params.id;
    User.findByIdAndUpdate(userId, {$pull: {articles: articleId}}, (err, result) => {
        if (result) {
            Article.findByIdAndDelete(articleId, (err, model) => {
                if (model) {
                    res.redirect(`/all-articles/${userId}`);
                } else {
                    res.send(err);
                }
            });
        } else {
            res.send(err);
        }
    });
});

module.exports = router;