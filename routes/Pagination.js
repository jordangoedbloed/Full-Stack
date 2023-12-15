// import express from "express";
// import Kitty from "../models/Kitten.js";
// import "dotenv/config";

// const routes = express.Router();

// Pagination Functions
// function currentItems(total, start, limit) {
//     if (!limit || !start) {
//         return total;
//     }
//     return Math.min(total - start, limit);
// }

// function numberOfPages(total, start, limit) {
//     if (!limit || !start) {
//         return 1;
//     }
//     return Math.ceil(total / limit);
// }

// function currentPage(start, limit) {
//     if (!limit || !start) {
//         return 1;
//     }
//     return Math.floor(start / limit) + 1;
// }

// function firstPageItem() {
//     return 1;
// }

// function lastPageItem(total, start, limit) {
//     if (!limit || !start) {
//         return total;
//     }
//     if (limit == 1) {
//         return total;
//     }
//     return (numberOfPages(total, start, limit) - 1) * limit;
// }

// function previousPageItem(start, limit) {
//     if (!limit || !start) {
//         return null;
//     }
//     return Math.max(start - limit, firstPageItem());
// }

// function nextPageItem(total, start, limit) {
//     if (!limit || !start) {
//         return null;
//     }
//     return Math.min(start + limit, lastPageItem(total, start, limit));
// }

// function getFirstQueryString(total, start, limit) {
//     let queryString = "";
//     if (limit && start) {
//         queryString = `?start=${firstPageItem(total, start, limit)}&limit=${limit}`;
//     }
//     return queryString;
// }

// function getLastQueryString(total, start, limit) {
//     let queryString = "";
//     if (limit && start) {
//         queryString = `?start=${lastPageItem(total, start, limit)}&limit=${limit}`;
//     }
//     return queryString;
// }

// function getPreviousQueryString(start, limit) {
//     let queryString = "";
//     if (limit && start) {
//         let previousStart = previousPageItem(start, limit);
//         if (previousStart !== null) {
//             queryString = `?start=${previousStart}&limit=${limit}`;
//         }
//     }
//     return queryString;
// }

// function getNextQueryString(total, start, limit) {
//     let queryString = "";
//     if (limit && start) {
//         let nextStart = nextPageItem(total, start, limit);
//         if (nextStart !== null) {
//             queryString = `?start=${nextStart}&limit=${limit}`;
//         }
//     }
//     return queryString;
// }

// function itemToPageNumber(start, limit, itemNumber) {
//     if (!limit || !start) {
//         return 1;
//     }
//     return Math.ceil(itemNumber / limit);
// }

// function createPagination(total, start, limit) {
//     let pagination = {
//         currentPage: currentPage(start, limit),
//         numberOfPages: numberOfPages(total, start, limit),
//         currentItems: currentItems(total, start, limit),
//         firstPageQueryString: getFirstQueryString(total, start, limit),
//         lastPageQueryString: getLastQueryString(total, start, limit),
//         previousPageQueryString: getPreviousQueryString(start, limit),
//         nextPageQueryString: getNextQueryString(total, start, limit),
//         itemToPageNumber: itemToPageNumber(start, limit),
//     };
//     return pagination;
// }


// routes.use(express.json());
// // routes.use(express.urlencoded());


// routes.options('/', function (req, res, next) {
//     res.header('Allow', 'GET, POST, OPTIONS'); // Voeg hier de juiste methoden toe die zijn toegestaan
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Zelfde methoden als Allow-header
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Accept, Authorization, Origin');
//     res.header('Access-Control-Allow-Origin', '*');
  
//     if (req.method === 'OPTIONS') {
//       return res.sendStatus(200);
//     }
//     next();
//   });
  
//   routes.options('/:id', function (req, res, next) {
//     res.header('Allow', 'GET, POST, DELETE, OPTIONS'); // Voeg hier de juiste methoden toe die zijn toegestaan
//     res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS'); // Zelfde methoden als Allow-header
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Accept, Authorization, Origin');
//     res.header('Access-Control-Allow-Origin', '*');
  
//     if (req.method === 'OPTIONS') {
//       return res.sendStatus(200);
//     }
//     next();
//   });




//   routes.get("/kitty", async (req, res) => {
//     try {
//         const acceptHeader = req.headers['accept'];

//         if (acceptHeader === 'application/json') {
//             // Verzoek voor JSON-formaat
//             // Genereer JSON-respons
//             // Je JSON-responscode hier
//         } else if (acceptHeader === 'application/xml') {
//             // Verzoek voor XML-formaat
//             // Genereer XML-respons
//             // Je XML-responscode hier
//         } else {
//             // Geen ondersteund formaat gevraagd, stuur 406 Not Acceptable-status
//             res.status(406).send('Not Acceptable');
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });



// routes.get("/", async (req, res) => {
//     try {
//       // Je ontvangt de Accept-header van het verzoek
//       const acceptHeader = req.headers['accept'];
  
