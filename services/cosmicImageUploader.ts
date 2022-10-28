import multer from "multer";
import cosmicjs from 'cosmicjs';

const {
    CATALOGUE_SLUG,
    CATALOGUE_WRITE_KEY } = process.env;

const Cosmic = cosmicjs();
const catalogueBucket = Cosmic.bucket({
    slug: CATALOGUE_SLUG,
    write_key: CATALOGUE_WRITE_KEY
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const cosmicImageUploader = async (req: any) => {
    if (req?.file?.originalname) {

        if (!req.file.originalname.includes('.png')
            && !req.file.originalname.includes('.jpg')
            && !req.file.originalname.includes('.jpeg')
            && !req.file.originalname.includes('.svg')
        ) {
            throw new Error('Invalid File');
        }
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        };

        return await catalogueBucket.addMedia({ media: media_object });
    }
}

export { upload, cosmicImageUploader };