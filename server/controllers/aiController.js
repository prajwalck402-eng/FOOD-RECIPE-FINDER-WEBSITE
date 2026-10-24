const Groq = require('groq-sdk');
const Recipe = require('../models/Recipe');
const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Securely initialize Groq client from environment variable
let _groqClient = null;
function getGroqClient() {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error('GROQ_API_KEY environment variable is not configured. Please set GROQ_API_KEY in your Render dashboard or .env file.');
  }
  if (!_groqClient) {
    _groqClient = new Groq({ apiKey: key });
  }
  return _groqClient;
}

// Transparent proxy to access Groq safely without crashing during startup if key is missing
const groq = {
  get chat() {
    return getGroqClient().chat;
  }
};

const CUISINE_IMAGES = {
  Italian: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80",
  Indian: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1200&q=80",
  Mexican: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
  Japanese: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
  Mediterranean: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
  French: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=1200&q=80",
  Thai: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
  Spanish: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1200&q=80",
  American: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
  Dessert: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=80",
  Breakfast: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80",
  Default: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
};

// Comprehensive, high-accuracy dish image dictionary
function pickRecipeImage(cuisine, category, title = "") {
  const t = title.toLowerCase();

  // Ennegayi / Brinjal / Eggplant / Baingan Curry
  if (t.includes("ennagayi") || t.includes("ennegayi") || t.includes("brinjal") || t.includes("eggplant") || t.includes("baingan") || t.includes("aubergine") || t.includes("vangi")) {
    return "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80";
  }

  // Rice / Pulao / Biryani / Pilaf / Fried Rice
  if (t.includes("pulao") || t.includes("pulav") || t.includes("palav") || t.includes("pilaf") || t.includes("biryani") || t.includes("jeera rice")) {
    return "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80";
  }
  if (t.includes("fried rice") || t.includes("nasi goreng")) {
    return "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80";
  }
  if (t.includes("risotto")) {
    return "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1200&q=80";
  }

  // Pizza / Calzone / Flatbread
  if (t.includes("pizza") || t.includes("flatbread") || t.includes("focaccia") || t.includes("calzone")) {
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80";
  }

  // Pasta / Noodles / Spaghetti / Lasagna / Carbonara
  if (t.includes("pasta") || t.includes("spaghetti") || t.includes("penne") || t.includes("fettuccine") || t.includes("carbonara") || t.includes("alfredo") || t.includes("lasagna") || t.includes("ravioli") || t.includes("macaroni")) {
    return "https://images.unsplash.com/photo-1621996346565-e3d5d6281290?auto=format&fit=crop&w=1200&q=80";
  }
  if (t.includes("pad thai") || t.includes("noodle") || t.includes("chow mein") || t.includes("lo mein") || t.includes("ramen") || t.includes("udon") || t.includes("soba")) {
    return "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80";
  }

  // Indian Curries / Paneer / Tikka / Dal
  if (t.includes("curry") || t.includes("tikka") || t.includes("butter chicken") || t.includes("paneer") || t.includes("masala") || t.includes("korma") || t.includes("dal") || t.includes("chana") || t.includes("rogan josh") || t.includes("sambhar") || t.includes("sambar")) {
    return "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1200&q=80";
  }
  if (t.includes("dosa") || t.includes("idli") || t.includes("uttapam")) {
    return "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80";
  }
  if (t.includes("samosa") || t.includes("pakora") || t.includes("chaat") || t.includes("naan") || t.includes("paratha") || t.includes("roti") || t.includes("chapati")) {
    return "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80";
  }

  // Mexican / Tacos / Burritos / Enchiladas
  if (t.includes("taco") || t.includes("burrito") || t.includes("fajita") || t.includes("quesadilla") || t.includes("enchilada") || t.includes("nachos") || t.includes("guacamole")) {
    return "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80";
  }

  // Japanese / Sushi / Gyoza / Teriyaki
  if (t.includes("sushi") || t.includes("sashimi") || t.includes("maki") || t.includes("nigiri") || t.includes("roll")) {
    return "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80";
  }
  if (t.includes("gyoza") || t.includes("dumpling") || t.includes("teriyaki") || t.includes("tempura") || t.includes("katsu")) {
    return "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=1200&q=80";
  }

  // Burgers & Sandwiches
  if (t.includes("burger") || t.includes("cheeseburger") || t.includes("slider")) {
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80";
  }
  if (t.includes("sandwich") || t.includes("toast") || t.includes("panini") || t.includes("wrap") || t.includes("croque") || t.includes("avocado toast")) {
    return "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80";
  }

  // Steaks, Beef Wellington, BBQ, Ribs
  if (t.includes("steak") || t.includes("wellington") || t.includes("ribeye") || t.includes("tenderloin") || t.includes("beef") || t.includes("brisket") || t.includes("bbq")) {
    return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80";
  }

  // Chicken & Poultry
  if (t.includes("chicken") || t.includes("poultry") || t.includes("roast chicken") || t.includes("wings") || t.includes("drumstick")) {
    return "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1200&q=80";
  }

  // Seafood / Salmon / Fish / Shrimp
  if (t.includes("salmon") || t.includes("fish") || t.includes("shrimp") || t.includes("prawn") || t.includes("seafood") || t.includes("tuna") || t.includes("crab") || t.includes("lobster")) {
    return "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80";
  }

  // Soups & Stews
  if (t.includes("soup") || t.includes("stew") || t.includes("chowder") || t.includes("broth") || t.includes("bisque") || t.includes("minestrone")) {
    return "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80";
  }

  // Salads & Bowls
  if (t.includes("salad") || t.includes("caesar") || t.includes("greek") || t.includes("quinoa") || t.includes("poke bowl") || t.includes("buddha bowl") || t.includes("hummus")) {
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80";
  }

  // Breakfast / Pancakes / Eggs / Waffles
  if (t.includes("pancake") || t.includes("souffle") || t.includes("waffle") || t.includes("crepe")) {
    return "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80";
  }
  if (t.includes("egg") || t.includes("omelet") || t.includes("benedict") || t.includes("scramble") || t.includes("frittata") || category === "Breakfast") {
    return "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80";
  }

  // Desserts / Cakes / Cookies / Tiramisu / Chocolate
  if (t.includes("tiramisu") || t.includes("cake") || t.includes("cheesecake") || t.includes("brownie") || t.includes("cookie") || t.includes("chocolate") || t.includes("churro") || t.includes("pie") || t.includes("tart") || t.includes("ice cream") || category === "Dessert") {
    return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80";
  }

  return CUISINE_IMAGES[cuisine] || CUISINE_IMAGES[category] || CUISINE_IMAGES.Default;
}

