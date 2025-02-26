import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
  requiredItems?: requiredItem[];
  cookTime?: number;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

interface recipeSummary {
  name: string;
  cooktime: number;
  ingredients: recipeSummaryIngredients[];
  recipes: cookbookEntry[];
}

interface recipeSummaryIngredients {
  name: string;
  quantity: number;
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: cookbookEntry[] = [];

// Task 1 helper (don't touch)
app.post("/parse", (req: Request, res: Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input);
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  }
  res.json({ msg: parsed_string });
  return;
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that
const parse_handwriting = (recipeName: string): string | null => {
  // TODO: implement me
  if (recipeName.length <= 0) {
    return null;
  }

  // replace undescore and hyphens to whitspace
  recipeName = recipeName.replace(/[-_]/g, " ");

  // Only alphabet and whitespace allowed in the name, otherwise delete
  recipeName = recipeName.replace(/[^a-zA-Z ]/g, "");
  const str = recipeName.split(" ").map((word) => {
    word = word.toLowerCase();
    word = word.charAt(0).toUpperCase() + word.slice(1);
    return word;
  });

  recipeName = str.join(" ");
  return recipeName;
};

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req: Request, res: Response) => {
  try {
    storeEntry(req.body);
    res.json({});
  } catch (error) {
    res.status(400).send(error);
  }
});

const storeEntry = (entry: cookbookEntry) => {
  if (entry.type !== "recipe" && entry.type !== "ingredient") {
    throw new Error("This type is not existed in cookbook");
  }

  if (
    cookbook.length != 0 &&
    cookbook.find((item) => item.name === entry.name) !== undefined
  ) {
    throw new Error("Name is not unique");
  }

  if (entry.type === "ingredient" && (!entry.cookTime || entry.cookTime < 0)) {
    throw new Error("Cooktime is not valid");
  }

  if (entry.type === "recipe") {
    if (!entry.requiredItems) {
      throw new Error("Required items is not valid");
    }

    const requiredItemName: string[] = [];
    const duplicates: string[] = [];
    entry.requiredItems.forEach((item) => {
      if (item.name in requiredItemName) {
        duplicates.push(item.name);
      } else {
        requiredItemName.push(item.name);
      }
    });

    if (duplicates.length > 0) {
      throw new Error("Required items is not valid");
    }
  }

  cookbook.push(entry);
  return { status: 200, msg: "Success" };
};

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req: Request, res: Request) => {
  // TODO: implement me
  try {
    res.json(getRecipeDetails(req.query.name));
  } catch (error) {
    res.status(400).send(error);
  }
});

const getRecipeDetails = (recipeName: string) => {
  const recipe = cookbook.find((item) => item.name === recipeName);
  if (recipe === undefined || recipe.type !== "recipe") {
    throw new Error("This recipe is invalid");
  }

  let recipeDetails = {
    name: recipeName,
    cooktime: 0,
    ingredients: [],
    recipes: [],
  };

  recipe.requiredItems.forEach((item) => {
    findIngredient(recipeDetails, item);
  });

  while (recipeDetails.recipes.length > 0) {
    recipeDetails.recipes.forEach((item) => {
      findIngredient(recipeDetails, item);
    });
  }

  recipeDetails.recipes = null;
  return recipeDetails;
};

const findIngredient = (recipeDetails: recipeSummary, item: requiredItem) => {
  const foundItem = cookbook.find((el) => el.name === item.name);
  if (foundItem.type === "ingredient") {
    recipeDetails.cooktime += foundItem.cookTime;
    const ingredient = recipeDetails.ingredients.find(
      (ing) => ing.name === foundItem.name
    );
    if (ingredient !== undefined) {
      ingredient.quantity += item.quantity;
    } else {
      recipeDetails.ingredients.push({
        name: foundItem.name,
        quantity: item.quantity,
      });
    }
  } else {
    recipeDetails.recipes.push(foundItem);
  }
};
// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
