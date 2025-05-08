import express from "express";

import { Activity, Sport, sportsValues } from "../model/activity.js";
import { SpreadAssignment } from "typescript";
import { error } from "console";

export const sportsRouter: express.Router = express.Router();

interface activityFilter {
  name?: string;
  sport?: string;
  distance?: number;
  date?: Date;
  description?: string;
}

sportsRouter.post("/activities", async (req, res) => {
  const activity = new Activity(req.body);

  try {
    await activity.save();
    res.status(201).send(activity);

  } catch (error) {
    res.status(500).send(error);
  }
});

sportsRouter.get("/activities", async (req, res) => {
  const filter: activityFilter = {};

  if (req.query.name) {
    filter.name = req.query.name.toString();
  }
  if (req.query.sport) {
    if (!sportsValues.includes(req.query.sport as Sport)) {
      res.status(400).send(error);
    }
    filter.sport = req.query.sport.toString();
  }
  if (req.query.distance) {
    filter.distance = parseFloat(req.query.distance.toString());
  }
  if (req.query.date) {
    filter.date = new Date(req.query.date.toString());
  }
  if (req.query.description) {
    filter.description = req.query.description.toString();
  }

  try {
    const activities = await Activity.find(filter);
    res.status(200).send(activities);
  } catch (error) {
    res.status(500).send(error);
  }
});

sportsRouter.get("/activities/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      res.status(404).send({ error: "Activity not found" });
    }
    res.status(200).send(activity);
  } catch (error) {
    res.status(500).send(error);
  }
});

sportsRouter.patch("/activities/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "sport", "distance", "date", "description"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update),
  );
  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body);
    if (!activity) res.status(404).send({ error: "Activity not found"});
    res.status(200).send(activity);
    
  } catch (error) {
    res.status(500).send(error);
  }
});

sportsRouter.delete("/activities/:id", async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) res.status(404).send({ error: "Activity not found"});
    res.status(200).send(activity);

  } catch (error) {
    res.status(500).send(error);
  }
});