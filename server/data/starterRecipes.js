// Comprehensive, authentic culinary recipes featuring global favorites and rich Indian regional local foods
// Karnataka, Andhra & Telangana, North Indian, South Indian, Mughlai & Street Delicacies

const starterRecipes = [
  // ==========================================
  // KARNATAKA LOCAL SPECIALS (ಕರ್ನಾಟಕ ಸ್ಪೆಷಲ್ಸ್)
  // ==========================================
  {
    title: "North Karnataka Stuffed Brinjal Curry (ಬದನೆಕಾಯಿ ಎಣ್ಣೆಗಾಯಿ / Ennegayi)",
    description: "Authentic North Karnataka style tender purple eggplants stuffed with a roasted peanut, sesame, jaggery, and Byadagi chili masala, simmered to perfection in fragrant peanut oil.",
    cuisine: "South Indian",
    category: "Dinner",
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    calories: 340,
    macros: { protein: 9, carbs: 24, fat: 22, fiber: 8 },
    dietaryTags: ["Vegetarian", "Vegan", "Gluten-Free"],
    ingredients: [
      { name: "Small Tender Purple Brinjals / Eggplants (slotted in 4)", amount: "500g (8-10 pcs)", category: "Produce" },
      { name: "Roasted Peanuts (skin removed)", amount: "1/2 cup", category: "Pantry & Grains" },
      { name: "White Sesame Seeds (roasted)", amount: "3 tbsp", category: "Pantry & Grains" },
      { name: "Dry Desiccated Coconut (Kobbari)", amount: "1/3 cup", category: "Pantry & Grains" },
      { name: "Byadagi Red Chili Powder", amount: "1.5 tbsp", category: "Spices & Oils" },
      { name: "Jaggery (Bella)", amount: "1 tbsp", category: "Pantry & Grains" },
      { name: "Tamarind Pulp (concentrate)", amount: "1.5 tbsp", category: "Pantry & Grains" },
      { name: "Coriander Seeds & Cumin Seeds", amount: "1 tbsp each", category: "Spices & Oils" },
      { name: "Peanut Oil or Gingelly Oil", amount: "3 tbsp", category: "Spices & Oils" },
      { name: "Fresh Curry Leaves & Mustard Seeds", amount: "1 sprig", category: "Produce" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Dry roast peanuts, sesame seeds, dry coconut, coriander seeds, and cumin seeds until aromatic. Grind into a semi-coarse masala powder with Byadagi chili, turmeric, jaggery, tamarind, and salt.",
        durationMinutes: 6,
        chefTip: "Do not add water while grinding the initial stuffing powder to keep the mixture potent."
      },
      {
        stepNumber: 2,
        instruction: "Slit the small brinjals in a plus (+) shape keeping the green stem intact. Generously stuff the prepared peanut-sesame masala inside each brinjal.",
        durationMinutes: 8,
        chefTip: "Keep brinjals in salted water before stuffing to prevent oxidation."
      },
      {
        stepNumber: 3,
        instruction: "Heat peanut oil in a heavy-bottomed kadai. Add mustard seeds, asafoetida (hing), and fresh curry leaves until they crackle.",
        durationMinutes: 2,
        chefTip: "Traditional North Karnataka cooking uses pure groundnut oil for signature aroma."
      },
      {
        stepNumber: 4,
        instruction: "Gently place stuffed brinjals into the hot oil. Sauté on medium-low heat for 5 minutes until skin softens and blisters lightly.",
        durationMinutes: 5,
        chefTip: "Turn each brinjal delicately with tongs so the filling stays secure."
      },
      {
        stepNumber: 5,
        instruction: "Add remaining ground masala and 1 cup warm water. Cover and simmer on low flame for 12-15 minutes until brinjals turn melt-in-mouth tender and oil floats to the surface.",
        durationMinutes: 15,
        chefTip: "The gravy will naturally thicken into a glossy, rich sauce as the peanut-sesame oils release."
      }
    ],
    chefSecret: "Using Byadagi chilies gives that iconic deep crimson color without overpowering sharpness, and a touch of dark jaggery balances the tamarind acidity.",
    beveragePairing: "Warm Jolada Rotti with Shenga Chutney Pudi and cold spiced Majjige (Buttermilk)",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80",
    isFavorite: true,
    isAiGenerated: false,
    rating: 5.0,
    reviewsCount: 164
  },
  {
    title: "Karnataka Royal Bisi Bele Bath (ಬಿಸಿಬೇಳೆ ಬಾತ್)",
    description: "Iconic Mysore-Karnataka one-pot culinary wonder combining short-grain rice, toor dal, seasonal vegetables, tamarind, and freshly ground aromatic bisi bele bath spice blend with ghee-roasted cashews.",
    cuisine: "South Indian",
    category: "Lunch",
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    calories: 440,
    macros: { protein: 14, carbs: 65, fat: 14, fiber: 9 },
    dietaryTags: ["Vegetarian", "Gluten-Free", "High-Fiber"],
    ingredients: [
      { name: "Sona Masoori Rice (or Raw Rice)", amount: "1 cup", category: "Pantry & Grains" },
      { name: "Toor Dal (Pigeon Peas)", amount: "1/2 cup", category: "Pantry & Grains" },
      { name: "Mixed Vegetables (Carrots, Beans, Green Peas, Shallots)", amount: "2 cups", category: "Produce" },
      { name: "Bisi Bele Bath Masala (Chana dal, Urad dal, Cinnamon, Cloves, Kapok Buds/Marathi Moggu, Byadagi Chili, Copra)", amount: "3 tbsp", category: "Spices & Oils" },
      { name: "Tamarind Extract", amount: "2 tbsp", category: "Pantry & Grains" },
      { name: "Jaggery (Organic)", amount: "1 tsp", category: "Pantry & Grains" },
      { name: "Pure Desi Ghee", amount: "3 tbsp", category: "Dairy & Eggs" },
      { name: "Whole Cashews", amount: "15 pieces", category: "Pantry & Grains" },
      { name: "Mustard Seeds, Hing & Curry Leaves", amount: "1 tbsp", category: "Spices & Oils" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Pressure cook rice and toor dal together with turmeric and 4.5 cups water for 4 whistles until soft and slightly mushy.",
        durationMinutes: 15,
        chefTip: "Cook rice and dal together with extra water to achieve the traditional velvety consistency."
      },
      {
        stepNumber: 2,
        instruction: "In a large pot, cook diced vegetables and shallots in tamarind water and salt until tender (about 8 minutes).",
        durationMinutes: 8,
        chefTip: "Shallots (madras onions) give an authentic sweet-savory flavor profile."
      },
      {
        stepNumber: 3,
        instruction: "Add the cooked rice-dal mash, Bisi Bele Bath powder, jaggery, and 1 cup warm water to the vegetable pot. Stir continuously on low heat for 7 minutes.",
        durationMinutes: 7,
        chefTip: "Marathi Moggu (Kapok buds) is the secret spice that gives Mysore Bisi Bele Bath its signature aroma."
      },
      {
        stepNumber: 4,
        instruction: "In a small tadka pan, heat desi ghee. Fry cashews until golden, then splutter mustard seeds, hing, and fresh curry leaves. Pour sizzling ghee over the piping hot bath.",
        durationMinutes: 3,
        chefTip: "Pouring the hot ghee tadka at the end locks in the deep herbal aroma."
      }
    ],
    chefSecret: "Marathi Moggu (Kapok Buds) and roasted dry coconut (kobbari) in the freshly ground spice paste create the undeniable temple-style flavor.",
    beveragePairing: "Crispy Potato Boondi / Sandige and authentic Bangalore Filter Kaapi",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
    isFavorite: true,
    isAiGenerated: false,
    rating: 4.9,
    reviewsCount: 198
  },
  {
    title: "Crispy Mysore Masala Dosa (ಮೈಸೂರು ಮಸಾಲ ದೋಸೆ)",
    description: "Crispy, golden fermented rice-lentil crepe smeared with spicy red garlic-chana dal chutney, filled with tempered potato palya, and finished with fragrant ghee.",
    cuisine: "South Indian",
    category: "Breakfast",
    difficulty: "Medium",
    prepTime: 25,
    cookTime: 15,
    servings: 4,
    calories: 360,
    macros: { protein: 8, carbs: 54, fat: 12, fiber: 6 },
    dietaryTags: ["Vegetarian", "Vegan"],
    ingredients: [
      { name: "Fermented Dosa Batter (Idli rice, Urad dal, Poha, Methi seeds)", amount: "4 cups", category: "Pantry & Grains" },
      { name: "Boiled Potatoes (mashed)", amount: "3 large", category: "Produce" },
      { name: "Red Garlic Chutney (Roasted chana dal, Byadagi chili, Garlic, Tamarind)", amount: "4 tbsp", category: "Spices & Oils" },
      { name: "Onions (finely sliced)", amount: "1 large", category: "Produce" },
      { name: "Green Chilies & Ginger (finely chopped)", amount: "1 tbsp", category: "Produce" },
      { name: "Pure Ghee / Butter", amount: "3 tbsp", category: "Dairy & Eggs" },
      { name: "Mustard Seeds, Urad Dal, Curry Leaves", amount: "1 tbsp", category: "Spices & Oils" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Prepare Potato Palya: Splutter mustard, urad dal, green chilies, ginger, and curry leaves in oil. Sauté onions until translucent, add turmeric, mashed potatoes, salt, and fresh coriander.",
        durationMinutes: 7,
        chefTip: "Keep potato palya slightly moist with a splash of water so it spreads effortlessly."
      },
      {
        stepNumber: 2,
        instruction: "Heat a heavy seasoned cast-iron tawa until water droplets sizzle and evaporate immediately. Wipe with a light sheen of oil.",
        durationMinutes: 2,
        chefTip: "Cast iron ensures an even golden-red caramelized crust."
      },
      {
        stepNumber: 3,
        instruction: "Pour a ladleful of batter in center, spreading in outward circular motions. Drizzle pure ghee generously along the edges and top.",
        durationMinutes: 3,
        chefTip: "Let the dosa cook purely on medium flame until bubbles form and bottom turns deep amber."
      },
      {
        stepNumber: 4,
        instruction: "Spread 1 tablespoon of spicy red garlic chutney evenly across the dosa surface. Place 2 spoonfuls of potato palya in the center. Fold into a half-moon and serve smoking hot.",
        durationMinutes: 2,
        chefTip: "The red chutney between the crisp crepe and soft potatoes is the true Mysore trademark."
      }
    ],
    chefSecret: "Adding soaked poha (flattened rice) and a pinch of methi seeds to the batter yields that coveted golden crunch on outside while remaining soft inside.",
    beveragePairing: "Fresh Coconut Chutney, Vegetable Sambhar, and piping hot Degree Coffee",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80",
    isFavorite: true,
    isAiGenerated: false,
    rating: 5.0,
    reviewsCount: 240
  },

  // ====================================================
  // ANDHRA & TELANGANA LOCAL SPECIALS (తెలుగు వంటకాలు)
  // ====================================================
  {
    title: "Andhra Gutti Vankaya Koora (గుత్తి వంకాయ కూర / Stuffed Brinjal Curry)",
    description: "Royal Andhra specialty of tender small brinjals simmered in a fiery, nutty gravy of roasted peanuts, poppy seeds (gasagasalu), sesame, grated coconut, and tangy tamarind.",
    cuisine: "South Indian",
    category: "Dinner",
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    calories: 380,
    macros: { protein: 8, carbs: 26, fat: 26, fiber: 7 },
    dietaryTags: ["Vegetarian", "Vegan", "Gluten-Free"],
    ingredients: [
      { name: "Small Purple Eggplants / Vankayalu", amount: "500g", category: "Produce" },
      { name: "Roasted Peanuts (Verusenaga)", amount: "1/4 cup", category: "Pantry & Grains" },
      { name: "White Poppy Seeds (Gasagasalu)", amount: "1.5 tbsp", category: "Pantry & Grains" },
      { name: "Sesame Seeds (Nuvvulu)", amount: "2 tbsp", category: "Pantry & Grains" },
      { name: "Fresh Grated Coconut", amount: "1/4 cup", category: "Produce" },
      { name: "Andhra Guntur Red Chili Powder", amount: "1.5 tbsp", category: "Spices & Oils" },
      { name: "Tamarind Paste (Chintapandu)", amount: "2 tbsp", category: "Pantry & Grains" },
      { name: "Onion & Ginger-Garlic Paste", amount: "3 tbsp", category: "Produce" },
      { name: "Groundnut Oil", amount: "3 tbsp", category: "Spices & Oils" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Dry roast peanuts, poppy seeds, sesame, cloves, cinnamon, and coconut. Grind with onions, ginger-garlic, Guntur chili powder, tamarind, and salt into a luscious thick paste.",
        durationMinutes: 7,
        chefTip: "Poppy seeds (gasagasalu) provide rich body and silky velvet mouthfeel."
      },
      {
        stepNumber: 2,
        instruction: "Slit brinjals crosswise and stuff generously with half of the prepared Andhra spice paste.",
        durationMinutes: 6,
        chefTip: "Keep brinjals in salted water until ready to fry to keep them crisp."
      },
      {
        stepNumber: 3,
        instruction: "Heat oil in a pan. Add mustard seeds and curry leaves. Place stuffed brinjals and shallow fry for 6 minutes until partially tender.",
        durationMinutes: 6,
        chefTip: "Gently rotate to ensure all sides are coated in hot oil."
      },
      {
        stepNumber: 4,
        instruction: "Pour in remaining masala paste with 1 cup water. Cover and cook on low heat for 12-15 minutes until brinjals are tender and the spicy red oil separates on top.",
        durationMinutes: 15,
        chefTip: "Simmer without disturbing excessively to keep the brinjal stems intact."
      }
    ],
    chefSecret: "Poppy seeds (gasagasalu) and authentic Guntur red chili give Gutti Vankaya its characteristic nutty heat and glossy sauce separation.",
    beveragePairing: "Steaming hot Sona Masoori rice with Ghee, or hot Bagara Rice",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80",
    isFavorite: true,
    isAiGenerated: false,
    rating: 4.9,
    reviewsCount: 175
  },
  {
    title: "Hyderabadi Dum Biryani (హైదరాబాదీ దమ్ బిర్యానీ / हैदराबादी बिरयानी)",
    description: "Royal Nizam court masterpiece featuring fragrant extra-long basmati rice slow-cooked on dum with tender marinated meat or spiced paneer, saffron milk, fried onions (birista), and fresh mint.",
    cuisine: "South Indian",
    category: "Dinner",
    difficulty: "Master Chef",
    prepTime: 30,
    cookTime: 40,
    servings: 6,
    calories: 620,
    macros: { protein: 36, carbs: 70, fat: 22, fiber: 5 },
    dietaryTags: ["High-Protein", "Gluten-Free"],
    ingredients: [
      { name: "Extra-Long Aged Basmati Rice", amount: "3 cups (soaked 30 mins)", category: "Pantry & Grains" },
      { name: "Chicken Thighs or Fresh Paneer & Veggies", amount: "800g", category: "Meat & Seafood" },
      { name: "Thick Curd / Dahi", amount: "1 cup", category: "Dairy & Eggs" },
      { name: "Crispy Golden Fried Onions (Birista)", amount: "1.5 cups", category: "Produce" },
      { name: "Fresh Mint & Coriander Leaves (chopped)", amount: "1 cup", category: "Produce" },
      { name: "Shahi Biryani Masala (Green Cardamom, Shahi Jeera, Mace, Nutmeg, Star Anise)", amount: "2 tbsp", category: "Spices & Oils" },
      { name: "Saffron dissolved in warm milk", amount: "1/4 cup", category: "Dairy & Eggs" },
      { name: "Pure Ghee & Rose Water", amount: "3 tbsp", category: "Dairy & Eggs" },
      { name: "Ginger Garlic Paste & Green Chilies", amount: "2 tbsp", category: "Produce" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Marinate chicken/paneer with yogurt, ginger-garlic paste, Guntur chili powder, biryani masala, half of fried onions, mint, coriander, lemon juice, and salt for at least 45 minutes.",
        durationMinutes: 45,
        chefTip: "A long marinade ensures deep spice penetration right to the bone."
      },
      {
        stepNumber: 2,
        instruction: "Boil water with whole spices (shahi jeera, cardamom, cloves, bay leaf, ghee, salt). Cook soaked basmati rice until exactly 70% done (grain breaks into 3 pieces). Drain immediately.",
        durationMinutes: 8,
        chefTip: "Water should taste as salty as sea water for perfectly seasoned rice grains."
      },
      {
        stepNumber: 3,
        instruction: "Layering: In a heavy bottom handi, spread the marinated chicken/paneer base. Top with 70% cooked rice, fried onions, chopped mint, saffron milk, desi ghee, and drops of rose water.",
        durationMinutes: 5,
        chefTip: "Drizzle ghee around the edges so steam circulates through every layer."
      },
      {
        stepNumber: 4,
        instruction: "Seal handi with foil or wheat dough lid. Cook on high for 5 minutes, then place on a heavy tawa on lowest flame for 25-30 minutes for slow 'Dum' cooking. Rest 10 minutes before opening.",
        durationMinutes: 30,
        chefTip: "Never open the lid immediately; resting allows juices to redistribute into the rice grains."
      }
    ],
    chefSecret: "Shahi Jeera (caraway seeds) in the boiling water and sealing the pot with dough to trap 100% of the aromatic steam is the true Nizam secret.",
    beveragePairing: "Mirchi ka Salan, Burani Garlic Raita, and Sweet Paan",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
    isFavorite: true,
    isAiGenerated: false,
    rating: 5.0,
    reviewsCount: 312
  },
  {
    title: "Andhra Pesarattu with Ginger Chutney (పెసరట్టు & అల్లం పచ్చడి)",
    description: "Wholesome protein-rich green gram (moong) crepes topped with finely chopped onions, ginger, and cumin, paired with Andhra's iconic sweet-spicy allam pachadi (ginger chutney).",
    cuisine: "South Indian",
    category: "Breakfast",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    calories: 280,
    macros: { protein: 16, carbs: 44, fat: 6, fiber: 8 },
    dietaryTags: ["Vegetarian", "Vegan", "High-Protein", "Gluten-Free"],
    ingredients: [
      { name: "Whole Green Gram / Moong Dal (soaked 6 hours)", amount: "2 cups", category: "Pantry & Grains" },
      { name: "Green Chilies & Fresh Ginger", amount: "4 chilies, 2 inch ginger", category: "Produce" },
      { name: "Cumin Seeds (Jeera)", amount: "1.5 tbsp", category: "Spices & Oils" },
      { name: "Finely Chopped Red Onions", amount: "1 cup", category: "Produce" },
      { name: "Fresh Ginger Chutney (Allam Pachadi)", amount: "1/2 cup", category: "Pantry & Grains" },
      { name: "Sesame Oil or Ghee", amount: "2 tbsp", category: "Spices & Oils" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Grind soaked green gram with green chilies, ginger, cumin seeds, and salt into a smooth, pourable batter without fermenting.",
        durationMinutes: 5,
        chefTip: "Pesarattu needs no fermentation; it is ground fresh and cooked immediately."
      },
      {
        stepNumber: 2,
        instruction: "Heat a seasoned tawa. Pour batter and spread into a thin crepe. Immediately press finely chopped onions, green chilies, and cumin onto the wet top surface.",
        durationMinutes: 3,
        chefTip: "Pressing the onions lightly with a spatula helps them stick and caramelize."
      },
      {
        stepNumber: 3,
        instruction: "Drizzle oil along the edges. Cook until bottom is crisp and golden brown. Flip briefly or fold in half and serve piping hot.",
        durationMinutes: 3,
        chefTip: "For MLA Pesarattu, place a scoop of hot Upma in the center before folding."
      }
    ],
    chefSecret: "Adding a tablespoon of raw rice while soaking moong gives that extra crispness without making the batter dense.",
    beveragePairing: "Tangy Allam Pachadi (Ginger Chutney) and hot Filter Coffee",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80",
    isFavorite: false,
    isAiGenerated: false,
    rating: 4.8,
    reviewsCount: 92
  },

  // ====================================================
  // NORTH INDIAN CLASSICS & STREET DELICACIES
  // ====================================================
  {
    title: "Golden Murgh Makhani / Butter Chicken (मुर्ग मखनी)",
    description: "Tender charred chicken thighs simmered in an aromatic velvet sauce of roasted tomatoes, ginger, toasted garam masala, cashew cream, and fragrant green cardamom.",
    cuisine: "North Indian",
    category: "Dinner",
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    calories: 580,
    macros: { protein: 38, carbs: 14, fat: 42, fiber: 4 },
    dietaryTags: ["High-Protein", "Gluten-Free"],
    ingredients: [
      { name: "Boneless Chicken Thighs (bite-sized)", amount: "700g", category: "Meat & Seafood" },
      { name: "Greek Yogurt / Hung Curd", amount: "1/2 cup", category: "Dairy & Eggs" },
      { name: "Garam Masala & Kashmiri Chili", amount: "2 tbsp", category: "Spices & Oils" },
      { name: "Fresh Ginger & Garlic Paste", amount: "2 tbsp", category: "Produce" },
      { name: "Butter (Ghee)", amount: "3 tbsp", category: "Dairy & Eggs" },
      { name: "Cashew Nut Paste", amount: "1/4 cup", category: "Pantry & Grains" },
      { name: "Crushed Ripe Tomatoes", amount: "400g", category: "Pantry & Grains" },
      { name: "Heavy Cream", amount: "1/2 cup", category: "Dairy & Eggs" },
      { name: "Kasuri Methi (Dried Fenugreek Leaves)", amount: "1 tbsp", category: "Spices & Oils" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Marinate chicken with Greek yogurt, ginger-garlic paste, turmeric, Kashmiri chili, and salt for at least 20 minutes.",
        durationMinutes: 20,
        chefTip: "Yogurt's lactic acid tenderizes the chicken fibers thoroughly."
      },
      {
        stepNumber: 2,
        instruction: "Sear marinated chicken pieces in a smoking hot pan with 1 tbsp ghee until charred in spots (about 6 minutes). Set aside.",
        durationMinutes: 6,
        chefTip: "Getting char marks replicates the tandoor oven smokiness."
      },
      {
        stepNumber: 3,
        instruction: "In the same pan, melt remaining butter. Add tomato puree, cashew paste, cardamom, and spices. Simmer for 10 minutes until smooth and silky.",
        durationMinutes: 10,
        chefTip: "Blend this sauce with an immersion blender for an ultra-silky makhani texture."
      },
      {
        stepNumber: 4,
        instruction: "Stir in heavy cream and cooked chicken. Simmer for 5 minutes. Crush dried fenugreek leaves between your palms and sprinkle over top.",
        durationMinutes: 5,
        chefTip: "Rubbing Kasuri Methi between your palms releases the essential herbal aroma."
      }
    ],
    chefSecret: "Kasuri Methi (dried fenugreek) and a tiny pinch of raw sugar are the real restaurant secrets to authentic butter chicken.",
    beveragePairing: "Garlic Butter Naan, Jeera Rice, and Sweet Mango Lassi",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1200&q=80",
    isFavorite: true,
    isAiGenerated: false,
    rating: 5.0,
    reviewsCount: 280
  },
  {
    title: "Slow-Simmered Dal Makhani (दाल मखनी / Creamy Black Lentils)",
    description: "Iconic Punjabi delicacy of whole black urad lentils and kidney beans slow-cooked overnight with ginger, tomato coulis, white butter (makhan), and a touch of cream.",
    cuisine: "North Indian",
    category: "Dinner",
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    calories: 420,
    macros: { protein: 18, carbs: 48, fat: 18, fiber: 12 },
    dietaryTags: ["Vegetarian", "Gluten-Free", "High-Protein"],
    ingredients: [
      { name: "Whole Black Urad Dal (soaked overnight)", amount: "1.5 cups", category: "Pantry & Grains" },
      { name: "Rajma (Red Kidney Beans)", amount: "1/4 cup", category: "Pantry & Grains" },
      { name: "Fresh Tomato Puree", amount: "1.5 cups", category: "Produce" },
      { name: "White Butter (Makhan) or Ghee", amount: "4 tbsp", category: "Dairy & Eggs" },
      { name: "Heavy Cream", amount: "1/4 cup", category: "Dairy & Eggs" },
      { name: "Kashmiri Red Chili & Garam Masala", amount: "1 tbsp", category: "Spices & Oils" },
      { name: "Kasuri Methi & Fresh Ginger Juliennes", amount: "1 tbsp", category: "Produce" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Pressure cook soaked black dal and rajma with salt, black cardamom, and water for 6-7 whistles until completely tender and mashable.",
        durationMinutes: 25,
        chefTip: "Mash a portion of the dal against the side of the pot to release natural starches for creamy thickness."
      },
      {
        stepNumber: 2,
        instruction: "In a heavy pot, melt white butter. Add ginger-garlic paste and sauté. Add tomato puree, Kashmiri chili powder, and cook until butter releases.",
        durationMinutes: 8,
        chefTip: "Kashmiri chili gives bright red color without pungent sharpness."
      },
      {
        stepNumber: 3,
        instruction: "Add cooked lentils with their cooking liquor. Simmer on low heat for 25-30 minutes, stirring frequently.",
        durationMinutes: 30,
        chefTip: "The longer dal makhani simmers, the richer and creamier it gets."
      },
      {
        stepNumber: 4,
        instruction: "Stir in heavy cream and crushed kasuri methi. Garnish with ginger juliennes and an extra knob of butter.",
        durationMinutes: 2,
        chefTip: "For charcoal aroma (dhungar), place a glowing piece of charcoal in a small bowl inside the pot with ghee and cover for 3 minutes."
      }
    ],
    chefSecret: "Dhungar technique (smoking with a live charcoal cube and ghee) gives authentic dhaba-style smokiness.",
    beveragePairing: "Tandoori Roti or Laccha Paratha and fresh onion salad",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1200&q=80",
    isFavorite: true,
    isAiGenerated: false,
    rating: 4.9,
    reviewsCount: 154
  },
  {
    title: "Dilli Wali Samosa Chaat (समोसा चाट)",
    description: "Crispy golden spiced potato samosas crushed and layered with warm spiced chole ragda, chilled whisked sweetened yogurt, tangy tamarind chutney, spicy mint chutney, and crunchy sev.",
    cuisine: "North Indian",
    category: "Snack",
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    calories: 460,
    macros: { protein: 12, carbs: 62, fat: 18, fiber: 7 },
    dietaryTags: ["Vegetarian"],
    ingredients: [
      { name: "Crispy Potato Samosas", amount: "4 pieces", category: "Bakery" },
      { name: "Spiced Chickpea Curry (Chole)", amount: "1.5 cups", category: "Pantry & Grains" },
      { name: "Sweetened Chilled Yogurt (Dahi)", amount: "1 cup", category: "Dairy & Eggs" },
      { name: "Sweet Tamarind-Date Chutney (Saunth)", amount: "4 tbsp", category: "Pantry & Grains" },
      { name: "Spicy Coriander-Mint Chutney", amount: "3 tbsp", category: "Produce" },
      { name: "Crispy Nylon Sev & Pomegranate Seeds", amount: "1/4 cup each", category: "Pantry & Grains" },
      { name: "Chaat Masala & Roasted Cumin Powder", amount: "1 tsp each", category: "Spices & Oils" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Warm the potato samosas in an oven or air fryer until shatteringly crisp.",
        durationMinutes: 5,
        chefTip: "Crisp samosas prevent the chaat from turning soggy under warm gravy."
      },
      {
        stepNumber: 2,
        instruction: "Place 2 warm samosas in a wide shallow bowl and gently crush them with your fingers.",
        durationMinutes: 2,
        chefTip: "Crushing exposes the spiced potato filling to absorb the chutneys."
      },
      {
        stepNumber: 3,
        instruction: "Ladle piping hot chole over the crushed samosas. Drizzle generously with cold sweetened yogurt, sweet tamarind chutney, and spicy green chutney.",
        durationMinutes: 3,
        chefTip: "The contrast between piping hot chole and chilled yogurt is the secret to unforgettable chaat."
      },
      {
        stepNumber: 4,
        instruction: "Sprinkle chaat masala, roasted cumin powder, chopped onions, fresh coriander, ruby pomegranate seeds, and crunchy nylon sev. Serve immediately.",
        durationMinutes: 2,
        chefTip: "Eat immediately to experience the contrast of hot, cold, sweet, spicy, and crunch."
      }
    ],
    chefSecret: "Roasting cumin seeds on low flame and grinding fresh for the garnish elevates street-style chaat into gourmet culinary art.",
    beveragePairing: "Masala Chai or chilled Rose Milk",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    isFavorite: false,
    isAiGenerated: false,
    rating: 4.9,
    reviewsCount: 120
  }
];

module.exports = starterRecipes;
