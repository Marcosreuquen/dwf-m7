// For the default version
import algoliasearch from "algoliasearch";

// For the search only version
//import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch(
  process.env.ALGOLIA_CLIENT,
  process.env.ALGOLIA_KEY
);
const pets_index_algolia = client.initIndex("pets");

export const algoliaController = {
  async createPet(petCreated) {
    return await pets_index_algolia.saveObject({
      objectID: petCreated.get("id"),
      name: petCreated.get("name"),
      imgURL: petCreated.get("imgURL"),
      _geoloc: {
        lat: petCreated.get("lat"),
        lng: petCreated.get("lng"),
      },
    });
  },
  async updatePet(petUpdated) {
    return await pets_index_algolia.partialUpdateObject({
      objectID: petUpdated.get("id"),
      name: petUpdated.get("name"),
      imgURL: petUpdated.get("imgURL"),
      _geoloc: {
        lat: petUpdated.get("lat"),
        lng: petUpdated.get("lng"),
      },
    });
  },
  async search(lat, lng) {
    const { hits } = await pets_index_algolia.search("", {
      aroundLatLng: `${lat},${lng}`,
    });
    return hits;
  },
  async deletePet(id) {
    return await pets_index_algolia.deleteObject(`${id}`);
  },
};
