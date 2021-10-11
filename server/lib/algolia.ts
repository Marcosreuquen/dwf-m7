// For the default version
import algoliasearch from "algoliasearch";

// For the search only version
//import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch(
  process.env.ALGOLIA_CLIENT,
  process.env.ALGOLIA_KEY
);
const pets_index_algolia = client.initIndex("pets");
const users_index_algolia = client.initIndex("users");

export { pets_index_algolia, users_index_algolia };
