import { Router, type IRouter } from "express";
import { GetInstagramFeedResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const INSTAGRAM_POSTS = [
  {
    id: "ig_1",
    imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
    caption: "Le Sahara en silence. Des dunes infinies, un ciel immense. #ElHawes #Sahara #Algérie",
    location: "Taghit, Algérie",
    likes: 2847,
    permalink: "https://www.instagram.com/elhawes/",
  },
  {
    id: "ig_2",
    imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
    caption: "Ghardaïa, la perle du M'zab. Architecture millénaire, chaleur humaine. #Ghardaia #UNESCO",
    location: "Ghardaïa, Algérie",
    likes: 1923,
    permalink: "https://www.instagram.com/elhawes/",
  },
  {
    id: "ig_3",
    imageUrl: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=800&q=80",
    caption: "Tassili N'Ajjer — des fresques rupestres vieilles de 10,000 ans. L'histoire à l'état pur.",
    location: "Tassili N'Ajjer, Algérie",
    likes: 3241,
    permalink: "https://www.instagram.com/elhawes/",
  },
  {
    id: "ig_4",
    imageUrl: "https://images.unsplash.com/photo-1562835155-a9e4aca72bf0?w=800&q=80",
    caption: "Coucher de soleil sur la Méditerranée depuis Tipaza. La magie de l'Algérie du Nord.",
    location: "Tipaza, Algérie",
    likes: 4102,
    permalink: "https://www.instagram.com/elhawes/",
  },
  {
    id: "ig_5",
    imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",
    caption: "Les Ruines d'El Djazair. Deux millénaires d'histoire sous nos pieds.",
    location: "Alger, Algérie",
    likes: 1587,
    permalink: "https://www.instagram.com/elhawes/",
  },
  {
    id: "ig_6",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
    caption: "Aurès — montagnes majestueuses, culture berbère intacte. Un autre monde.",
    location: "Batna, Algérie",
    likes: 2156,
    permalink: "https://www.instagram.com/elhawes/",
  },
  {
    id: "ig_7",
    imageUrl: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80",
    caption: "Camping sous les étoiles à Djanet. Pas de lumière artificielle, juste l'univers.",
    location: "Djanet, Algérie",
    likes: 3678,
    permalink: "https://www.instagram.com/elhawes/",
  },
  {
    id: "ig_8",
    imageUrl: "https://images.unsplash.com/photo-1542779632-02a49b8d6de8?w=800&q=80",
    caption: "La Casbah d'Alger. Rues étroites, parfums de jasmin, mémoire vivante.",
    location: "Alger, Algérie",
    likes: 2890,
    permalink: "https://www.instagram.com/elhawes/",
  },
  {
    id: "ig_9",
    imageUrl: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80",
    caption: "Mer de dunes à l'aube. Le Sahara se réveille dans les oranges et les ors.",
    location: "Béchar, Algérie",
    likes: 5234,
    permalink: "https://www.instagram.com/elhawes/",
  },
];

router.get("/instagram/feed", async (req, res): Promise<void> => {
  const limitParam = req.query.limit;
  const limit = limitParam ? parseInt(String(limitParam), 10) : 9;
  const posts = INSTAGRAM_POSTS.slice(0, Math.min(limit, INSTAGRAM_POSTS.length));
  res.json(GetInstagramFeedResponse.parse(posts));
});

export default router;
