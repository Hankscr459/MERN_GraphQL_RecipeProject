exports.resolvers = {
    Query: {
        getAllRecipes: async (root, args, { Recipe }) => {
            const getAllRecipes = await Recipe.find()
            return getAllRecipes
        }
    },
    Mutation: {
        addRecipe: async(root, { name, description, category,
        instructions, username }, { Recipe }) => {
            const newRecipe = await new Recipe({
                name,
                description,
                category,
                instructions,
                username
            }).save()
            return newRecipe
        }
    }
}