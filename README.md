## Northcoders News  

The aim of the Northcoders News sprint is to create an Heroku hosted app which allows the end user to make API calls to a MongoDB database. The data is served from four different collections:

* Articles
* Comments
* Users 
* Topics

Comments can be posted by users on articles, articles can be added and each article belongs to a topic.

### Prerequisites

Before proceeding, ensure you have NodeJS v6.1.0 and MongoDB v4.0.0 installed.

### Getting Started

1. Firstly, you will need to fork and clone this repository. Clone this repository by running the following command in your terminal:

```http
git clone https://github.com/robD33/BE-FT-northcoders-news
```

2. Install npm by running the following command:

```http
npm install
```

The project requires the following dependencies:

* mongoose 5.2.1
* body-parser 1.18.3
* express 4.16.3
* nodemon 1.17.5
* supertest 3.1.0
* chai 4.1.2
* mocha 5.0.5

3. Make sure you add a config folder to your root directory and add the following code in an index.js file:

```http
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

const config = {
  dev: {
    DB_URL: "mongodb://localhost:27017/northcoders_news"
  },
  test: {
    DB_URL: "mongodb://localhost:27017/northcoders_news_test"
  }
};

module.exports = config;
```
4. You can now run Mongo and start the tests. Run 'mongod' in a separate terminal window using the following command:

```http
mongod
```
### Seeding the data

Once you have run the mongod command, you should be listening to mongod and ready to create your local database to test/dev on.

In order to seed the database, run the following command:
```http
npm run seed/seed:dev
```
You should receive a seed successfully complete. If you wish to add data to the seed files, make sure that they conform to the schemas which can be found in the models folder.

### Testing

The test file is found in the spec folder. It has two hooks, beforeEach and after. These run to seed test data, and will disconnect once the all tests have run.To run the test database ensure you are in the correct file, and run the following command:

```http
npm test
```

Each unit test includes the expected status code as well as specific tests for each, such as object keys and values. They also check that the correct error statuses are being sent for different scenarios.

### Available endpoints

Below is a list of all available endpoints. You can test run these either using a browser such as Google Chrome, or using Postman (https://www.getpostman.com/).

The following link is the main API page of the application:

https://ncnewsrobd.herokuapp.com/api/

MongoDB hosted on Mlabs

### Built With
* [MongooseJS](https://mongoosejs.com/)
* [Heroku](https://heroku.com/)
* [MLabs](https://mlab.com/)

### Authors: 
Rob Davidson

### Acknowledgments:
Thanks to Northcoders for the documentation HTML and for helping greatly with this project.
Also thanks to Rosie Amphlett (git: rosieamphlett) for help with this README.
