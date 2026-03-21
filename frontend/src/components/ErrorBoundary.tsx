import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Map Loading Error</AlertTitle>
          <AlertDescription>
            There was an error loading the map. This could be due to:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Invalid or missing Google Maps API key</li>
              <li>API key missing required permissions</li>
              <li>Internet connectivity issues</li>
            </ul>
            <div className="mt-3 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Refresh Page
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
                className="mt-2"
              >
                Check API Console
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
} 