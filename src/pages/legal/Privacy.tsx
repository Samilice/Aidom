export function Privacy() {
  return (
    <div className="legal-page">
      <h1>Politique de confidentialité</h1>
      <p className="updated">Dernière mise à jour : mars 2026</p>

      <h2>1. Responsable du traitement</h2>
      <p>Thomas Busquets, Suisse.<br />Email : contact@aidom.ch</p>

      <h2>2. Données collectées</h2>
      <p>Nous collectons les catégories de données suivantes :</p>
      <ul>
        <li><strong>Données employeur :</strong> nom, prénom, adresse, canton, téléphone, numéro AVS</li>
        <li><strong>Données employé :</strong> nom, prénom, date de naissance, nationalité, type de permis, numéro AVS, salaire, horaires</li>
        <li><strong>Données de paie :</strong> heures travaillées, calculs de cotisations, montants nets</li>
        <li><strong>Données de compte :</strong> email, mot de passe (haché), date d'inscription</li>
      </ul>

      <h2>3. Finalités du traitement</h2>
      <ul>
        <li>Gestion du compte utilisateur et authentification</li>
        <li>Calcul des cotisations sociales et génération de documents</li>
        <li>Envoi de rappels et notifications liés au service</li>
        <li>Facturation et gestion de l'abonnement</li>
      </ul>

      <h2>4. Base juridique</h2>
      <p>
        Le traitement repose sur l'exécution du contrat (CGV), le consentement de l'utilisateur,
        et les obligations légales en matière de conservation des données commerciales.
      </p>

      <h2>5. Numéros AVS</h2>
      <p>
        Les numéros AVS sont stockés de manière chiffrée (AES-256). Ils sont utilisés
        exclusivement pour la génération de documents (contrats, fiches de paie) et ne sont
        jamais partagés avec des tiers.
      </p>

      <h2>6. Durée de conservation</h2>
      <p>
        Les données sont conservées pendant la durée du compte utilisateur, puis 10 ans
        après la suppression du compte conformément aux obligations légales de conservation
        des documents commerciaux en Suisse (CO Art. 958f).
      </p>

      <h2>7. Sous-traitants</h2>
      <ul>
        <li><strong>Hébergement :</strong> Vercel Inc. (frontend et base de données)</li>
        <li><strong>Paiement :</strong> Stripe Inc. (traitement des paiements)</li>
        <li><strong>Emails :</strong> Resend (emails transactionnels)</li>
      </ul>

      <h2>8. Transferts internationaux</h2>
      <p>
        Certains sous-traitants (Stripe, Vercel) peuvent traiter des données aux États-Unis
        sous couvert de garanties contractuelles appropriées (clauses contractuelles types).
      </p>

      <h2>9. Droits des utilisateurs</h2>
      <p>Vous disposez des droits suivants :</p>
      <ul>
        <li>Droit d'accès à vos données personnelles</li>
        <li>Droit de rectification des données inexactes</li>
        <li>Droit d'effacement (« droit à l'oubli »)</li>
        <li>Droit à la portabilité des données</li>
        <li>Droit d'opposition au traitement</li>
      </ul>
      <p>Pour exercer ces droits : contact@aidom.ch</p>

      <h2>10. Cookies</h2>
      <p>
        Aidom utilise uniquement des cookies techniques nécessaires au fonctionnement du service
        (authentification, préférences de langue). Aucun cookie de suivi publicitaire n'est utilisé.
      </p>

      <h2>11. Réclamation</h2>
      <p>
        En cas de litige, vous pouvez déposer une réclamation auprès du Préposé fédéral à la
        protection des données et à la transparence (PFPDT).
      </p>
    </div>
  );
}
