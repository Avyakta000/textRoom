import prisma from "../db/prisma.js";
import { getRecieverSocketId, io } from "../socket/socket.js";
export const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { id: recieverId } = req.params;
        const senderId = req.user.id;
        // console.log(recieverId, ' recieverId, ', senderId, ' senderId')
        if (senderId === recieverId) {
            // You can choose to not allow self-conversations or handle differently
            // For now, we'll return a simple response stating that self-conversations are not allowed
            res.status(400);
            throw new Error("Self-conversations are not allowed.");
        }
        let conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, recieverId],
                }
            }
        });
        // the very first message is being sent, that's why we need to create new conversation
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, recieverId]
                    }
                }
            });
        }
        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id
            }
        });
        if (newMessage) {
            conversation = await prisma.conversation.update({
                where: {
                    id: conversation.id
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        }
                    }
                }
            });
        }
        // socket io
        const recieverSocketId = getRecieverSocketId(recieverId);
        console.log('recieverSocketId above', recieverSocketId, recieverId);
        if (recieverSocketId) {
            console.log('recieverSocketId recieved', recieverSocketId, recieverId);
            io.to(recieverSocketId).emit("newMessage", newMessage);
        }
        return res.status(201).json(newMessage);
    }
    catch (error) {
        next(error);
    }
};
export const getMessage = async (req, res, next) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;
        // console.log('senderId ',senderId, 'userToChatId ', userToChatId)
        // Check if senderId and userToChatId is same
        if (senderId === userToChatId) {
            res.status(400);
            throw new Error("You are viewing self conversation which is not allowed.");
        }
        ;
        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, userToChatId],
                }
            },
            // where: isSelfConversation
            // ? { participantIds: { equals: [senderId] } } // Only the sender ID for self-conversation
            // : { participantIds: { hasEvery: [senderId, userToChatId] } }, // Both IDs for a regular conversation
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });
        if (!conversation) {
            return res.status(200).json([]);
        }
        return res.status(201).json(conversation.messages);
    }
    catch (error) {
        console.log('catch error', error.message);
        next(error);
    }
};
export const getUsers = async (req, res, next) => {
    try {
        const authUserId = req.user.id;
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: authUserId
                }
            },
            select: {
                id: true,
                fullName: true,
                profilePic: true,
            }
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.log('catch error', error.message);
        next(error);
    }
};
