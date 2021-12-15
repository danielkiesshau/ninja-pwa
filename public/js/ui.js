const recipes = document.querySelector('.recipes')

document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});

// render recipe data
const renderRecipe = (data, id) => {
  const html = `
    <div class="card-panel recipe white row" data-id="${id}">
      <img src="/img/dish.png">
      <div class="recipe-details">
        <div class="recipe-title">${data.title}</div>
        <div class="recipe-ingredients">${data.ingredients}</div>
      </div>
      <div class="recipe-delete">
        <i class="material-icons" data-id="${id}">delete</i>
      </div>
    </div>
  `;

  recipes.innerHTML += html;
}

// delete a recipe
const recipeContainer = document.querySelector('.recipes')

recipeContainer.addEventListener('click', event => {
  if(event.target.tagName === 'I') {
    const id = event.target.getAttribute('data-id');
    db.collection('recipes').doc(id).delete();
  }
})

// remove recipe from DOM
const removeRecipe = id => {
  const recipe = document.querySelector(`.recipe[data-id="${id}"]`);
  recipe.remove();
}