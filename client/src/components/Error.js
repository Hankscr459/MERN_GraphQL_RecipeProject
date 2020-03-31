import React from 'react'

const Error = ({ error }) => <p>{error.message.substring(15,100)}</p>


export default Error
