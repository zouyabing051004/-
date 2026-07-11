// 二十四节气英文内容（人工校准，面向国际儿童）
// 由 localizeTerm() 在英文模式下取用；诗歌正文仍用中文原文，此处提供英文大意 poemEn
export interface TermEnContent {
  date: string;
  climate: string;
  phenologyKids?: { raw: string; kids: string }[];
  folkCustoms?: {
    north: { eat: string; do: string };
    south: { eat: string; do: string };
    kidsExplain: string;
  } | null;
  customs?: { eat: string; do: string; wear: string };
  story?: { title: string; content: string };
  poemTitleEn?: string;
  poemAuthorEn?: string;
  poemEn?: string;
  readingTipEn?: string;
  keywords?: string[];
}

export const SOLAR_TERM_EN_CONTENT: Record<string, TermEnContent> = {

  "lichun": {
    "date": "Feb 3–5",
    "climate": "The warm east wind melts the ice, plants and animals wake up, and the weather slowly gets warmer.",
    "phenologyKids": [
      {
        "raw": "1st pentad: the east wind thaws the ice",
        "kids": "The east wind is like a warm little hand, gently blowing the ice on the river until it melts away!"
      },
      {
        "raw": "2nd pentad: hibernating bugs begin to stir",
        "kids": "The little bugs in the soil have a big stretch — they've woken up and are ready to come out and play!"
      },
      {
        "raw": "3rd pentad: fish swim up carrying ice",
        "kids": "The little fish swim just under the ice, like they're wearing a see-through glass hat on their heads!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Chunbing (thin spring pancakes) and radish, eaten in a custom called 'biting spring' to welcome the new season.",
        "do": "The 'spring ox' parade, to remind everyone that spring plowing is beginning!"
      },
      "south": {
        "eat": "Chunjuan (spring rolls), fried until golden, crispy, and crunchy.",
        "do": "Putting up 'yichun' (lucky spring) signs, wishing for a safe and happy new year."
      },
      "kidsExplain": "The spring ox reminds everyone it's time to plant. And chunbing and radish smell so good — take one bite and you've bitten into all of spring!"
    },
    "customs": {
      "eat": "Chunbing (spring pancakes), chunjuan (spring rolls), and radish — for the custom of 'biting spring.'",
      "do": "Putting up spring couplets, welcoming spring, and holding the spring ox parade.",
      "wear": "Wearing red or bright clothes to greet the new spring."
    },
    "story": {
      "title": "How We Started Welcoming Spring on Lichun",
      "content": "Long, long ago, people held a big celebration on the first day of spring. The story says that Goumang, the god of spring, rode in on the spring breeze on this very day and woke up the sleeping earth. People made a little ox out of colorful paper, called the 'spring ox,' and carried it all through the streets, wishing for a good harvest in the new year. This custom has lasted all the way to today. It reminds us that spring is here, so we should treasure our time and work hard."
    },
    "poemTitleEn": "Start of Spring",
    "poemAuthorEn": "Bai Yuchan (Song Dynasty)",
    "poemEn": "The east wind blows the snow off the plum branches, and in a single night, spring returns to the whole world. From now on spring seems to have feet of its own, and every flower blooms bright while the grass springs back to life.",
    "readingTipEn": "Read it in a happy, lively voice — let everyone hear the surprise and joy of spring arriving!",
    "keywords": [
      "spring",
      "waking up",
      "spring pancakes",
      "welcoming spring"
    ]
  },
  "yushui": {
    "date": "Feb 18–20",
    "climate": "Rain starts to fall more often, and the weather warms up quickly.",
    "phenologyKids": [
      {
        "raw": "1st pentad: the otter lays out its fish",
        "kids": "The otter lines up all the fish it caught in a neat row, like it's setting the table for a dinner party!"
      },
      {
        "raw": "2nd pentad: the wild geese return",
        "kids": "The wild geese fly back from the south in a line — sometimes straight like the number '1,' sometimes in a big 'V' shape!"
      },
      {
        "raw": "3rd pentad: grass and trees begin to sprout",
        "kids": "The little grass and trees quietly poke out tiny green buds — spring is really here!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Popcorn and longxu bing (crispy 'dragon-whisker' pancakes) — crunchy and yummy.",
        "do": "'Labaobao,' where families pick a godparent for their child, wishing for the child to grow up healthy."
      },
      "south": {
        "eat": "Red date porridge and tangyuan (sweet sticky rice balls) — sweet and soft.",
        "do": "Daughters go back to visit their own parents, bringing gifts along."
      },
      "kidsExplain": "Kids in the south eat tangyuan (sweet rice balls), and kids in the north eat popcorn — everyone is waiting for the spring rain to come!"
    },
    "customs": {
      "eat": "Longxu bing (dragon-whisker pancakes), popcorn, and red date porridge.",
      "do": "Visiting mom's family, and 'labaobao' (choosing a godparent).",
      "wear": "Wearing a light jacket, and staying warm and dry."
    },
    "story": {
      "title": "Rain Water Feeds Everything",
      "content": "During the Rain Water season, gentle spring rain falls softly and feeds the earth. Long ago people said 'spring rain is as precious as oil,' because rain at this time is so important for the crops to grow. The story says that the Dragon King sprinkles sweet dew from the sky down to the world on this day, giving the thirsty land a big drink of water. When the farmers see the spring rain fall, they know it's the perfect time to start planting."
    },
    "poemTitleEn": "Happy Rain on a Spring Night",
    "poemAuthorEn": "Du Fu (Tang Dynasty)",
    "poemEn": "The good rain knows just the right time to come, arriving in spring when the plants need it most. It slips in quietly on the wind at night, feeding everything softly without a sound.",
    "readingTipEn": "Read it in a soft, gentle voice — like the spring rain quietly tiptoeing in.",
    "keywords": [
      "spring rain",
      "planting",
      "feeding the plants"
    ]
  },
  "jingzhe": {
    "date": "Mar 5–7",
    "climate": "The first spring thunder rumbles, the weather warms up, and the sleeping insects wake up.",
    "phenologyKids": [
      {
        "raw": "1st pentad: the peach trees begin to bloom",
        "kids": "The peach trees are covered in pink blossoms, like the earth put on a beautiful flowery skirt!"
      },
      {
        "raw": "2nd pentad: the orioles begin to sing",
        "kids": "The yellow oriole birds chirp 'tweet-tweet,' singing a springtime song up in the branches!"
      },
      {
        "raw": "3rd pentad: the hawk becomes a dove",
        "kids": "The hawks hide away to hatch their babies, and everywhere you can hear the cuckoo birds calling!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Pears — eating pears keeps your throat from getting dry.",
        "do": "'Beating the little bad guy' and putting up paper charms to chase away bad luck."
      },
      "south": {
        "eat": "Roasted beans, toasted crispy and called 'frying the bugs.'",
        "do": "Honoring the White Tiger, wishing for safety wherever you go."
      },
      "kidsExplain": "On Jingzhe we eat pears to soothe our throats, because the spring thunder shakes all the wetness out of the air and makes it dry!"
    },
    "customs": {
      "eat": "Pears, roasted beans, and eggs.",
      "do": "Honoring the White Tiger, 'beating the little bad guy,' and eating pears for a happy throat.",
      "wear": "Wearing light spring clothes, and staying out of the wind."
    },
    "story": {
      "title": "Spring Thunder Wakes Up the World",
      "content": "On the day of Jingzhe, the very first spring thunder booms across the sky. The story says that the Thunder God beats his great sky drum, and the loud 'rumble-rumble' wakes up all the little animals sleeping through the winter. The little frogs pop up out of the mud, the little snakes crawl out of their holes, and the tiny bugs peek their heads out too. Long ago, people believed the thunder was the sky's way of saying: spring is really here — time to get up and get to work!"
    },
    "poemTitleEn": "Watching the Farmers",
    "poemAuthorEn": "Wei Yingwu (Tang Dynasty)",
    "poemEn": "A light rain makes every flower and plant look fresh and new, and the first thunder means Jingzhe has begun. The farmers won't rest for many more days — from now on, it's time to plow and plant.",
    "readingTipEn": "Read the first two lines softly, then say the last line more strongly — feel how the farmers are getting busy.",
    "keywords": [
      "spring thunder",
      "bugs waking up",
      "peach blossoms"
    ]
  },
  "chunfen": {
    "date": "Mar 20–22",
    "climate": "Day and night are exactly the same length, the weather is warm, and the flowers are blooming.",
    "phenologyKids": [
      {
        "raw": "1st pentad: the swallows arrive",
        "kids": "The swallows fly back from the south and carry little bits of mud under the roof to build their new homes!"
      },
      {
        "raw": "2nd pentad: the thunder begins to boom",
        "kids": "Rumble-rumble! The Thunder God up in the sky starts beating his drum — don't be scared!"
      },
      {
        "raw": "3rd pentad: the lightning begins to flash",
        "kids": "Bright lightning flashes in the sky, like the flash on a camera!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Lü da gun ('rolling donkey' — sweet, sticky soybean-flour cakes).",
        "do": "The egg-standing game — see who can make an egg stand up on its end!"
      },
      "south": {
        "eat": "Chuncai — a 'spring soup' made from wild greens.",
        "do": "Flying kites, wishing to chase away sickness and bad luck."
      },
      "kidsExplain": "Standing eggs on Chunfen is the most fun! Because today the day and night are the same length, the earth is at its most balanced, and the egg is easiest to stand up!"
    },
    "customs": {
      "eat": "Chuncai (spring greens), tangyuan (sweet rice balls), and lü da gun ('rolling donkey' cakes).",
      "do": "Standing eggs, flying kites, and going for spring walks.",
      "wear": "Wearing comfy spring clothes, perfect for playing outside."
    },
    "story": {
      "title": "The Legend of Standing Eggs on Chunfen",
      "content": "On the day of Chunfen, the daytime and the nighttime are exactly the same length. The story says that on this day the earth's pull is at its most balanced, so an egg is the easiest to stand up. Every year on Chunfen, lots of people all around the world play the 'egg-standing' game. They say that anyone who can stand an egg up on this day will have good luck for the whole year! Kids, why don't you give it a try too?"
    },
    "poemTitleEn": "The Day of Spring Equinox",
    "poemAuthorEn": "Xu Xuan (Five Dynasties)",
    "poemEn": "On the fourth day of mid-spring, the colors of spring are right at their middle point. The moon lingers over the green fields, and on the clear sky the clouds come and go.",
    "readingTipEn": "Read slowly and calmly — let everyone feel how lovely and peaceful the spring scenery is.",
    "keywords": [
      "equal day and night",
      "standing eggs",
      "kites"
    ]
  },
  "qingming": {
    "date": "Apr 4–6",
    "climate": "The weather is bright and sunny, and the grass and trees grow thick and green.",
    "phenologyKids": [
      {
        "raw": "1st pentad: the paulownia trees begin to bloom",
        "kids": "The paulownia trees open up purple trumpet-shaped flowers — so sweet-smelling and so pretty!"
      },
      {
        "raw": "2nd pentad: the field mice turn into quails",
        "kids": "The field mice hide underground for a long nap, and everywhere you can see little quails come out to play!"
      },
      {
        "raw": "3rd pentad: rainbows begin to appear",
        "kids": "After the rain, a rainbow shows up in the sky! Its seven colors look like rainbow candy!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Sanzi (crispy fried dough twists) and qingming guo (green rice cakes) — crunchy and tasty.",
        "do": "Visiting ancestors' graves to say thank you to those who came before us, and hanging up willow branches to wish for life to carry on."
      },
      "south": {
        "eat": "Qingtuan — soft, sweet green sticky-rice balls made with mugwort juice.",
        "do": "Going on spring outings, swinging on swings, and flying kites."
      },
      "kidsExplain": "Qingming is a day to remember our ancestors and the family members who love us. And in the south, the green qingtuan are soft, sweet, and super yummy!"
    },
    "customs": {
      "eat": "Qingtuan (green rice balls), sanzi (fried dough twists), and qingming guo (green rice cakes).",
      "do": "Visiting ancestors' graves, going on spring outings, and hanging willow branches.",
      "wear": "Wearing light, easy spring clothes, just right for outings."
    },
    "story": {
      "title": "How the Qingming Festival Began",
      "content": "Long ago, a prince named Chong'er had to flee his home country and wander for many years. One of his loyal followers, Jie Zitui, once cut off a piece of his own leg to feed the starving prince. Later, when Chong'er became king, he wanted to reward Jie Zitui. But Jie Zitui did not want to be an official, and he hid away on Mount Mian. The king set the mountain on fire to make him come out — but sadly, Jie Zitui died there instead. The king was terribly sad, so he ordered that on this day no one could light a fire to cook; people could only eat cold food. This became the 'Cold Food Festival.' Later, the Cold Food Festival and Qingming joined together to make the Qingming Festival we have today."
    },
    "poemTitleEn": "Qingming (Tomb-Sweeping Day)",
    "poemAuthorEn": "Du Mu (Tang Dynasty)",
    "poemEn": "During Qingming the rain drizzles down and down, and the travelers on the road feel sad and low. 'Excuse me, where can I find a place to rest?' A little cowherd points far away, toward Apricot Blossom Village.",
    "readingTipEn": "Read the first two lines a bit slowly and sadly, then the last two lines lighter and quicker — show the happy surprise of meeting the little cowherd.",
    "keywords": [
      "tomb-sweeping",
      "spring outing",
      "green rice balls"
    ]
  },
  "guyu": {
    "date": "Apr 19–21",
    "climate": "The rain grows heavier, just right for grain crops to grow.",
    "phenologyKids": [
      {
        "raw": "1st pentad: the duckweed begins to grow",
        "kids": "Duckweed pops up on the pond, and the little green circles floating on the water look so cute!"
      },
      {
        "raw": "2nd pentad: the cuckoo preens its feathers",
        "kids": "The cuckoo bird tidies its feathers with its beak and calls out 'coo-coo, coo-coo'!"
      },
      {
        "raw": "3rd pentad: the hoopoe lands on the mulberry tree",
        "kids": "The hoopoe (a bird with a beautiful crown of feathers on its head) flies down onto the mulberry tree!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Xiangchun (Chinese toon leaves) stir-fried with egg — smells wonderful.",
        "do": "Admiring peony flowers — the peony is the special flower of Guyu."
      },
      "south": {
        "eat": "Fresh new tea picked before Guyu — clean-tasting and lovely to drink.",
        "do": "'Walking the Guyu' — strolling through the fields and wishing for good weather and good harvests."
      },
      "kidsExplain": "Guyu tea is the most fragrant tea of the whole year! Grown-ups in the north admire peonies, and grown-ups in the south pick fresh tea — everyone is hoping for a good harvest!"
    },
    "customs": {
      "eat": "Xiangchun (Chinese toon leaves), Guyu tea, and spinach.",
      "do": "Admiring peonies, 'walking the Guyu,' and drinking Guyu tea.",
      "wear": "Wearing comfy spring clothes, and staying ready for rain."
    },
    "story": {
      "title": "The Legend of Picking Tea at Guyu",
      "content": "Guyu is the last solar term of spring. The story says that tea leaves picked on this day are especially fragrant, and drinking the tea cools you down and brightens your eyes. Long ago there was a brave young man named Guyu. To save the people of his village, he fought bravely against an evil dragon, and in the end he gave up his own life. To remember him, people named this solar term 'Guyu.' Every year when Guyu comes, people brew a pot of fresh tea to honor this brave young man."
    },
    "poemTitleEn": "Grain Rain",
    "poemAuthorEn": "Zhu Gao (Song Dynasty)",
    "poemEn": "Raindrops fall softly at the edge of the woods, and under the quiet eaves I write down my dream. Tomorrow, I know, will be Grain Rain — and there's no way to stop the wind from scattering the flowers.",
    "readingTipEn": "Use a soft, gentle voice — imagine you're standing under the eaves watching the spring rain, and read it slowly.",
    "keywords": [
      "picking tea",
      "peony",
      "planting"
    ]
  },
  "lixia": {
    "date": "May 5–7",
    "climate": "The days turn noticeably warmer, and the hot summer is on its way.",
    "phenologyKids": [
      {
        "raw": "1st pentad: mole crickets start to sing",
        "kids": "Mole crickets and frogs sing their summer song in the fields — ribbit, ribbit, ribbit!"
      },
      {
        "raw": "2nd pentad: earthworms come out",
        "kids": "Earthworms wriggle up out of the soil. They're the little doctors who keep the earth healthy!"
      },
      {
        "raw": "3rd pentad: royal melon vines sprout",
        "kids": "Wang-gua (royal melon) vines shoot up fast, and their green leaves climb all over the fence!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Lixia eggs — hard-boiled eggs carried in a little red net pouch around your neck, so much fun!",
        "do": "Weigh yourself, to see how many pounds you gained over the winter."
      },
      "south": {
        "eat": "Fresh fava beans, yummy stir-fried or boiled.",
        "do": "Play the egg-bumping game — whoever has the toughest eggshell wins!"
      },
      "kidsExplain": "You hang your Lixia egg around your neck — you can play with it AND eat it! In the egg-bumping game, whoever's egg doesn't crack is the champ!"
    },
    "customs": {
      "eat": "Lixia eggs, Lixia rice, and fava beans.",
      "do": "Weigh yourself, bump eggs, and taste the first foods of summer.",
      "wear": "Wear light, cool summer clothes and remember your sun protection."
    },
    "story": {
      "title": "Why We Weigh Ourselves on Lixia",
      "content": "On the day of Lixia, many places have a fun custom called 'weighing people.' Grown-ups pop the children onto a big scale to check their weight. People believed this would keep you from getting the 'summer wilts' — feeling too hot to eat and getting skinny. The story goes that this custom is linked to Liu Bei, a famous leader from long ago in the Three Kingdoms days. He worried his son Liu Shan might grow thin in the summer heat, so he weighed him on Lixia day. After that, everyone started doing the same!"
    },
    "poemTitleEn": "The Start of Summer",
    "poemAuthorEn": "Lu You (Song Dynasty)",
    "poemEn": "Spring gently steps aside as the summer god arrives. As the sun leans low, I finish my bath and try on light, thin clothes for the warm days ahead.",
    "readingTipEn": "Read it in a happy, bouncy voice. Put the stress on 'summer arrives' in the second line, so you can really feel the joy of summer coming!",
    "keywords": [
      "summer",
      "weigh-in",
      "Lixia eggs"
    ]
  },
  "xiaoman": {
    "date": "May 20–22",
    "climate": "The grains of the summer crops begin to plump up and fill out.",
    "phenologyKids": [
      {
        "raw": "1st pentad: sow thistle flourishes",
        "kids": "Sow thistle grows nice and tall. It's a little bitter, but it's the best wild veggie nature gives us!"
      },
      {
        "raw": "2nd pentad: delicate grasses wither",
        "kids": "The little grasses that can't take the heat start to droop — like they got dizzy from being too hot!"
      },
      {
        "raw": "3rd pentad: the wheat harvest nears",
        "kids": "The wheat is ripe! Golden, golden — that's the color of a good harvest!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Wheat cakes and mulberries — one smells of grain, the other tastes sweet.",
        "do": "Hold the Silkworm-Praying Festival, to thank the silkworms for giving us silk."
      },
      "south": {
        "eat": "Sow thistle to cool you down, and green-plum wine that's sweet and sour.",
        "do": "Watch the wheat tips turn yellow, and visit family to celebrate the coming harvest."
      },
      "kidsExplain": "At Xiaoman the wheat is half golden, and the farmers are so happy! Kids in the south eat sow thistle to cool down, and sour-plum juice is super refreshing!"
    },
    "customs": {
      "eat": "Sow thistle, wheat cakes, and mulberries.",
      "do": "Honor the water-wheel god, hold the Silkworm-Praying Festival, and watch the wheat turn yellow.",
      "wear": "Wear breezy summer clothes and stay cool in the heat."
    },
    "story": {
      "title": "'A Little Full, Not Quite Full' — Wheat Faces One Danger",
      "content": "Xiaoman means 'the wheat grains are getting fuller, but not completely full yet.' Around this time, the wheat in the fields starts to swell, but it isn't fully ripe. Farmers have a saying: 'A little full, not quite full — wheat faces one danger.' It means if it doesn't rain now, the wheat won't grow well. So during Xiaoman, everyone hopes for rain to help the crops grow strong. Xiaoman teaches us something nice: do things one step at a time, don't rush, and slowly everything gets better."
    },
    "poemTitleEn": "Xiaoman (Grain Buds)",
    "poemAuthorEn": "Ouyang Xiu (Song Dynasty)",
    "poemEn": "A nightingale sings among the green willows while a bright moon wakes in the wide sky. Best of all is the wheat on the ridge, laughing in the wind as the last blossoms fall.",
    "readingTipEn": "Read the last line with love and a light, happy voice, putting the stress on 'best of all' and 'laughing.'",
    "keywords": [
      "wheat",
      "plump grains",
      "sow thistle"
    ]
  },
  "mangzhong": {
    "date": "June 5–7",
    "climate": "The temperature climbs, the rain pours down, and the farmers are busy, busy, busy.",
    "phenologyKids": [
      {
        "raw": "1st pentad: praying mantises hatch",
        "kids": "Baby mantises hatch out of their eggs, holding up two tiny 'sickles'!"
      },
      {
        "raw": "2nd pentad: the shrike begins to call",
        "kids": "The shrike sits on a high branch and calls out loud — the loudest singer of summer!"
      },
      {
        "raw": "3rd pentad: the mockingbird falls silent",
        "kids": "The mockingbird stops singing — it needs some quiet time to grow new feathers!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Boiled green plums, sweet-and-sour to beat the heat, and zongzi (sticky-rice dumplings wrapped in leaves), soft and fragrant.",
        "do": "Hold the seedling-blessing ceremony, praying for the rice seedlings to grow up safe and sound."
      },
      "south": {
        "eat": "Bright red bayberries that are super sweet, and 'black rice' — glutinous rice dyed purple-black.",
        "do": "Hold the Farewell to the Flower Goddess, thanking her for a whole year of beauty."
      },
      "kidsExplain": "Mangzhong is the busiest solar term — you harvest the wheat AND plant the rice! Eat a sour plum to perk yourself up, and keep working hard!"
    },
    "customs": {
      "eat": "Green plums, zongzi, and bayberries.",
      "do": "Bid farewell to the Flower Goddess, bless the seedlings, and boil green plums.",
      "wear": "Wear light, airy clothes and stay cool in the heat."
    },
    "story": {
      "title": "Saying Goodbye to the Flower Goddess at Mangzhong",
      "content": "Mangzhong is the busiest time of summer — you have to harvest the wheat and plant the rice all at once. Long ago, people believed that after Mangzhong the flowers begin to fade, and the Flower Goddess must return to the heavens. So on this day, people held a 'Farewell to the Flower Goddess' ceremony. They decorated tree branches with flower petals and colorful ribbons to thank her for the beautiful spring she had brought. This lovely custom was a way of showing thanks to nature."
    },
    "poemTitleEn": "A Sudden Cold Spell After the Mangzhong Rains",
    "poemAuthorEn": "Fan Chengda (Song Dynasty)",
    "poemEn": "The plum-season rains pour down and flood the rivers until they overflow, and the water spreads out as wide as the sea. The poor farmers of the south work in the cold, soggy fields, year after year planting their rice bundled in padded coats against the chill.",
    "readingTipEn": "Slow down on the last line, and read it with tender feeling, as if your heart aches for how hard the farmers work.",
    "keywords": [
      "busy farming",
      "wheat harvest",
      "planting rice"
    ]
  },
  "xiazhi": {
    "date": "June 21–22",
    "climate": "The days are long and the nights are short, and the temperature is at its highest.",
    "phenologyKids": [
      {
        "raw": "1st pentad: deer shed their antlers",
        "kids": "The buck's antlers fall off — but don't worry, brand-new ones will grow back next year!"
      },
      {
        "raw": "2nd pentad: cicadas begin to sing",
        "kids": "The cicadas buzz and buzz without stopping — they're the loudest musicians of summer!"
      },
      {
        "raw": "3rd pentad: the crow-dipper herb sprouts",
        "kids": "The banxia herb pops up — it's a very powerful plant used in Chinese medicine!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Cold noodles rinsed in cool water, fresh and cooling. As people say, 'Eat your Xiazhi noodles, and each day gets a thread shorter.'",
        "do": "Hold the earth-worship ceremony, to thank the land for a whole year's harvest."
      },
      "south": {
        "eat": "Lychees, red and juicy, and wontons with thin skins and tasty fillings.",
        "do": "Chase away the summer heat by relaxing and cooling off down by the river."
      },
      "kidsExplain": "Xiazhi is the longest day of the year! Kids in the north eat cold noodles and kids in the south eat lychees — both are super cooling!"
    },
    "customs": {
      "eat": "Cold noodles, wontons, and lychees.",
      "do": "Worship the earth, cool off in the summer heat, and eat cold noodles.",
      "wear": "Wear light, airy clothes and don't forget your sun protection."
    },
    "story": {
      "title": "Xiazhi: The Longest Day",
      "content": "Xiazhi is the day with the longest daylight of the whole year. On this day, the sun climbs the highest, and daytime lasts the longest. People long ago had a saying, 'At Xiazhi, one bit of coolness is born.' It means that even though the weather is at its hottest, from Xiazhi onward the cooler energy slowly begins to grow. On this day, people in the north love to eat cold noodles, and people in the south love wontons — both to help beat the heat."
    },
    "poemTitleEn": "Escaping the Summer Heat by the North Pond at Xiazhi",
    "poemAuthorEn": "Wei Yingwu (Tang Dynasty)",
    "poemEn": "The daytime has reached its very longest, and from now the nights grow long again. The green bamboo is still dusted with soft powder, and the round lotus leaves are just beginning to spread their sweet scent.",
    "readingTipEn": "Read slowly and gently, drawing out the words to feel the long days, short nights, and the lotus flowers just starting to open.",
    "keywords": [
      "longest day",
      "beat the heat",
      "cold noodles"
    ]
  },
  "xiaoshu": {
    "date": "July 6–8",
    "climate": "The weather starts to turn hot, though it isn't the hottest time yet.",
    "phenologyKids": [
      {
        "raw": "1st pentad: warm winds arrive",
        "kids": "Even the wind blows warm now — like it came straight out of an oven!"
      },
      {
        "raw": "2nd pentad: crickets move to the walls",
        "kids": "Crickets move from the fields to the shelter of the eaves — they think it's too hot out there too!"
      },
      {
        "raw": "3rd pentad: hawks learn to hunt",
        "kids": "Hawks start practicing their flying high in the sky, getting ready to swoop down and catch their food!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Lotus root stewed with pork ribs, cooling and refreshing.",
        "do": "Air out books and clothes — the strong sun kills germs and chases away mold."
      },
      "south": {
        "eat": "Mung bean soup and watermelon, super cooling.",
        "do": "Sun the 'dragon robe' (airing out clothes on the sixth day of the sixth month), praying for peace and safety."
      },
      "kidsExplain": "Xiaoshu is really hot! In the north people sun their books and paintings, in the south they sip mung bean soup, and watermelon is the number-one cool-down treat for kids all over the country!"
    },
    "customs": {
      "eat": "Lotus root, mung bean soup, and watermelon.",
      "do": "Air out books and paintings, sun your clothes, and eat lotus root.",
      "wear": "Wear light, airy clothes and stay cool in the heat."
    },
    "story": {
      "title": "The Custom of 'Sunning Things' at Xiaoshu",
      "content": "During Xiaoshu, the weather gets hotter and hotter. People long ago had a good habit: on this day they'd bring out the family's books, paintings, and clothes to lay in the sun. This is called 'sunning during the dog days.' Because the summer sun is so strong, giving things a good airing keeps away bugs and mold. There's a legend that the sixth day of the sixth month is the day the Dragon King airs out his scales, so people air out their things too. This custom reminds us to keep dampness and mold away in summer, and to keep our homes clean and tidy."
    },
    "poemTitleEn": "Xiaoshu, the Festival of the Sixth Month",
    "poemAuthorEn": "Yuan Zhen (Tang Dynasty)",
    "poemEn": "All at once a warm wind arrives, and right on schedule Xiaoshu comes. When the bamboo rustles, you know rain is near; when the hills go dark, you can already hear the thunder.",
    "readingTipEn": "Read the first two lines slowly, then speed up on the last two, to mimic the tense feeling right before a rainstorm bursts.",
    "keywords": [
      "hot weather",
      "sunning things",
      "mung bean soup"
    ]
  },
  "dashu": {
    "date": "July 22–24",
    "climate": "The hottest stretch of the whole year.",
    "phenologyKids": [
      {
        "raw": "1st pentad: rotting grass turns to fireflies",
        "kids": "Fireflies come flying out of the rotting grass! Their little tails blink on and off, like tiny flying lanterns!"
      },
      {
        "raw": "2nd pentad: the soil grows damp and steamy",
        "kids": "The ground is all wet and the air is sticky — it's as hot as a steamer basket!"
      },
      {
        "raw": "3rd pentad: heavy rains come often",
        "kids": "Rumble, rumble — down comes a big rainstorm. The Earth is taking a bath!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Mutton — eating lamb at Dashu is called 'dog-days lamb,' and it boosts your energy and blood.",
        "do": "Sip 'dog-days tea' — tea stalls hand out free cooling tea to keep everyone from overheating."
      },
      "south": {
        "eat": "Grass jelly (a cool, slippery, wobbly dessert), smooth and refreshing.",
        "do": "Send off the 'Dashu boat,' carrying away troubles and praying for peace and safety."
      },
      "kidsExplain": "Dashu is the hottest time of the whole year! Kids in the south eat cool grass jelly to chill out, and fireflies are the prettiest gift Dashu brings!"
    },
    "customs": {
      "eat": "Grass jelly, cooked grass jelly, and lychees.",
      "do": "Sip dog-days tea, dry ginger in the sun, and send off the Dashu boat.",
      "wear": "Wear the lightest clothes you have and stay cool in the heat."
    },
    "story": {
      "title": "The Legend of the Dashu Fireflies",
      "content": "Dashu is the hottest time of the whole year. People long ago noticed that during Dashu, fireflies seemed to appear out of the rotting grass. Of course, that was just their imagination — fireflies actually grow from tiny little larvae. On summer nights, fireflies dart back and forth through the grass like little glowing lanterns, so beautiful to see. On a Dashu evening, kids can go out to the edge of the grass and watch these glowing little sprites!"
    },
    "poemTitleEn": "Dashu (Great Heat)",
    "poemAuthorEn": "Zeng Ji (Song Dynasty)",
    "poemEn": "When will this blazing sun ever pass? A cool breeze is nowhere to be found. I lie back on a pile of books to rest, while melons and plums bob in cool water.",
    "readingTipEn": "Read it in a lazy, drowsy voice to bring out how the great heat makes you not want to move a muscle. Take the fourth line nice and easy, oh so relaxed.",
    "keywords": [
      "hottest time",
      "fireflies",
      "beat the heat"
    ]
  },
  "liqiu": {
    "date": "Aug 7–9",
    "climate": "The heat says goodbye and cool air rolls in, so autumn starts to feel closer every day.",
    "phenologyKids": [
      {
        "raw": "1st pentad: cool breezes arrive",
        "kids": "A cool wind blows in! The air isn't hot anymore. Now it's a breezy, chilly autumn wind!"
      },
      {
        "raw": "2nd pentad: white dew appears",
        "kids": "In the morning, tiny drops of water sit on the grass, shiny like little pearls. That's dew!"
      },
      {
        "raw": "3rd pentad: the autumn cicadas sing",
        "kids": "The cicadas (buzzy tree bugs) are getting quieter, singing their very last song. Autumn is really here!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Munch on watermelon — the last watermelon of the year — to wave goodbye to summer.",
        "do": "'Sticking on autumn fat': eat hearty, meaty meals to build up strength for the cold months ahead."
      },
      "south": {
        "eat": "Autumn peaches — and you keep the pit for good luck!",
        "do": "'Drying the autumn harvest': spread the fresh crops out on the rooftops to dry in the sun."
      },
      "kidsExplain": "Eating watermelon at the Start of Autumn is a fun way to say goodbye to summer! In southern mountain villages, the colorful crops drying on the rooftops look just like a beautiful painting!"
    },
    "customs": {
      "eat": "Watermelon, green beans, and autumn peaches.",
      "do": "Eating hearty foods, munching watermelon, and drying crops in the sun.",
      "wear": "Put on a light jacket, and keep cozy in the cool mornings and evenings."
    },
    "story": {
      "title": "Building Up 'Autumn Fat' at the Start of Autumn",
      "content": "The Start of Autumn (Liqiu) is the very first solar term of fall. In hot summer weather, lots of people don't feel like eating and grow a bit thin. When autumn begins, the air turns cool and their appetite comes back, so people start eating yummy, hearty food to make up for what they lost in summer. This is called 'sticking on autumn fat.' But remember, kids: don't eat too many greasy foods! Eating a good mix of everything is what keeps you healthy."
    },
    "poemTitleEn": "The Start of Autumn",
    "poemAuthorEn": "Liu Han (Song Dynasty)",
    "poemEn": "Baby crows chirp and scatter, leaving the jade screen quiet; on the pillow comes a fresh coolness and a breath of fan-like breeze. Waking up, the poet hunts for the sound of autumn but can't find it — only paulownia leaves scattered on the steps in the bright moonlight.",
    "readingTipEn": "Read softly and gently, showing the cool, calm quiet of an early autumn night. Slow right down on the last line to picture the paulownia leaves covering the ground.",
    "keywords": [
      "autumn",
      "building up autumn fat",
      "cool breeze"
    ]
  },
  "chushu": {
    "date": "Aug 22–24",
    "climate": "The summer heat slowly fades away and the days begin to turn cool.",
    "phenologyKids": [
      {
        "raw": "1st pentad: hawks hunt the birds",
        "kids": "The hawk lines up the little birds it has caught in a row, as if celebrating the harvest!"
      },
      {
        "raw": "2nd pentad: heaven and earth grow solemn",
        "kids": "The air turns cool and crisp, and the plants and trees start to draw in, getting ready for winter!"
      },
      {
        "raw": "3rd pentad: the grain ripens",
        "kids": "The rice and sorghum are ripe! The farmers begin their big harvest!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Duck at the End of Heat — duck meat is cooling; and lily-bulb porridge to soothe your chest on dry days.",
        "do": "Head outdoors to greet autumn with the season's very first trip to the countryside."
      },
      "south": {
        "eat": "Longan (a small, sweet fruit, also called dragon-eye) to give you a sweet little energy boost.",
        "do": "Float river lanterns — pretty little lanterns drift down the water carrying wishes for peace and safety."
      },
      "kidsExplain": "At the End of Heat, the hot weather packs up and leaves! Floating river lanterns is the most magical custom — each little lantern carries one beautiful wish!"
    },
    "customs": {
      "eat": "Duck, longan, and little white rice balls.",
      "do": "Floating river lanterns, opening the fishing season, and going out to greet autumn.",
      "wear": "Wear a light jacket, and watch out for the temperature gap between morning and night."
    },
    "story": {
      "title": "Floating River Lanterns at the End of Heat",
      "content": "The End of Heat (Chushu) means 'the hot weather stops here.' The blazing summer is finally coming to an end. On this day, people in some places go down to the river to float lanterns. One by one, the little lanterns drift along the water — a truly lovely sight. Long ago, people floated river lanterns to honor their ancestors and pray for safety. Today, it has become a beautiful custom that carries everyone's hopes for a happy life."
    },
    "poemTitleEn": "Wind and Rain After the End of Heat",
    "poemAuthorEn": "Chou Yuan (Song Dynasty)",
    "poemEn": "A rushing wind drives a sudden downpour, and it sweeps the last of the summer heat clean away. And so you learn that hot and cool can trade places — all in a single passing moment.",
    "readingTipEn": "Read the first two lines strongly, showing the satisfying rush of wind and rain washing the heat away. Read the last two lines thoughtfully, showing the wonder at how quickly the weather changes.",
    "keywords": [
      "heat fades",
      "river lanterns",
      "autumn cool"
    ]
  },
  "bailu": {
    "date": "Sep 7–9",
    "climate": "The weather turns cool and dewdrops gather on the grass.",
    "phenologyKids": [
      {
        "raw": "1st pentad: the wild geese arrive",
        "kids": "The wild geese line up in a row and fly down from the north, just like airplanes in formation!"
      },
      {
        "raw": "2nd pentad: the swallows go home",
        "kids": "The swallows are flying back south for winter. See you again next spring!"
      },
      {
        "raw": "3rd pentad: the birds store their food",
        "kids": "The birds start saving up food to get ready for winter. So hardworking!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "White Dew tea — the tea picked on this day smells the sweetest; and longan (dragon-eye fruit), said to grow as big as eggs at White Dew.",
        "do": "Honor King Yu, thanking the ancient hero Yu the Great for taming the floods."
      },
      "south": {
        "eat": "Sweet potato — soft, sweet, and lovely.",
        "do": "Collect the clear dew: use lotus leaves to gather dewdrops and brew them into tea."
      },
      "kidsExplain": "At White Dew, the dewdrops on the morning grass are clear and sparkling. Long ago people brewed tea with this dew — the most special tea in the whole world!"
    },
    "customs": {
      "eat": "White Dew tea, longan, and sweet potato.",
      "do": "Collecting clear dew, honoring King Yu, and eating longan.",
      "wear": "Wear a long-sleeved jacket and keep yourself warm."
    },
    "story": {
      "title": "Gathering the Clear Dew at White Dew",
      "content": "At the time of White Dew (Bailu), the weather turns cool, and early in the morning tiny sparkling water drops appear on the blades of grass — this is dew. Long ago, people believed the dew on this special day had magical powers, so they collected it to brew tea and make medicine. That's exactly how White Dew got its name — white dewdrops. Kids, on a White Dew morning you can go out to the grass and look for these beautiful little drops yourself."
    },
    "poemTitleEn": "The Reeds",
    "poemAuthorEn": "From the Book of Songs, Airs of Qin",
    "poemEn": "The reeds grow green and thick, and the white dew has turned to frost. The one I long for is somewhere far away, on the other side of the water.",
    "readingTipEn": "Read with deep, faraway feeling, as if you are missing a dear friend you haven't seen in a long time — slowly and full of emotion.",
    "keywords": [
      "dew",
      "autumn cool",
      "wild geese"
    ]
  },
  "qiufen": {
    "date": "Sep 22–24",
    "climate": "Day and night are equal in length, and the autumn sky is high, clear, and crisp.",
    "phenologyKids": [
      {
        "raw": "1st pentad: the thunder falls silent",
        "kids": "Grandpa Thunder is off work! The summer thunder has gone quiet, so autumn is truly here!"
      },
      {
        "raw": "2nd pentad: the hibernating bugs seal their burrows",
        "kids": "The little bugs plug up their burrow doors with mud and start getting ready for their winter sleep!"
      },
      {
        "raw": "3rd pentad: the waters begin to dry",
        "kids": "Some little streams have less water now. The autumn air is dry, so drink lots of water!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Autumn greens (wild amaranth cooked into 'autumn soup'); and mooncakes — round pastries eaten while gazing at the moon at the Mid-Autumn Festival.",
        "do": "Play the egg-standing game, just as fun as at the Spring Equinox."
      },
      "south": {
        "eat": "Tangyuan (sweet, round rice-flour dumplings) for togetherness; and crab, which is plump and tasty at the Autumn Equinox.",
        "do": "Give an 'autumn ox': present farmers with a picture poster wishing them a good harvest."
      },
      "kidsExplain": "Just like the Spring Equinox, at the Autumn Equinox day and night are exactly the same length! Mooncakes are round to stand for the whole family being together. Happy Mid-Autumn!"
    },
    "customs": {
      "eat": "Autumn greens, tangyuan (sweet rice-flour balls), and sweet-osmanthus wine.",
      "do": "Standing eggs, eating autumn greens, and giving the 'autumn ox' poster.",
      "wear": "Wear comfy autumn clothes — perfect for playing outdoors."
    },
    "story": {
      "title": "Standing Eggs at the Autumn Equinox",
      "content": "Just like at the Spring Equinox, day and night are the same length at the Autumn Equinox. Standing an egg on its end is another fun custom for this day. People used to say that on the Autumn Equinox, the forces of nature are perfectly balanced, so eggs are easiest to stand upright. At this time of year the autumn sky is high and the air is crisp — the perfect time for flying kites and enjoying the autumn views. Kids, go outside and soak up the beautiful fall!"
    },
    "poemTitleEn": "Autumn Song",
    "poemAuthorEn": "Liu Yuxi (Tang Dynasty)",
    "poemEn": "Since the old days, people have felt sad and lonely in autumn — but I say an autumn day beats a spring morning! A single crane soars up through the clear sky, carrying my poet's spirit all the way to the deep blue heavens.",
    "readingTipEn": "Read the second line with proud strength, and let the third and fourth lines rise higher and higher, showing the bold joy of the crane flying into the sky!",
    "keywords": [
      "equal day and night",
      "standing eggs",
      "crisp autumn air"
    ]
  },
  "hanlu": {
    "date": "Oct 8–9",
    "climate": "The temperature drops even lower and the dew grows colder.",
    "phenologyKids": [
      {
        "raw": "1st pentad: the last wild geese arrive",
        "kids": "The very last group of wild geese flies in — these are the ones staying in the south for winter!"
      },
      {
        "raw": "2nd pentad: sparrows turn into clams",
        "kids": "The sparrows disappear, and suddenly the sea is full of clams! (A funny idea the ancient people imagined.)"
      },
      {
        "raw": "3rd pentad: the chrysanthemums bloom yellow",
        "kids": "The chrysanthemums are blooming! Their golden petals are autumn's last bit of beauty!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Sesame — black sesame to build up strength; and persimmons, bright red and sweet as can be.",
        "do": "Climb up high to gaze far, hiking the hills to enjoy the autumn colors."
      },
      "south": {
        "eat": "Chrysanthemum tea, cooling and soothing; and crab, rich and full of tasty roe.",
        "do": "Visit chrysanthemum flower shows and sip chrysanthemum wine."
      },
      "kidsExplain": "At Cold Dew, climb up high to see the maple leaves — the chrysanthemum is braver than all the other flowers! And remember, don't eat persimmons on an empty tummy!"
    },
    "customs": {
      "eat": "Chrysanthemum tea, sesame, and persimmons.",
      "do": "Climbing up high, admiring chrysanthemums, and sipping chrysanthemum wine.",
      "wear": "Wear a thick jacket and keep warm against the cold."
    },
    "story": {
      "title": "Admiring Chrysanthemums at Cold Dew",
      "content": "At the time of Cold Dew (Hanlu), the weather grows colder and the dew is almost ready to turn to frost. Yet this is exactly when the chrysanthemums bloom their brightest! People long ago especially loved to admire chrysanthemums and drink chrysanthemum tea at Cold Dew. The chrysanthemum isn't afraid of the cold — it blooms all on its own just as the other flowers are fading, so people see it as a symbol of being strong and pure. Kids, go visit a chrysanthemum show at Cold Dew and enjoy the beauty of autumn!"
    },
    "poemTitleEn": "Seeing Cold Dew on the Paulownia Leaves by Moonlight",
    "poemAuthorEn": "Dai Cha (Tang Dynasty)",
    "poemEn": "On the thin, scattered paulownia leaves, the moon is bright and the fresh dew gathers into round beads. The drops shine, full of clear light, glowing pale and shimmering in the cold.",
    "readingTipEn": "Read softly, feeling the quiet, cool calm of a moonlit Cold Dew night, and say every word clearly.",
    "keywords": [
      "chrysanthemum",
      "climbing high",
      "cold"
    ]
  },
  "shuangjiang": {
    "date": "Oct 23–24",
    "climate": "The weather gradually turns cold, and the first frost begins to fall.",
    "phenologyKids": [
      {
        "raw": "1st pentad: the jackals hunt the beasts",
        "kids": "The jackals line up the animals they've caught in a row, as if giving thanks for nature's gifts!"
      },
      {
        "raw": "2nd pentad: the plants turn yellow and fall",
        "kids": "The leaves turn red, yellow, and orange, and then flutter down one after another!"
      },
      {
        "raw": "3rd pentad: the hibernating bugs bow their heads",
        "kids": "All the sleepy winter bugs lower their heads, getting ready for a nice long sleep!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Persimmons — the fruit that Emperor Zhu Yuanzhang named the 'Lord Who Braves the Frost'; and chestnuts, sweet, soft, and fragrant.",
        "do": "Enjoy the red maple leaves and climb up high to gaze into the distance."
      },
      "south": {
        "eat": "Beef to build strength and warm the body; and duck, which is plumpest right before First Frost.",
        "do": "Sweep the graves to honor the ancestors (in some regions)."
      },
      "kidsExplain": "Persimmons are at their sweetest at First Frost! The red leaves are even prettier than spring flowers! When the maple leaves turn red and gold, it's the most beautiful picture nature ever paints!"
    },
    "customs": {
      "eat": "Persimmons, chestnuts, and beef.",
      "do": "Enjoying red leaves, eating persimmons, and climbing up high to gaze afar.",
      "wear": "Wear a thick jacket and a sweater, and keep nice and warm."
    },
    "story": {
      "title": "The Legend of Eating Persimmons at First Frost",
      "content": "First Frost (Shuangjiang) is the last solar term of autumn. Legend says that if you eat a persimmon on this day, your lips won't crack all winter long. One story tells that when Emperor Zhu Yuanzhang of the Ming Dynasty was a poor boy, he was once starving on First Frost day when he found a persimmon tree. He picked the persimmons and ate them, and that's how he survived. Years later, when he became emperor, he honored that tree with the title 'Lord Who Braves the Frost.' And ever since, eating persimmons at First Frost has been a custom."
    },
    "poemTitleEn": "First Frost",
    "poemAuthorEn": "Yuan Zhen (Tang Dynasty)",
    "poemEn": "Thirty days after First Frost, one last leaf of autumn remains. The deep shade meets the setting sun, and the cool moon dwindles to a thin, worn hook.",
    "readingTipEn": "Read in a calm, quiet voice, showing the bare, peaceful stillness of late autumn slipping into early winter.",
    "keywords": [
      "frost falls",
      "persimmon",
      "red leaves"
    ]
  },
  "lidong": {
    "date": "Nov 7–8",
    "climate": "Water starts to freeze and the ground turns hard as winter begins.",
    "phenologyKids": [
      {
        "raw": "1st pentad: water starts to freeze",
        "kids": "Water begins to freeze! There's a thin sheet of ice at the edge of the pond, and it goes 'crack!' when you step on it."
      },
      {
        "raw": "2nd pentad: the ground starts to freeze",
        "kids": "The ground freezes rock-hard, so digging is really tough. The Earth has put on its armor!"
      },
      {
        "raw": "3rd pentad: pheasants dive into the water and become clams",
        "kids": "The pheasants hide away, and lots of big clams show up by the sea! (That's how people imagined it long ago.)"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Jiaozi (Chinese dumplings)! There's an old saying: 'If you don't eat dumplings at the start of winter, your ears might freeze off and no one will help!'",
        "do": "'Topping up for winter': eating warming, nourishing foods like lamb stewed with radish."
      },
      "south": {
        "eat": "Ciba (soft, chewy, sweet pounded rice cakes), and jiangmu duck (duck cooked with ginger) to warm you up and chase the cold away.",
        "do": "Brewing rice wine, because winter is the perfect time to make it."
      },
      "kidsExplain": "People eat jiaozi (dumplings) at the start of winter because dumplings look like little ears, and eating them means your ears won't freeze! In the south, people eat ciba (sticky rice cakes) that are yummy and chewy!"
    },
    "customs": {
      "eat": "Jiaozi (dumplings), lamb, and ciba (rice cakes).",
      "do": "Topping up for winter, eating dumplings, and brewing yellow rice wine.",
      "wear": "Wear padded coats and puffy down jackets, and keep nice and warm."
    },
    "story": {
      "title": "Why We Eat Dumplings at the Start of Winter",
      "content": "The start of winter is the very first solar term of the cold season. In the north, people eat jiaozi (Chinese dumplings) at this time, because dumplings look just like little ears. There's a saying: 'If you don't eat dumplings at the start of winter, your ears might freeze off and no one will help!' This custom goes back to a famous doctor named Zhang Zhongjing. The story goes that one winter he saw many poor people with frostbitten ears, so he wrapped medicine and food inside dough to make a warm 'tender-ear soup' for everyone, and it healed their frozen ears. Ever since, people eat dumplings on this day to remember him."
    },
    "poemTitleEn": "The Start of Winter",
    "poemAuthorEn": "Li Bai (Tang Dynasty)",
    "poemEn": "It's too cold to write new poems with a frozen brush, so the poet warms good wine by the stove instead. Tipsy, he watches the ink and the pale moon, and for a moment thinks snow has covered the whole village.",
    "readingTipEn": "Read it in a lazy, cozy winter voice, like someone relaxing by a warm stove sipping wine. Keep the tone easy and unhurried.",
    "keywords": [
      "winter",
      "dumplings",
      "staying warm"
    ]
  },
  "xiaoxue": {
    "date": "Nov 22–23",
    "climate": "The first snow begins to fall, but only a little.",
    "phenologyKids": [
      {
        "raw": "1st pentad: rainbows hide away",
        "kids": "The rainbows are gone! In winter there's little rain and the sun is weak, so rainbows go into hiding!"
      },
      {
        "raw": "2nd pentad: the sky's air rises and the earth's air sinks",
        "kids": "The air up high floats higher, and the air down low sinks lower, so sky and earth pull apart!"
      },
      {
        "raw": "3rd pentad: everything closes up and winter arrives",
        "kids": "Heaven and earth shut their big doors, and everything switches into hibernation mode!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Cured meats and sausages, salted early to stock up for the New Year.",
        "do": "Pickling vegetables, and storing cabbage and green onions in the cellar for winter."
      },
      "south": {
        "eat": "Ciba (chewy pounded rice cakes) — a Hunan tradition at Light Snow — and paotang (a feast of fresh pork).",
        "do": "Drying fish, as families by the sea hang up fish and shrimp to dry."
      },
      "kidsExplain": "At Light Snow it's time to cure the meat! The cured meat hangs from the eaves and smells wonderful, and it tastes best at New Year!"
    },
    "customs": {
      "eat": "Cured meat, ciba (rice cakes), and paotang (fresh pork feast).",
      "do": "Curing meat, eating ciba, and drying fish.",
      "wear": "Wear thick padded clothes and stay bundled up against the cold."
    },
    "story": {
      "title": "Curing Meat at Light Snow",
      "content": "At Light Snow, the weather turns cold and the first light snow starts to fall. This is when people in many places begin curing meat. Because it's cold now, the meat doesn't spoil easily, and once it's cured it keeps for a long time — saved up to eat at New Year. People long ago said, 'In the winter months we salt and cure, storing food to get through the cold.' That simply means preparing food for winter. Kids, at Light Snow you can help Mom and Dad cure the meat too!"
    },
    "poemTitleEn": "Light Snow",
    "poemAuthorEn": "Dai Shulun (Tang Dynasty)",
    "poemEn": "The snowflakes swirl in the wind and never tire the eye, drifting and losing themselves among the forest hills. But a worried person sits by the study window, and each flake that flies past brings a little more chill.",
    "readingTipEn": "Read the first two lines happily, then slow down for the last two to bring out the gentle, dreamy sadness of the first snow.",
    "keywords": [
      "light snow",
      "cured meat",
      "rice cakes"
    ]
  },
  "daxue": {
    "date": "Dec 6–8",
    "climate": "The snow grows heavier and the weather gets even colder.",
    "phenologyKids": [
      {
        "raw": "1st pentad: the cold-night bird falls silent",
        "kids": "The little cold-crying bird stops singing, because it's just too cold to make a sound!"
      },
      {
        "raw": "2nd pentad: tigers begin to seek mates",
        "kids": "Tigers start looking for a partner — there's love even in winter!"
      },
      {
        "raw": "3rd pentad: the liting plant sprouts",
        "kids": "The liting grass pushes out new buds — even in the big snow, there are tough little lives!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Lamb stewed with radish to warm your tummy, and sweet potato porridge that's sweet and cozy.",
        "do": "Building snowmen and having snowball fights — the most fun things about winter!"
      },
      "south": {
        "eat": "Tangyuan (sweet glutinous rice balls) for the winter solstice, rolled by the whole family together, plus salted fish and meat to get ready for the New Year.",
        "do": "Enjoying the snowy scenery, since snow is rare in the south and worth a good look."
      },
      "kidsExplain": "'A timely snow promises a good harvest' — big snow is a hint that next year's crops will grow well! Building snowmen and snowball fights are the happiest parts of winter!"
    },
    "customs": {
      "eat": "Sweet potato porridge, lamb, and radish.",
      "do": "Curing meat, eating nourishing foods, and enjoying the snow.",
      "wear": "Wear your thickest padded coat and down jacket, and keep really warm."
    },
    "story": {
      "title": "Big Snow: A Good Snow Means a Good Harvest",
      "content": "At Big Snow, the snow falls more heavily. People long ago said, 'A timely snow promises a good harvest,' meaning that heavy winter snow leads to great crops next year. That's because thick snow is like a big cozy quilt, keeping the crops in the fields from freezing and even freezing away the harmful bugs. When spring comes and the snow melts, it gives the crops plenty of water too. So farmers hope for lots of snow in winter!"
    },
    "poemTitleEn": "River Snow",
    "poemAuthorEn": "Liu Zongyuan (Tang Dynasty)",
    "poemEn": "Across a thousand hills not a single bird flies, and on ten thousand paths there isn't one footprint. In a lonely little boat, an old man in a straw cape and hat fishes all alone in the snowy, freezing river.",
    "readingTipEn": "Let your voice get quieter and quieter, so you can feel the lonely beauty of a world all white and perfectly still.",
    "keywords": [
      "big snow",
      "lucky snow",
      "nourishing food"
    ]
  },
  "dongzhi": {
    "date": "Dec 21–23",
    "climate": "The days are shortest and the nights longest, and the coldest stretch of winter begins.",
    "phenologyKids": [
      {
        "raw": "1st pentad: earthworms curl up",
        "kids": "Earthworms curl their bodies into a ball to stay warm, hibernating down in the soil!"
      },
      {
        "raw": "2nd pentad: the elk shed their antlers",
        "kids": "The milu deer (also called the 'four-unlikes') drop their antlers, and won't grow them back until spring!"
      },
      {
        "raw": "3rd pentad: springs begin to stir",
        "kids": "The spring water underground starts to trickle softly, carrying just a tiny bit of warmth!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Jiaozi (dumplings) — a must-eat in the north at the winter solstice! — and lamb soup to chase away the cold.",
        "do": "'Counting the nines' to shrink the cold: every day you color in a square on a paper, counting the days until spring."
      },
      "south": {
        "eat": "Tangyuan (sweet glutinous rice balls), which stand for the family being round and together.",
        "do": "Honoring the ancestors, since the winter solstice is an important day for it."
      },
      "kidsExplain": "The winter solstice is the shortest day of all! In the south people eat tangyuan (rice balls) and in the north jiaozi (dumplings), and the whole family sitting down to eat together is the warmest thing of all!"
    },
    "customs": {
      "eat": "Jiaozi (dumplings, in the north), tangyuan (rice balls, in the south), and lamb soup.",
      "do": "Honoring ancestors, counting the nines, and eating dumplings or rice balls.",
      "wear": "Wear your thickest winter clothes and guard against the cold."
    },
    "story": {
      "title": "Why We Eat Dumplings at the Winter Solstice",
      "content": "On the winter solstice, the daytime is the shortest and the night is the longest of the whole year. The story goes that the famous doctor Zhang Zhongjing once saw many poor people with frostbitten ears on this day. So he wrapped lamb and medicine inside dough, shaped them like little ears, and cooked them in soup for everyone to eat. After eating, their ears got better. Ever since, people eat jiaozi (dumplings) on the winter solstice to remember Zhang Zhongjing's kindness. In the south, people eat tangyuan (sweet rice balls) instead, wishing for the family to be round and together."
    },
    "poemTitleEn": "Winter Solstice",
    "poemAuthorEn": "Du Fu (Tang Dynasty)",
    "poemEn": "Year after year the poet spends this special day far from home, and his loneliness and worry weigh him down. By the river he feels he is growing old all alone, while the customs of these faraway places carry on without him.",
    "readingTipEn": "Read it with deep feeling, so you can hear how much Du Fu misses his home while far away on the winter solstice.",
    "keywords": [
      "winter solstice",
      "dumplings",
      "rice balls",
      "counting the nines"
    ]
  },
  "xiaohan": {
    "date": "Jan 5–7",
    "climate": "The weather is cold, but not yet at its coldest.",
    "phenologyKids": [
      {
        "raw": "1st pentad: wild geese turn toward the north",
        "kids": "The wild geese are getting ready to fly back north! They can feel spring is coming, so they set off early!"
      },
      {
        "raw": "2nd pentad: magpies begin to build nests",
        "kids": "Magpies start picking up twigs to build new homes, getting ready to welcome spring!"
      },
      {
        "raw": "3rd pentad: pheasants begin to call",
        "kids": "Pheasants start going 'cluck-cluck-cluck' — they know spring is on its way too!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Laba porridge — on the eighth day of the last lunar month, people cook a hot, hearty porridge from eight kinds of grains.",
        "do": "Going out to 'seek the plum blossoms': visiting the plum garden to see the flowers, the very first sign of spring."
      },
      "south": {
        "eat": "Glutinous rice, which people in Guangdong eat at Minor Cold to warm the body.",
        "do": "Getting ready for the New Year, because once Minor Cold arrives, the New Year isn't far off."
      },
      "kidsExplain": "Laba porridge has eight things in it: rice, red beans, peanuts, red dates, and more. One bowl warms you all over! And the plum blossom is the bravest flower of all!"
    },
    "customs": {
      "eat": "Laba porridge, glutinous rice, and lamb.",
      "do": "Seeking plum blossoms, eating Laba porridge, and getting ready for the New Year.",
      "wear": "Wear your thickest winter clothes and bundle up from head to toe."
    },
    "story": {
      "title": "The Legend of Laba Porridge at Minor Cold",
      "content": "Minor Cold is one of the coldest times of the whole year. The story goes that long ago, while the Buddha was training himself, he grew so hungry he could barely go on. A shepherd girl cooked him a bowl of porridge, and after eating it his strength came back, and on the eighth day of the last lunar month he reached enlightenment and became the Buddha. Ever since, people cook porridge on that day to remember it, and they call it 'Laba porridge.' At Minor Cold, a bowl of hot Laba porridge warms you all over!"
    },
    "poemTitleEn": "Minor Cold",
    "poemAuthorEn": "Yuan Zhen (Tang Dynasty)",
    "poemEn": "Minor Cold arrives right after the deep midwinter, and the happy magpies pile up twigs for a brand-new nest. They hunt for food along the bends of the river and carry pretty bits round and round the treetops.",
    "readingTipEn": "Read it lightly and cheerfully, bringing out how busy and joyful the magpies are as they build, so you can feel the life stirring even in winter.",
    "keywords": [
      "cold",
      "Laba porridge",
      "plum blossoms"
    ]
  },
  "dahan": {
    "date": "Jan 20–21",
    "climate": "This is the coldest time of the whole year.",
    "phenologyKids": [
      {
        "raw": "1st pentad: hens begin to hatch chicks",
        "kids": "Mother hens start hatching their eggs! The baby chicks are coming into the world in the deep cold!"
      },
      {
        "raw": "2nd pentad: birds of prey fly fierce and fast",
        "kids": "Eagles fly high, fast and fierce, swooping down to catch their prey like an arrow shot from a bow!"
      },
      {
        "raw": "3rd pentad: the water freezes solid to the center",
        "kids": "The ice on the river freezes as thick as it gets — you could stand on it and not fall through!"
      }
    ],
    "folkCustoms": {
      "north": {
        "eat": "Niangao (sticky rice cake) — eaten at Great Cold because its name sounds like 'higher year after year,' a lucky wish.",
        "do": "Clearing out the old to make room for the new, with a big clean-up to welcome the New Year."
      },
      "south": {
        "eat": "Eight-treasure rice (a sweet, rich glutinous rice dish) and 'cold-chasing cake' that warms you up.",
        "do": "Steaming offerings, getting the food ready for honoring the ancestors."
      },
      "kidsExplain": "Great Cold is the very last solar term, and right after it comes the start of spring! Niangao (rice cake) means 'higher every year,' so eating it makes you even better at your studies!"
    },
    "customs": {
      "eat": "Eight-treasure rice, niangao (rice cake), and cold-chasing cake.",
      "do": "Clearing out the old for the new, getting ready for the New Year, and steaming offerings.",
      "wear": "Wear your thickest winter clothes and stay warm and protected from the cold."
    },
    "story": {
      "title": "Great Cold: Welcoming the New Year",
      "content": "Great Cold is the very last of the twenty-four solar terms, and also the coldest time of the whole year. Right after Great Cold comes the start of spring, and a brand-new year begins. So at Great Cold, everyone is busy getting ready for the New Year: cleaning the house, buying New Year treats, and putting up spring couplets. Even though it's freezing, everyone feels warm inside, because the New Year is almost here! Great Cold reminds us: once the coldest days pass, spring is not far away."
    },
    "poemTitleEn": "Leaving Jiangling's West Gate at Great Cold",
    "poemAuthorEn": "Lu You (Song Dynasty)",
    "poemEn": "At dawn the poet rides his thin, tired horse out the west gate, while a pale sun and cold clouds keep swallowing each other in the sky. The biting wind on his tipsy face startles him awake, and he tucks his hands into his heavy fur coat to steal a little warmth.",
    "readingTipEn": "Read it in a steady, calm voice, bringing out both the cold of setting off on a Great Cold morning and the poet's cheerful, easygoing spirit.",
    "keywords": [
      "coldest",
      "New Year treats",
      "welcoming the New Year"
    ]
  }
};
