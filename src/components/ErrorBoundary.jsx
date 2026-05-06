import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Error caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="card bg-base-100 max-w-md space-y-4 p-8 text-center">
            <h2 className="text-5xl font-bold uppercase">
              Something went wrong
            </h2>

            <p className="text-sm wrap-break-word text-red-500">
              {this.state.error?.message}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="btn btn-error btn-lg uppercase"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
