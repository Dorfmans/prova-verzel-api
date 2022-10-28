import type { NextApiRequest, NextApiResponse } from 'next';
import type { signUpTypes } from '../../types/signUpTypes';
import { userModels } from '../../models/userModels';
import { dbConnection } from '../../middlewares/dbConnection'
import nc from 'next-connect';
import { upload } from '../../services/cosmicImageUploader';

const handler = nc()
    .use(upload.single(''))
    .post(async (req: NextApiRequest, res: NextApiResponse) => {

        try {

            const user = req.body as signUpTypes;

            if (!user.name || user.name.length < 2) { return res.status(400).json({ error: 'Invalid Username' }) };

            if (!user.email
                || user.email.length < 5
                || !user.email.includes('@')
                || !user.email.includes('.')) { return res.status(400).json({ error: 'Invalid Email' }) };

            const savingUser = {
                name: user.name,
                email: user.email
            }

            const sameUserEmail = await userModels.find({ email: user.email });
            if (sameUserEmail && sameUserEmail.length > 0) { return res.status(400).json({ error: 'Email already registered' }) };

            await userModels.create(savingUser);
            return res.status(201).json({ message: 'User Created' })

        } catch (e: any) {
            console.log(e)
            return res.status(400).json({ error: 'Could not register this user, try again.' })
        };
    }
    );

export const config = {
    api: {
        bodyParser: false
    }
}

export default dbConnection(handler);
