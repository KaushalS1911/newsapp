const express = require('express');
const router = express.Router();
const NewsModel = require('../models/news')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const {uploadFiles} = require('../helpers/images');

router.post('/news', upload.array("images", 10), async (req, res) => {
    const {
        category,
        title,
        desc_1,
        desc_2,
        desc_3,
        desc_4,
        desc_5,
    } = req.body;

    const files = req.files;
    const fileBuffers = files.map(file => file.buffer);

    const imageUrls = await uploadFiles(fileBuffers);
    const news = await NewsModel.create({
        category,
        title,
        desc_1,
        desc_2,
        desc_3,
        desc_4,
        desc_5,
        images: imageUrls,
    });

    return res.status(201).json({data: news, message: "News data added successfully", status: 201});
});

router.get("/news", async (req, res) => {
    const news = await NewsModel.find({});
    return res.json(news);
});

router.get("/news/:id", async (req, res) => {

    const news = await NewsModel.findById(req.params.id);

    if (!news) {
        res.status(404);
        throw new Error('Product not found');
    }

    return res.json(news)
});

router.put("/news/:id", async (req, res) => {
    const {id} = req.params;

    const files = req.files;
    let imageUrls = []

    let payload = req.body
    if (files && files.length > 0) {
        const fileBuffers = files.map(file => file.buffer);
        imageUrls = await uploadFiles(fileBuffers);
        payload.images = imageUrls
    }

    try {
        const updatedNews = await NewsModel.findByIdAndUpdate(id, payload, {new: true});

        if (updatedNews) {
            return res.status(200).json({status: 200, message: "News data updated successfully", data: updatedNews});
        } else {
            res.status(404).json({status: 404, message: "News data not found"});
            throw new Error("News data not found");
        }
    } catch (err) {
        console.error("Error updating News data", err.message);
        return res.status(500).json({message: "Failed to update News data", error: err.message})
    }
});

router.delete("/news/:id", async (req, res) => {

    const news = await NewsModel.findByIdAndDelete(req.params.id);

    if (!news) {
        res.status(404);
        throw new Error('News data not found');
    }

    return res.json({message: "Deleted Successfully"})
});


module.exports = router;
