const PAS_FRONTALIER = "Aucun pays frontaliers";
const PAS_MONNAIE = "Pas de monnaie";
const PAS_SURFACE = "Indéfini";
const ID_TBODY_PAYS = "contenu-table-pays"
const NB_PAYS_PAR_PAGE = 25;
const DEFAULT_VALUE_FILTRE_CONTINENT = "--Sélectionner un continent--";
const DEFAULT_VALUE_FILTRE_LANGUE = "--Sélectionner une langue--";

var data = JSON.parse("[]");

let xhr = new  XMLHttpRequest ();
if (!xhr) {
   alert("Erreur de creation de l'objet XML HTTP Request");
} else {
   xhr.open("GET", "./gateway_to_restcountries.php", true);
   xhr.onreadystatechange = process;
   xhr.send(null);
}

function process () {
   if (xhr.readyState == 4) {
      if (xhr.status == 200) {
         alert("Ca marche : le serveur a repondu !");
         data = JSON.parse(xhr.responseText);

         fill_db();

         onClickSuivant(); //Initialisation de la liste des pays

         //Ajout de l'écouteur sur le bouton suivant
         let bt_suivant = document.getElementById("bt_suivant"); //Récupération de l'élément
         bt_suivant.addEventListener("click",onClickSuivant); //Ajout de l'écouteur
      } else {
         alert("Erreur retour requete XML HTTP : "+xhr.status);
      }
   }
}