import request from "supertest";
import app from "../app";

it("should return an array of books", async () => {
  const { body } = await request(app)
    .get("/api/book/search/card+games")
    .send()
    .expect(200);
  expect(body).toMatchObject({
    status: "complete",
    books: expect.any(Array),
  });
  expect(body.books[0]).toMatchObject({
    id: expect.any(String),
    title: expect.any(String),
  });
});

// TODO book's description stripped HTML tags

it("should return an empty array of books if no books are found", async () => {
  const { body } = await request(app)
    .get("/api/book/search/uslvtugszgdxzgvhzsvja")
    .send()
    .expect(200);
  expect(body).toMatchObject({
    status: "complete",
    books: [],
  });
});

it('should return a status of "searching" when multiple search requests are sent at once', async () => {
  const responses = ["ca", "car", "cars"].map((text) => {
    return request(app).get(`/api/book/search/${text}`).send();
  });
  const results = await Promise.all(responses);
  const statues = results.map(({ body }) => body.status);
  expect(statues).toEqual(["searching", "searching", "complete"]);
});
