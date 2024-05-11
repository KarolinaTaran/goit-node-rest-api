import * as contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HTTPError.js";

export const getAllContacts = (req, res) => {
  contactsService
    .listContacts()
    .then((contacts) => res.status(200).json(contacts))
    .catch((err) => res.status(500).json({ message: err.message }));
};

export const getOneContact = (req, res) => {
  const id = req.params.id;
  contactsService
    .getContactById(id)
    .then((contact) => {
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

export const deleteContact = (req, res) => {
  const id = req.params.id;
  contactsService
    .removeContact(id)
    .then((deletedContact) => {
      if (deletedContact) {
        res.status(200).json({ message: "Contact deleted successfully" });
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

export const createContact = (req, res) => {
  const { error } = createContactSchema.validate(req.body);
  if (error) {
    throw new HttpError(400, error.message);
  }
  const newContact = req.body;
  contactsService
    .addContact(newContact)
    .then((createdContact) => res.status(201).json(createdContact))
    .catch((err) => res.status(500).json({ message: err.message }));
};

export const updateContact = (req, res) => {
  const id = req.params.id;
  const updatedContactData = req.body;
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    throw new HttpError(400, error.message);
  }
  contactsService
    .updateContact(
      id,
      updatedContactData.name,
      updatedContactData.email,
      updatedContactData.phone
    )
    .then((updatedContact) => {
      if (!updatedContact) {
        throw new HttpError(404, "Not found");
      }
      res.status(200).json(updatedContact);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
