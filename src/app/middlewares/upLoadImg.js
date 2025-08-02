import multer from "multer";
import fs from "fs";
import path from "path";

const upLoadImg = (type) => {
    const uploadPath = path.join("public", "uploads", type);

    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }
    });

    // ✅ fileFilter phải nằm ở đây
    const fileFilter = function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false)
        }
    };

    return multer({ storage, fileFilter });
};

export default upLoadImg;
