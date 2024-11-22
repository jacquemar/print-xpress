const express = require("express");
require("dotenv").config();
const cors = require("cors");
const axios = require("axios");
const { Dropbox } = require("dropbox");
const fetch = require("isomorphic-fetch");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Dossier local pour stocker temporairement les fichiers
  },
  filename: function (req, file, cb) {
    const name = file.originalname.split("").join("_");
    const extension = MIME_TYPES[file.mimetype];
    cb(null, name + Date.now() + "." + extension);
  },
});

const upload = multer({ storage: storage });

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Augmenter la limite de taille maximale à 50 Mo
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
const cloudinary = require("cloudinary").v2;
const cloudconfig = require("./cloudinary");

const mongoose = require("mongoose");

const Product = require("./models/Produit");
const Ticket = require("./models/Ticket");
const DeliveryPerson = require('./models/DeliveryPerson');

mongoose
  .connect(
    "mongodb+srv://jacquemar:o85pxev28Rl0qapG@products.mht5fkp.mongodb.net/?retryWrites=true&writeConcern=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

// <-------------------------ENPOINTS-----------------------> //

// <--------------- RESEARCH END POINT ---------------> //

app.get("/search", async (req, res) => {
  const searchTerm = req.query.q; // RécupéreR le terme de recherche depuis la requête

  try {
    const results = await Product.find({
      // Utilisez l'opérateur $regex pour effectuer une recherche textuelle
      $or: [
        { name: { $regex: searchTerm, $options: "i" } }, // "i" pour une recherche insensible à la casse
        { category: { $regex: searchTerm, $options: "i" } },
        // Ajoutez d'autres champs sur lesquels vous souhaitez effectuer la recherche
      ],
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    res.status(500).json({ error: "Erreur serveur lors de la recherche" });
  }
});
// ---------------------------------------------------------------------------------------------------//``

// <---------------------------- ORANGE SMS API ---------------------------------->

const clientId = process.env.ORANGE_SMS_CLIENT_ID;
const clientSecret = process.env.ORANGE_SMS_CLIENT_SECRET;
const apiKey = process.env.ORANGE_API_KEY;

// Encodage des identifiants pour créer l'en-tête d'autorisation
const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString(
  "base64"
)}`;

const apiBaseUrl = "https://api.orange.com/smsmessaging/v1";

const sendSMS = async (phoneNumber, message) => {
  const url = `${apiBaseUrl}/outbound/tel:${phoneNumber}/requests`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader}`,
  };

  const payload = {
    outboundSMSMessageRequest: {
      senderAddress: "tel:+2250777293456",
      outboundSMSTextMessage: { message },
    },
  };

  try {
    const response = await axios.post(url, payload, { headers });
    console.log("SMS envoyé avec succès:", response.data);
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS:", error.response.data);
  }
};

// ROUTE POUR L'ENVOI D'SMS //

app.post("/send-sms", async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    // Appelez la fonction sendSMS avec les paramètres requis
    await sendSMS(phoneNumber, message);

    res.status(200).json({ message: "SMS envoyé avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS :", error);
    res.status(500).json({ error: "Erreur serveur lors de l'envoi du SMS" });
  }
});

// <------------------------- categories ------------------------------------> //

app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des catégories",
    });
  }
});

app.post("/upload", upload.single("file"), async (req, res, next) => {
  const currentDate = new Date().toISOString();
  const ProductdbId = process.env.NOTION_PRODUCT_DATABASE_ID;
  const { name, category, gender, price, description, stock } = req.body;

  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ error: "Aucun fichier n'a été téléchargé." });
    }

    // Utilisation de Cloudinary pour téléverser le fichier depuis le dossier local
    const result = await cloudinary.uploader.upload(file.path);

    const produit = new Product({
      name: name,
      category: category,
      gender: gender,
      price: price,
      cover: result.secure_url,
      description: description,
      stock: stock,
    });

    // Enregistrez le produit dans la base de données MongoDB
    await produit.save();
    const newPage = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: ProductdbId,
      },
      properties: {
        "Nom du produit": {
          title: [
            {
              text: {
                content: produit.name,
              },
            },
          ],
        },
        Genre: {
          select: {
            name: produit.gender,
          },
        },
        Catégorie: {
          select: {
            name: produit.category,
          },
        },
        Prix: {
          number: produit.price,
        },
        Date: {
          date: {
            start: currentDate,
          },
        },
      },
    });
    return res.status(201).json({ message: "Produit ajouté !" });
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image :", error);
    return res
      .status(500)
      .json({ error: "Erreur lors du téléchargement de l'image" });
  }
});

app.get("/list", (req, res) => {
  Product.find()
    .then((products) => res.status(200).json(products))
    .catch((error) => res.status(400).json({ error }));
});
app.get("/product/:id", (req, res) => {
  Product.findOne({ _id: req.params.id })
    .then((products) => res.status(200).json(products))
    .catch((error) => res.status(404).json({ error }));
});

