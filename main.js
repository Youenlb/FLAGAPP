/**
 * Instanciation des pays avec Country et insertion des pays dans le tableau de classe de Country
 */
function fill_db()
{
    let key_alpha3code;
    let borders;
    let name;
    let code_currency;
    let tableau_code_currency;
    let code_language;
    let tableau_code_language;
    for(let pays of data) //Parcours l'ensemble des pays
    {
        tableau_code_currency = [];
        /**Ajout des monnaies dans la variable all_currencies**/
        if(pays["currencies"] !== undefined)
        {
            for(let currency of pays["currencies"])
            {
                code_currency = currency["code"];
                tableau_code_currency.push(code_currency);
                if(Currency.all_currencies[code_currency] === undefined)
                {
                    Currency.all_currencies[code_currency] = new Currency(
                        currency["code"],
                        currency["name"],
                        currency["symbol"]
                    );
                }
            }
        }
        else //Si pas de monnaie (antartique)
        {
            pays["currencies"] = PAS_MONNAIE;
        }
        /**Ajout des langues dans la variable all_languages**/
        tableau_code_language = [];
        for(let language of pays["languages"])
        {
            code_language = language["iso639_2"];
            tableau_code_language.push(code_language);
            if(Language.all_languages[code_language] === undefined)
            {
                Language.all_languages[code_language] = new Language(
                    code_language,
                    language["name"]
                );
            }
        }

        /**Ajout des pays dans la variable all_countries **/
        key_alpha3code = pays["alpha3Code"];
        //Gestion des traductions du nom du pays afin d'avoir toujours un nom à afficher dans la méthode toString() de la classe Country
        name = pays["name"]; 
        pays["translations"]["en"] = name;
        //Gestion de la valeur borders (pays frontaliers) pour avoir une valeur même si le pays n'a pas de pays frontaliers
        borders = pays["borders"] === undefined ? PAS_FRONTALIER : pays["borders"];
        //Ajout du nouvelle objet dans le tableau 
        Country.all_countries[key_alpha3code] = new Country(
            key_alpha3code,
            pays["area"],
            borders,
            pays["capital"],
            pays["region"],
            pays["demonym"],
            pays["flag"],
            pays["translations"],
            pays["population"],
            pays["topLevelDomain"],
            tableau_code_currency,
            tableau_code_language
        );
    }
}

function addAllCountries(tab_code_pays,template_countrie,id_table_body_pays)
{
    for(let code_pays of tab_code_pays)
    {
        let clone_content_template = document.importNode(template_countrie.content, true);

        //Mise à jour de l'id du tr du pays (attribut)
        let tr_pays = clone_content_template.querySelector("tr");
        tr_pays.setAttribute("id",code_pays);

        //Ajout du nom 
        //console.log("TEST -----------");
        //console.log(dict_countries);

        if(dict_countries[code_pays] !== undefined) {
            if(dict_countries[code_pays].translations["fr"] !== undefined)
            {
                tr_pays.getElementsByClassName("name")[0].textContent = dict_countries[code_pays].translations["fr"];
            }
            else
            {
                tr_pays.getElementsByClassName("name")[0].textContent = dict_countries[code_pays].translations["en"];
            }
            tr_pays.getElementsByClassName("name")[0].setAttribute("onclick", "afficheDetailsOuDrapeauPays(\""+ code_pays+ "\")");
            
            //Ajout population
            tr_pays.getElementsByClassName("population")[0].textContent = dict_countries[code_pays].population;
            tr_pays.getElementsByClassName("population")[0].setAttribute("onclick", "afficheDetailsOuDrapeauPays(\""+ code_pays+ "\")");

            //Ajout surface
            if(dict_countries[code_pays].area !== undefined)
            {
                tr_pays.getElementsByClassName("area")[0].textContent = dict_countries[code_pays].area;
            }
            else
            {
                tr_pays.getElementsByClassName("area")[0].textContent = PAS_SURFACE;
            }
            tr_pays.getElementsByClassName("area")[0].setAttribute("onclick", "afficheDetailsOuDrapeauPays(\""+ code_pays+ "\")");

            //Ajout densite
            if(dict_countries[code_pays].area !== undefined)
            {
                tr_pays.getElementsByClassName("density")[0].textContent = Math.round(dict_countries[code_pays].getPopDensity()*100)/100;
            }
            else
            {
                tr_pays.getElementsByClassName("density")[0].textContent = PAS_SURFACE;
            }
            tr_pays.getElementsByClassName("density")[0].setAttribute("onclick", "afficheDetailsOuDrapeauPays(\""+ code_pays+ "\")");
            
            //Ajout continent
            tr_pays.getElementsByClassName("region")[0].textContent = dict_countries[code_pays].region;
            tr_pays.getElementsByClassName("region")[0].setAttribute("onclick", "afficheDetailsOuDrapeauPays(\""+ code_pays+ "\")");

            //Ajout flag
            tr_pays.getElementsByClassName("flag")[0].querySelector("img").setAttribute("src",dict_countries[code_pays].flag);
            tr_pays.getElementsByClassName("flag")[0].setAttribute("onclick", "afficheDetailsOuDrapeauPays(\""+ code_pays + "\",\"" + dict_countries[code_pays].flag + "\")");
        }
        document.getElementById(id_table_body_pays).appendChild(clone_content_template);
    }
}

