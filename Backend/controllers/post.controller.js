import jwt from "jsonwebtoken";
import { getDB } from "../lib/db.js";
import { ObjectId } from "mongodb";

export const getPosts = async (req, res) => {
  const query = req.query;
  const db = getDB();
  try {
    const filter = {};
    if (query.city) filter.city = query.city;
    if (query.type) filter.type = query.type;
    if (query.property) filter.property = query.property;
    if (query.bedroom) filter.bedroom = parseInt(query.bedroom);
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = parseInt(query.minPrice);
      if (query.maxPrice) filter.price.$lte = parseInt(query.maxPrice);
    }

    const posts = await db.collection("posts").find(filter).toArray();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  const db = getDB();
  try {
    const post = await db.collection("posts").aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "postdetails",
          localField: "_id",
          foreignField: "postId",
          as: "postDetail",
        },
      },
      { $unwind: "$postDetail" },
      {
        $project: { "user.password": 0 },
      },
    ]).next();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          return res.status(200).json({ ...post, isSaved: false });
        }
        const saved = await db.collection("savedposts").findOne({
          postId: new ObjectId(id),
          userId: new ObjectId(payload.id),
        });
        res.status(200).json({ ...post, isSaved: !!saved });
      });
    } else {
      res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;
  const db = getDB();
  try {
    const newPostData = {
      ...body.postData,
      userId: new ObjectId(tokenUserId),
      createdAt: new Date(),
    };

    const result = await db.collection("posts").insertOne(newPostData);
    const newPostId = result.insertedId;

    if (body.postDetail) {
      const postDetailData = {
        ...body.postDetail,
        postId: newPostId,
      };
      await db.collection("postdetails").insertOne(postDetailData);
    }

    res.status(200).json({ ...newPostData, _id: newPostId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    res.status(200).json({ message: "Update endpoint not implemented yet." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const db = getDB();
  try {
    const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });

    if (post.userId.toString() !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await db.collection("posts").deleteOne({ _id: new ObjectId(id) });
    await db.collection("postdetails").deleteOne({ postId: new ObjectId(id) });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};