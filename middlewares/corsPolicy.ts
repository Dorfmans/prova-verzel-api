import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next"
import NextCors from "nextjs-cors"

export const corsPolicy = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        try {

            await NextCors(req, res, {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                optionsSuccessStatus: 200
            });

            return handler(req, res)

        } catch (e) {
            return res.status(500).json({ error: 'Could not connect to cors policy' })
        };
    };