let dict_countries = Country.all_countries; //Dictionnaire des pays
let compteur_countries = 0; //Contient le nombre de pays afficher dans l'état de la pagination (50 pour 50 pays afficher sur les 2 pages)
let compteur_page = 0;
function onClickSuivant()
{
    //Variable
    let tab_code_pays = Object.keys(dict_countries); //Liste des alpha3code des pays
    let tab_countries; //Tableau contenant les pays qui vont être ajouter dans le tableau
    let longueur_tableau = Object.keys(dict_countries).length; //Longueur du dictionnaire

    //Récupération des 25 (ou moins) éléments que l'on souhaite afficher
    if(compteur_countries + NB_PAYS_PAR_PAGE <= longueur_tableau) //Si on peux encore ajouter NB_PAYS_PAR_PAGE (on rentre toujours dans cette condition pour la longueur du tableau de pays est un multiple de NB_PAYS_PAR_PAGE)
    {
        tab_countries = tab_code_pays.slice(compteur_countries,compteur_countries + NB_PAYS_PAR_PAGE); //On recupere les pays suivant que l'on va ajouter
        compteur_countries+=NB_PAYS_PAR_PAGE; //On ajoute NB_PAYS_PAR_PAGE au compteur de pays
    }
    else //Si on ne peux pas encore ajouter NB_PAYS_PAR_PAGE (ce cas arrive pour la dernière page de la pagination quand la longueur du tableau des pays n'est pas un multiple de NB_PAYS_PAR_PAGE)
    {
        tab_countries = tab_code_pays.slice(compteur_countries,tab_code_pays.length); //On ajoute les pays restant dans la page
        compteur_countries+=tab_code_pays.length-compteur_countries;
    }
    if(compteur_countries > NB_PAYS_PAR_PAGE) //On ajoute l'écouteur sur le bouton précédent, si on ne se trouve pas sur la première page
    {
        document.getElementById("bt_precedent").addEventListener("click",onClickPrecedent);
    }
    else
    {
        document.getElementById("bt_precedent").removeEventListener("click",onClickPrecedent);
    }
    if(compteur_countries === longueur_tableau) //On enleve l'écouteur sur le bouton suivant, si on se trouve sur la dernière page 
    {
        document.getElementById("bt_suivant").removeEventListener("click",onClickSuivant); //Enleve l'ecouteur pour eviter les erreursé
    }
    else
    {
        document.getElementById("bt_suivant").addEventListener("click",onClickSuivant);
    }
    compteur_page++;
    //Suppression du contenu présent dans la table
    let tbody_table_pays = document.getElementById(ID_TBODY_PAYS);
    tbody_table_pays.innerHTML = "";

    //Ajout des pays dans la page
    let template_country = document.getElementById("un_pays");
    addAllCountries(tab_countries,template_country,ID_TBODY_PAYS);
    
    //Update du numéro de page 
    document.getElementById("num_page").textContent = "Page n°"+compteur_page;
}

