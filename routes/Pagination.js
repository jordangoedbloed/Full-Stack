import express from "express";
import Kitty from "../models/Kitten.js";
import "dotenv/config";
import { faker } from "@faker-js/faker";

// functions for pagination die ik niet werkende heb gekregen.
function currentItems(total, start, limit) {
  return start && limit ? Math.min(limit, total - start + 1) : total;
}

function numberOfPages(total, start, limit) {
  return start && limit ? Math.ceil((total - start + 1) / limit) : 1;
}

function currentPage(total, start, limit) {
  return start && limit ? Math.ceil(start / limit) : 1;
}

function firstPageItem(total, start, limit) {
  return 1;
}

function lastPageItem(total, start, limit) {
  return start && limit ? start + limit - 1 : total;
}

function previousPageItem(total, start, limit) {
  return Math.max(1, start - limit);
}

function nextPageItem(total, start, limit) {
  return Math.min(total, start + limit);
}

function getFirstQueryString(total, start, limit) {
  return start && limit ? `?start=1&limit=${limit}` : "";
}

function getLastQueryString(total, start, limit) {
  return start && limit ? `?start=${total - limit + 1}&limit=${limit}` : "";
}

function getPreviousQueryString(total, start, limit) {
  return start && limit
    ? `?start=${previousPageItem(total, start, limit)}&limit=${limit}`
    : "";
}

function getNextString(total, start, limit) {
  return start && limit
    ? `?start=${nextPageItem(total, start, limit)}&limit=${limit}`
    : "";
}

function itemToPageNumber(total, start, limit, itemNumber) {
  return start && limit ? Math.ceil(itemNumber / limit) : 1;
}

function createPagination(total, start, limit) {
  limit = limit || 10;
  return {
    currentItems: currentItems(total, start, limit),
    numberOfPages: numberOfPages(total, start, limit),
    currentPage: currentPage(total, start, limit),
    firstPageItem: firstPageItem(total, start, limit),
    lastPageItem: lastPageItem(total, start, limit),
    previousPageItem: previousPageItem(total, start, limit),
    nextPageItem: nextPageItem(total, start, limit),
    getFirstQueryString: getFirstQueryString(total, start, limit),
    getLastQueryString: getLastQueryString(total, start, limit),
    getPreviousQueryString: getPreviousQueryString(total, start, limit),
    getNextString: getNextString(total, start, limit),
    itemToPageNumber: itemToPageNumber(total, start, limit, start),
  };
}

const routes = express.Router();

// routes.use((req, res, next) => {
//   // const origin = req.headers.origin;
//   // if (allowedOrigins.includes(origin)) {
//   //   res.header("Access-Control-Allow-Origin", origin);
//   // }

//   // res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   // res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   // if (req.method === "OPTIONS") {
//   //   return res.sendStatus(200);
//   // }

//   next();
// });

