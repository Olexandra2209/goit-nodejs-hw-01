const fs = require("node:fs/promises");
const path = require("node:path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function getContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "UTF-8" });

  return JSON.parse(data);
}

function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function listContacts() {
  const contacts = await getContacts();

  return contacts;
}

async function getContactById(contactId) {
  const contacts = await getContacts();

  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contacts = await getContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const newContacts = [
    ...contacts.slice(0, index),
    ...contacts.slice(index + 1),
  ];
  await writeContacts(newContacts);
  return contacts[index];
}

async function addContact(name, email, phone) {
  const contacts = await getContacts();
  const newContact = { id: nanoid(), name, email, phone };

  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