// Ultra-robust JSON parser
function extractJson(content) {
  if (!content) return {};
  
  // 1. Remove think tags and internal reasoning
  let cleaned = String(content).replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  if (cleaned.includes('<think>')) {
    const parts = cleaned.split('</think>');
    cleaned = (parts.length > 1 ? parts[parts.length - 1] : cleaned.replace(/<think>[\s\S]*/gi, '')).trim();
  }

  // 2. Extract JSON code block
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }

  // 3. Find outer braces
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // 4. Remove trailing commas before } or ]
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    try {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0].replace(/,\s*([}\]])/g, '$1'));
      }
    } catch (e2) {
      console.warn("extractJson parse fallback failure.");
    }
    return null;
  }
}

const LANGUAGE_NAMES = {
  hi: 'Hindi (हिन्दी)',
  kn: 'Kannada (ಕನ್ನಡ)',
  te: 'Telugu (తెలుగు)',
  en: 'English'
};

const configuredModel = process.env.GROQ_MODEL;
const GROQ_CANDIDATE_MODELS = [
  ...(configuredModel ? [configuredModel] : []),
  'qwen/qwen3.6-27b',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b'
].filter((m, idx, arr) => arr.indexOf(m) === idx);

exports.generateRecipe = async (req, res) => {
  try {
    const {
      query = '',
      dishName = '',
      title = '',
      ingredients = [],
      cuisine = 'Any',
      category = 'Dinner',
      dietary = [],
      maxTime = 40,
      difficulty = 'Medium',
      craving = '',
      servings = 4,
      language = 'en',
    } = req.body;

    const requestedDish = dishName || query || title || craving;
    const ingredientsList = Array.isArray(ingredients) ? ingredients.join(', ') : ingredients;
    const dietaryList = Array.isArray(dietary) ? dietary.join(', ') : dietary;

    const langDirective = language && language !== 'en' && LANGUAGE_NAMES[language]
      ? `\nCRITICAL LANGUAGE INSTRUCTION: Output ALL user-facing text (title, description, ingredients names and amounts, instructions, chef tips, chefSecret, beveragePairing) in fluent ${LANGUAGE_NAMES[language]}. Keep the JSON keys in English as specified in the schema.`
      : '';

    const systemPrompt = `You are a World-Renowned Master Chef specializing in International Gourmet Cuisine and Authentic Regional Indian Local Foods (Karnataka, Andhra Pradesh, Telangana, North Indian, Tamil Nadu, Kerala, Mughlai, and Street Food).
Generate an authentic, extraordinarily delicious recipe with precise spice blends, tempering techniques (tadka), and flavor balancing.${langDirective}
Output ONLY raw JSON matching this schema:
{
  "title": "Exact Dish Name (with native name if applicable)",
  "description": "Appetizing 2-sentence description highlighting key flavors and textures.",
  "cuisine": "South Indian | North Indian | Indian | Italian | Mexican | Japanese | Mediterranean | French | Thai | Spanish | Asian",
  "category": "Breakfast | Lunch | Dinner | Dessert | Snack | Appetizer",
  "difficulty": "Easy | Medium | Master Chef",
  "prepTime": 15,
  "cookTime": 25,
  "servings": 4,
  "calories": 480,
  "macros": { "protein": 32, "carbs": 38, "fat": 18, "fiber": 6 },
  "dietaryTags": ["Vegetarian", "High-Protein", "Gluten-Free"],
  "ingredients": [
    { "name": "Ingredient Name", "amount": "2 tbsp / 200g", "category": "Produce | Dairy & Eggs | Pantry & Grains | Meat & Seafood | Spices & Oils | Other" }
  ],
  "instructions": [
    { "stepNumber": 1, "instruction": "Clear, detailed step text.", "durationMinutes": 5, "chefTip": "Pro chef technique tip" }
  ],
  "chefSecret": "Master culinary technique secret.",
  "beveragePairing": "Traditional beverage or pairing."
}`;

    const userPrompt = requestedDish 
      ? `Specific Requested Dish: "${requestedDish}". Formulate an authentic, world-class gourmet recipe for this exact dish!
- Additional Ingredients available: ${ingredientsList || 'Standard chef pantry'}
- Preferred Cuisine: ${cuisine}
- Category: ${category}
- Dietary Restrictions: ${dietaryList || 'None'}
- Max Cook Time: ${maxTime} min
- Skill: ${difficulty}
- Servings: ${servings}`
      : `Hero Ingredients: ${ingredientsList || 'Fresh seasonal items'}
- Cuisine: ${cuisine}
- Category: ${category}
- Dietary: ${dietaryList || 'None'}
- Max Time: ${maxTime} min
- Skill: ${difficulty}
- Servings: ${servings}
- Craving / Style: ${craving || 'Savory and delicious'}`;

    const candidateModels = GROQ_CANDIDATE_MODELS;

    let recipeData = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const completion = await groq.chat.completions.create({
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.6,
          max_tokens: 3000,
        });

        const responseText = completion.choices[0]?.message?.content;
        if (responseText) {
          recipeData = extractJson(responseText);
          if (recipeData && (recipeData.title || recipeData.ingredients)) {
            break;
          }
        }
      } catch (err) {
        lastError = err;
        console.warn(`Groq model ${modelName} attempt failed:`, err.message);
      }
    }

    if (!recipeData) {
      throw lastError || new Error("Failed to generate recipe with available AI models.");
    }

    // Attach curated image and metadata tailored to title or requested dish
    const searchTarget = recipeData.title || requestedDish || cuisine;
    recipeData.image = pickRecipeImage(recipeData.cuisine || cuisine, recipeData.category || category, searchTarget);
    recipeData.isAiGenerated = true;
    recipeData.rating = 4.9;
    recipeData.reviewsCount = 1;

    res.status(200).json({
      success: true,
      recipe: recipeData,
    });
  } catch (error) {
    console.error("Error in AI Recipe Generation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate AI recipe: " + error.message,
    });
  }
};

