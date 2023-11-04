// document on ready
// /images/media/drink/vrwquq1478252802.jpg/preview (100x100 pixels OR 350x350 pixels) IMAGES FROM API

$(function() {
  var requestURL = 'https://thecocktaildb.com/api/json/v1/1/search.php?s=';
  var cocktailListEl = $('#cocktail-list');

  cocktailListEl.hide();

  $('#drinkSearchBtn').click(function(e) {
    e.preventDefault();

    loadCocktails();

    cocktailListEl.show();
    
  });

  async function loadCocktails() {
    var response = await fetch(requestURL);
    var jsonData = await response.json();
    console.log(jsonData);
    console.log(jsonData.drinks[0].strDrink);

    if (jsonData.drinks) {
      var drinks = jsonData.drinks;

      for (var i = 0; i < drinks.length; i++) {
          var drink = drinks[i];
          var drinkName = drink.strDrink;
          var drinkInstructions = drink.strInstructions;

          var li = $('<li>');
          li.text(drinkName);
          cocktailListEl.append(li);

          var p = $('<p>');
          p.text(drinkInstructions);
          cocktailListEl.append(p);
      }
  }

  }

  // loadCocktails();

});

function firstFetch(user) {
  var requestURL = 'https://api.github.com/users/' + user;
  var cocktailListEl = $('#cocktail-List');

  $.get(requestURL, function (data) {
    console.log(data);
    var image = data.avatar_url;
    var repoUrl = data.repos_url;

    var imgEl = $('<img>');

    imgEl.attr({
      alt: "avatar",
      src: image 
    });

    cocktailListEl.append(imgEl);

    reposFetch(repoUrl);
  });
}

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