//       // Controleer de waarde van de Accept-header
//       if (acceptHeader === 'application/json') {
//         // Verzoek voor JSON-formaat
//         // Genereer JSON-respons
//         res.json({ message: 'Response in JSON format' });
//       } else if (acceptHeader === 'application/xml') {
//         // Verzoek voor XML-formaat
//         // Genereer XML-respons
//         res.type('application/xml').send('<message>Response in XML format</message>');
//       } else {
//         // Geen ondersteund formaat gevraagd, stuur 406 Not Acceptable-status
//         res.status(406).send('Not Acceptable');
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   });


// // GET all kitty's with pagination


// routes.get("/", async (req, res) => {
//     try {
//         let start = isNaN(parseInt(req.query.start)) ? undefined : parseInt(req.query.start);
//         let limit = isNaN(parseInt(req.query.limit)) ? undefined : parseInt(req.query.limit);

//         const kitties = await Kitty.find()
//             .skip((currentPage(start, limit) - 1) * limit)
//             .limit(limit);

//         const totalKitties = await Kitty.countDocuments();
//         const pagination = createPagination(totalKitties, start, limit);

//         const kittiesCollection = {
//             items: kitties.map((kitty) => {
//                 const kittyJson = kitty.toJSON();
//                 return {
//                     ...kittyJson,
//                     _links: {
//                         self: {
//                             href: `${process.env.URI}/kitty/${kittyJson._id}`,
//                         },
//                     },
//                 };
//             }),
//             _links: {
//                 self: {
//                     href: `${process.env.URI}/kitty/`,
//                 },
//                 // Voeg andere links toe indien nodig
//             },
//             pagination: {
//                 currentPage: pagination.currentPage,
//                 currentItems: pagination.currentItems,
//                 totalPages: pagination.numberOfPages,
//                 totalItems: totalKitties,
//                 _links: {
//                     first: {
//                         href: process.env.URI + pagination.firstPageQueryString,
//                     },
//                     last: {
//                         href: process.env.URI + pagination.lastPageQueryString,
//                     },
//                     previous: {
//                         href: process.env.URI + pagination.previousPageQueryString,
//                     },
//                     next: {
//                         href: process.env.URI + pagination.nextPageQueryString,
//                     },
//                 },
//             },
//         };

//         res.json(kittiesCollection);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });

// export default routes


import express from "express";
import Kitty from "../models/Kitten.js";
import "dotenv/config";
import { faker } from '@faker-js/faker';

// functions for pagination
function currentItems(total, start, limit) {
    if (!limit || !start) {
        return total;
    }
    return Math.min(total - start, limit);
}

function numberOfPages(total, start, limit) {
    if (!limit || !start) {
        return 1;
    }
    return Math.ceil(itemsToShow / limit);
}


function currentPage(start, limit) {
    if (!limit || !start) {
        return 1;
    }
    return Math.floor(start / limit) + 1;
}

function firstPageItem() {
    return 1;
}

function lastPageItem(total, start, limit) {
    if (!limit || !start) {
        return total;
    }
    if (limit === 1) {
        return total;
    }
    return Math.min((currentPage(total, start, limit) - 1) * limit + limit, total);
}

function previousPageItem(start, limit) {
    if (!limit || !start) {
        return null;
    }
    return Math.max(start - limit, firstPageItem());
}

function nextPageItem(total, start, limit) {
    if (!limit || !start) {
        return null;
    }
    return Math.min(start + limit, lastPageItem(total, start, limit));
}

function getLastQueryString(total, start, limit) {
    let queryString = "";
    if (limit && start) {
        queryString = `?start=${lastPageItem(total, start, limit)}&limit=${limit}`;
    }
    return queryString;
}

function getPreviousQueryString(start, limit) {
    let queryString = "";
    if (limit && start) {
        let previousStart = previousPageItem(start, limit);
        if (previousStart !== null) {
            queryString = `?start=${previousStart}&limit=${limit}`;
        }
    }
    return queryString;
}

function getNextQueryString(total, start, limit) {
    let queryString = "";
    if (limit && start) {
        let nextStart = nextPageItem(total, start, limit);
        if (nextStart !== null) {
            queryString = `?start=${nextStart}&limit=${limit}`;
        }
    }
    return queryString;
}

const routes = express.Router();


routes.use(express.json());
routes.use(express.urlencoded({ extended: false }));

routes.options('/', function (req, res, next) {  
    res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Accept, Authorization, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Origin', '*');
  
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});




routes.options('/:id', function (req, res, next) {
    res.header('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Accept, Authorization, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Origin', '*');
  
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});


//checks uri
// routes.use((req, res, next) => {
//     console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
//     next();
// });


routes.use((req, res, next) => {
    const acceptedTypes = req.accepts(['json', 'html']);

    if (!acceptedTypes) {
        res.sendStatus(400);
        return;
    }
    res.locals.acceptedTypes = acceptedTypes;
    next();
})
    

