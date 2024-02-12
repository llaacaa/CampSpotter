const campground = require('../models/campground');
const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    req.session.returnTo = req.originalUrl;
    const { id } = req.params;
    const show = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!show) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { show });
};

module.exports.showCampground = async (req, res, next) => {
    const { title, location, description, price, image } = req.body;
    const show = new Campground({ title, location, description, price, image });
    show.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    show.author = req.user._id;
    await show.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`campgrounds/${show._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const edit = await Campground.findById(id);
    if (!edit) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { edit });
};

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const { title, location, description, price, image } = req.body;
    const show = await Campground.findByIdAndUpdate(id, { title, location, description, price, image });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    show.images.push(...imgs);
    await show.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await show.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
};
