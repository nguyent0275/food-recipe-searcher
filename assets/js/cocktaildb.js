// document on ready

$(function() {
  var requestURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
  var cocktailListEl = $('#cocktail-list');

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

          var li = $('<li>');
          var imgEl = $('<img>');
          imgEl.attr({
            alt: "",
            src: drink.strDrinkThumb
          })

          
          li.append(imgEl);

          li.append(drinkName);
          cocktailListEl.append(li);

          var p = $('<p>');
          p.text(drinkInstructions);
          cocktailListEl.append(p);
      }
  }

  }

  // loadCocktails();

});

// function firstFetch(user) {
//   var requestURL = 'https://api.github.com/users/' + user;
//   var cocktailListEl = $('#cocktail-List');

//   $.get(requestURL, function (data) {
//     console.log(data);
//     var image = data.avatar_url;
//     var repoUrl = data.repos_url;

//     var imgEl = $('<img>');

//     imgEl.attr({
//       alt: "avatar",
//       src: image 
//     });

//     cocktailListEl.append(imgEl);

//     reposFetch(repoUrl);
//   });
// }

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