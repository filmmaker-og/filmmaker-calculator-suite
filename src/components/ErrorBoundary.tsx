import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-void flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="font-bebas text-3xl text-gold mb-4">
              SOMETHING WENT WRONG
            </h1>
            <p className="text-text-mid text-sm mb-6">
              An unexpected error occurred. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="h-12 px-8 rounded-md font-bold tracking-[0.12em] uppercase bg-gold/[0.22] border-2 border-gold/60 text-gold text-sm hover:border-gold/80 hover:bg-gold/[0.28] transition-all active:scale-[0.96]"
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
