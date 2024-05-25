import * as contactsService from "../services/contactsServices.js";
import { createContactSchema } from "../schemas/contactsSchemas.js";
import Contact from "../models/contact.js";
import mongoose from "mongoose";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOneContact = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const contact = await Contact.findOne({ _id: id, owner: req.user.id });
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteContact = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedContact = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });
    if (deletedContact) {
      res.status(200).json(deletedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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

    const newContact = new Contact({
      name,
      email,
      phone,
      owner: req.user.id,
    });

    const createdContact = await newContact.save();
    res.status(201).json(createdContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  const id = req.params.id;
  const updatedContactData = req.body;

  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      updatedContactData,
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFavoriteStatus = async (req, res) => {
  const id = req.params.id;
  const { favorite } = req.body;

  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      { favorite },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
