import React from 'react'

function Poem(props) {
  const { children } = props
  return <pre>{children}</pre>
}
export default Poem
