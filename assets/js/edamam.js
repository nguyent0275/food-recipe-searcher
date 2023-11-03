async function loadRecipes() {
  let healthRequirements = getHealthReqs(); // string[]
  let searchQuery = getSearchQuery(); // string
  console.log(healthRequirements);
  let results = await searchDatabase(searchQuery, healthRequirements); // Promise<json data from the page>
  return results;
}

// getting ingredients from html to make q=
function getSearchQuery() {
  let searchWords = $(".ingredient-item > label");
  let query = Array.from(searchWords)
    .map((e) => e.innerText)
    .join(" ");
  return query;
}

// need a function that applies a filter on the search based on pre-existing criterias (append the function as a button to said crtierias)
// search via healthLabels and return recipes that match

function getHealthReqs() {
  // on function call, variables will be stored with a value of true or false
  const vegetarian = $("#vegetarian").is(":checked");
  const vegan = $("#vegan").is(":checked");
  const dairyFree = $("#dairy-free").is(":checked");
  const glutenFree = $("#gluten-free").is(":checked");
  let healthReqsArray = [];
  if (vegetarian) {
    healthReqsArray.push("vegetarian");
  }
  if (vegan) {
    healthReqsArray.push("vegan");
  }
  if (dairyFree) {
    healthReqsArray.push("dairy-free");
  }
  if (glutenFree) {
    healthReqsArray.push("gluten-free");
  }
  console.log(healthReqsArray);
  return healthReqsArray;
}

// last function that runs the fetch and api search
async function searchDatabase(
  searchQuery /*string*/,
  healthRequirements /* string[] */
) {
  let apiURL = "https://api.edamam.com/api/recipes/v2?";
  let searchParameters = {
    per_page: 1,
    type: "public",
    app_id: "47a9652c",
    app_key: "ff96e3cd2cbbce2cf5d87436ee7f0c2d",
    q: searchQuery,
  };
  let urlSearchParams = new URLSearchParams(searchParameters)
  if (healthRequirements.length !== 0) {
    for (let i = 0; i < healthRequirements.length; i++) {
      urlSearchParams.append("health", healthRequirements[i])
    }
  }
  let requestURL = apiURL + urlSearchParams;
  let response = await fetch(requestURL);
  let jsonData = await response.json();
  console.log(requestURL)
  return jsonData;
}

// need a function that creates a li and takes the ingredients.value to create/append to the ulIngredients
let ingredientList = $("#ingredient-list");
$("#add").on("click", renderIngredients);
function renderIngredients(event) {
  event.preventDefault();
  let userIngredient = $("#user-ingredient")[0].value;
  let userIngredientEl = $("#user-ingredient")[0];
  //create
  let ingredientItem = $("<li>");
  let removeButton = $("<button>");
  let itemLabel = $("<label>");
  //attr
  ingredientItem.addClass("ingredient-item");
  removeButton.addClass("remove");
  itemLabel.text(userIngredient);
  removeButton.text("X");
  removeButton.click(() => {
    ingredientItem.remove();
  });
  //append
  ingredientList.append(ingredientItem);
  ingredientItem.append(itemLabel);
  ingredientItem.append(removeButton);
  // clearing textfield
  userIngredientEl.value = "";
}

// need a forloop that creates <div>, <a>, <p> or <lis>, <ul> with <li> appended to the <ul>
// <div> is the container for each recipe
// <a> is the name of the recipe with a link to the website / use css to give it bigger font size
// <p> or <lis> is the ingredients
// <ul> and <li> is the additional info about dish (cooktime, serving size, and fiters)
let recipeContainer = $("#recipe-container");
$("#submit").on("click", renderRecipes);
async function renderRecipes() {
  let recipeData = await loadRecipes();
  let numOfRecipeEl = $("#recipe-num");
  numOfRecipeEl.text(recipeData.count + " Recipes Available");
  if (recipeData.count === 0){
    numOfRecipeEl.text("No Recipes Found")
  }
  for (let i = 0; i < 9; i++) {
    //create
    let recipeDivEl = $("<div>");
    let recipeImgEl = $("<img>");
    let recipeURL = $("<a>");
    let recipeNameEl = $("<h2>");
    let recipeInfoEl = $("<ul>");
    let cookTimeEl = $("<li>");
    let servingSizeEl = $("<li>");
    let caloriesEl = $("<li>");
    let recipeAPIData = recipeData.hits[i].recipe;
    let cookTimeNumber = recipeAPIData.totalTime;
    //attr
    recipeDivEl.addClass("recipe");
    recipeURL.addClass("url");
    recipeImgEl.addClass("recipe-img");
    recipeNameEl.addClass("recipe-name");
    recipeInfoEl.addClass("recipe-info");
    recipeImgEl.attr("src", recipeAPIData.images.SMALL.url);
    recipeURL.attr("href", recipeAPIData.url);
    recipeURL.text(recipeAPIData.label);
    if (cookTimeNumber == 0) {
      cookTimeEl.text("Cook Time: N/A");
    } else {
      cookTimeEl.text("Cook Time: " + cookTimeNumber + " min");
    }
    servingSizeEl.text("Serving Size: " + recipeAPIData.yield);
    caloriesEl.text("Calories: " + Math.round(recipeAPIData.calories));

    //append
    // recipeContainer.append(recipeDivEl);
    recipeDivEl.append(recipeNameEl);
    recipeDivEl.append(recipeImgEl);
    recipeNameEl.append(recipeURL);
    recipeDivEl.append(recipeInfoEl);
    recipeInfoEl.append(cookTimeEl);
    recipeInfoEl.append(servingSizeEl);
    recipeInfoEl.append(caloriesEl);
    recipeContainer.append(recipeDivEl);
  }
}
