import bcrypt from "bcrypt";
import { getDB } from "../lib/db.js";
import { ObjectId } from "mongodb";

export const getUsers = async (req, res) => {
  const db = getDB();
  try {
    const users = await db.collection("users").find().toArray();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  const db = getDB();
  try {
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;
  const db = getDB();

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updateData = {
      ...inputs,
      ...(updatedPassword && { password: updatedPassword }),
      ...(avatar && { avatar }),
    };

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedUser = await db.collection("users").findOne(
        { _id: new ObjectId(id) },
        { projection: { password: 0 } }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update user!" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const db = getDB();

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete user!" });
  }
};

export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;
    const db = getDB();

    try {
        const savedPost = await db.collection("savedposts").findOne({
            userId: new ObjectId(tokenUserId),
            postId: new ObjectId(postId),
        });

        if (savedPost) {
            await db.collection("savedposts").deleteOne({ _id: savedPost._id });
            res.status(200).json({ message: "Post removed from saved list" });
        } else {
            await db.collection("savedposts").insertOne({
                userId: new ObjectId(tokenUserId),
                postId: new ObjectId(postId),
                createdAt: new Date(),
            });
            res.status(200).json({ message: "Post saved" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to save post!" });
    }
};

export const profilePosts = async (req, res) => {
    const tokenUserId = req.userId;
    const db = getDB();
    try {
        const userPosts = await db.collection("posts").find({ userId: new ObjectId(tokenUserId) }).toArray();

        const saved = await db.collection("savedposts").aggregate([
            { $match: { userId: new ObjectId(tokenUserId) } },
            {
                $lookup: {
                    from: "posts",
                    localField: "postId",
                    foreignField: "_id",
                    as: "post"
                }
            },
            { $unwind: "$post" }
        ]).toArray();
        
        const savedPosts = saved.map(item => item.post);

        res.status(200).json({ userPosts, savedPosts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get profile posts!" });
    }
};

export const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;
    const db = getDB();
    try {
        const number = await db.collection("chats").countDocuments({
            userIDs: new ObjectId(tokenUserId),
            seenBy: { $ne: new ObjectId(tokenUserId) }
        });
        res.status(200).json(number);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get notification number!" });
    }
};