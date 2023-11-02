// document on ready (add document on ready later / was not establishing variables correctly inside of it )
// $(function() {
// getting ingredients from html to make q=
async function searchQuery() {
  let searchWords = $(".ingredient-item > label");
  let searchQuery = Array.from(searchWords)
    .map((e) => e.innerText)
    .join(" ");
  searchParameters.q = searchQuery;
  return jsonData;
}

const vegetarian = $("#vegetarian");
const vegan = $("#vegan");
const dairyFree = $("#dairy-free");
const glutenFree = $("#gluten-free");

// var checkedValue = $('.health-options:checked')

$('.health-options').on("click", function(){
  let isChecked = $('.health-options:checked')
  console.log(isChecked.val())
  if (isChecked.val() === "on") {
    console.log(isChecked)
    // if value is checked or "on" / take text from html and stringify and join together for searchparam
  }
})


// last function that runs the fetch and api search
async function searchDatabase(searchQuery /*string*/, healthRequirements /* string[] */){
  let apiURL = "https://api.edamam.com/api/recipes/v2?";
  let searchParameters = {
    per_page: 1,
    type: "public",
    app_id: "47a9652c",
    app_key: "ff96e3cd2cbbce2cf5d87436ee7f0c2d",
    q: searchQuery,
    health: healthRequirements,
  };
  let requestURL = apiURL + new URLSearchParams(searchParameters);
  let response = await fetch(requestURL);
  let jsonData = await response.json();
  return jsonData;
}

// document on ready ending
// });

// https://realfood.tesco.com/what-can-i-make-with.html
// good reference for a recipe searcher application
// has searchbox that autocompletes and tracks ingredients in a list
// filters recipe by most ingredients that you have
// checks for special diets (vegetarian, vegan, dairyfree, gluten free)

// need a function that creates a li and takes the ingredients.value to create/append to the ulIngredients
let ingredientList = $("#ingredient-list");
// console.log(userIngredient)
$("#add").on("click", renderIngredients);
function renderIngredients(event) {
  event.preventDefault();
  let userIngredient = $("#user-ingredient")[0].value;
  let userIngredientEl = $("#user-ingredient")[0];
  //create
  let ingredientItem = $("<li>");
  let removeButton = $('<button>')
  let itemLabel = $('<label>')
  ingredientItem.addClass("ingredient-item");
  removeButton.addClass("remove")
  itemLabel.text(userIngredient)
  removeButton.text("X")
  removeButton.click(() =>{
    ingredientItem.remove()
  } )
  //attr
  //append
  ingredientList.append(ingredientItem);
  ingredientItem.append(itemLabel)
  ingredientItem.append(removeButton)
  // clearing textfield
  userIngredientEl.value = "";
}
// need a function that applies a filter on the search based on pre-existing criterias (append the function as a button to said crtierias)
// search via healthLabels and return recipes that match

// need a forloop that creates <div>, <a>, <p> or <lis>, <ul> with <li> appended to the <ul>
// <div> is the container for each recipe
// <a> is the name of the recipe with a link to the website / use css to give it bigger font size
// <p> or <lis> is the ingredients
// <ul> and <li> is the additional info about dish (cooktime, serving size, and fiters)
let recipeContainer = $("#recipe-container");
$("#submit").on("click", renderRecipes);
async function renderRecipes() {
  let recipeData = await loadRecipes()
  let numOfRecipeEl = $('#recipe-num')
  numOfRecipeEl.text(recipeData.count + " Recipes Available")
  // console.log(requestURL)
  for (let i = 0; i < 9; i++) {
    //create
    let recipeDivEl = $("<div>");
    let recipeImgEl = $('<img>')
    let recipeURL = $("<a>");
    let recipeNameEl = $("<h2>");
    let recipeInfoEl = $("<ul>")
    let cookTimeEl = $('<li>')
    let servingSizeEl = $('<li>')
    let caloriesEl = $('<li>')
    let cookTimeNumber = recipeData.hits[i].recipe.totalTime
    //attr
    recipeDivEl.addClass("recipes");
    recipeURL.addClass("url");
    recipeImgEl.addClass('recipe-img')
    recipeNameEl.addClass('recipe-name')
    recipeInfoEl.addClass('recipe-info')
    recipeImgEl.attr("src", recipeData.hits[i].recipe.images.SMALL.url)
    recipeURL.attr("href", recipeData.hits[i].recipe.url)
    recipeURL.text(recipeData.hits[i].recipe.label);
    if (cookTimeNumber == 0) {
      cookTimeEl.text("Cook Time: N/A")
    }else{
      cookTimeEl.text("Cook Time: " + cookTimeNumber + " min")
    }
    servingSizeEl.text("Serving Size: " + recipeData.hits[i].recipe.yield)
    caloriesEl.text("Calories: " + Math.round(recipeData.hits[i].recipe.calories))
    
    //append
    recipeContainer.append(recipeDivEl);
    recipeDivEl.append(recipeNameEl);
    recipeDivEl.append(recipeImgEl)
    recipeNameEl.append(recipeURL);
    recipeDivEl.append(recipeInfoEl)
    recipeInfoEl.append(cookTimeEl)
    recipeInfoEl.append(servingSizeEl)
    recipeInfoEl.append(caloriesEl)
  }
}

// need a forloop for that pulls 3 random recipe from api library and display and link them
// grabs the images, url links, and names from the library and appends them to page

// EDAMAM API important object and key:value returns
// hits = different recipes (20 per page request)
//  recipe = name of recipe
// images > thumbnail/small/regular
// source = name of website that the recipe is located
// url = url of website that the recipe is located
// ingredientLines = list of ingredients
// healthLabels = allergen + health concerns (dairyfree/peanutfree)
// calories = amount of calories
// totalTime = cooking time (minutes)
// cuisineType = ethnic background of dish
// mealType = breakfast/lunch/dinner
// dishType = starters/maincourse/sauce or condiments
// yield = servings