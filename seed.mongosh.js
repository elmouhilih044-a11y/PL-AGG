(async () => {
{
  // Vérifier le nom AVANT toute suppression.
  if (db.getName() !== "pl_aggregations") {
    throw new Error("Seed refusé : sélectionner uniquement la base pl_aggregations.");
  }

  const members = [
    { _id: "MB-001", fullName: "Salma Bennani", city: "CASABLANCA", active: true },
    { _id: "MB-002", fullName: "Yassine El Amrani", city: "RABAT", active: true },
    { _id: "MB-003", fullName: "Lina Idrissi", city: "CASABLANCA", active: true },
    { _id: "MB-004", fullName: "Omar Tazi", city: "FES", active: false }
  ];

  const equipments = [
    { _id: "EQ-001", assetTag: "INF-001", name: "Ordinateur portable", category: "INFORMATIQUE", archived: false },
    { _id: "EQ-002", assetTag: "INF-002", name: "Ordinateur de bureau", category: "INFORMATIQUE", archived: false },
    { _id: "EQ-003", assetTag: "VID-001", name: "Vidéoprojecteur", category: "VIDEO", archived: false },
    { _id: "EQ-004", assetTag: "VID-002", name: "Caméra", category: "VIDEO", archived: false },
    { _id: "EQ-005", assetTag: "AUD-001", name: "Enceinte", category: "AUDIO", archived: false },
    { _id: "EQ-006", assetTag: "INF-OLD", name: "Ancien ordinateur", category: "INFORMATIQUE", archived: true }
  ];

  // Douze prêts rendus, dont un sur matériel archivé ; un actif et un annulé.
  // Les montants sont déjà calculés en centimes, indépendamment de la durée.
  // Les dates de début/retour sont cohérentes avec durationDays pour les rendus.
  const loans = [
    { _id: "LN-001", memberId: "MB-001", equipmentId: "EQ-001", status: "RETURNED", startedAt: ISODate("2026-02-26T00:00:00Z"), returnedAt: ISODate("2026-03-01T00:00:00Z"), durationDays: 3, feeCents: 6000 },
    { _id: "LN-002", memberId: "MB-001", equipmentId: "EQ-002", status: "RETURNED", startedAt: ISODate("2026-03-07T00:00:00Z"), returnedAt: ISODate("2026-03-10T00:00:00Z"), durationDays: 3, feeCents: 2000 },
    { _id: "LN-003", memberId: "MB-003", equipmentId: "EQ-003", status: "RETURNED", startedAt: ISODate("2026-03-12T00:00:00Z"), returnedAt: ISODate("2026-03-15T00:00:00Z"), durationDays: 3, feeCents: 4400 },
    { _id: "LN-004", memberId: "MB-003", equipmentId: "EQ-004", status: "RETURNED", startedAt: ISODate("2026-03-17T00:00:00Z"), returnedAt: ISODate("2026-03-20T00:00:00Z"), durationDays: 3, feeCents: 0 },
    { _id: "LN-005", memberId: "MB-002", equipmentId: "EQ-005", status: "RETURNED", startedAt: ISODate("2026-03-29T00:00:00Z"), returnedAt: ISODate("2026-03-31T00:00:00Z"), durationDays: 2, feeCents: 1000 },
    { _id: "LN-006", memberId: "MB-002", equipmentId: "EQ-003", status: "RETURNED", startedAt: ISODate("2026-03-29T00:00:00Z"), returnedAt: ISODate("2026-04-01T00:00:00Z"), durationDays: 3, feeCents: 10000 },
    { _id: "LN-007", memberId: "MB-002", equipmentId: "EQ-004", status: "RETURNED", startedAt: ISODate("2026-04-07T00:00:00Z"), returnedAt: ISODate("2026-04-10T00:00:00Z"), durationDays: 3, feeCents: 8000 },
    { _id: "LN-008", memberId: "MB-004", equipmentId: "EQ-003", status: "RETURNED", startedAt: ISODate("2026-04-12T00:00:00Z"), returnedAt: ISODate("2026-04-15T00:00:00Z"), durationDays: 3, feeCents: 2000 },
    { _id: "LN-009", memberId: "MB-001", equipmentId: "EQ-001", status: "RETURNED", startedAt: ISODate("2026-04-17T00:00:00Z"), returnedAt: ISODate("2026-04-20T00:00:00Z"), durationDays: 3, feeCents: 3000 },
    { _id: "LN-010", memberId: "MB-003", equipmentId: "EQ-002", status: "RETURNED", startedAt: ISODate("2026-04-22T00:00:00Z"), returnedAt: ISODate("2026-04-25T00:00:00Z"), durationDays: 3, feeCents: 1000 },
    { _id: "LN-011", memberId: "MB-001", equipmentId: "EQ-005", status: "RETURNED", startedAt: ISODate("2026-04-28T00:00:00Z"), returnedAt: ISODate("2026-04-30T00:00:00Z"), durationDays: 2, feeCents: 3000 },
    { _id: "LN-012", memberId: "MB-001", equipmentId: "EQ-006", status: "RETURNED", startedAt: ISODate("2026-03-02T00:00:00Z"), returnedAt: ISODate("2026-03-05T00:00:00Z"), durationDays: 3, feeCents: 3000 },
    { _id: "LN-013", memberId: "MB-002", equipmentId: "EQ-001", status: "ACTIVE", startedAt: ISODate("2026-04-29T00:00:00Z"), returnedAt: null, durationDays: 3, feeCents: 9000 },
    { _id: "LN-014", memberId: "MB-003", equipmentId: "EQ-005", status: "CANCELLED", startedAt: ISODate("2026-03-25T00:00:00Z"), returnedAt: null, durationDays: 2, feeCents: 0 }
  ];

  // Cinq dépenses admissibles ; une sur équipement archivé, une orpheline,
  // une en cours. EQ-ABSENT est volontairement inexistant.
  const maintenance = [
    { _id: "MT-001", equipmentId: "EQ-003", status: "DONE", performedAt: ISODate("2026-03-03T00:00:00Z"), costCents: 2500 },
    { _id: "MT-002", equipmentId: "EQ-003", status: "DONE", performedAt: ISODate("2026-03-21T00:00:00Z"), costCents: 3000 },
    { _id: "MT-003", equipmentId: "EQ-004", status: "DONE", performedAt: ISODate("2026-04-12T00:00:00Z"), costCents: 4000 },
    { _id: "MT-004", equipmentId: "EQ-001", status: "DONE", performedAt: ISODate("2026-04-22T00:00:00Z"), costCents: 5000 },
    { _id: "MT-005", equipmentId: "EQ-005", status: "DONE", performedAt: ISODate("2026-04-26T00:00:00Z"), costCents: 1200 },
    { _id: "MT-006", equipmentId: "EQ-006", status: "DONE", performedAt: ISODate("2026-03-06T00:00:00Z"), costCents: 6000 },
    { _id: "MT-007", equipmentId: "EQ-ABSENT", status: "DONE", performedAt: ISODate("2026-04-15T00:00:00Z"), costCents: 9999 },
    { _id: "MT-008", equipmentId: "EQ-002", status: "IN_PROGRESS", performedAt: null, costCents: 8000 }
  ];

  // Le PDF prévoit une réinitialisation : cela évite que des essais précédents
  // modifient les résultats attendus. Aucun dropDatabase n'est exécuté.
  for (const [name, documents] of [["members", members], ["equipments", equipments], ["loans", loans], ["maintenance", maintenance]]) {
    await db.getCollection(name).deleteMany({});
    await db.getCollection(name).insertMany(documents);
  }

  print("MaterialDesk initialisé : 4 membres, 6 équipements, 14 prêts, 8 interventions.");
  print("Base : pl_aggregations. Dates BSON UTC, références textuelles, montants en centimes.");
}
})();