app.get("/ticket-list", (req, res) => {
  Ticket.find()
    .sort({ orderDate: -1 })
    .then((tickets) => res.status(200).json(tickets))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/ticket/:id", (req, res) => {
  Ticket.findOne({_id: req.params.id})
    .then((tickets) => res.status(200).json(tickets))
    .catch((error) => res.status(400).json({ error }));
});

// Route pour supprimer un produit par son ID
app.delete("/products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la suppression du produit" });
  }
});

// Route pour supprimer un ticket par son ID
app.delete("/ticket/:id", async (req, res) => {
  const ticketId = req.params.id;
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
      return res.status(404).json({ error: "Ticket non trouvé" });
    }

    res.status(200).json({ message: "Ticket supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du ticket :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la suppression du ticket" });
  }
});

app.get("/tickets-by-numbers", async (req, res) => {
  try {
    const ticketList = req.query.ticketList;
    const ticketNumbers = ticketList.split(","); // Convertir la chaîne en tableau de numéros
    const mesTickets = await Ticket.find({
      ticketNumber: { $in: ticketNumbers },
    }); // Utiliser ticketNumbers
    res.status(200).json(mesTickets);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des tickets" });
  }
});

//ROUTE POUR LA SAUVEGARDE TEMPORAIRE DES FICHIERS DE PERSONNALISATION

app.post("/upload-temp", upload.array("files", 100), async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "Aucun fichier n'a été téléchargé." });
  }

  // Traitement de chaque fichier temporaire et stockage des chemins dans un tableau
  const tempFilePaths = files.map((file) => file.path);

  // Renvoi des chemins des fichiers temporaires côté client
  res.status(200).json({
    message: "Fichiers temporaires téléchargés avec succès",
    tempFilePaths,
  });

  // Attendre 24 heures avant de supprimer les fichiers
  setTimeout(async () => {
    // Suppression des fichiers temporaires après 24 heures
    for (const tempFilePath of tempFilePaths) {
      try {
        await fs.promises.unlink(tempFilePath);
        console.log("Fichier temporaire supprimé avec succès :", tempFilePath);
      } catch (err) {
        console.error(
          "Erreur lors de la suppression du fichier temporaire :",
          err
        );
      }
    }
  }, 24 * 60 * 60 * 1000); // 24 heures en millisecondes
});

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

app.post("/create-order", async (req, res) => {
  //console.log("Données reçues:", req.body);

  const currentDate = new Date().toISOString();
  const {
    dbId = "2e332d43-1242-4118-a0ce-b7b94a48ecfe",
    cartItems,
    cartItemPerso,
    selectedCommune,
    selectedMethod,
    deliveryMethod,
    deliveryPrice,
    totalPrice,
    phoneNumber,
    ticketNumber,
    orderDate,
  } = req.body;

  console.log("cartItems:", cartItems);
  console.log("cartItemPerso:", cartItemPerso);

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: "Le panier est vide" });
  }

  try {
    const ticket = new Ticket({
      cartItems: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        cover: item.cover,
      })),
      cartItemPerso: cartItemPerso.map((item) => ({
        id: item.id,
        type: item.type,
        persoPrice: item.persoPrice,
        quantity: item.quantity,
        cover: item.cover,
      })),
      selectedCommune,
      selectedMethod,
      deliveryMethod,
      deliveryPrice,
      totalPrice,
      phoneNumber,
      ticketNumber,
      orderDate,
    });

    await ticket.save();
    console.log("Ticket sauvegardé:", ticket);

    const uploadFilesToDropbox = async (cartItemPerso) => {
      try {
        const results = await Promise.all(
          cartItemPerso.map(async (item) => {
            const filePaths = item.filePaths;
            const uploadResults = await Promise.all(
              filePaths.map(async (filePath) => {
                try {
                  // Lire le contenu du fichier depuis son chemin
                  const fileContent = fs.readFileSync(filePath);

                  // Obtenir le nom du fichier à partir du chemin
                  const fileName = path.basename(filePath);
                  const dropboxPath = `/NomDuDossier/${ticketNumber}/${fileName}`;

                  // Télécharger le fichier vers Dropbox en utilisant le contenu du fichier
                  const response = await dbx.filesUpload({
                    path: dropboxPath,
                    contents: fileContent,
                    mode: { ".tag": "overwrite" }, // Écraser le fichier s'il existe déjà
                  });

                  console.log("File uploaded successfully:", response);

                  return response;
                } catch (error) {
                  console.error("Error uploading file to Dropbox:", error);
                  throw error;
                }
              })
            );
            return uploadResults;
          })
        );

        console.log("Files uploaded successfully to Dropbox:", results);
        return results;
      } catch (error) {
        console.error("Error uploading files to Dropbox:", error);
        throw error;
      }
    };

    if (cartItemPerso && cartItemPerso.length > 0) {
      await uploadFilesToDropbox(cartItemPerso);
    }

    const newPage = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: dbId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: ticketNumber,
              },
            },
          ],
        },
        Commune: {
          select: {
            name: selectedCommune,
          },
        },
        Prix: {
          number: totalPrice,
        },
        Date: {
          date: {
            start: currentDate,
          },
        },
        "Prix de livraison": {
          phone_number: deliveryPrice,
        },
        Téléphone: {
          phone_number: phoneNumber,
        },
        "Méthode de paiement": {
          select: {
            name: selectedMethod,
          },
        },
        "Méthode de livraison": {
          select: {
            name: deliveryMethod,
          },
        },
      },
    });
    console.log("Page Notion créée:", newPage);

    res.status(200).json({
      success: true,
      message: "Commande enregistrée avec succès",
      ticketNumber: ticket.ticketNumber,
      data: newPage,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    return res.status(500).json({
      success: false,
      error:
        "Erreur lors de l'enregistrement du ticket ou de la commande dans Notion",
      details: error.message,
    });
  }
});

