import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface ToolExecutionOptions {
  tool: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useToolExecution({ tool, onSuccess, onError }: ToolExecutionOptions) {
  const [isExecuting, setIsExecuting] = useState(false);

  const execute = async (params: Record<string, any>) => {
    setIsExecuting(true);
    
    try {
      const response = await apiRequest('POST', `/api/tools/${tool}/execute`, params);
      const data = await response.json();
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
      
      throw error;
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    execute,
    isExecuting
  };
}
