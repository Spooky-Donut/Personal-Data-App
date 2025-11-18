interface Persona {
  id_type: string;
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  birthdate: Date;
  gender: string;
  email: string;
  phone: number;
  foto: string;
}

export type { Persona };
