
import { Database } from './types';

// This file augments the Database type to account for the tables that we just created
// This helps TypeScript understand our database schema

export type Tables = Database['public']['Tables'];

// Extract row types for each table
export type ProfileRow = Tables['profiles']['Row'];
export type DoctorRow = Tables['doctors']['Row'];
export type PatientRow = Tables['patients']['Row'];
export type AppointmentRow = Tables['appointments']['Row'];

// Type-safe selectors with nested objects
export type DoctorWithProfile = DoctorRow & {
  profiles: ProfileRow;
};

export type PatientWithProfile = PatientRow & {
  profiles: ProfileRow;
};

export type AppointmentWithPatient = AppointmentRow & {
  patients: PatientWithProfile;
};
