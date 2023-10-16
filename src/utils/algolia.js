import algoliasearch from "algoliasearch";

const client = algoliasearch("2HN874FJ0C", "58e052366c4b31b93dbf43cae40dbaed")

const algolia = client.initIndex("SocialWeb")

export default algolia;