import React, { useState, useEffect } from "react";
import CocktailList from "./CocktailList";
import CocktailFilter from "./CocktailFilter";
import { applyFilters } from "../utilities/filter";
import LinearProgress from "@material-ui/core/LinearProgress";
import { connect } from "react-redux";

const CocktailBrowser = ({ filter, bar, allCocktails }) => {
  const [filteredCocktails, setFilteredCocktails] = useState(allCocktails);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    applyFilters(allCocktails, [
      filter.barOnly ? { rule: "makeableFrom", ingredients: bar } : null,
      filter
    ])
      .then(cocktails => {
        return cocktails.sort((a, b) => (a.name > b.name ? 1 : -1));
      })
      .then(cocktails => {
        // an artificial delay helps avoid animation janking
        // and provides a less jarring user experience.
        setTimeout(() => {
          setFilteredCocktails(cocktails);
          setLoading(false);
        }, 500);
      });
  }, [filter, bar, allCocktails]);

  return (
    <div>
      <CocktailFilter />
      {loading && <LinearProgress />}
      {!loading && <CocktailList cocktails={filteredCocktails} />}
    </div>
  );
};

const mapStateToProps = state => ({
  allCocktails: state.db.cocktails,
  bar: state.bar,
  filter: state.filter
});

export default connect(mapStateToProps)(CocktailBrowser);