import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnection } from '../../middlewares/dbConnection';
import { corsPolicy } from '../../middlewares/corsPolicy';
import { userModels } from '../../models/userModels';
import jwt from 'jsonwebtoken';
import { loginTypes } from "../../types/loginTypes";

const login = async (req: NextApiRequest, res: NextApiResponse<loginTypes | any>) => {

    const { JWT_KEY } = process.env;
    if (!JWT_KEY) {
        return res.status(500).json({ error: 'Check ENV JWT_KEY' });
    }

    if (req.method === 'POST') {
        const email = req.query.email;

        const users = await userModels.find({ email: email })

        if (users && users.length > 0) {
            const hasUser = users[0]

            const token = jwt.sign({ _id: hasUser._id }, JWT_KEY)

            return res.status(200).json({
                name: hasUser.name,
                email: hasUser.email,
                token
            });
        }
        console.log(users)
        return res.status(400).json({ error: 'Did you sign up?' });
    }

    return res.status(405).json({ error: 'Method invalid' });
}

export default corsPolicy(dbConnection(login));