routes.get("/", async (req, res) => {
    try {
        const acceptHeader = req.headers['accept'];

        if (acceptHeader === 'application/json') {
            const kitties = await Kitty.find();

            const kittiesCollection = {
                items: kitties.map((kitty) => {
                    const kittyJson = kitty.toJSON();
                    if (!kitty) {
                        return null; // Geen acties uitvoeren op een leeg object
                    }
                    return {
                        ...kittyJson,
                        _links: {
                            self: {
                                href: `${process.env.URI}${process.env.PORT}/kitty/${kittyJson._id}`,
                            },
                            collection: {
                                href: `${process.env.URI}${process.env.PORT}/kitty/`,
                            },

                        },
                    };
                }).filter((kitty) => kitty !== null),
                _links: {
                    self: {
                        href: `${process.env.URI}${process.env.PORT}/kitty/`,
                    },
                },
                pagination: {
                    currentPage: 1,
                    currentItems: kitties.length,
                    totalPages: 1,
                    totalItems: kitties.length,
                    
                    __links: {
                        first: {
                            page: 1,
                            href: `${process.env.URI}${process.env.PORT}/kitty/`,
                        },
                        last: {
                            page: 1,
                            href: `${process.env.URI}${process.env.PORT}/kitty/`,
                        },
                        previous: {
                            page: 1,
                            href: `${process.env.URI}${process.env.PORT}/kitty/`,
                        },
                        next: {
                            page: 1,
                            href: `${process.env.URI}${process.env.PORT}/kitty/`,
                        },
                    },
                },
            };

            res.json(kittiesCollection);
        } else if (acceptHeader === 'application/xml') {
            res.type('application/xml').send('<message>Response in XML format</message>');
        } else {
            res.status(406).send('Not Acceptable');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



routes.get("/:id", async (req, res)  => {
    try {
        const acceptHeader = req.headers['accept'];

        if (acceptHeader === 'application/json') {
            const kitty = await Kitty.findById(req.params.id);
            const kittyJson = kitty.toJSON();
            const jsonFormat = {
                ...kittyJson,
                _links: {
                    self:{
                        href: `${process.env.URI}${process.env.PORT}/kitty/${kitty._id}`,
                    },
                    collection: {  
                        href: `${process.env.URI}${process.env.PORT}/kitty/`,
                    }
                    
                }
            }
            if (kitty) {
                res.json(jsonFormat);

            } else {
                res.status(404).send('Not Found');
            }
            
        } else if (acceptHeader === 'application/xml') {
            res.type('application/xml').send('<message>Response in XML format</message>');
        } else {
            res.status(406).send('Not Acceptable');
        }
    } catch (error) {
        console.error(error);
        res.status(404).send("404 not found");
    }

    
});

routes.post('/seed', async (req, res) => {
    try {

 
        await Kitty.deleteMany();

        for (let i = 0; i < 10; i++) {
            const newKitty = {
                name: faker.person.firstName(),
                breed: faker.animal.cat(),
                color: faker.color.rgb()

            };

            // Voeg de Kitty toe aan de database
             await Kitty.create(newKitty);
        }
        

        res.sendStatus(201); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

routes.post('/', async (req, res) => {

    const contentType = req.get('Content-Type');

    if (
        contentType !== 'application/json' &&
        contentType !== 'application/x-www-form-urlencoded'
    ) {
        res.status(415).json({message: 'unsupported'});
        return;
    }
    const {name, breed, color,} = req.body;
    if (!name || !breed || !color) {
        res.status(400).json({message: 'all required'});
        return;
    }
    try {
        await Kitty.create({
            name: req.body.name,
            breed: req.body.breed,
            color: req.body.color
        });

        res.status(201).json({message: 'Kitty created !'})

    } catch (err) {
        res.status(500).json({message: err.message})
    }

});

routes.put('/:id', async (req, res) => {
    try {
        // Check if all fields are filled
        if (
            !req.body.name ||
            !req.body.breed ||
            !req.body.color 
        ) {
            return res.status(400).json({
                message: 'All fields must be filled for update',
            });
        }

 
        const updateFields = {
            name: req.body.name,
            breed: req.body.breed,
            color: req.body.color,
        };


        await Kitty.updateOne({ _id: req.params.id }, updateFields);


        const item = await Kitty.findOne({ _id: req.params.id });
        res.status(200).json(item);
    } catch (err) {
        res.status(400).json({
            message: 'Could not update',
            error: err.message,
        });
    }
});

routes.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const result = await Kitty.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({message: 'Kitty not found !'});
        } else {
            return res.status(204).send({message: 'Kitty is deleted!'});
        }

    } catch (err) {
        console.log(err);
        res.status(404).json({error: 'Could not find kitty'});
    }
});




export default routes;