exports.chatWithChef = async (req, res) => {
  try {
    const { messages = [], currentRecipe = null, language = 'en' } = req.body;

    const recipeContext = currentRecipe ? `Current recipe being viewed/cooked:
Title: "${currentRecipe.title}"
Cuisine: ${currentRecipe.cuisine}
Ingredients: ${currentRecipe.ingredients?.map(i => `${i.amount} ${i.name}`).join(', ')}
Instructions: ${currentRecipe.instructions?.map(s => `Step ${s.stepNumber}: ${s.instruction}`).join(' | ')}
Chef Secret: ${currentRecipe.chefSecret || 'N/A'}` : 'User is browsing recipes.';

    const langDirective = language && language !== 'en' && LANGUAGE_NAMES[language]
      ? `\nCRITICAL LANGUAGE INSTRUCTION: You MUST reply entirely and fluently in ${LANGUAGE_NAMES[language]}! Use authentic regional vocabulary for cooking terms, ingredients, and techniques.`
      : '';

    const systemPrompt = `You are Chef Savor (Chef Pierre), an award-winning master chef and AI sous-chef copilot with deep expertise in Indian regional cooking (Karnataka, Andhra/Telangana, North Indian, South Indian tiffin, street foods) and global gastronomy.${langDirective}
Give warm, actionable, culinary-accurate advice with bullet points, spice adjustments, tempering tips, and bold highlights.
Context:
${recipeContext}`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }))
    ];

    const candidateModels = GROQ_CANDIDATE_MODELS;

    let chefReply = null;

    for (const modelName of candidateModels) {
      try {
        const completion = await groq.chat.completions.create({
          model: modelName,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 1200,
        });
        chefReply = completion.choices[0]?.message?.content;
        if (chefReply) break;
      } catch (err) {
        console.warn(`Chat attempt with ${modelName} failed:`, err.message);
      }
    }

    chefReply = chefReply ? chefReply.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim() : "Bonjour! How can I assist in your kitchen today?";

    res.status(200).json({
      success: true,
      message: chefReply,
    });
  } catch (error) {
    console.error("Error in Chef Savor Chat:", error);
    res.status(500).json({
      success: false,
      message: "Chef Savor is taking a quick breather. Please try asking again in a moment.",
    });
  }
};

