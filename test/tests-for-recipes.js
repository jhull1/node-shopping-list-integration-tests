const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Recipes", function() {
	before(function() {
    return runServer();
  });

	after(function() {
    return closeServer();
  });

	// test strategy:
  //   1. make request to `/shopping-list`
  //   2. inspect response object and prove has right code and have
  //   right keys in response object.
  it("should list items on GET", function() {
    // for Mocha tests, when we're dealing with asynchronous operations,
    // we must either return a Promise object or else call a `done` callback
    // at the end of the test. The `chai.request(server).get...` call is asynchronous
    // and returns a Promise, so we just return it.
    return chai
      .request(app)
      .get("/recipes")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");

        // because we create three items on app load
        expect(res.body.length).to.be.at.least(1);
        // each item should be an object with key/value pairs
        // for `id`, `name` and `checked`.
        const expectedKeys = ["name", "ingredients"];
        res.body.forEach(function(item) {
          expect(item).to.be.a("object");
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

   // test strategy:
  //  1. make a POST request with data for a new item
  //  2. inspect response object and prove it has right
  //  status code and that the returned object has an `id`
  it("should add a recipe on POST", function() {
    const newRecipe = { name: "Latte", ingredients: ["espresso", "milk"]};
    return chai
      .request(app)
      .post("/recipes")
      .send(newRecipe)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.include.keys("id", "name", "ingredients");
        expect(res.body.id).to.not.equal(null);
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id`
        expect(res.body).to.deep.equal(
          Object.assign(newRecipe, { id: res.body.id }) //ISSUES HERE NEED TO REVIEW
        );
      });
  });


  // test strategy:
  //  1. initialize some update data (we won't have an `id` yet)
  //  2. make a GET request so we can get an item to update
  //  3. add the `id` to `updateData`
  //  4. Make a PUT request with `updateData`
  //  5. Inspect the response object to ensure it
  //  has right status code and that we get back an updated
  //  item with the right data in it.
  //it("should update items on PUT", function() {
    // we initialize our updateData here and then after the initial
    // request to the app, we update it with an `id` property so
    // we can make a second, PUT call to the app.
    //const updateData = {
    //  name: "Americano",
    //  ingredients: ["espresso", "water"]
    //};

   // return (
     // chai
        //.request(app)
        // first have to get so we have an idea of object to update
       // .get("/recipes")
      //  .then(function(res) {
        //  updateData.id = res.body[0].id;
          // this will return a promise whose value will be the response
          // object, which we can inspect in the next `then` block. Note
          // that we could have used a nested callback here instead of
          // returning a promise and chaining with `then`, but we find
          // this approach cleaner and easier to read and reason about.
         // return chai
          //  .request(app)
          //  .put(`/recipes/${updateData.id}`)
          //  .send(updateData);
        //})
        // prove that the PUT request has right status code
        // and returns updated item
       // .then(function(res) {
         // expect(res).to.have.status(200);
         // expect(res).to.be.json;
         // expect(res.body).to.be.a("object");
         // expect(res.body).to.deep.equal(updateData);
       // })
   // );
 // });

 it('should update recipes on PUT', function() {

    const updateData = {
      name: 'foo',
      ingredients: ['bizz', 'bang']
    };

    return chai.request(app)
      // first have to get recipes so have `id` for one we
      // want to update. Note that once we're working with databases later
      // in this course get the `id` of an existing instance from the database,
      // which will allow us to isolate the PUT logic under test from our
      // GET interface.
      .get('/recipes')
      .then(function(res) {
        updateData.id = res.body[0].id;

        return chai.request(app)
          .put(`/recipes/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
         expect(res).to.have.status(204);
      });
  });


   // test strategy:
  //  1. GET shopping list items so we can get ID of one
  //  to delete.
  //  2. DELETE an item and ensure we get back a status 204
  it("should delete items on DELETE", function() {
    return (
      chai
        .request(app)
        // first have to get so we have an `id` of item
        // to delete
        .get("/recipes")
        .then(function(res) {
          return chai.request(app).delete(`/recipes/${res.body[0].id}`);
        })
        .then(function(res) {
         expect(res).to.have.status(204);
        })
    );
  });
});


//would this file normally be merged with other file
//how do i run these tests? just npm test?
