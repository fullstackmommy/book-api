const request = require("supertest")
const books = require("../../routes/books")
const app = require("../../app")

const bookData = [
    {
        id: "1",
        title: "ABC",
        author: "Bob",
        genre: "Computer",
        price: 25,
        quantity: 5
    }, {
        id: "2",
        title: "DEF",
        author: "John",
        genre: "Arts",
        price: 12,
        quantity: 10
    }, {
        id: "3",
        title: "GHI",
        author: "Jane",
        genre: "History",
        price: 34,
        quantity: 50
    }
]

describe('Books', () => {
    describe('GET', () => {
        const route = "/books"
        test("Gets all books", () => {
            return request(app)
                .get(route)
                .expect(200)
                .expect("Content-Type", /json/)
                .expect(bookData)
        })

        test("Get the books matching the title", () => {
            const title = "ABC"
            const foundBook = bookData.filter(book => book.title === title)

            return request(app)
                .get(route)
                .query({title: "ABC"})
                .expect(200)
                .expect("Content-Type", /json/)
                .expect(foundBook)
        })

        test("Get the books matching the author", () => {
            const author = "John"
            const foundBook = bookData.filter(book => book.author === author)

            return request(app)
                .get(route)
                .query({author: "John"})
                .expect(200)
                .expect("Content-Type", /json/)
                .expect(foundBook)
        })
    });

    describe('POST', () => {
        const route = "/books"
        test("Create a new book, deny access when no token is given ", () => {
            return request(app)
                .post(route)
                .send({title: "New Book"})
                .ok(res => res.status === 403)
                .then(res => {
                    expect(res.status).toBe(403)
                })
        })

        test("Create a new book, deny access when invalid token is given ", () => {
            return request(app)
                .post(route)
                .set("Authorization", "Bearer my-invalid-token")
                .send({title: "New Book"})
                .ok(res => res.status === 403)
                .then(res => {
                    expect(res.status).toBe(403)
                })
        })

        test("Create a new book, grant access with authorization token ", () => {
            return request(app)
                .post(route)
                .set("Authorization", "Bearer my-token")
                .send({title: "New Book"})
                .expect(201)
                .then(res => {
                    expect(res.body).toEqual(expect.any(Object))
                    expect(res.body).toEqual({
                        id: expect.any(String),
                        title: "New Book"
                    })
                })
        })
    })

    describe("PUT", () => {

        test("Update a book's record based on ID, book is found", () => {
            const route = "/books/1"
            return request(app)
                .put(route)
                .send({title: "New Title"})
                .expect(202)
                .expect({title: "New Title"})
        })

        test("Update a book's record based on ID, book is not found", () => {
            const route = "/books/100"
            return request(app)
                .put(route)
                .send({title: "New Title"})
                .expect(202)
                .catch(res => {
                    expect(res.status).toBe(400)
                })
        })

    })
    describe("DELETE", () => {
        test("Delete a book's record based on ID", () => {
            const route = "/books/1"
            return request(app)
                .delete(route)
                .expect(202)
        })

        test("Delete a book's record based on ID, record not found", () => {
            const route = "/books/100"
            return request(app)
                .delete(route)
                .ok(res => res.status === 400)
                .then(res => {
                    expect(res.status).toBe(400)
                })
        })
    });

});