const request = require("supertest")
//const books = require("../../routes/books")
const app = require("../../app")

const Book = require("../../models/book")
const mongoose = require("mongoose");
const {MongoMemoryServer} = require("mongodb-memory-server");

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
    let mongoServer;
    let db

    beforeAll(async() => {
        jest.setTimeout(120000)
        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getConnectionString()

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        db = mongoose.connection
    })

    afterAll(async() => {
        mongoose.disconnect()
        await mongoServer.stop()
    })

    beforeEach(async() => {

        await Book.insertMany([
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
        ])
    })

    afterEach(async() => {
        await db.dropCollection("books")
    })

    describe('GET', () => {

        const route = "/api/v1/books"
        test("Gets all books", () => {
            const expectedBooks = [
                {
                    title: "ABC",
                    author: "Bob"
                }, {
                    title: "DEF",
                    author: "John"
                }, {
                    title: "GHI",
                    author: "Jane"
                }
            ]

            return request(app)
                .get(route)
                .expect("Content-Type", /json/)
                .expect(200)
                .then(res => {
                    const books = res.body
                    expect(books.length).toBe(3)
                    books.forEach((book, index) => {
                        // expect(book).toEqual(expect.objectContaining(expectedBooks[index]))
                        // alternative:
                        expect(book.title).toBe(expectedBooks[index].title)
                        expect(book.author).toBe(expectedBooks[index].author)
                    })

                })
        })

        test("Get the books matching the title", () => {

            return request(app)
                .get(route)
                .query({title: "ABC"})
                .expect("Content-Type", /json/)
                .expect(200)
                .then(res => {
                    const book = res.body[0]
                    expect(book.title).toEqual("ABC")
                })
        })

        test("Get the books matching the author", () => {

            return request(app)
                .get(route)
                .query({author: "John"})
                .expect("Content-Type", /json/)
                .expect(200)
                .then(res => {
                    const book = res.body[0]
                    expect(book.title).toEqual("DEF")
                    // const books = res.body books.forEach((book, index) => {
                    // expect(book).toEqual(expect.objectContaining(expectedBooks[index])) })

                })
        })

        xtest('should return 400 if searching according to title is invalid', async() => {
            const route = "/api/v1/books/100"
            try {
                await request(app)
                    .get(route)
                    .set('Accept', 'application/json');
            } catch (error) {
                const {response} = error;
                expect(response.status).toEqual(400);
            }
        });

    });

    describe('POST', () => {
        const route = "/api/v1/books"
        test("Create a new book, deny access when no token is given ", () => {
            return request(app)
                .post(route)
                .send({title: "New Book", author: "New Author"})
                .ok(res => res.status === 403)
                .then(res => {
                    expect(res.status).toBe(403)
                })
        })

        test("Create a new book, deny access when invalid token is given ", () => {
            return request(app)
                .post(route)
                .set("Authorization", "Bearer my-invalid-token")
                .send({title: "New Book", author: "New Author"})
                .ok(res => res.status === 403)
                .then(res => {
                    expect(res.status).toBe(403)
                })
        })

        test("Create a new book record in the database", async() => {
            const res = await request(app)
                .post(route)
                .set("Authorization", "Bearer my-token")
                .send({title: "New Book", author: "QWE"})
                .expect(201)

            expect(res.body.title).toBe("New Book")
            expect(res.body.author).toBe("QWE")

            const book = await Book.findOne({title: "New Book"})
            expect(book.title).toBe("New Book")
            expect(book.author).toBe("QWE")
        })

    })

    describe("PUT", () => {

        test("Update a book's record based on ID, book is found", async() => {
            const {_id} = await Book.findOne({title: "ABC"})
            const route = `/api/v1/books/${_id}`

            const res = await request(app)
                .put(route)
                .set("Authorization", "Bearer my-token")
                .send({title: "New Title", author: "New Author"})
                .expect(202)
            expect(res.body).toEqual(expect.objectContaining({title: "New Title", author: "New Author"}))
        })

        test("Update a book's record based on ID, book is not found", () => {
            const route = "/api/v1/books/100"
            return request(app)
                .put(route)
                .set("Authorization", "Bearer my-token")
                .send({title: "New Title"})
                .catch(res => {
                    expect(res.status).toBe(400)
                })
        })

    })
    describe("DELETE", () => {
        test("Delete a book's record based on ID", async() => {
            const {_id} = await Book.findOne({title: "ABC"})
            const route = `/api/v1/books/${_id}`

            await request(app)
                .delete(route)
                .set("Authorization", "Bearer my-token")
                .expect(202)

            const book = await Book.findById(_id)
            expect(book).toBe(null)
        })

        test("Delete a book's record based on ID, record not found", () => {
            const route = "/api/v1/books/5c8fb5c41529bf25dcba41a7"
            return request(app)
                .delete(route)
                .set("Authorization", "Bearer my-token")
                .ok(res => res.status === 404)
                .then(res => {
                    expect(res.status).toBe(404)
                })
        })

        // alternative method:
        test("fails as there is no such book", done => {
            const route = "/api/v1/books/5c8fb5c41529bf25dcba41a7"
            request(app)
                .delete(route)
                .set("Authorization", "Bearer my-token")
                .expect(404, done);
        });

    });

});