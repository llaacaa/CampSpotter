const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '65c7d77b8a1e32f1fe2c018e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit similique, ipsum sapiente aut, non hic architecto eos debitis modi voluptates tempore minus ipsa harum molestias sunt, earum libero totam rem! Reprehenderit labore tempore quasi porro ea magnam temporibus eius saepe, optio ratione qui praesentium, dignissimos inventore excepturi facere odit omnis ducimus.Tempore, a laboriosam! Dignissimos officiis accusamus deleniti reiciendis amet!",
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dr3uqsfeu/image/upload/v1707696705/CampSpotter/fknvl76dexgol8sk2kz3.jpg',
                    filename: 'CampSpotter/fknvl76dexgol8sk2kz3'
                },
                {
                    url: 'https://res.cloudinary.com/dr3uqsfeu/image/upload/v1707696705/CampSpotter/pbwfekiwm2f4mki7pvqf.jpg',
                    filename: 'CampSpotter/pbwfekiwm2f4mki7pvqf'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})