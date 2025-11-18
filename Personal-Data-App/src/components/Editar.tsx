import { useState } from "react";
import Busqueda from "../utils/Busqueda.tsx";
import Detalles from "../utils/Detalles.tsx";
import Back from "../utils/BackButton.tsx";

function Editar() {
  const personasSimuladas = [
    {
      id_type: "cc",
      id: 1000000000,
      first_name: "Juan",
      middle_name: "",
      last_name: "Pérez",
      birthdate: new Date("1995-05-10"),
      gender: "m",
      email: "juan@example.com",
      phone: 123,
    },
    {
      id_type: "cc",
      id: 2000000000,
      first_name: "Ana",
      middle_name: "",
      last_name: "López",
      birthdate: new Date("1998-09-25"),
      gender: "f",
      email: "ana@example.com",
      phone: 111,
    },
    {
      id_type: "ti",
      id: 3000000000,
      first_name: "Pedro",
      middle_name: "Daniel",
      last_name: "Gómez",
      birthdate: new Date("2009-01-15"),
      gender: "m",
      email: "pedro@example.com",
      phone: 102,
    },
    {
      id_type: "cc",
      id: 4000000000,
      first_name: "Laura",
      middle_name: "Isabel",
      last_name: "Martínez",
      birthdate: new Date("1992-03-12"),
      gender: "f",
      email: "laura.martinez@example.com",
      phone: 555111222,
    },
    {
      id_type: "cc",
      id: 5000000000,
      first_name: "Carlos",
      middle_name: "Andrés",
      last_name: "Ramírez",
      birthdate: new Date("1988-07-19"),
      gender: "m",
      email: "carlos.ramirez@example.com",
      phone: 555333444,
    },
    {
      id_type: "cc",
      id: 6000000000,
      first_name: "María",
      middle_name: "Camila",
      last_name: "Torres",
      birthdate: new Date("1999-11-08"),
      gender: "f",
      email: "maria.torres@example.com",
      phone: 555555666,
    },
    {
      id_type: "cc",
      id: 7000000000,
      first_name: "Andrés",
      middle_name: "Felipe",
      last_name: "García",
      birthdate: new Date("1996-02-27"),
      gender: "m",
      email: "andres.garcia@example.com",
      phone: 555777888,
    },
    {
      id_type: "ti",
      id: 8000000000,
      first_name: "Valentina",
      middle_name: "",
      last_name: "Rodríguez",
      birthdate: new Date("2007-09-30"),
      gender: "f",
      email: "valentina.rodriguez@example.com",
      phone: 555999000,
    },
    {
      id_type: "cc",
      id: 9000000000,
      first_name: "Julián",
      middle_name: "David",
      last_name: "Hernández",
      birthdate: new Date("1994-06-21"),
      gender: "m",
      email: "julian.hernandez@example.com",
      phone: 555222333,
    },
    {
      id_type: "cc",
      id: 1000000000,
      first_name: "Paula",
      middle_name: "Andrea",
      last_name: "Moreno",
      birthdate: new Date("1993-12-04"),
      gender: "f",
      email: "paula.moreno@example.com",
      phone: 555444555,
    },
    {
      id_type: "cc",
      id: 1100000000,
      first_name: "Santiago",
      middle_name: "",
      last_name: "Suárez",
      birthdate: new Date("2000-08-17"),
      gender: "m",
      email: "santiago.suarez@example.com",
      phone: 555666777,
    },
    {
      id_type: "ti",
      id: 1200000000,
      first_name: "Nicolás",
      middle_name: "Alejandro",
      last_name: "Castro",
      birthdate: new Date("1991-01-22"),
      gender: "m",
      email: "nicolas.castro@example.com",
      phone: 555888999,
    },
    {
      id_type: "cc",
      id: 1300000000,
      first_name: "Daniela",
      middle_name: "Sofía",
      last_name: "Jiménez",
      birthdate: new Date("1997-10-05"),
      gender: "f",
      email: "daniela.jimenez@example.com",
      phone: 555000111,
    },
    {
      id_type: "cc",
      id: 1400000000,
      first_name: "Camilo",
      middle_name: "José",
      last_name: "Vargas",
      birthdate: new Date("1990-04-16"),
      gender: "m",
      email: "camilo.vargas@example.com",
      phone: 555111333,
    },
    {
      id_type: "cc",
      id: 1500000000,
      first_name: "Tatiana",
      middle_name: "Lucía",
      last_name: "Ortiz",
      birthdate: new Date("1995-12-09"),
      gender: "f",
      email: "tatiana.ortiz@example.com",
      phone: 555222444,
    },
    {
      id_type: "ti",
      id: 1600000000,
      first_name: "Miguel",
      middle_name: "Ángel",
      last_name: "Ruiz",
      birthdate: new Date("1987-07-30"),
      gender: "m",
      email: "miguel.ruiz@example.com",
      phone: 555333555,
    },
    {
      id_type: "cc",
      id: 1700000000,
      first_name: "Sara",
      middle_name: "Elena",
      last_name: "Cortés",
      birthdate: new Date("2001-02-25"),
      gender: "f",
      email: "sara.cortes@example.com",
      phone: 555444666,
    },
    {
      id_type: "ti",
      id: 1800000000,
      first_name: "David",
      middle_name: "Esteban",
      last_name: "Ríos",
      birthdate: new Date("2008-11-11"),
      gender: "m",
      email: "david.rios@example.com",
      phone: 555555777,
    },
  ];

  const [persona, setPersona] = useState<any | null>(null);

  const handleBusqueda = (id: number) => {
    const encontrada = personasSimuladas.find((p) => p.id === id);
    if (encontrada) {
      setPersona(encontrada);
    } else {
      alert("No se encontró una persona con ese ID");
    }
  };

  return (
    <div>
      <Back />
      {!persona ? (
        <Busqueda onBuscar={handleBusqueda} />
      ) : (
        <Detalles persona={persona} edit={true} />
      )}
    </div>
  );
}

export default Editar;
