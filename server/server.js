const axios = require("axios");
const cheerio = require("cheerio");

const loadHtml = async (url) => {
  try {
    //This is how to get the website:
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Recipe Name
    const recipeName = $("h1").text();

    // Prep Time, Cook Time, Additional Time, Total Duration

    let prepTime = "";
    const prepTimeScrape = $(".recipe-meta-item:contains('prep')");
    if (prepTimeScrape.length > 0) {
      prepTime = prepTimeScrape.text().split("\n")[2].trim();
    }

    let cookTime = "";
    const cookTimeScrape = $(".recipe-meta-item:contains('cook')");
    if (cookTimeScrape.length > 0) {
      cookTime = cookTimeScrape.text().split("\n")[2].trim();
    }

    let additionalTime = "";
    const additionalTimeScrape = $(".recipe-meta-item:contains('additional')");
    if (additionalTimeScrape.length > 0) {
      additionalTime = additionalTimeScrape.text().split("\n")[2].trim();
    }

    let totalTime = "";
    const totalTimeScrape = $(".recipe-meta-item:contains('total')");
    if (totalTimeScrape.length > 0) {
      totalTime = totalTimeScrape.text().split("\n")[2].trim();
    }

    // Serves how many
    const servings = $(".recipe-meta-item:contains('Servings')")
      .text()
      .split("\n")[1]
      .trim();

    // ingredients
    const ingredients = [];
    const ingredientsScrape = $(".ingredients-item-name");
    if (ingredientsScrape.length > 0) {
      ingredientsScrape.each(function (index, item) {
        ingredients.push($(this).text().trim());
      });
    }
    // instructions
    const instructions = [];
    const instructionsScrape = $(".paragraph");
    if (instructionsScrape.length > 0) {
      instructionsScrape.each(function (index, item) {
        instructions.push($(this).text().trim());
      });
    }

    console.log({
      url,
      recipeName,
      prepTime,
      cookTime,
      additionalTime,
      totalTime,
      servings,
      ingredients,
      instructions,
    });

    parseInstructions(ingredients, instructions);
  } catch (error) {
    console.error(error);
  }
};

const parseInstructions = (ingredientsArr, instructionsArr) => {
  for (let instruction of instructionsArr) {
    const splitInstructions = instruction.split(" ");
    for (let splitInstruction of splitInstructions) {
      for (let i = 0; i < ingredientsArr.length; i++) {
        if (
          ingredientsArr[i]
            .toLowerCase()
            .includes(splitInstruction.toLowerCase())
        ) {
          console.log({ index: i, splitInstruction });
        }
      }
    }
  }
};

// loadHtml("https://www.allrecipes.com/recipe/254740/vegetable-kottu-roti/");
// loadHtml("https://www.allrecipes.com/recipe/213688/sri-lanka-beef-curry/");
loadHtml("https://www.allrecipes.com/recipe/281702/butternut-squash-curry/");