exports.getIngredientSubstitution = async (req, res) => {
  try {
    const { ingredient, dietaryPreference = "None", recipeContext = "" } = req.body;

    if (!ingredient) {
      return res.status(400).json({ success: false, message: "Ingredient is required" });
    }

    const systemPrompt = `You are an expert culinary chemist. Given an ingredient, suggest 3 gourmet substitutions. Output ONLY valid JSON:
{
  "originalIngredient": "${ingredient}",
  "substitutions": [
    {
      "name": "Sub Name",
      "ratio": "1:1 equivalent",
      "flavorProfile": "Flavor note",
      "bestFor": "Cooking use case"
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      model: GROQ_CANDIDATE_MODELS[0],
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Ingredient: ${ingredient}. Dietary: ${dietaryPreference}. Recipe: ${recipeContext}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
      max_tokens: 1000,
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content);
    res.status(200).json({
      success: true,
      ...parsed,
    });
  } catch (error) {
    console.error("Error in Ingredient Substitution:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch substitutions: " + error.message,
    });
  }
};

exports.generateMealPlan = async (req, res) => {
  try {
    const {
      targetCalories = 2000,
      dietary = [],
      days = 7,
      preferences = "Balanced Gourmet",
    } = req.body;

    const dietaryList = Array.isArray(dietary) ? dietary.join(', ') : dietary;

    const systemPrompt = `You are a certified culinary nutritionist. Generate a 7-day gourmet meal plan. Output ONLY raw JSON matching this schema:
{
  "weekSummary": "Summary text",
  "dailyTargetCalories": ${targetCalories},
  "days": [
    {
      "day": "Monday",
      "totalCalories": 1950,
      "meals": {
        "breakfast": { "title": "Dish Name", "calories": 400, "prepTime": 10 },
        "lunch": { "title": "Dish Name", "calories": 650, "prepTime": 20 },
        "dinner": { "title": "Dish Name", "calories": 750, "prepTime": 30 },
        "snack": { "title": "Dish Name", "calories": 150, "prepTime": 5 }
      }
    }
  ]
}`;

    const userPrompt = `Create a 7-day meal plan for ${days} days with ~${targetCalories} kcal/day. Dietary: ${dietaryList || 'None'}. Style: ${preferences}`;

    const selectedModel = GROQ_CANDIDATE_MODELS[0] || 'qwen/qwen3.6-27b';
    const completion = await groq.chat.completions.create({
      model: selectedModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const parsed = extractJson(completion.choices[0]?.message?.content);
    res.status(200).json({
      success: true,
      mealPlan: parsed,
    });
  } catch (error) {
    console.error("Error in Meal Plan Generation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate meal plan: " + error.message,
    });
  }
};

exports.voiceNarrate = async (req, res) => {
  try {
    const { recipe, language = 'en', mode = 'full' } = req.body;

    if (!recipe || !recipe.title) {
      return res.status(400).json({ success: false, message: "Recipe data is required" });
    }

    const langName = LANGUAGE_NAMES[language] || 'English';
    const candidateModels = GROQ_CANDIDATE_MODELS;

    const systemPrompt = `You are Chef Savor, an enthusiastic Michelin-starred chef and voice sous-chef.
Your job is to generate a lively, conversational, audio-ready narration script for a culinary Text-to-Speech voice engine.
The requested language is: ${langName}.
CRITICAL LANGUAGE RULE: Write the entire response strictly and fluently in ${langName}!
- If Hindi, write in Devanagari script.
- If Kannada, write in Kannada script.
- If Telugu, write in Telugu script.
- If English, write in English.

Format the output strictly as JSON with this schema:
{
  "intro": "Warm spoken greeting and introduction to this dish (1-2 sentences)",
  "ingredientsOverview": "Spoken walk-through of the hero ingredients and measurements",
  "spokenSteps": [
    {
      "stepNumber": 1,
      "spokenText": "Clear, friendly spoken instruction for this step with timing and sensory cues"
    }
  ],
  "chefTip": "Spoken chef secret or finishing touch tip",
  "outro": "Spoken encouragement wishing happy cooking / bon appetit"
}`;

    const userPrompt = `Generate a voice narration script for:
Title: ${recipe.title}
Cuisine: ${recipe.cuisine || 'Gourmet'}
Prep Time: ${recipe.prepTime || 15} mins | Cook Time: ${recipe.cookTime || 20} mins
Ingredients: ${Array.isArray(recipe.ingredients) ? recipe.ingredients.map(i => typeof i === 'string' ? i : `${i.amount || ''} ${i.name || ''}`).join(', ') : ''}
Instructions: ${Array.isArray(recipe.instructions) ? recipe.instructions.map((s, idx) => `Step ${idx + 1}: ${typeof s === 'string' ? s : s.instruction || ''}`).join(' | ') : ''}
Chef Secret: ${recipe.chefSecret || 'Serve hot and fresh'}`;

    let narrationData = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const completion = await groq.chat.completions.create({
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.6,
          max_tokens: 2500,
        });

        const responseText = completion.choices[0]?.message?.content;
        if (responseText) {
          narrationData = extractJson(responseText);
          if (narrationData && (narrationData.intro || narrationData.spokenSteps)) {
            break;
          }
        }
      } catch (err) {
        lastError = err;
        console.warn(`Groq voice narration attempt with ${modelName} failed:`, err.message);
      }
    }

    if (!narrationData) {
      // Fallback structured narration if AI model fails
      narrationData = {
        intro: language === 'hi' ? `नमस्ते! आइए आज बनाते हैं स्वादिष्ट ${recipe.title}.` :
               language === 'kn' ? `ನಮಸ್ಕಾರ! ಬನ್ನಿ ಇವತ್ತು ರುಚಿಕರವಾದ ${recipe.title} ಮಾಡೋಣ.` :
               language === 'te' ? `నమస్కారం! రండి ఈ రోజు రుచికరమైన ${recipe.title} తయారు చేసుకుందాం.` :
               `Welcome Chef! Let's prepare a delicious ${recipe.title} together.`,
        ingredientsOverview: ``,
        spokenSteps: (recipe.instructions || []).map((s, idx) => ({
          stepNumber: idx + 1,
          spokenText: typeof s === 'string' ? s : s.instruction || ''
        })),
        chefTip: recipe.chefSecret || '',
        outro: language === 'hi' ? 'आनंद लीजिए अपने शानदार पकवान का!' :
               language === 'kn' ? 'ಸವಿಯಿರಿ ನಿಮ್ಮ ಅದ್ಭುತ ಅಡುಗೆಯನ್ನು!' :
               language === 'te' ? 'మీ రుచికరమైన వంటకాన్ని ఆస్వాదించండి!' :
               'Enjoy your culinary masterpiece!'
      };
    }

    res.status(200).json({
      success: true,
      narration: narrationData,
      language
    });
  } catch (error) {
    console.error("Error in Voice Narration:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate voice narration: " + error.message
    });
  }
};

