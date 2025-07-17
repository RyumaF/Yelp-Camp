const mongoose=require('mongoose');
const cities =require('./cities');
const{descriptors,places}= require('./seedHelpers');
const Campground=require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then(()=>{
    console.log('コネクション接続したよ～ん');
})
.catch(err=>{
    console.log('コネクションエラー');
    console.log(err);
});

const sample = array=> array[Math.floor(Math.random()*array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;++i){
        const randomCityIndex= Math.floor(Math.random()* cities.length);
        const price =Math.floor(Math.random()*2000) + 1000;
        const camp = new Campground({
            author:'685d55a91739074aecd12fbf',
            location:`${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`
            ,title:`${sample(descriptors)}・${sample(places)}`
            ,image: `https://picsum.photos/400?random=${Math.random()}`
            ,description:'伝説のキャンプ場として名をはせる名所といえばここ。キャンプハンターのレベルが上がるにつれて皆が口をそろえて行くべきという、渓流の山奥に潜む聖地といえばそうこのキャンプ場。キャンパーランク40以上の推奨'
            ,price
        });
        await camp.save();
    }
};

seedDB().then(()=>{
    mongoose.connection.close();
});