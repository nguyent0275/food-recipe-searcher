// document on ready

$(function() {
  var requestURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
  var cocktailListEl = $('#cocktail-list');
  var pastCocktails = [];

  cocktailListEl.hide();

  $('#drinkSearchBtn').click(function(e) {
    e.preventDefault();

    loadCocktails();

    cocktailListEl.show();
    
  });

  async function loadCocktails() {
    var userData = $('.user-ingredient').val()
    console.log (userData)
    var response = await fetch(requestURL + userData);
    var jsonData = await response.json();
    console.log(jsonData);
    console.log(jsonData.drinks[0].strDrink);
    cocktailListEl.text("")
    
    if (jsonData.drinks) {
      var drinks = jsonData.drinks;

      for (var i = 0; i < 3; i++) {
          var drink = drinks[i];
          var drinkName = drink.strDrink;
          var drinkInstructions = drink.strInstructions;
          var drinkThumbnail = drink.strDrinkThumb;

          var li = $('<li>');
          var imgEl = $('<img>');
          imgEl.attr({
            alt: "",
            src: drinkThumbnail
          })

          
          li.append(imgEl);
          li.append(drinkName);
          cocktailListEl.append(li);

          var p = $('<p>');
          p.text(drinkInstructions);
          cocktailListEl.append(p);

          pastCocktails.push({
            name: drinkName,
            instructions: drinkInstructions,
            thumbnail: drinkThumbnail
          });
      }
  }

    displayPastCocktails();
  }

  function displayPastCocktails() {
    var pastCocktailsContainer = $('#past-cocktails');
    pastCocktailsContainer.empty();

    for (var i = 0; i < pastCocktailsContainer.length; i++) {
      var pastCocktail = pastCocktails[i];

      var pastCocktailDiv = $('<div>');
      var pastCocktailName = $('<h2>');
      pastCocktailName.text(pastCocktail.name);

      var pastCocktailThumbnail = $('<img>');
      pastCocktailThumbnail.attr({
        alt: "",
        src: pastCocktail.thumbnail
      });
      
      var pastCocktailInstructions = $('<p>');
      pastCocktailInstructions.text(pastCocktail.instructions);

      pastCocktailDiv.append(pastCocktailName);
      pastCocktailDiv.append(pastCocktailThumbnail);
      pastCocktailDiv.append(pastCocktailInstructions);

      pastCocktailsContainer.append(pastCocktailDiv);
    }
  }
});

function reposFetch(url) {
  var cocktailListEl = $('#cocktail-list');

  $.get(url, function (data) {
    console.log(data);

    for (var i = 0; i < data.length; i++) {
      console.log(data[i].name);

      var name = data[i].name;

      var pEl = $('<p>');

      pEl.text(name);

      cocktailListEl.append(pEl);
    }

  });
}

var userName = '';

 reposFetchFetch(userName);