var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    sanitizer = require("express-sanitizer");
//APP CONFIG
    mongoose.connect("mongodb://localhost/blog_app", {useMongoClient: true});
    
    app.set("view engine", "ejs");
    app.use(express.static("public")); //for using public directory
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(sanitizer());
    app.use(methodOverride("_method"));
    
//MONGOOSE/MODEL CONFIG
    var blogSchema = new mongoose.Schema({
        
       title: String,
       image: String,
       body: String,
       created: {type: Date, default: Date.now}
    });
    
    var Blog = mongoose.model("Blog", blogSchema);
    
    // Blog.create({
    //     title: "Sunday Morning",
    //     image: "https://i.pinimg.com/736x/f6/6d/fb/f66dfb28ae74c59eb004c7cb9097073c--tumblr-colors-tea-for-colds.jpg",
    //     body: "Sunday morning, rain is falling, Steal some covers, share some skin, Clouds are shrouding us in moments unforgettable, You twist to fit the mold that I am in, But things just get so crazy, living life gets hard to do, And I would gladly hit the road, get up and go if I knew, That someday it would lead me back to you, That someday it would lead me back to you..."
        
    // }, function(err, neww){
    //     if(err)
    //     {
    //         console.log("ERROR!!");
    //     }
    //     else{
            
    //         console.log(neww);
    //     }
    // });
    
//RESTFUL ROUTES
    //INDEX ROUTE
    app.get("/", function(req,res){
        
       res.redirect("/blogs"); 
    });
    app.get("/blogs", function(req,res){
        
        Blog.find({}, function(err, blogs){
            
            if(err){
                console.log(err);
            }
            else{
                 res.render("index", {blogs: blogs}); 
                
            }
        });  
      
    });

//NEW ROUTE
    app.get("/blogs/new", function(req,res){
        
       res.render("new"); 
    });
//CREATE ROUTE

app.post("/blogs", function(req,res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // create blog
   Blog.create(req.body.blog, function(err, newBlog){
       
      if(err)
      {
          console.log(err);
          
      }
      
      else{
            // redirect to index
          res.redirect("/blogs");
      }
   });
    
  
    
});

//SHOW ROUTE

    app.get("/blogs/:id", function(req,res){
        Blog.findById(req.params.id, function(err, foundBlog){
           if(err)
           {
               console.log(err);
           }
           else{
               
               res.render("show", {blog:foundBlog});
           }
            
        });
    
    });
    
// EDIT ROUTE
    app.get("/blogs/:id/edit", function(req,res){
        Blog.findById(req.params.id, function(err, foundBlog){
            
           if(err)
           {console.log(err);}
           else{
               res.render("edit",{blog: foundBlog}); 
           }
           
        });
       
    });
    
// CHANGE ROUTE
    app.put("/blogs/:id", function(req,res){
      req.body.blog.body = req.sanitize(req.body.blog.body);
       Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
           if(err)
           {console.log(err);}
           else{
               res.redirect("/blogs/" + req.params.id);
           }
       });
        
    });
    
// DELETE ROUTE
    app.delete("/blogs/:id", function(req,res){
        
    Blog.findByIdAndRemove(req.params.id, function(err){
        
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs");
        }
    });
        
    });
    
    
    app.listen(process.env.PORT, process.env.IP);