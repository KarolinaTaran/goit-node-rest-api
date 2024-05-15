import * as contactsService from "../services/contactsServices.js";
import { createContactSchema } from "../schemas/contactsSchemas.js";

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
        res.status(200).json(deletedContact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

export const createContact = async (req, res) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "Name, email, and phone are required fields" });
    }

    const createdContact = await contactsService.addContact({
      name,
      email,
      phone,
    });
    res.status(201).json(createdContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  const id = req.params.id;
  const updatedContactData = req.body;

  try {
    const updatedContact = await contactsService.updateContact(
      id,
      updatedContactData
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
