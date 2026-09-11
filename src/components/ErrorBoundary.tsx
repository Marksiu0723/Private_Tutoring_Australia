import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Application ErrorBoundary Caught]:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      window.location.reload();
    } catch {
      window.location.href = window.location.href;
    }
  };

  private handleReset = () => {
    try {
      sessionStorage.clear();
    } catch {}
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#171714] text-[#4A4A40] dark:text-[#EDEAE1] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full p-8 rounded-[28px] bg-[#F5F2ED] dark:bg-[#20201A] border border-[#E8E4D9] dark:border-[#313128] shadow-sm text-center space-y-6">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E8E4D9] dark:bg-[#2A2A22] border border-[#D1C9BC] dark:border-[#38382E] flex items-center justify-center text-[#5A5A40] dark:text-[#A3B18A]">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-[#2D2C27] dark:text-[#EDEAE1]">
                Shanon Lee Tutoring
              </h2>
              <p className="text-sm text-[#6B6658] dark:text-[#A6A295] leading-relaxed">
                The application encountered an unexpected state. You can reload or reset the view to continue exploring tutoring services.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#5A5A40] hover:bg-[#484833] text-[#FDFCF8] font-medium text-sm transition-all shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#E8E4D9] hover:bg-[#DCD7C9] dark:bg-[#2A2A22] dark:hover:bg-[#34342A] text-[#4A4A40] dark:text-[#EDEAE1] font-medium text-sm transition-all"
              >
                Reset Session
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
