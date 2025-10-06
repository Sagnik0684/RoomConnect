import { getDB } from "../lib/db.js";
import { ObjectId } from "mongodb";

export const addMessage = async (req, res) => {
    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const text = req.body.text;
    const db = getDB();

    try {
        const chat = await db.collection("chats").findOne({
            _id: new ObjectId(chatId),
            userIDs: new ObjectId(tokenUserId),
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found or user not authorized!" });
        }

        const newMessage = {
            text,
            userId: new ObjectId(tokenUserId),
            chatId: new ObjectId(chatId),
            createdAt: new Date(),
        };

        const result = await db.collection("messages").insertOne(newMessage);

        await db.collection("chats").updateOne(
            { _id: new ObjectId(chatId) },
            {
                $set: {
                    lastMessage: text,
                    seenBy: [new ObjectId(tokenUserId)],
                },
            }
        );

        res.status(200).json({ ...newMessage, _id: result.insertedId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to add message!" });
    }
};