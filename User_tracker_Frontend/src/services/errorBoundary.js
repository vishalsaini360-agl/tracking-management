import React from "react";
import ErrorPage from "./error";
import { BASE_URL } from "../utils/url";
import { _POST } from "./axios.method";

export default class StandardErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        // to keep track of when an error occurs
        // and the error itself
        this.state = {
            hasError: false,
            error: undefined
        };
    }

    // update the component state when an error occurs
    static getDerivedStateFromError(error) {
        // console.log(error, "errrrorr")
        // specify that the error boundary has caught an error
        return {
            hasError: true,
            error: error
        };
       
    }

    // defines what to do when an error gets caught
   async componentDidCatch(error, errorInfo) {
        // log the error
        const errorName = error.message;
        const type = error.name;
        const info = errorInfo
        await _POST(BASE_URL + "logError", {errorName, type, info});     
        this.setState({hasError: true , error: error })

        // record the error in an APM tool...
    }

    render() {
        // if an error occurred
        if (this.state.hasError) {
            return <ErrorPage />;
        } else {
            // default behavior
            // eslint-disable-next-line react/prop-types
            return this.props.children;
        }
    }
}