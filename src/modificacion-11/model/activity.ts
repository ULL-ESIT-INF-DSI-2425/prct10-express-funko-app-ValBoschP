import { Document, model, Schema } from "mongoose";
import validator from "validator";

export type Sport = "Running" | "Cycling" | "Swimming" | "Walking" | "Hiking";

export const sportsValues = [
  "Running",
  "Cycling",
  "Swimming",
  "Walking",
  "Hiking"
];

interface ActivityDocumentInterface extends Document {
  name: string;
  sport: string;
  distance: number
  date: Date;
  description?: string;
}

const ActivitySchema = new Schema<ActivityDocumentInterface>({
  name: {
    type: String,
    required: true,
    default: "Running",
    validate: {
      validator: (value: string) =>
        !validator.isEmpty(value, { ignore_whitespace: true }),
      message: "Activity name must not be empty",
    }
  },
  sport: {
    type: String,
    required: true,
    enum: sportsValues,
    validate: {
      validator: (value: string) => sportsValues.includes(value),
      message: "Invalid sport value",
    }
  },
  distance: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => value >= 0,
      message: "Distance must be a positive number",
    }
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: (value: Date) => value <= new Date(),
      message: "Date must be in the past",
    },
    default: Date.now,
  },
  description: {
    type: String,
    validate: {
      validator: (value: string) =>
        !validator.isEmpty(value, { ignore_whitespace: true }),
      message: "Description must not be empty",
    }
  }
});

export const Activity = model<ActivityDocumentInterface>("activity", ActivitySchema);