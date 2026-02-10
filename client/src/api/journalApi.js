import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getJournalEntries = () =>
  API.get("/journal");

export const saveJournalEntry = (data) =>
  API.post("/journal", data);