exports.translateRecipe = async (req, res) => {
  try {
    const { recipe, targetLanguage = 'hi' } = req.body;

    if (!recipe || !recipe.title) {
      return res.status(400).json({ success: false, message: "Recipe data is required" });
    }

    if (targetLanguage === 'en') {
      return res.status(200).json({ success: true, translatedRecipe: recipe });
    }

    const langName = LANGUAGE_NAMES[targetLanguage] || 'Hindi';
    const candidateModels = GROQ_CANDIDATE_MODELS;

    const systemPrompt = `You are a culinary translator specializing in authentic Indian regional cooking terms.
Translate the provided recipe into ${langName}.
- Maintain the exact JSON structure.
- Translate dish names, descriptions, ingredient names, amounts, instruction steps, and chef tips accurately into ${langName} script.
- Return ONLY valid JSON.

JSON Structure:
{
  "title": "Translated Title",
  "description": "Translated Description",
  "cuisine": "${recipe.cuisine || ''}",
  "ingredients": [
    { "name": "Translated Name", "amount": "Translated Amount", "category": "Produce" }
  ],
  "instructions": [
    { "stepNumber": 1, "instruction": "Translated Step", "durationMinutes": 5, "chefTip": "Translated Tip" }
  ],
  "chefSecret": "Translated Secret"
}`;

    const userPrompt = JSON.stringify({
      title: recipe.title,
      description: recipe.description || '',
      cuisine: recipe.cuisine || '',
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      chefSecret: recipe.chefSecret || ''
    });

    let translatedData = null;

    for (const modelName of candidateModels) {
      try {
        const completion = await groq.chat.completions.create({
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 3000,
        });

        const responseText = completion.choices[0]?.message?.content;
        if (responseText) {
          translatedData = extractJson(responseText);
          if (translatedData && translatedData.title) break;
        }
      } catch (err) {
        console.warn(`Translation attempt with ${modelName} failed:`, err.message);
      }
    }

    if (!translatedData) {
      translatedData = recipe;
    } else {
      // Retain original media and IDs
      translatedData._id = recipe._id;
      translatedData.image = recipe.image;
      translatedData.rating = recipe.rating;
      translatedData.reviewsCount = recipe.reviewsCount;
      translatedData.prepTime = recipe.prepTime;
      translatedData.cookTime = recipe.cookTime;
      translatedData.servings = recipe.servings;
      translatedData.calories = recipe.calories;
      translatedData.difficulty = recipe.difficulty;
      translatedData.dietaryTags = recipe.dietaryTags;
    }

    res.status(200).json({
      success: true,
      translatedRecipe: translatedData,
      language: targetLanguage
    });
  } catch (error) {
    console.error("Error in Recipe Translation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to translate recipe: " + error.message
    });
  }
};

