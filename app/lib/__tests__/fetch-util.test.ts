import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// vi.hoisted: definisikan data mock SEBELUM vi.mock di-hoist ke atas
const mocks = vi.hoisted(() => {
  const requestInterceptor: ((config: any) => any) | undefined = undefined;
  const responseInterceptor: ((error: any) => any) | undefined = undefined;

  return {
    requestInterceptorRef: { value: requestInterceptor },
    responseInterceptorRef: { value: responseInterceptor },
    mockInstance: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn((fn: any) => {
            mocks.requestInterceptorRef.value = fn;
          }),
        },
        response: {
          use: vi.fn((fn: any, errFn: any) => {
            mocks.responseInterceptorRef.value = errFn;
          }),
        },
      },
    },
  };
});

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => mocks.mockInstance),
  },
}));

import { fetchData } from "../fetch-util";

describe("fetch-util", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("menambahkan Authorization header jika token ada di localStorage", () => {
    localStorage.setItem("token", "abc123");

    const config = mocks.requestInterceptorRef.value!({ headers: {} });

    expect(config.headers.Authorization).toBe("Bearer abc123");
  });

  it("tidak menambahkan Authorization jika tidak ada token", () => {
    const config = mocks.requestInterceptorRef.value!({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });

  it("memicu event force-logout saat response 401", async () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    const error = {
      response: { status: 401, data: {} },
      config: { url: "/api/v1/test" },
      message: "Unauthorized",
    };

    await expect(mocks.responseInterceptorRef.value!(error)).rejects.toBe(error);
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it("tidak memicu force-logout untuk error selain 401", async () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    const error = {
      response: { status: 500, data: {} },
      config: { url: "/api/v1/test" },
      message: "Server Error",
    };

    await expect(mocks.responseInterceptorRef.value!(error)).rejects.toBe(error);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