routes.get("/", async (req, res) => {
  try {
    // const acceptHeaders = req.headers.accept;
    // const supportedMediaTypes = [
    //   "application/json",
    //   "text/html",
    //   "*/*",
    //   "application/x-www-form-urlencoded",
    // ];

    // if (!supportedMediaTypes.includes(acceptHeaders)) {
    //   return res
    //     .status(406)
    //     .send(
    //       "Not Acceptable. Supported media types: application/json, text/html"
    //     );
    // }

    const start = parseInt(req.query.start) || 1;
    const limit = parseInt(req.query.limit) || 9;

    const skip = start && limit ? start - 1 : 0;

    const total = await Kitty.countDocuments();
    const kitties = await Kitty.find().skip(skip).limit(limit);

    const pagination = createPagination(total, start, limit);

    res.send({
      items: kitties.map((kitty) => ({
        _id: kitty._id,
        name: kitty.name,
        breed: kitty.breed,
        color: kitty.color,
        _links: {
          self: {
            href: `${process.env.URI}${process.env.PORT}/kitty/${kitty._id}`,
          },
          collection: {
            href: `${process.env.URI}${process.env.PORT}/kitty/`,
          },
        },
      })),
      _links: {
        self: {
          href: `${process.env.URI}${process.env.PORT}/kitty/`,
        },
      },
      pagination: {
        currentPage: pagination.currentPage,
        currentItems: pagination.currentItems,
        totalPages: pagination.numberOfPages,
        totalItems: total,
        _links: {
          first: {
            page: 1,
            href: `${process.env.URI}${process.env.PORT}/kitty/${pagination.getFirstQueryString}`,
          },
          last: {
            page: pagination.numberOfPages,
            href: `${process.env.URI}${process.env.PORT}/kitty/${pagination.getLastQueryString}`,
          },
          previous: {
            page: pagination.currentPage - 1,
            href: `${process.env.URI}${process.env.PORT}/kitty/${pagination.getPreviousQueryString}`,
          },
          next: {
            page: pagination.currentPage + 1,
            href: `${process.env.URI}${process.env.PORT}/kitty/${pagination.getNextString}`,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

routes.get("/:id", async (req, res) => {
  try {
    const kitty = await Kitty.findById(req.params.id);
    if (!kitty) {
      return res.status(404).send("404 not found");
    }

    res.send({
      _id: kitty._id,
      name: kitty.name,
      breed: kitty.breed,
      color: kitty.color,
      _links: {
        self: {
          href: `${process.env.URI}${process.env.PORT}/kitty/${kitty._id}`,
        },
        collection: {
          href: `${process.env.URI}${process.env.PORT}/kitty/`,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("404 not found");
  }
});

routes.post("/seed", async (req, res) => {
  try {
    await Kitty.deleteMany();

    for (let i = 0; i < 10; i++) {
      const newKitty = {
        name: faker.person.firstName(),
        breed: faker.animal.cat(),
        color: faker.color.rgb(),
      };

      // Voeg de Kitty toe aan de database
      await Kitty.create(newKitty);
    }

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

routes.post("/", async (req, res) => {
  // const contentType = req.get("Content-Type");

  // if (
  //   contentType !== "application/json" &&
  //   contentType !== "application/x-www-form-urlencoded"
  // ) {
  //   res.status(415).json({ message: "unsupported" });
  //   return;
  // }

  // // Set CORS headers for handling preflight request
  // const origin = req.headers.origin;
  // if (allowedOrigins.includes(origin)) {
  //   res.header("Access-Control-Allow-Origin", origin);
  // }

  // // Set other CORS headers
  // res.header("Access-Control-Allow-Methods", "POST");
  // res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  const { name, breed, color } = req.body;
  if (!name || !breed || !color) {
    res.status(400).json({ message: "all required" });
    return;
  }

  try {
    await Kitty.create({
      name: req.body.name,
      breed: req.body.breed,
      color: req.body.color,
    });

    res.status(201).json({ message: "Kitty created !" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

routes.put("/:id", async (req, res) => {
  try {
    // Check if all fields are filled
    if (!req.body.name || !req.body.breed || !req.body.color) {
      return res.status(400).json({
        message: "All fields must be filled for update",
      });
    }

    const updateFields = {
      name: req.body.name,
      breed: req.body.breed,
      color: req.body.color,
      img: req.body.img,
    };

    await Kitty.updateOne({ _id: req.params.id }, updateFields);

    const item = await Kitty.findOne({ _id: req.params.id });
    res.status(200).json(item);
  } catch (err) {
    res.status(400).json({
      message: "Could not update",
      error: err.message,
    });
  }
});

routes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Kitty.deleteOne({ _id: id });

    if (Kitty.deletedCount === 0) {
      return res.status(404).json({ message: "Kitty not found !" });
    }

    // if (!result) {
    //     return res.status(404).json({message: 'Kitty not found !'});
    // } else {
    //     return res.status(204).send({message: 'Kitty is deleted!'});
    // }

    res.status(204).json({ message: "Kitty is deleted!" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: "Could not find kitty" });
  }
});

export default routes;
