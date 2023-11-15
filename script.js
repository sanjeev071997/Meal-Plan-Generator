function generateMealPlan() {
  const numberOfMeals = document.getElementById("numberOfMeals").value;
  const dietPreference = document.getElementById("dietPreference").value;
  const healthSpecification = document.getElementById("healthSpecification").value;
  const calories = document.getElementById("calories").value;

  // Use the Edamam Nutrition’s recipe search API to retrieve recipe information
  const appId = "d14468b4";
  const appKey = "0cf5ef6d66095a1f4d49221d69306300";
  const apiEndpoint = "https://api.edamam.com/search";

  const params = {
    q: dietPreference,
    health: healthSpecification,
    calories: `${calories}-${parseInt(calories) + 1000}`, // A range of calories
    app_id: appId,
    app_key: appKey,
  };

  // Build the API request URL with parameters
  const apiUrl = `${apiEndpoint}?${new URLSearchParams(params)}`;

  // Make an AJAX request to the Edamam API
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => displayMealPlan(data, numberOfMeals))
    .catch((error) => alert ("Error: Current calorie count do not consider any of these factors:", error));
}

function displayMealPlan(data, numberOfMeals) {
  const mealPlanTableContainer = document.getElementById(
    "mealPlanTableContainer"
  );

  // Clear previous meal plan if any
  mealPlanTableContainer.innerHTML = "";

  // Create a table to display the meal plan
  const mealPlanTable = document.createElement("table");
  mealPlanTable.classList.add("meal-plan-table");

  // Create table headers (weekdays)
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const headerRow = mealPlanTable.insertRow();
  weekdays.forEach((weekday) => {
    const headerCell = headerRow.insertCell();
    headerCell.textContent = weekday;
  });

  // Create rows for each meal
  for (let i = 0; i < numberOfMeals; i++) {
    const mealRow = mealPlanTable.insertRow();

    // Use data from the API response to populate the meal details
    for (let j = 0; j < weekdays.length; j++) {
      const cell = mealRow.insertCell();
      const recipe = data.hits[i * weekdays.length + j].recipe;

      // Display recipe information in the cell
      cell.innerHTML = `
            <div class="card">
           <img src="${recipe.image}" alt="${recipe.label}" style="width:100%">
           <div class="container">
           <h4><b>${recipe.label}</b></h4>
           <h5><b>Meal-Type: ${recipe.mealType}</b></h4>
           <h6><b>Dish-Type: ${recipe.dishType}</b></h4>
           <p>${recipe.ingredientLines
            .map((ingredient) => `<li>${ingredient}</li>`)
            .join("")}</p>
           </div>
           </div>
                
            `;
    }
  }

  // Append the table to the container
  mealPlanTableContainer.appendChild(mealPlanTable);
}
