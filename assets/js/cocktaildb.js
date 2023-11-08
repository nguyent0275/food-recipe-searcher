// document on ready

$(function () {
  var requestURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=";
  var cocktailListEl = $("#cocktail-list");
  var pastCocktails = [];

  cocktailListEl.hide();

  $("#drinkSearchBtn").click(function (e) {
    e.preventDefault();

    loadCocktails();

    cocktailListEl.show();
  });

  async function loadCocktails() {
    var userData = $(".user-ingredient").val();
    console.log(userData);
    var response = await fetch(requestURL + userData);
    var jsonData = await response.json();
    console.log(jsonData);
    console.log(jsonData.drinks[0].strDrink);
    cocktailListEl.text("");

    if (jsonData.drinks) {
      var drinks = jsonData.drinks;

      for (var i = 0; i < 3; i++) {
        var drink = drinks[i];
        var drinkName = drink.strDrink;
        var drinkInstructions = drink.strInstructions;
        var drinkThumbnail = drink.strDrinkThumb;

        var li = $("<li>");
        li.addClass('drnkResults');
        var imgEl = $("<img>");
        imgEl.addClass('drnkImg');
        imgEl.attr({
          alt: "",
          src: drinkThumbnail,
        });

        li.append(imgEl);


        var drinkNameLink = $("<a>");
        drinkNameLink.addClass('drnkNm')
        drinkNameLink.attr(
          "href",
          "https://www.google.com/search?q=" +
            encodeURIComponent(drinkName + "cocktail recipe")
        );
        drinkNameLink.attr("target", "_blank");
        drinkNameLink.text(drinkName);
        li.append(drinkNameLink);
       

        var p = $("<p>");
        p.text(drinkInstructions);
        cocktailListEl.append(p);

        var saveButton = $('<button>');
        saveButton.text('Save');
        saveButton.addClass('drinkSave')
        saveButton.click({cocktail: drink}, function(event) {
          var cocktailToSave = event.data.cocktail;
          pastCocktails.push({
            name: cocktailToSave.strDrink,
            instructions: drinkInstructions,
            thumbnail: drinkThumbnail,
        });

        localStorage.setItem("#past-cocktails", JSON.stringify(pastCocktails));
        displayPastCocktails();
        });

        li.append(saveButton);
        cocktailListEl.append(li);
      }
    }
  }

  function displayPastCocktails() {
    var pastCocktailsContainer = $("#past-cocktails");
    pastCocktailsContainer.empty();

    for (var i = 0; i < 3; i++) {
      var pastCocktail = pastCocktails[i];

      var pastCocktailDiv = $("<div>");
      var pastCocktailName = $("<h2>");
      var googleSearchLink = $("<a>");
      googleSearchLink.attr(
        "href",
        "https://www.google.com/search?q=" +
          encodeURIComponent(pastCocktail.name + "cocktail recipe")
      );
      googleSearchLink.attr("target", "_blank");
      googleSearchLink.text(pastCocktail.name);
      pastCocktailName.append(googleSearchLink);
    

      var pastCocktailInstructions = $("<p>");
      pastCocktailInstructions.text(pastCocktail.instructions);

      pastCocktailDiv.append(pastCocktailName);
      pastCocktailDiv.append(pastCocktailInstructions);

      pastCocktailsContainer.append(pastCocktailDiv);
    }
  }
  var storedPastCocktails = localStorage.getItem("#past-cocktails");
  if (storedPastCocktails) {
    pastCocktails = JSON.parse(storedPastCocktails);
    displayPastCocktails();
  }

  $('#clearStorageBtn').click(function () {
    pastCocktails = [];
    localStorage.removeItem("#past-cocktails");
    displayPastCocktails();
  })

});

function reposFetch(url) {
  var cocktailListEl = $("#cocktail-list");

  $.get(url, function (data) {
    console.log(data);

    for (var i = 0; i < data.length; i++) {
      console.log(data[i].name);

      var name = data[i].name;

      var pEl = $("<p>");

      pEl.text(name);

      cocktailListEl.append(pEl);
    }
  });
}