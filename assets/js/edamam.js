// document on ready
$(function () {
  let recipeData = {};
  // loadRecipes calls 3 functions to get user inputs and fetch from api based on those inputs
  async function loadRecipes() {
    let healthRequirements = getHealthReqs(); // array of strings
    let searchQuery = getSearchQuery(); // string
    let results = await searchDatabase(searchQuery, healthRequirements); // Promise <json data from the page>
    return results;
  }

  // getting ingredients from user inputs to make a searchQuery
  function getSearchQuery() {
    // selecting the labels of elements with the class ingredient-item
    let searchWords = $(".ingredient-item > label");
    // turns searchWords into an array and then gets the innerText from each value and joins them together into a string
    let query = Array.from(searchWords)
      .map((e) => e.innerText)
      .join(" ");
    return query;
  }

  // getting health labels based on user inputs in checkboxes
  function getHealthReqs() {
    // on function call, variables will be stored with a value of true or false
    const vegetarian = $("#vegetarian").is(":checked");
    const vegan = $("#vegan").is(":checked");
    const dairyFree = $("#dairy-free").is(":checked");
    const glutenFree = $("#gluten-free").is(":checked");
    // if any checkboxes are checked, the string value will be added to the healthReqsArray's empty array
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
    return healthReqsArray;
  }

  // last function that runs the fetch and api search based on healthreqs and search query
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
      mealType: "Dinner",
      q: searchQuery,
    };
    // taking the object of searchParameters and convering them to URL format
    let urlSearchParams = new URLSearchParams(searchParameters);
    // if there are health requirements, add each one to the url's search parameters (health=vegetarian+health=vegan)
    if (healthRequirements.length !== 0) {
      for (let i = 0; i < healthRequirements.length; i++) {
        urlSearchParams.append("health", healthRequirements[i]);
      }
    }
    let requestURL = apiURL + urlSearchParams;
    let response = await fetch(requestURL);
    let jsonData = await response.json();
    console.log(requestURL);
    return jsonData;
  }
  // create modal for no user input
  let errorModal = $("#error-modal");
  let errorModalCloseBtn = $(".modal-close");
  function openModal() {
    errorModal.addClass("is-active");
    errorModalCloseBtn.on("click", function () {
      errorModal.removeClass("is-active");
    });
    $(document).on('keydown', (event) => {
      if (event.key === 'Escape'){
        errorModal.removeClass("is-active")
      }
    })
  }

  // create click function that creates <li> elements based on user ingredients
  let ingredientList = $("#ingredient-list");
  $("#add").on("click", renderIngredients);
  function renderIngredients(event) {
    event.preventDefault();
    let userIngredient = $("#user-ingredient")[0].value;
    let userIngredientEl = $("#user-ingredient")[0];
    if (userIngredient === "") {
      openModal()
      return;
    }
    //create
    let ingredientItem = $("<li>");
    let removeButton = $("<button>");
    let itemLabel = $("<label>");
    //attr
    ingredientItem.addClass("ingredient-item");
    removeButton.addClass("remove-btn");
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

  // create click function for search button that calls api and creates elements with the data
  let recipeContainer = $("#recipe-container");
  let savedRecipeDiv = $("#saved-recipe");
  $("#search").on("click", renderRecipes);
  async function renderRecipes() {
    // await makes sure that recipeData gets a value after loadRecipes fully runs and returns a value (prevents recipeData = promise)
    recipeData = await loadRecipes();
    // on multiple searches, the html will be cleared for new search
    recipeContainer.children(".recipe").remove();
    // createRecipeEl will be run 9 times in the recipeContainer <div> and create 9 save buttons(true)
    for (let i = 0; i < 9; i++) {
      createRecipeEl(recipeContainer, i, true);
    }
  }
  // create click function for save button that recreates the saved recipe under the saved recipe div
  $("#recipe-container").on("click", ".save-btn", function () {
    const value = $(this).attr("value");
    saveRecipe(value);
  });
  // this.attr(value) is passed to saveRecipe function and saved under saveRecipeItemPosition parameter (this is the value in save-btn html 0-8)
  let recipeLocalName = JSON.parse(localStorage.getItem("recipeName"));
  console.log(recipeLocalName);
  function saveRecipe(saveRecipeItemPosition) {
    console.log(saveRecipeItemPosition);
    // checking if all those fields return true (not undefined)
    if (
      recipeData &&
      recipeData.hits &&
      recipeData.hits[saveRecipeItemPosition] &&
      recipeData.hits[saveRecipeItemPosition].recipe
    ) {

      const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

    const savedRecipe = {
      name: recipeData.hits[saveRecipeItemPosition].recipe.label,
      image: recipeData.hits[saveRecipeItemPosition].recipe.images.SMALL.url,
      cookTime: recipeData.hits[saveRecipeItemPosition].recipe.totalTime,
      calories: recipeData.hits[saveRecipeItemPosition].recipe.calories,
      servingSize: recipeData.hits[saveRecipeItemPosition].recipe.yield,
      url: recipeData.hits[saveRecipeItemPosition].recipe.url,
    };
        // param 1 is the div where the createRecipeEl will be used, param2 is the value (which recipe will be saved), param 3 is deciding which button will be created(true = save recipe / false = delete)
        savedRecipes.push(savedRecipe);
        localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
        createRecipeEl(savedRecipeDiv, saveRecipeItemPosition, false);
  // }
    } else {
      console.error("Recipe data is missing or invalid.");
    }
  }
  // function for creating html elements based on api data (param 1 = where the function is being called, param 2 is how many times it is being called, param3 is the default boolean (it will create a button true=save-btn/false=delete-btn)
  function createRecipeEl(parentDiv, i, createButton) {
    if (recipeData && recipeData.hits && recipeData.hits.length > i) {
      let recipeAPIData = recipeData.hits[i].recipe;
      //create
      let recipeDivEl = $("<div>");
      let recipeImgEl = $("<img>");
      let recipeURL = $("<a>");
      let recipeNameEl = $("<h2>");
      let recipeInfoEl = $("<ul>");
      let cookTimeEl = $("<li>");
      let servingSizeEl = $("<li>");
      let caloriesEl = $("<li>");

      recipeDivEl.addClass("recipe");
      recipeURL.addClass("url");
      recipeImgEl.addClass("recipe-img");
      recipeNameEl.addClass("recipe-name");
      recipeInfoEl.addClass("recipe-info");
     
      {
        recipeImgEl.attr("src", recipeAPIData.image);
        recipeURL.attr("href", recipeAPIData.url || recipeAPIData.uri);
        recipeURL.text(recipeAPIData.name || recipeAPIData.label);
      }

      let cookTimeNumber = recipeAPIData.cookTime;
      console.log(recipeAPIData.totalTime);
      if (!recipeAPIData.cookTime && !recipeAPIData.totalTime) {
        cookTimeEl.text("Cook Time: N/A");
      } else if (recipeAPIData.cookTime){
        cookTimeEl.text("Cook Time: " + recipeAPIData.cookTime + " min");
      }

      else {cookTimeEl.text("Cook Time: " + recipeAPIData.totalTime + " min")}
       if (!recipeAPIData.servingSize && !recipeAPIData.yield) {
        servingSizeEl.text("Serving Size: N/A");

      } else if (recipeAPIData.servingSize) {
        servingSizeEl.text("Serving Size: " + recipeAPIData.servingSize);
      }
      else {servingSizeEl.text("Serving Size: " + recipeAPIData.yield)};
      if (recipeAPIData.calories) {
        caloriesEl.text("Calories: " + Math.round(recipeAPIData.calories));
      } else {
        caloriesEl.text("Calories: N/A");
      }

      
      //append
      recipeDivEl.append(recipeNameEl);
      recipeDivEl.append(recipeImgEl);
      recipeNameEl.append(recipeURL);
      recipeDivEl.append(recipeInfoEl);
      recipeInfoEl.append(cookTimeEl);
      recipeInfoEl.append(servingSizeEl);
      recipeInfoEl.append(caloriesEl);
      parentDiv.append(recipeDivEl);
      // if true it will create a save button, else it will create a remove button
      if (createButton) {
        let saveRecipeBtn = $("<button>");
        saveRecipeBtn.addClass("save-btn");
        saveRecipeBtn.attr({ value: i });
        saveRecipeBtn.text("Save");
        recipeDivEl.append(saveRecipeBtn);
      } else {
        let removeRecipeBtn = $("<button>");
        removeRecipeBtn.addClass("delete-btn");
        removeRecipeBtn.attr({ value: i });
        removeRecipeBtn.text("Delete");
        recipeDivEl.append(removeRecipeBtn);
        removeRecipeBtn.click(() => {
          const index = removeRecipeBtn.attr("value");
          deleteSavedRecipe(index);

          recipeDivEl.remove();
        });
      } 
    } else {
      console.error("Recipe data is missing or invalid.");
      console.log("recipeData:", recipeData);
      console.log("recipeData.hits:", recipeData && recipeData.hits);
    }
  }

  function loadSavedRecipes() {
  
  const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
  recipeData = {
    hits: savedRecipes.map(savedRecipe => ({ recipe: savedRecipe})),
  };
  for (let i = 0; i < savedRecipes.length; i++) {
    createRecipeEl(savedRecipeDiv, i, false);
  }
}

function deleteSavedRecipe(index) {
  const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
  if (index >= 0 && index < savedRecipes.length) {
    savedRecipes.splice(index, 1);
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
  }
}

$(document).ready(function() {
  loadSavedRecipes();
})

});
