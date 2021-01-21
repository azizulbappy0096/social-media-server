const postModel = require("../../models/Post");

// testing
let test = "test"
const posts = [
    {
        username: test,
        body: test,
        createdAt: test,
        comments: [
            {
                username: test,
                createdAt: test,
            }
        ],
        likes: [
            {
                username: test,
                createdAt: test,
            }
        ]
    },
    {
        username: test,
        body: test,
        createdAt: test,
        comments: [
            {
                username: test,
                createdAt: test,
            },
            {
                username: test,
                createdAt: test,
            },
            {
                username: test,
                createdAt: test,
            }
        ],
        likes: [
            {
                username: test,
                createdAt: test,
            }
        ]
    }
]

module.exports = {
    Query: {
        getPosts: async () => {
            try{
                const allPosts = await postModel.find({});
                return allPosts;
            }catch(error) {
                throw new Error(error)
            }
        }
    }
}