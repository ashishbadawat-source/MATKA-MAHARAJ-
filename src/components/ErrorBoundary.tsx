import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('matka_maharaj_markets_v2');
      localStorage.removeItem('matka_maharaj_profile_v2');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-600/40 rounded-2xl p-6 max-w-md w-full text-center shadow-2xl space-y-4">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-amber-300">पेज लोड करने में रुकावट आई</h2>
            <p className="text-sm text-stone-400">
              चिंता न करें, आप नीचे दिए गए बटन से डेटा रीफ्रेश करके ऐप को तुरंत सामान्य स्थिति में ला सकते हैं।
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-stone-950 font-black px-5 py-2.5 rounded-xl hover:brightness-110 transition shadow-lg cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              ऐप पुनः लोड करें (Reload App)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
