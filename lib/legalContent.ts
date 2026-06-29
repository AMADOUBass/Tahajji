/**
 * Contenu des pages « À propos / Crédits », « Confidentialité » et « CGU ».
 *
 * ⚠️ Les pages Confidentialité et CGU sont des BROUILLONS sérieux mais doivent
 * être relues par un juriste avant publication sur les stores. Remplacer
 * l'e-mail de contact et la juridiction par les valeurs réelles.
 */
export type LegalSection = { heading?: string; body: string };
export type LegalDoc = {
  title: string;
  updated: string;
  disclaimer?: string;
  sections: LegalSection[];
};

const CONTACT = 'contact@tahajji.app'; // TODO : remplacer par l'adresse réelle
const UPDATED = 'Juin 2026';

export const LEGAL: Record<'about' | 'privacy' | 'terms', LegalDoc> = {
  about: {
    title: 'À propos & crédits',
    updated: UPDATED,
    sections: [
      {
        body:
          'Tahajji (تهجّي) aide les francophones débutants à apprendre à lire le Coran, ' +
          'pas à pas, depuis zéro. L’apprentissage est gratuit ; certaines fonctionnalités ' +
          'avancées sont proposées en Premium.',
      },
      {
        heading: 'Méthode pédagogique',
        body:
          'Le parcours s’appuie sur la méthode « La mine des novices pour la lecture du ' +
          'saint Coran » (RECI, Bamako), utilisée avec l’autorisation de son auteur, et ' +
          'fusionnée avec la pédagogie de la Qaïda Nourania. Nos remerciements à l’auteur ' +
          'pour son travail et sa confiance.',
      },
      {
        heading: 'Texte du Coran',
        body:
          'Le texte arabe suit le rasm ‘Uthmani (Hafs). La traduction française des sens ' +
          'est celle de Muhammad Hamidullah. Le Coran est présenté à titre d’apprentissage ' +
          'et de lecture.',
      },
      {
        heading: 'Récitations audio',
        body:
          'Les récitations des versets proviennent de ressources en ligne (récitation de ' +
          'Mishary Rashid Alafasy). Les sons des leçons sont enregistrés spécifiquement ' +
          'pour l’application.',
      },
      {
        heading: 'Validation religieuse',
        body:
          'Le contenu est en cours de validation par une autorité religieuse compétente ' +
          'avant publication. Pour signaler une erreur, écris-nous : ' + CONTACT + '.',
      },
      {
        heading: 'Contact',
        body: 'Une question, une suggestion ? ' + CONTACT,
      },
    ],
  },

  privacy: {
    title: 'Politique de confidentialité',
    updated: UPDATED,
    disclaimer: 'Brouillon — à faire relire par un juriste avant publication.',
    sections: [
      {
        body:
          'Cette politique explique quelles données Tahajji collecte, pourquoi, et tes droits. ' +
          'Nous limitons la collecte au strict nécessaire au fonctionnement de l’app.',
      },
      {
        heading: 'Données que nous collectons',
        body:
          '• Compte : ton adresse e-mail (pour la connexion et la confirmation).\n' +
          '• Profil : nom affiché et, si tu le renseignes, une courte bio.\n' +
          '• Progression : leçons terminées, XP, série, cœurs, badges, dernière lecture.\n' +
          'Nous ne collectons pas ta localisation ni tes contacts, et n’affichons pas de publicité.',
      },
      {
        heading: 'Pourquoi',
        body:
          'Ces données servent uniquement à fournir le service : t’authentifier, sauvegarder ' +
          'ta progression entre tes appareils et personnaliser ton parcours.',
      },
      {
        heading: 'Hébergement et sous-traitants',
        body:
          'Les données sont hébergées via Supabase (base de données et authentification), ' +
          'qui agit comme sous-traitant. L’accès est protégé par des règles de sécurité au ' +
          'niveau de chaque ligne (RLS) : tu n’accèdes qu’à tes propres données.',
      },
      {
        heading: 'Notifications',
        body:
          'Si tu actives le « rappel quotidien », une notification locale est planifiée sur ' +
          'ton téléphone. Aucune donnée n’est envoyée à un serveur pour cela.',
      },
      {
        heading: 'Mode hors-ligne',
        body:
          'Le contenu et ta progression sont enregistrés sur ton appareil pour fonctionner ' +
          'sans connexion. Ils sont synchronisés avec le serveur au retour du réseau.',
      },
      {
        heading: 'Tes droits',
        body:
          'Tu peux accéder à tes données, les corriger (écran Profil) ou demander la ' +
          'suppression de ton compte et de tes données en nous écrivant à ' + CONTACT + '.',
      },
      {
        heading: 'Conservation',
        body:
          'Tes données sont conservées tant que ton compte existe. À la suppression du ' +
          'compte, elles sont effacées dans un délai raisonnable.',
      },
      {
        heading: 'Contact',
        body: 'Pour toute question relative à tes données : ' + CONTACT,
      },
    ],
  },

  terms: {
    title: 'Conditions d’utilisation',
    updated: UPDATED,
    disclaimer: 'Brouillon — à faire relire par un juriste avant publication.',
    sections: [
      {
        heading: 'Objet',
        body:
          'Tahajji est une application d’apprentissage de la lecture du Coran pour débutants ' +
          'francophones. En utilisant l’app, tu acceptes les présentes conditions.',
      },
      {
        heading: 'Compte',
        body:
          'Tu t’engages à fournir une adresse e-mail valide et à garder ton mot de passe ' +
          'confidentiel. Tu es responsable de l’activité sur ton compte.',
      },
      {
        heading: 'Utilisation',
        body:
          'L’app est destinée à un usage personnel et non commercial. Il est interdit d’en ' +
          'détourner le fonctionnement, de tenter d’en contourner la sécurité ou d’en ' +
          'extraire le contenu de manière automatisée.',
      },
      {
        heading: 'Premium et abonnements',
        body:
          'Certaines fonctionnalités sont payantes. Les achats et abonnements sont gérés et ' +
          'facturés par la boutique d’applications (App Store / Google Play). Le ' +
          'renouvellement et la résiliation se gèrent depuis ton compte de la boutique.',
      },
      {
        heading: 'Propriété intellectuelle',
        body:
          'Le texte du Coran relève du domaine public. La méthode pédagogique est utilisée ' +
          'avec l’autorisation de son auteur. La traduction des sens est attribuée à son ' +
          'auteur (Hamidullah). Le reste de l’application (code, design, agencement du ' +
          'contenu) est protégé.',
      },
      {
        heading: 'Contenu religieux',
        body:
          'Nous apportons un grand soin à l’exactitude du contenu, en cours de validation ' +
          'par une autorité compétente. En cas d’erreur constatée, merci de nous la signaler.',
      },
      {
        heading: 'Responsabilité',
        body:
          'L’application est fournie « en l’état ». Nous nous efforçons d’en assurer la ' +
          'disponibilité et l’exactitude sans pouvoir les garantir de façon absolue.',
      },
      {
        heading: 'Modifications',
        body:
          'Ces conditions peuvent évoluer. Les changements importants seront signalés dans ' +
          'l’application.',
      },
      {
        heading: 'Contact',
        body: 'Pour toute question : ' + CONTACT,
      },
    ],
  },
};
