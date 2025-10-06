import { getDB } from "../lib/db.js";
import { ObjectId } from "mongodb";

export const getChats = async (req, res) => {
    const tokenUserId = req.userId;
    const db = getDB();

    try {
        const chats = await db.collection("chats").find({
            userIDs: new ObjectId(tokenUserId)
        }).toArray();

        for (const chat of chats) {
            const receiverId = chat.userIDs.find((id) => id.toString() !== tokenUserId);
            
            if (receiverId) {
                const receiver = await db.collection("users").findOne(
                    { _id: receiverId },
                    {
                        projection: { username: 1, avatar: 1 },
                    }
                );
                chat.receiver = receiver;
            }
        }

        res.status(200).json(chats);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get chats!" });
    }
};

export const getChat = async (req, res) => {
    const tokenUserId = req.userId;
    const chatId = req.params.id;
    const db = getDB();

    try {
        const chat = await db.collection("chats").findOne({
            _id: new ObjectId(chatId),
            userIDs: new ObjectId(tokenUserId),
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found!" });
        }

        await db.collection("chats").updateOne(
            { _id: new ObjectId(chatId) },
            { $addToSet: { seenBy: new ObjectId(tokenUserId) } }
        );

        const messages = await db.collection("messages").find({
            chatId: new ObjectId(chatId)
        }).sort({ createdAt: 1 }).toArray();

        chat.messages = messages;

        res.status(200).json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get chat!" });
    }
};

export const addChat = async (req, res) => {
    const tokenUserId = req.userId;
    const receiverId = req.body.receiverId;
    const db = getDB();

    try {
        const newChat = {
            userIDs: [new ObjectId(tokenUserId), new ObjectId(receiverId)],
            createdAt: new Date(),
            seenBy: [new ObjectId(tokenUserId)],
            messages: [],
        };

        const result = await db.collection("chats").insertOne(newChat);
        res.status(200).json({ ...newChat, _id: result.insertedId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to add chat!" });
    }
};

export const readChat = async (req, res) => {
    const tokenUserId = req.userId;
    const chatId = req.params.id;
    const db = getDB();

    try {
        const result = await db.collection("chats").updateOne(
            {
                _id: new ObjectId(chatId),
                userIDs: new ObjectId(tokenUserId),
            },
            { $addToSet: { seenBy: new ObjectId(tokenUserId) } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Chat not found or user not a member." });
        }
        
        res.status(200).json({ message: "Chat marked as read." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to read chat!" });
    }
};