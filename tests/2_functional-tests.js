/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   *
  test("#example Test GET /api/books", function(done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
   *
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function() {
    let id1;

    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "Wuthering Heights" })
            .end((err, res) => {
              assert.strictEqual(res.status, 200);
              assert.property(res.body, "title");
              assert.strictEqual(res.body.title, "Wuthering Heights");
              assert.property(res.body, "_id");
              id1 = res.body._id;
              done();
            });
        });

        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "" })
            .end((err, res) => {
              assert.strictEqual(res.status, 200);
              assert.strictEqual(res.text, "No title given");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.strictEqual(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "title");
            assert.isString(res.body[0].title);
            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "commentcount");
            assert.isNumber(res.body[0].commentcount);
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .get("/api/books/123456789012345678901234")
          .end((err, res) => {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .get("/api/books/" + id1)
          .end((err, res) => {
            assert.strictEqual(res.status, 200);
            assert.property(res.body, "title");
            assert.strictEqual(res.body.title, "Wuthering Heights");
            assert.property(res.body, "_id");
            assert.property(res.body, "comments");
            assert.isArray(res.body.comments);
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
          chai
            .request(server)
            .post("/api/books/" + id1)
            .send({ comment: "I've never read it." })
            .end((err, res) => {
              assert.strictEqual(res.status, 200);
              assert.property(res.body, "title");
              assert.strictEqual(res.body.title, "Wuthering Heights");
              assert.property(res.body, "_id");
              assert.property(res.body, "comments");
              assert.isArray(res.body.comments);
              assert.strictEqual(res.body.comments[0], "I've never read it.");
              done();
            });
        });
      }
    );
  });
});
