// Centralized API client that avoids FullStory fetch interference

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export async function apiRequest(
  url: string,
  options: ApiRequestOptions = {},
): Promise<Response> {
  const { method = "GET", headers = {}, body, timeout = 30000 } = options;

  let response: Response;

  // Use XMLHttpRequest first to avoid FullStory interference
  try {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.withCredentials = true;

    // Set headers
    xhr.setRequestHeader("Content-Type", "application/json");
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    response = await new Promise<Response>((resolve, reject) => {
      xhr.onload = () => {
        const responseText = xhr.responseText;
        resolve({
          ok: xhr.status >= 200 && xhr.status < 300,
          status: xhr.status,
          statusText: xhr.statusText,
          json: () => {
            try {
              return Promise.resolve(JSON.parse(responseText));
            } catch (e) {
              return Promise.reject(new Error("Invalid JSON response"));
            }
          },
          text: () => Promise.resolve(responseText),
          headers: new Headers(),
          url: url,
          redirected: false,
          type: "basic",
          clone: () => response,
          body: null,
          bodyUsed: false,
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          blob: () => Promise.resolve(new Blob()),
          formData: () => Promise.resolve(new FormData()),
        } as Response);
      };
      xhr.onerror = () => reject(new Error("XMLHttpRequest network error"));
      xhr.ontimeout = () => reject(new Error("XMLHttpRequest timeout"));
      xhr.timeout = timeout;

      if (body && method !== "GET") {
        xhr.send(JSON.stringify(body));
      } else {
        xhr.send();
      }
    });
  } catch (xhrError) {
    console.log(
      `apiClient: XMLHttpRequest failed for ${url}, trying fetch fallback`,
    );

    // Fallback to fetch
    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      };

      if (body && method !== "GET") {
        fetchOptions.body = JSON.stringify(body);
      }

      response = await fetch(url, fetchOptions);
    } catch (fetchError) {
      console.error(
        `apiClient: Both XMLHttpRequest and fetch failed for ${url}:`,
        {
          xhrError,
          fetchError,
        },
      );
      throw new Error(`Failed to ${method} ${url}: All request methods failed`);
    }
  }

  return response;
}

// Convenience methods
export const apiGet = (
  url: string,
  options?: Omit<ApiRequestOptions, "method">,
) => apiRequest(url, { ...options, method: "GET" });

export const apiPost = (
  url: string,
  body?: any,
  options?: Omit<ApiRequestOptions, "method" | "body">,
) => apiRequest(url, { ...options, method: "POST", body });

export const apiPut = (
  url: string,
  body?: any,
  options?: Omit<ApiRequestOptions, "method" | "body">,
) => apiRequest(url, { ...options, method: "PUT", body });

export const apiDelete = (
  url: string,
  options?: Omit<ApiRequestOptions, "method">,
) => apiRequest(url, { ...options, method: "DELETE" });
