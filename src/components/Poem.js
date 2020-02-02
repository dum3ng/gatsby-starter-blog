import React from 'react'

function Poem(props) {
  const { children } = props
  const style = { 'padding-left': '40px' }
  return <pre style={style}>{children}</pre>
}
export default Poem
