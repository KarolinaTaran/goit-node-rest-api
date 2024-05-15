import * as fs from "node:fs/promises";
import path from "node:path";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
}

async function saveContacts(contacts) {
  const data = JSON.stringify(contacts);
  await fs.writeFile(contactsPath, data);
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    return contacts.find((contact) => contact.id === contactId) || null;
  } catch (error) {
    throw new Error(`Unable to get contact by id: ${error}`);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) return null;
    const removedContact = contacts.splice(index, 1)[0];
    await saveContacts(contacts);
    return removedContact;
  } catch (error) {
    throw new Error(`Unable to remove contact: ${error}`);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = { id: Date.now().toString(), name, email, phone };
    contacts.push(newContact);
    await saveContacts(contacts);
    return newContact;
  } catch (error) {
    throw new Error(`Unable to add contact: ${error}`);
  }
}

async function updateContact(id, updatedContactData) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === id);
    if (index === -1) return null;
    const existingContact = contacts[index];
    Object.assign(existingContact, updatedContactData);
    await saveContacts(contacts);
    return existingContact;
  } catch (error) {
    throw new Error(`Unable to update contact: ${error}`);
  }
}

export {
  getContactById,
  removeContact,
  addContact,
  listContacts,
  updateContact,
};
