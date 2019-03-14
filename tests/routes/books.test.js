const request = require("supertest")
const books = require("../../routes/books")
const app = require("../../app")

const bookData = [
    {
        title: "ABC",
        author: "Bob",
        genre: "Computer",
        price: 25,
        quantity: 5
    }, {
        title: "DEF",
        author: "John",
        genre: "Arts",
        price: 12,
        quantity: 10
    }, {
        title: "GHI",
        author: "Jane",
        genre: "History",
        price: 34,
        quantity: 50
    }
]

describe('Books', () => {
    describe('/books', () => {
        const route = "/books"
        test("Gets all books", () => {
            return request(app)
                .get(route)
                .expect(200)
                .expect("Content-Type", /json/)
                .expect(bookData)
        })

        test("Add a book ", () => {
            return request(app)
                .post(route)
                .send({title: "New Book"})
                .set("Accept", "application/json")
                .expect(201)
                .then(res => {
                    expect(res.body).toEqual(expect.any(Object))
                    expect(res.body).toEqual({
                        id: expect.any(String),
                        title: "New Book",
                        author: expect.any(String),
                        genre: expect.any(String),
                        price: expect.any(Number),
                        quantity: expect.any(Number)
                    })
                })
        })
    })

});