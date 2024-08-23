import { test, expect, request } from "@playwright/test";

test.describe("Auth in Before each", () => {
  let apiContext;
  let token;

  test.beforeEach(async () => {
    apiContext = await request.newContext({
      baseURL: "https://qauto.forstudy.space",
    });

    const authResponse = await apiContext.post("/api/auth/signin", {
      data: {
        email: "darii+test@test.com",
        password: "Dariia5!",
        remember: false,
      },
    });

    const authResponseBody = await authResponse.json();
    token = authResponseBody.data.access_token;
  });

  // test("Positive Test: Create Car Successfully", async () => {
  //   const response = await apiContext.post("/api/cars", {
  //     data: {
  //       carBrandId: 1,
  //       carModelId: 1,
  //       mileage: 1221,
  //     },
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  //   expect(response.ok()).toBeTruthy();

  //   const responseBody = await response.json();
  //   expect(responseBody.status).toBe("ok");
  //   expect(responseBody.data).toHaveProperty("id");
  //   expect(responseBody.data.brand).toBe("Audi");
  // });
  test("Negative Test: Create Car with Invalid Data", async () => {
    const response = await apiContext.post("/api/cars", {
      data: {
        carBrandId: "",
        carModelId: "",
        mileage: "invalid",
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    expect(responseBody.status).toBe("error");
    expect(responseBody.message).toContain("Cars limit reached");
  });

  test("Negative Test: Create Car with incorrect carBrand", async () => {
    const response = await apiContext.post("/api/cars", {
      data: {
        carBrandId: 123322,
        carModelId: 1,
        mileage: 1221,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    expect(responseBody.status).toBe("error");
    expect(responseBody.message).toBe("Cars limit reached");
  });

  test.afterEach(async () => {
    await apiContext.dispose();
  });
});
