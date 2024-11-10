import { getToken, initializeTestDb, insertTestUser } from "./helpers/test.js";

import { expect } from "chai";

const base_url = "http://localhost:3001";

describe("GET Tasks", () => {
  it("should return all tasks", async () => {
    const response = await fetch(base_url);
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data).to.be.an("array").that.is.not.empty;
    expect(data[0]).to.include.all.keys("id", "description");
  });
});

describe("POST Task", () => {
  const email = "post@foo.com";
  const password = "post123";
  it("should create a new task", async () => {
    await insertTestUser(email, password);
    const token = await getToken(email);
    const response = await fetch(base_url + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ description: "New Task" }),
    });
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data).to.be.an("object");
    expect(data).to.have.all.keys("id");
  });

  it("should not create a new task without description", async () => {
    const token = await getToken(email);
    const response = await fetch(base_url + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ description: null }),
    });
    const data = await response.json();

    expect(response.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.have.all.keys("error");
  });

  it("should not post a task with zero length description", async () => {
    const token = await getToken(email);
    const response = await fetch(base_url + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ description: "" }),
    });
    const data = await response.json();
    expect(response.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.have.all.keys("error");
  });
});

describe("DELETE Task", () => {
  it("should delete a task", async () => {
    const response = await fetch(base_url + "/delete/1", {
      method: "DELETE",
    });
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id");
  });

  it("should not delete a task with SQL Injection", async () => {
    const response = await fetch(base_url + "/delete/id=0 or id > 0", {
      method: "DELETE",
    });
    const data = await response.json();

    expect(response.status).to.equal(500);
    expect(data).to.be.an("object");
    expect(data).to.have.all.keys("error");
  });
});

describe("POST Register", () => {
  const email = "register@foo.com";
  const password = "register123";
  it("should register with valid email and password", async () => {
    const response = await fetch(base_url + "/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await response.json();

    expect(response.status).to.equal(201, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id", "email");
  });

  it("should not post a user with less than 8 character password", async () => {
    const email = "register@foo1.com";
    const password = "short1";
    const response = await fetch(base_url + "/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await response.json();
    expect(response.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.have.all.keys("error");
  });
});

describe("POST Login", () => {
  const email = "login@foo.com";
  const password = "login123";
  insertTestUser(email, password);

  it("should login with valid credentials", async () => {
    const response = await fetch(base_url + "/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await response.json();
    expect(response.status).to.equal(200, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id", "email", "token");
  });
});