// NOTION MIDDLEWARE

// Create new database. The page ID is set in the environment variables.
app.post("/databases", async function (request, response) {
  const pageId = process.env.NOTION_DATABASE_ID;
  const title = request.body.dbName;

  try {
    const newDb = await notion.databases.create({
      parent: {
        type: "page_id",
        page_id: pageId,
      },
      title: [
        {
          type: "text",
          text: {
            content: title,
          },
        },
      ],
      properties: {
        Name: {
          title: {},
        },
      },
    });
    response.json({ message: "success!", data: newDb });
  } catch (error) {
    response.json({ message: "error", error });
  }
});

// Create new page. The database ID is provided in the web form.
app.post("/pages", async function (request, response) {
  const { dbId, pageName, header } = request.body;

  try {
    const newPage = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: dbId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: pageName,
              },
            },
          ],
        },
      },
    });
    response.json({ message: "success!", data: newPage });
  } catch (error) {
    response.json({ message: "error", error });
  }
});

// Route pour modifier le status d'une commande
app.patch('/ticket/:id', async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    if (!updatedTicket) {
      return res.status(404).json({ error: 'Ticket non trouvé' });
    }
    
    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du status:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du status' });
  }
});

// Route pour éditer un produit
app.put('/products/:id', upload.single('file'), async (req, res) => {
  try {
    const { name, category, gender, price, description, stock } = req.body;
    const updateData = {
      name,
      category,
      gender,
      price,
      description,
      stock
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.cover = result.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
  }
});

// Routes pour les livreurs
app.get('/delivery-persons', async (req, res) => {
  try {
    const deliveryPersons = await DeliveryPerson.find()
      .populate('activeOrders');
    res.status(200).json(deliveryPersons);
  } catch (error) {
    console.error('Erreur lors de la récupération des livreurs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des livreurs' });
  }
});

app.post('/delivery-persons', async (req, res) => {
  try {
    const deliveryPerson = new DeliveryPerson({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    });
    
    const savedPerson = await deliveryPerson.save();
    res.status(201).json(savedPerson);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du livreur:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du livreur' });
  }
});

app.delete('/delivery-persons/:id', async (req, res) => {
  try {
    const deletedPerson = await DeliveryPerson.findByIdAndDelete(req.params.id);
    
    if (!deletedPerson) {
      return res.status(404).json({ error: 'Livreur non trouvé' });
    }
    
    res.status(200).json({ message: 'Livreur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du livreur:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du livreur' });
  }
});

// Route pour assigner un livreur à une commande
app.post('/assign-delivery', async (req, res) => {
  try {
    const { orderId, deliveryPersonId } = req.body;
    
    const ticket = await Ticket.findById(orderId);
    const deliveryPerson = await DeliveryPerson.findById(deliveryPersonId);
    
    if (!ticket || !deliveryPerson) {
      return res.status(404).json({ error: 'Ticket ou livreur non trouvé' });
    }
    
    // Assignation du livreur
    ticket.deliveryPersonName = deliveryPerson.name;
    ticket.isAssigned = true;
    await ticket.save();
    
    // Mettre à jour le statut du livreur
    deliveryPerson.activeOrders.push(orderId);
    deliveryPerson.status = 'occupé';
    await deliveryPerson.save();
    
    res.status(200).json({ ticket, deliveryPerson });
  } catch (error) {
    console.error('Erreur lors de l\'assignation du livreur:', error);
    res.status(500).json({ error: 'Erreur lors de l\'assignation du livreur' });
  }
});

module.exports = app;
