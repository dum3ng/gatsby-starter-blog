const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  return graphql(
    `
      {
        allMdx(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fileAbsolutePath
              fields {
                slug
              }
              frontmatter {
                title
                draft
              }
              parent {
                ... on File {
                  sourceInstanceName
                }
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges
      .filter(e => !e.node.frontmatter.draft)
      .filter(e => {
        return e.node.parent.sourceInstanceName === 'blog'
        // const rel = path.relative(
        //   path.resolve(__dirname, 'content'),
        //   e.node.fileAbsolutePath
        // )
        // return rekkl.startsWith('blog')
      })

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node
      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if ([`MarkdownRemark`, `Mdx`].includes(node.internal.type)) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
  })
}