function onClickPrecedent()
{
    
    //Tableau all_coutries
    let tab_code_pays = Object.keys(dict_countries);
    let tab_countries;
    let longueur_tableau = Object.keys(dict_countries).length;

    //Récupération des 25 (ou moins) éléments que l'on souhaite afficher
    if(compteur_countries%NB_PAYS_PAR_PAGE !== 0) //Si la page n'est pas un multiple de NB_PAYS_PAR_PAGE (on se trouve sur la dernière page)
    {
        compteur_countries=compteur_countries-(compteur_countries%NB_PAYS_PAR_PAGE); //On enleve le reste de la division euclidienne au compteur (ce qui permet de revenir à l'avant dernière page)
        tab_countries = tab_code_pays.slice(compteur_countries-NB_PAYS_PAR_PAGE,compteur_countries);
    }
    else //Si la page est un multiple de NB_PAYS_PAR_PAGE
    {
        compteur_countries-=NB_PAYS_PAR_PAGE; //On enleve NB_PAYS_PAR_PAGE au compteur
        tab_countries = tab_code_pays.slice(compteur_countries-NB_PAYS_PAR_PAGE,compteur_countries);
    }
    if(compteur_countries === NB_PAYS_PAR_PAGE) //On enleve l'ecouteur sur le bouton précédent si on se trouve sur la première page
    {
        document.getElementById("bt_precedent").removeEventListener("click",onClickPrecedent);
    }
    else
    {
        document.getElementById("bt_precedent").addEventListener("click",onClickPrecedent);
    }
    if(compteur_countries < longueur_tableau) //On ajoute l'écouteur sur le bouton suivant si on se trouve sur l'avant dernière page (pour contrebalancer le suppression de l'écouteur pour le bouton suivant quand on est sur la dernière page dans la fonction onClickSuivant())
    {
        document.getElementById("bt_suivant").addEventListener("click",onClickSuivant);
    }
    else
    {
        document.getElementById("bt_suivant").removeEventListener("click",onClickSuivant)
    }
    compteur_page--;
    //Suppression du contenu présent dans la table
    let tbody_table_pays = document.getElementById(ID_TBODY_PAYS);
    tbody_table_pays.innerHTML = "";

    //Ajout des pays dans la page
    let template_country = document.getElementById("un_pays");
    addAllCountries(tab_countries,template_country,ID_TBODY_PAYS);

    //Update du numéro de page 
    document.getElementById("num_page").textContent = "Page n°"+compteur_page;
}
var clic_ligne_active = true;

/**
 * Permet d'afficher les détails ou le drapeaud d'un pays. 
 * Le code pays est récupéré grâce à l'attribut onclick se trouvant sur chaque ligne des pays.
 * Même chose pour le drapeau avec le lien.
 * @param {*} code_pays Code du pays
 * @param {*} flag lien du drapeau du pays
 */
