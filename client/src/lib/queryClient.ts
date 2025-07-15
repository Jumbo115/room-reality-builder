import { QueryClient } from "@tanstack/react-query";

// Default fetcher function
const defaultQueryFn = async ({ queryKey }: { queryKey: (string | number)[] }) => {
  const response = await fetch(queryKey[0] as string);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

// Helper function for making API requests with mutations
export const apiRequest = async (
  url: string,
  options: {
    method?: "POST" | "PATCH" | "DELETE" | "PUT";
    body?: any;
    headers?: Record<string, string>;
  } = {}
) => {
  const { method = "POST", body, headers = {} } = options;
  
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};