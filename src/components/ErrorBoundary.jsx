import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="card bg-base-100 max-w-md space-y-4 p-8 text-center">
            <h2 className="text-center text-5xl font-bold tracking-tight uppercase">
              Something went wrong
            </h2>
            <p className="relative z-10 mx-auto max-w-2xl px-4 text-lg leading-relaxed text-black">
              Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-error btn-dash btn-lg uppercase"
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
