const express = require("express");
const app = express();
app.use(express.json());

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Author & Books API",
      version: "1.0.0",
      description:
        "CRUD API for authors and their books using Express and Prisma",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

swaggerDocs(app);

app.use("/", require("./routes/author.routes"));
app.use("/", require("./routes/book.routes"));
app.use("/", require("./routes/genre.routes"));

// 👇 Serverni ishga tushirish
app.listen(3000, () => console.log("Server started on port 3000"));
