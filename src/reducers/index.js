import uniq from "lodash/uniq";

const initialState = {
  db: {
    cocktails: [],
    ingredients: []
  },
  filterOptions: {
    ingredients: [],
    ingredientsRule: "mustInclude",
    barOnly: false,
    categories: [],
    glasses: []
  },
  bar: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "LOAD_COCKTAILS":
      return { ...state, db: { ...state.db, cocktails: action.payload } };

    case "LOAD_INGREDIENTS":
      return { ...state, db: { ...state.db, ingredients: action.payload } };

    case "UPDATE_FILTER":
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          ...action.payload
        }
      };
    case "SET_BAR":
      return { ...state, bar: [...action.payload] };
    case "ADD_TO_BAR":
      return { ...state, bar: uniq([...state.bar, action.payload]) };
    case "START_ENRICH_COCKTAIL":
      return {
        ...state,
        db: {
          ...state.db,
          cocktails: updateCocktailInDB(state.db.cocktails, action.payload, {
            enriching: true
          })
        }
      };

    case "FAIL_ENRICH_COCKTAIL":
      return {
        ...state,
        db: {
          ...state.db,
          cocktails: updateCocktailInDB(
            state.db.cocktails,
            action.payload.cocktailName,
            {
              enriching: false,
              enrichmentFailed: true,
              enrichmentFailedError: action.payload.error.message
            }
          )
        }
      };

    case "FINISH_ENRICH_COCKTAIL":
      return {
        ...state,
        db: {
          ...state.db,
          cocktails: updateCocktailInDB(
            state.db.cocktails,
            action.payload.cocktailName,
            {
              enriching: false,
              enriched: true,
              enrichment: action.payload.enrichment
            }
          )
        }
      };

    default:
      return state;
  }
}

// return a new cocktailDB with the named cocktail updated
function updateCocktailInDB(cocktailDb, cocktailName, newAttributes) {
  return cocktailDb.map(cocktail => {
    if (cocktail.name === cocktailName) {
      return { ...cocktail, ...newAttributes };
    }
    return cocktail;
  });
}
