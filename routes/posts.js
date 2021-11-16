const express = require("express");
const jwt = require("jsonwebtoken");
const upload = require("../multer");
const router = express.Router();

const posts = [];
/* {
  id:
  title:
  description:
  image:
  author:
} */
const likes = [];
/* 
{
  id: 
  postId:
  userId:
}
*/

const verifyToken = (req, res, next) => {
  // FORMAT OF TOKEN
  // Authorization: Bearer <access_token>
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader && bearerHeader.includes("Bearer ")) {
    const token = bearerHeader.split(" ")[1];
    req.token = token;
    next();
  } else {
    res.status(403);
    res.send({ message: "Authorization token is missing or invalid!" });
  }
};

// create post
router.post("/", [verifyToken, upload.single("image")], (req, res) => {
  jwt.verify(req.token, "secretkey", (error, data) => {
    if (error) {
      res.status(403);
      res.send({ message: "Authorization token is invalid!" });
    } else {
      console.log(data);
      console.log(req.body);
      console.log(req.file);
      const newPost = {
        id: new Date().getTime(),
        title: req.body.title,
        description: req.body.description,
        image: req.file.path,
        author: data.user.username,
      };
      posts.push(newPost);
      res.send({
        message: "Post created successfully",
        post: newPost,
      });
    }
  });
});

router.get("/", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (error, data) => {
    if (error) {
      res.status(403);
      res.send({ message: "Authorization token is invalid!" });
    } else {
      /* {
        id:
        title:
        description:
        image:
        author:
        totalLikes: 
        isLiked:
      } */
      const result = posts.map((post) => {
        let totalLikes = 0;
        let isLiked = 0;
        likes.forEach((like) => {
          if (like.postId === post.id) {
            totalLikes++;
            if (like.userId === data.user.userId) {
              isLiked = 1;
            }
          }
        });
        return {
          ...post,
          totalLikes,
          isLiked,
        };
      });
      res.send({ posts: result });
    }
  });
});

module.exports = router;