function afficheDetailsOuDrapeauPays(code_pays, flag = undefined) {
    if(clic_ligne_active) { // seulement s'il n'y a pas l'affichage des détails ou drapeau d'activé
        clic_ligne_active = false;
        if(flag === undefined) { // affiche les détails du pays
            let pays = Country.all_countries[code_pays];

            // récupération du nom du pays
            if(pays.translations["fr"] !== undefined) {
                document.getElementById("details_name").textContent = pays.translations["fr"];
            } else {
                document.getElementById("details_name").textContent = pays.translations["en"];
            }

            // récupération du drapeau du pays
            document.getElementById("details_flag").setAttribute("src", pays.flag);

            // récupération de la capitale du pays
            document.getElementById("details_capital").textContent = pays.capital;

            // récupération du continent du pays
            document.getElementById("details_region").textContent = pays.region;
    
            // récupération du nombre d'habitants du pays
            document.getElementById("details_population").textContent = pays.population + " habitants";

            // récupération de la surface du pays
            if(pays.area !== undefined) {
                document.getElementById("details_area").textContent = pays.area + " km²";
            } else {
                document.getElementById("details_area").textContent = "Indéfini";
            }
            
            // récupération de la densité du pays
            if(pays.area !== undefined)
            {
                document.getElementById("details_density").textContent = Math.round(pays.getPopDensity()*10)/10  + " habitants/km²";
            } else {
                document.getElementById("details_density").textContent = "Indéfini";
            }
            
            // récupération de la monnaie du pays
            if(pays.currencies[0] !== undefined) {
                document.getElementById("details_currencies").textContent = pays.currencies;
            } else {
                document.getElementById("details_currencies").textContent = "Aucune monnaie";
            }

            // affiche les détails
            document.getElementById("details").style.visibility = "visible";
    
        } else { // affiche le drapeau en grand
            document.getElementById("big_flag").setAttribute("src", flag);

            document.getElementById("support_flag").style.visibility = "visible";
        }
    }
    
}

function fermerDetails() {
    document.getElementById("details").style.visibility = "hidden";
    clic_ligne_active = true;
}

function fermerDrapeau() {
    document.getElementById("support_flag").style.visibility = "hidden";
    clic_ligne_active = true;
}

function remplissage_liste_deroulante(id_liste,table_value) //Fonction qui remplis une liste dynamiquement
{
    //Recupérer l'élément de la liste
    let liste = document.getElementById(id_liste);
    for(let value of table_value)
    {
        //Création d'une élément valeur
        let option = document.createElement("option");
        //Modification de l'attribut value de l'élément option
        option.setAttribute("value",value);
        //Modification de la valeur de l'élément option
        option.textContent = value;
        //Ajout de l'élément option à la liste
        liste.appendChild(option);
    }
}
let bt_submit = document.getElementById("submit-pays-input");
let liste_continent = document.getElementById("continent-select");
let liste_langue = document.getElementById("langue-select");
let champ_texte_pays = document.getElementById("pays-input");
function apply_filters() //Fonction écouteur qui effectue la gestion des filtres 
{ //S'active lors du changement de valeur sur un des filtres continent ou langue (change), ou lors du click sur bouton "Valider" du pays (click)

    let ensemble_pays = Country.all_countries;
    let tab_pays = {};
    //On récupére les valeurs des trois filtres 
    let value_continent = liste_continent.value;
    let value_langue = liste_langue.value;
    let value_pays = champ_texte_pays.value.toLowerCase();

    if(value_continent === DEFAULT_VALUE_FILTRE_CONTINENT && value_langue === DEFAULT_VALUE_FILTRE_LANGUE && value_pays === "")
    {
        dict_countries = Country.all_countries;
        compteur_countries = 0;
        compteur_page = 0;
        onClickSuivant();
    }
    else
    {
        for(let code_pays in ensemble_pays) //Parcours tout les pays
        {
            let garde = true;
            let langue_presente = ensemble_pays[code_pays].getLanguages().some(langue => { //Vérifie que la langue est parlé dans le pays (si c'est le cas on arrête directement la boucle, pour éviter de parcourir tout les langues)
                if(langue.name === value_langue)
                {
                    return true;
                }
                return false;
            });
            if(value_continent !== DEFAULT_VALUE_FILTRE_CONTINENT && value_continent !== ensemble_pays[code_pays].region) //Si ce n'est pas la valeur par défault et que la valeur n'est pas égale à la region du pays
            {
                garde = false; //On met à faux pour dire que l'on ne va pas ajouter ce pays dans le filtre car il ne le respecte pas
            }
            else if(value_langue !== DEFAULT_VALUE_FILTRE_LANGUE && !(langue_presente))//Si ce n'est pas la valeur par défault et que la langue n'est pas parlé par le pays
            {
                garde = false;
            }
            else if(value_pays !== "" && !(ensemble_pays[code_pays].translations["fr"].toLowerCase().includes(value_pays) || ensemble_pays[code_pays].translations["en"].toLowerCase().includes(value_pays))) //Si le champ n'est pas vide et que le texte saisis est contenu soit dans le nom du pays français ou anglais
            {
                garde = false;
            } 
            if(garde)//Si le pays respecte tout les filtres 
            {
                tab_pays[code_pays] = ensemble_pays[code_pays]; //On ajoute le pays dans ceux que l'on va afficher
            }
        }
        
        console.log(tab_pays);

        dict_countries = tab_pays;
        compteur_countries = 0;
        compteur_page = 0;
        onClickSuivant();
    }

}


