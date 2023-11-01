// document on ready
// /images/media/drink/vrwquq1478252802.jpg/preview (100x100 pixels OR 350x350 pixels) IMAGES FROM API
$(function() {
    var requestURL = 'https://thecocktaildb.com/api/json/v1/1/search.php?s=margarita';
    var imageURL =  '/images/media/drink/vrwquq1478252802.jpg/preview (350x350 pixels)'
    var mainEl = 
    
    async function loadCocktails() {
        var response = await fetch(requestURL);
        var jsonData = await response.json();
        console.log(Object.keys(jsonData))
        console.log(jsonData.hits[0].recipe.label);
    }
});

function firstFetch(user) {
    $.get(requestURL + user, function (data) {
      console.log(data);
      var image = data.imageURL;
      var repoUrl = data.repos_url;
  
      var imgEl = $('<img>');
  
      imgEl.attr({
        alt: "avatar",
        src: image
      });
  
      mainEl.append(imgEl);
  
      reposFetch(repoUrl);
    });
  }
  
  function reposFetch(url) {
    $.get(url, function (data) {
      console.log(data); // repo data
  
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].name);
  
        var name = data[i].name;
  
        var pEl = $('<p>');
  
        pEl.text(name);
  
        mainEl.append(pEl);
      }
    });
  }
  
  var requestURL = 'https://thecocktaildb.com/api/json/v1/1/search.php?s=margarita';
  var userName = 'exampleUser';
  var cocktailList = $('#cocktail-list'); // You should replace this with the actual element you want to append to
  
  firstFetch(userName);


// EDAMAM API important object and key:value returns 
// hits[0-19] = different recipes (20 per page request)
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

// https://realfood.tesco.com/what-can-i-make-with.html
// good reference for a recipe searcher application 
// has searchbox that autocompletes and tracks ingredients in a list
// filters recipe by most ingredients that you have 
// checks for special diets (vegetarian, vegan, dairyfree, gluten free)

// let ingredients = $("input-text")
// let ingredientsContainer = $("divIngredientContainer")
// let ingredientsList = $(ulIngredients)

// need a function that creates a li and takes the ingredients.value to create/append to the ulIngredients

// need an async function that takes ingredients.value and stringconcat with "+" in between each value and add it to url after "q=". Then make the fetch off that concatination. 

// $(function() {
//     let requestURL = 'https://api.edamam.com/api/recipes/v2?per_page=1&type=public&q={ingredients.value}+{ingrdients.value}&app_id=47a9652c&app_key=ff96e3cd2cbbce2cf5d87436ee7f0c2d';
// let ingredientsURL = $("ingredientsList").children().value.JSONstringify().

//     async function loadRecipes() {
//         let response = await fetch(requestURL);
//         let jsonData = await response.json();
//         console.log(Object.keys(jsonData))
//         console.log(jsonData.hits[0].recipe.label);
//     }
// });

// need a function that applies a filter on the search based on pre-existing criterias (append the function as a button to said crtierias)
// search via healthLabels and return recipes that match

// need a forloop that creates <div>, <a>, <p> or <lis>, <ul> with <li> appended to the <ul>
// <div> is the container for each recipe
// <a> is the name of the recipe with a link to the website / use css to give it bigger font size
// <p> or <lis> is the ingredients
// <ul> and <li> is the additional info about dish (cooktime, serving size, and fiters)

// need a forloop for that pulls 3 random recipe from api library and display and link them
// grabs the images, url links, and names from the library and appends them to page

// let unorderedList = $('ul')
// let ingredientsURL = unorderedList.children()
// console.log(ingredientsURL)
// console.log(typeof ingredientsURL)