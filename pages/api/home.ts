import type { NextApiRequest, NextApiResponse } from 'next';
import { catalogueModels } from '../../models/catalogueModels';
import { dbConnection } from '../../middlewares/dbConnection'


const home = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === 'GET') {

    const catalogue = await catalogueModels.find().sort({ price: 1 })

    if (catalogue) {
      return res.status(200).json(catalogue);
    }

    return res.status(404).json({ error: 'Something went wrong, try again' })
  }

  return res.status(405).json({ error: 'Method invalid' });
}

export default dbConnection(home);