var colonneTriee = "";

function trierPaysSelonColonne(colonne) {
    if(colonne !== colonneTriee && colonne === "headName") {

        // mise en gras de l'intitulé de la colonne
        if(colonneTriee !== "") {
            document.getElementById(colonneTriee).style.fontWeight = "normal";
        }
        document.getElementById("headName").style.fontWeight = "bold";
        
        colonneTriee = "headName";

        let tab = dict_countries;
        // trie sur le nom
        let tab_sort = Object.values(tab).sort(function(a,b)
        {
            if(a.translations["fr"] !== undefined || b.translations["fr"] !== undefined) {
                var cleanNameA = a.translations["fr"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                var cleanNameB = b.translations["fr"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
            } else {
                var cleanNameA = a.translations["en"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                var cleanNameB = b.translations["en"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                
            }
            return cleanNameA.localeCompare(cleanNameB); 
        });
        
        // tableau temporaire pour recréer le dictionnaire des pays trié
        let tab_tmp_pays= [];

        for(pays of tab_sort) {
            tab_tmp_pays[pays.alpha3Code] = dict_countries[pays.alpha3Code];
        }

        dict_countries = tab_tmp_pays;

        compteur_countries = 0;
        compteur_page = 0;
        onClickSuivant();

    } else if(colonne !== colonneTriee && colonne === "headPopulation") {
        
        // mise en gras de l'intitulé de la colonne
        if(colonneTriee !== "") {
            document.getElementById(colonneTriee).style.fontWeight = "normal";
        }
        document.getElementById("headPopulation").style.fontWeight = "bold";

        colonneTriee = "headPopulation";

        let tab = dict_countries;
        // trie sur la population
        let tab_sort = Object.values(tab).sort(function(a,b)
        {
            if(a.population < b.population)
            {
                return 1;
            }
            else if(a.population > b.population)
            {
                return -1;
            }

            // si égalité, alors trier sur le nom
            if(a.translations["fr"] !== undefined || b.translations["fr"] !== undefined) {
                var cleanNameA = a.translations["fr"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                var cleanNameB = b.translations["fr"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
            } else {
                var cleanNameA = a.translations["en"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                var cleanNameB = b.translations["en"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                
            }
            return cleanNameA.localeCompare(cleanNameB); 
            
        });
        
        // tableau temporaire pour recréer le dictionnaire des pays trié
        let tab_tmp_pays= [];

        for(pays of tab_sort) {
            tab_tmp_pays[pays.alpha3Code] = dict_countries[pays.alpha3Code];
        }

        dict_countries = tab_tmp_pays;

        compteur_countries = 0;
        compteur_page = 0;
        onClickSuivant();
    } else if(colonne !== colonneTriee && colonne === "headArea") {

        // mise en gras de l'intitulé de la colonne
        if(colonneTriee !== "") {
            document.getElementById(colonneTriee).style.fontWeight = "normal";
        }
        document.getElementById("headArea").style.fontWeight = "bold";

        colonneTriee = "headArea";

        let tab = dict_countries;
        // trie sur la surface
        let tab_sort = Object.values(tab).sort(function(a,b)
        {
            let aArea = a.area;
            let bArea = b.area;

            if(a.area === undefined) { // si le pays a une surface indéfinie
                aArea = -1;
            }

            if(b.area === undefined) { // si le pays a une surface indéfinie
                bArea = -1;
            }

            if(aArea < bArea)
            {
                return 1;
            }
            else if(aArea > bArea)
            {
                return -1;
            }

            // si égalité, alors trier sur le nom
            if(a.translations["fr"] !== undefined || b.translations["fr"] !== undefined) {
                var cleanNameA = a.translations["fr"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                var cleanNameB = b.translations["fr"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
            } else {
                var cleanNameA = a.translations["en"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                var cleanNameB = b.translations["en"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                
            }
            return cleanNameA.localeCompare(cleanNameB); 
        });
        
        // tableau temporaire pour recréer le dictionnaire des pays trié
        let tab_tmp_pays= [];

        for(pays of tab_sort) {
            tab_tmp_pays[pays.alpha3Code] = dict_countries[pays.alpha3Code];
        }

        dict_countries = tab_tmp_pays;

        
        compteur_countries = 0;
        compteur_page = 0;
        onClickSuivant();
    } else if(colonne !== colonneTriee && colonne === "headDensity") {
        
        // mise en gras de l'intitulé de la colonne
        if(colonneTriee !== "") {
            document.getElementById(colonneTriee).style.fontWeight = "normal";
        }
        document.getElementById("headDensity").style.fontWeight = "bold";
        
        colonneTriee = "headDensity";

        let tab = dict_countries;
        // trie sur la surface
        let tab_sort = Object.values(tab).sort(function(a,b)
        {
            let aDensity = a.getPopDensity();
            let bDensity = b.getPopDensity();

            if(Number.isNaN(a.getPopDensity())) { // si le pays a une densité indéfinie
                aDensity = -1;
            }

            if(Number.isNaN(b.getPopDensity())) { // si le pays a une densité indéfinie
                bDensity = -1;
            }

            if(aDensity < bDensity)
            {
                return 1;
            }
            else if(aDensity > bDensity)
            {
                return -1;
            }
            
            // si égalité, alors trier sur le nom
            if(a.translations["fr"] !== undefined || b.translations["fr"] !== undefined) {
                var cleanNameA = a.translations["fr"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                var cleanNameB = b.translations["fr"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
            } else {
                var cleanNameA = a.translations["en"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                var cleanNameB = b.translations["en"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                
            }
            return cleanNameA.localeCompare(cleanNameB); 
        });
        
        // tableau temporaire pour recréer le dictionnaire des pays trié
        let tab_tmp_pays= [];

        for(pays of tab_sort) {
            tab_tmp_pays[pays.alpha3Code] = dict_countries[pays.alpha3Code];
        }

        dict_countries = tab_tmp_pays;

        compteur_countries = 0;
        compteur_page = 0;
        onClickSuivant();
    } else if(colonne !== colonneTriee && colonne === "headRegion") {

        // mise en gras de l'intitulé de la colonne
        if(colonneTriee !== "") {
            document.getElementById(colonneTriee).style.fontWeight = "normal";
        }
        document.getElementById("headRegion").style.fontWeight = "bold";

        colonneTriee = "headRegion";

        let tab = dict_countries;
        // trie sur le nom
        let tab_sort = Object.values(tab).sort(function(a,b)
        {
            let resComparaison = a.region.localeCompare(b.region);
            if(resComparaison !== 0) {
                return resComparaison ; 
            }

            // si égalité, alors trier sur le nom
            if(a.translations["fr"] !== undefined || b.translations["fr"] !== undefined) {
                var cleanNameA = a.translations["fr"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                var cleanNameB = b.translations["fr"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
            } else {
                var cleanNameA = a.translations["en"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                var cleanNameB = b.translations["en"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlever les accents... pour trier correctement
                
            }
            return cleanNameA.localeCompare(cleanNameB); 
        });
        
        // tableau temporaire pour recréer le dictionnaire des pays trié
        let tab_tmp_pays= [];

        console.log(tab_sort);

        for(pays of tab_sort) {
            tab_tmp_pays[pays.alpha3Code] = dict_countries[pays.alpha3Code];
        }

        dict_countries = tab_tmp_pays;
        compteur_countries = 0;
        compteur_page = 0;
        onClickSuivant();
    }
}