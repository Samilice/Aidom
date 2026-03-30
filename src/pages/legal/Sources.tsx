export function Sources() {
  return (
    <div className="legal-page">
      <h1>Sources</h1>
      <p className="updated">Dernière mise à jour : mars 2026</p>

      <p>
        Les taux et informations utilisés par Aidom proviennent de sources officielles suisses.
        Nous mettons à jour ces données régulièrement pour garantir leur exactitude.
      </p>

      <h2>Cotisations sociales</h2>
      <ul>
        <li>Office fédéral des assurances sociales (OFAS/BSV) — Taux de cotisation AVS/AI/APG</li>
        <li>Secrétariat d'État à l'économie (SECO) — Taux assurance chômage (AC)</li>
        <li>Suva — Taux LAA pour employés de maison</li>
        <li>Caisses de compensation cantonales — Taux allocations familiales par canton</li>
      </ul>

      <h2>Droit du travail</h2>
      <ul>
        <li>Code des obligations (CO), Art. 319 ss. — Contrat de travail</li>
        <li>Contrats-types de travail cantonaux pour l'économie domestique</li>
        <li>Loi fédérale contre le travail au noir (LTN/BGSA)</li>
      </ul>

      <h2>Protection des données</h2>
      <ul>
        <li>Nouvelle loi fédérale sur la protection des données (nLPD), en vigueur depuis le 1er septembre 2023</li>
        <li>Ordonnance sur la protection des données (OPDo)</li>
      </ul>

      <h2>Salaires minimaux</h2>
      <ul>
        <li>Canton de Genève — Loi sur le salaire minimum (LSMG)</li>
        <li>Canton de Neuchâtel — Loi sur l'emploi et l'assurance-chômage</li>
        <li>Canton du Jura — Loi sur le salaire minimum</li>
        <li>Canton de Bâle-Ville — Mindestlohngesetz</li>
      </ul>

      <h2>Avertissement</h2>
      <p>
        Malgré le soin apporté à la mise à jour des taux, Aidom ne peut garantir l'exactitude
        absolue de tous les calculs. Les taux officiels peuvent être modifiés par les autorités
        compétentes. Nous recommandons de vérifier les montants auprès de votre caisse de
        compensation cantonale.
      </p>
    </div>
  );
}
