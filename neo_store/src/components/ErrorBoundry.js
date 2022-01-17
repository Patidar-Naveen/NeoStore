import React, { Component } from 'react'

class ErrorBoundary extends Component {
   constructor(props){
       super(props)

       this.state={
           hasError:false
       }
   }

   static getDerivedStateFromError(error){
       return{
           hasError: true
       }
   }
    render() {
        if(this.state.hasError){
            return  <img src="../images/errorboundry.gif" className="images" alt="..."
            width="100%" height='700px'></img>
        }
        return this.props.children
    }
}
export default ErrorBoundary