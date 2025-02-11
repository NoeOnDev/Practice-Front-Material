import { useState } from "react";

export const Practica = () => {
  const [userTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const citas = [
    {
      title: "Cita 1",
      start: "2025-09-01T10:00:00Z",
      end: "2025-09-01T11:00:00Z",
    },
    {
      title: "Cita 2",
      start: "2025-09-02T10:00:00Z",
      end: "2025-09-02T11:00:00Z",
    },
    {
      title: "Cita 3",
      start: "2025-09-03T10:00:00Z",
      end: "2025-09-03T20:00:00Z",
    },
  ];

  const formatAppointmentTime = (utcTime) => {
    const date = new Date(utcTime);
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: userTimeZone,
    }).format(date);
  };

  return (
    <div>
      <h2>Tu zona horaria: {userTimeZone}</h2>
      <h3>Citas en tu hora local:</h3>
      <ul>
        {citas.map((cita, index) => (
          <li key={index}>
            {cita.title}: {formatAppointmentTime(cita.start)} -
            {formatAppointmentTime(cita.end)}
          </li>
        ))}
      </ul>
    </div>
  );
};
