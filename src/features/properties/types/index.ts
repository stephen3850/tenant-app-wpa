import { Property, Unit, User } from "@prisma/client";

export type PropertyWithDetails = Property & {
  landlord?: Pick<User, "name" | "email"> | null;
  caretaker?: Pick<User, "name"> | null;
  units?: Unit[];
  _count?: {
    units: number;
  };
};

export type PropertyStats = {
  total: number;
  active: number;
  archived: number;
  occupancy: number;
};
