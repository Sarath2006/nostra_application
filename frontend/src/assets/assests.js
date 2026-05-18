import LogoNostra from "./LogoNostra.png";
import firstslider from "./firstslider.jpg";
import secslider from "./secslider.jpg";
import thirdslider from "./thirdslider.jpg";
import white_1 from "./white_1.jpg";
import white_2 from "./white_2.jpg";
import white_3 from "./white_3.jpg";
import white_4 from "./white_4.jpg";
import black_1 from "./black_1.jpg";
import black_2 from "./black_2.jpg";
import black_3 from "./black_3.jpg";
import black_4 from "./black_4.jpg";

import white_p_1 from "./white_p_1.jpg";
import white_p_2 from "./white_p_2.jpg";
import white_p_3 from "./white_p_3.jpg";  
import white_p_4 from "./white_p_4.jpg";

import popcorn_1 from "./popcorn_1.jpg";
import popcorn_2 from "./popcorn_2.jpg";
import hoodie_1 from "./hoodie_1.jpg";
import hoodie_2 from "./hoodie_2.jpg";
import hoodie_3 from "./hoodie_3.jpg";

import chanel from "./chanel.png";
import ck from "./ck.png";
import guess from "./guess.png";
import gucci from "./gucci.png";
import dg from "./dg.png";
import addidas from "./addidas.png";
import levis from "./levis.png";
import versace from "./versace.png";
import bestSeller from "./bestSeller.jpg";
import men from "./men.jpg";
import women from "./women.jpg";
import casual from "./casual.jpg";  
import nihonjin from "./nihonjin.jpg";
import newbanner from "./newbanner.jpg";
import blackj_1 from "./blackj_1.jpg";
import blackj_2 from "./blackj_2.jpg";
import blackj_3 from "./blackj_3.jpg";
import blackj_4 from "./blackj_4.jpg";

import Lengthdress_1 from "./Lengthdress_1.jpg";
import Lengthdress_2 from "./Lengthdress_2.jpg";
import Lengthdress_3 from "./Lengthdress_3.jpg";

import metronaut_1 from "./metronaut_1.jpg";
import metronaut_2 from "./metronaut_2.jpg";
import metronaut_3 from "./metronaut_3.jpg";
import metronaut_4 from "./metronaut_4.jpg";

import cmdj_1 from "./cmdj_1.jpg";
import cmdj_2 from "./cmdj_2.jpg";
import cmdj_3 from "./cmdj_3.jpg";
import cmdj_4 from "./cmdj_4.jpg";

const IMAGES = {
    LogoNostra,
    firstslider,
    secslider,
    thirdslider,
    chanel,
    ck,
    guess,
    gucci,
    dg,
    addidas,
    levis,
    versace,
    bestSeller,
    men,
    women,
    casual,
    black_1,
    black_2,
    black_3,
    black_4,

    hoodie_1,
    hoodie_2,
    hoodie_3,
    popcorn_1,
    popcorn_2,

    blackj_1,
    blackj_2,
    blackj_3,
    blackj_4,
    nihonjin,
    newbanner,
    white_1,
    white_2,
    white_3,
    white_4,

    white_p_1,
    white_p_2,
    white_p_3,
    white_p_4,
    Lengthdress_1,
    Lengthdress_2,
    Lengthdress_3,
    metronaut_1,
    metronaut_2,
    metronaut_3,
    metronaut_4,
    cmdj_1,
    cmdj_2,
    cmdj_3,
    cmdj_4,
};

export const products = [
  {
    _id: 1,
    name: "DEELMO",
    description: "Men Regular Fit Self Design Button Down Collar Casual Shirt.",
    price: 50,
    image: [white_1, white_2, white_3, white_4],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: 1716634345448,
    bestseller: true,
  },
  {
    _id: 2,
    name: "METRONAUT",
    description: "Men Regular Fit Solid Spread Collar Casual Shirt.",
    price: 87,
    image: [popcorn_1, popcorn_2],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L","XL","XXL"],
    date: 1716634345999,
    bestseller: false,

  },
  {
    _id: 3,
    name: "Comfy Women Trousers",
    description: "White 6 Strie Trouser for woman NNY.",
    price: 100,
    image: [white_p_1, white_p_2, white_p_3, white_p_4],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S","M", "L", "XL"],
    date: 1716634346000,
    bestseller: true,
  },
  {
    _id: 4,
    name: "White Pants",
    description: "Trendy Japanese-style pants.",
    price: 150,
    image: [nihonjin],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["L", "XL"],
    date: 1716634346100,
    bestseller: false,

  },
  {
    _id: 5,
    name: "tallwalker",
    description: "Men Regular Fit Solid Slim Collar Casual Shirt.",
    price: 25,
    image: [black_1, black_2, black_3, black_4],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L","XL"],
    date: 1716634346200,
    bestseller: false,
  },
  {
    _id: 6,
    name: "sti",
    description: "Men Full Sleeve Solid Hooded Sweatshirt.",
    price: 30,
    image: [hoodie_2,hoodie_3,hoodie_1],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L"],
    date: 1710334521200,
    bestseller: true,
  },
  {
    _id: 7,
    name: "PUMA",
    description: "Women Solid Casual Jacket.",
    price: 70,
    image: [blackj_1, blackj_2, blackj_3, blackj_4],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "XL"],
    date: 1710354789200,
    bestseller: true,
  },
  {
    _id: 8,
    name: "Sheetal Associates",
    description: "Women A-line Orange Midi/Calf Length Dress.",
    price: 3.50,
    image: [Lengthdress_1, Lengthdress_2, Lengthdress_3],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    date: 1710023479200,
    bestseller: true,
  },

  {
    _id: 9,
    name: "METRONAUT",
    description: "Relaxed Women Pink Lycra Blend Trousers.",
    price: 3.64,
    image: [metronaut_1, metronaut_2, metronaut_3, metronaut_4],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    date: 1710247899200,
    bestseller: false,
  },

  {
    _id: 10,
    name: "CMD Coinmen Denims ",
    description: "Men Loose Fit Mid Rise Light Blue Jeans.",
    price: 5.50,
    image: [cmdj_1, cmdj_2, cmdj_3, cmdj_4],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    date: 1710012500200,
    bestseller: true,
  },

];


export const curatedPicks = [
  { id: 1, title: "Best Seller", img: IMAGES.bestSeller },
  { id: 2, title: "Shop Men", img: IMAGES.men },
  { id: 3, title: "Shop Women", img: IMAGES.women },
  { id: 4, title: "Shop Casual", img: IMAGES.casual },
];


export default IMAGES;