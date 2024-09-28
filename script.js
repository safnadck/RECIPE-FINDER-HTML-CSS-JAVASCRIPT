const apikey = "0436ecc3ee6f46a19e19e028cbe26775";
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultContainer = document.getElementById("results");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (query !== "") {
        fetchRecipes(query);
    }
});

function fetchRecipes(query) {
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apikey}&query=${query}&number=10`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            displayRecipes(data.results);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function displayRecipes(recipes) {

    let output = "";

    recipes.forEach((recipe) => {
        const recipeCard = `
        <div class="col-md-4 mb-4>">
            <div class="card">
                <img src="${recipe.image}" class="card-img-top" alt="Recipe Image">
                <div class="card-body">
                    <h5 class="card-title">${recipe.title}</h5>
                    <button class="btn btn-primary view-recipe-btn"
                        data-id="${recipe.id}" data-bs-toggle="modal"
                        data-target="#recipeModal">View Recipe</button>
                </div>
            </div>
        </div>`;
        output += recipeCard;
    });

    resultContainer.innerHTML = output;

    const viewRecipeButtons = document.querySelectorAll(".view-recipe-btn");
    viewRecipeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const recipeId = button.dataset.id;
            fetchRecipeDetails(recipeId);
        });
    });
}

function fetchRecipeDetails(recipeId) {

    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apikey}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            displayRecipeDetails(data);
        })
        .catch((error) => {
            console.error("Error fetching recipe details:", error);
        });
}

function displayRecipeDetails(recipe) {
    const recipeModalBody = document.getElementById("recipeModalBody");

    // Recipe details with ingredients
    const recipeDetails = `
    <h3>${recipe.title}</h3>
    <img src="${recipe.image}" alt="Recipe Image" class="img-fluid mb-3">
    <h5>Ingredients:</h5>
    <ul>${recipe.extendedIngredients.map((ingredient)=> `<li>${ingredient.original}</li>`)
        .join("")}
        </ul>
    <h5>Instructions:</h5>
    <p>${recipe.instructions || "Instructions not available."}</p>`;

    recipeModalBody.innerHTML = recipeDetails;
}
