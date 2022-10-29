import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { catalogueModels } from '../../models/catalogueModels';
import { corsPolicy } from '../../middlewares/corsPolicy';
import { tokenAuth } from '../../middlewares/tokenAuth';
import { dbConnection } from '../../middlewares/dbConnection'
import { cosmicImageUploader, upload } from '../../services/cosmicImageUploader';


const postVehicle = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const vehicle = req.body;

        const owner = req.query.email;

        if (!vehicle) {
            return res.status(400).json({ error: 'Missing Info' });
        }

        const image = await cosmicImageUploader(req);


        const savingVehicle = {
            name: vehicle.name,
            brand: vehicle.brand,
            model: vehicle.model,
            price: vehicle.price,
            image: image?.media?.url,
            owner: owner
        };

        const sameVehicle = await catalogueModels.find({ image: vehicle.image });

        if (sameVehicle && sameVehicle.length > 0) {
            return res.status(400).json({ error: 'Vehicle already registered' });
        }

        await catalogueModels.create(savingVehicle);

        return res.status(201).json({ message: 'Vehicle Registered' });

    } catch (e: any) {
        console.log(e);
        return res.status(500).json({ error: 'Cannot register your vehicle' });
    }
};

const getVehicle = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const owner = req.query.email;

        const vehicle = await catalogueModels
            .find({ owner: owner })
            .sort({ price: 1 });

        if (!vehicle || vehicle.length < 1) {
            return res.status(404).json({ message: 'Could not get any vehicle' });
        }
        return res.status(200).json(vehicle);

    } catch (e: any) {
        console.log(e);
        return res.status(500).json({ error: 'Cannot get vehicle' });
    }
};

const putVehicle = async (req: any, res: NextApiResponse) => {
    try {
        if (req.query.vehicleId) {

            const vehicleId = req.query.vehicleId;

            const vehicle = await catalogueModels.findById(vehicleId);

            if (!vehicle) {
                res.status(404).json({ error: 'Vehicle not found' });
            }

            const { name, brand, model, price } = req.body;
            if (name) {
                vehicle.name = name;
            }
            if (brand) {
                vehicle.brand = brand;
            }
            if (model) {
                vehicle.model = model;
            }
            if (price) {
                vehicle.price = price;
            }


            const { file } = req;
            if (file && file.originalname) {
                const image = await cosmicImageUploader(req);
                if (image && image.media && image.media.url) {
                    vehicle.image = image.media.url;
                }
            }
            await catalogueModels.findByIdAndUpdate({ _id: vehicle._id }, vehicle);

            res.status(200).json({ message: 'Vehicle updated successfully' });
        }
    } catch (e) {
        return res.status(500).json({ error: 'Cannot update this vehicle' });
    }
};

const deleteVehicle = async (req: any, res: NextApiResponse) => {
    try {
        if (req.query.vehicleId) {

            const vehicleId = req.query.vehicleId;

            const vehicle = await catalogueModels.findById(vehicleId);

            if (!vehicle) {
                res.status(404).json({ error: 'Vehicle not found' });
            }

            await catalogueModels.findByIdAndDelete({ _id: vehicle._id });

            res.status(200).json({ message: 'Vehicle deleted successfully' });
        }
    } catch (e) {
        return res.status(500).json({ error: 'Cannot delete this vehicle' });
    }
};



const handler = nc()
    .use(upload.single('image'))
    .post(postVehicle)
    .get(getVehicle)
    .put(putVehicle)
    .delete(deleteVehicle);


export const config = {
    api: {
        bodyParser: false
    }
};

export default corsPolicy(tokenAuth(dbConnection(handler)));