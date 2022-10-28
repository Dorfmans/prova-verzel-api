import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";


export const dbConnection = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (mongoose.connections[0].readyState) {
            return handler(req, res);
        }

        const { DB_CONNECTION_STRING } = process.env;

        if (!DB_CONNECTION_STRING) {
            return res.status(500).json({ error: 'Something is missing' });
        }

        mongoose.connection.on('connected', () => console.log('Database Connected'));
        mongoose.connection.on('error', error => console.log('Database NOT Connected: ' + error));
        await mongoose.connect(DB_CONNECTION_STRING);

        return handler(req, res);
    }
