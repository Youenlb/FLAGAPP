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
            if(Language.all_languages[code_language] === undefined) //Si le langage n'est pas déjà ajouter
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
    let dict_countries = Country.all_countries;
    for(let code_pays of tab_code_pays)
    {
        let clone_content_template = document.importNode(template_countrie.content, true);

        //Mise à jour de l'id du tr du pays (attribut)
        let tr_pays = clone_content_template.querySelector("tr");
        tr_pays.setAttribute("id",code_pays);

        //Ajout du nom 
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
            tr_pays.getElementsByClassName("density")[0].textContent = Math.round(dict_countries[code_pays].getPopDensity()*10)/10;
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

        /*
        for(let indice_td in td_pays)
        {
            let td = td_pays[indice_td];
            let parametre = tab_parametre[indice_td];
            if(parametre !== PARAM_FLAG) //Si ce n'est pas le parametre flag (image)
            {
                //On ajoute le contenu du parametre dans td
                td.setAttribute("id",parametre+name_country);
                td.textContent = dict_countries[code_pays][parametre];
            }
            else //Si c'est le flag
            {
                //On met le contenu du parametre dans le src de l'img de td
                let img = td.querySelector("img");
                img.setAttribute("src",dict_countries[code_pays][parametre]);
            }
        }*/
        document.getElementById(id_table_body_pays).appendChild(clone_content_template);
    }
}
let dict_countries = Country.all_countries; //Dictionnaire des pays
let compteur_countries = 0; //Contient le nombre de pays afficher dans l'état de la pagination (50 pour 50 pays afficher sur les 2 pages)
let compteur_page = 0;
function onClickSuivant()
{
    console.log("suivant");
    console.log(dict_countries);
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
    console.log(compteur_page);
}
function onClickPrecedent()
{
    console.log("precedent");
    console.log(dict_countries);
    //Tableau all_coutries
    let tab_code_pays = Object.keys(dict_countries);
    let tab_countries;
    let longueur_tableau = Object.keys(dict_countries).length;

    //Récupération des 25 (ou moins) éléments que l'on souhaite afficher
    if(compteur_countries%NB_PAYS_PAR_PAGE !== 0) //Si la page n'est pas un multiple de NB_PAYS_PAR_PAGE (on se trouve sur la dernière page)
    {
        compteur_countries-=compteur_countries-(compteur_countries%NB_PAYS_PAR_PAGE); //On enleve le reste de la division euclidienne au compteur (ce qui permet de revenir à l'avant dernière page)
        tab_countries = tab_code_pays.slice(compteur_countries-NB_PAYS_PAR_PAGE,compteur_countries);
        //document.getElementById("bt_suivant").removeEventListener("click",onClickSuivant);
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
    console.log(tab_countries);
    addAllCountries(tab_countries,template_country,ID_TBODY_PAYS);

    //Update du numéro de page 
    document.getElementById("num_page").textContent = "Page n°"+compteur_page;
    console.log(compteur_page);
}
var clic_ligne_active = true;

function afficheDetailsOuDrapeauPays(code_pays, flag = undefined) {
    if(clic_ligne_active) {
        clic_ligne_active = false;
        if(flag === undefined) { // affiche les détails du pays
            let pays = Country.all_countries[code_pays];

            document.getElementById("details").style.visibility = "visible";
            
            if(pays.translations["fr"] !== undefined) {
                document.getElementById("details_name").textContent = pays.translations["fr"];
            } else {
                document.getElementById("details_name").textContent = pays.translations["en"];
            }

            document.getElementById("details_flag").setAttribute("src", pays.flag);
    
            document.getElementById("details_capital").textContent = pays.capital;

            document.getElementById("details_region").textContent = pays.region;
    
            document.getElementById("details_population").textContent = pays.population + " habitants";


            if(pays.area !== undefined) {
                document.getElementById("details_area").textContent = pays.area + " km²";
            } else {
                document.getElementById("details_area").textContent = "Indéfini";
            }
            
            if(pays.area !== undefined)
            {
                document.getElementById("details_density").textContent = Math.round(pays.getPopDensity()*10)/10  + " habitants/km²";
            } else {
                document.getElementById("details_density").textContent = "Indéfini";
            }
            
            if(pays.currencies[0] !== undefined) {
                document.getElementById("details_currencies").textContent = pays.currencies;
            } else {
                document.getElementById("details_currencies").textContent = "Aucune monnaie";
            }
    
        } else { // affiche le drapeau en grand
            document.getElementById("support_flag").style.visibility = "visible";

            document.getElementById("big_flag").setAttribute("src", flag);
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
        dict_countries = tab_pays;
        compteur_countries = 0;
        compteur_page = 0;
        onClickSuivant();
    }
    //mise_a_jour_liste_pays(tab_pays);
    //On fait une fonction qui réinitialise la liste avec tab_pays
        //Pas un solution plus simple avec addAllCountries (je pense pas car il ne gerer pas le 25 par 25 pages donc c'est la meilleur solution celle d'en bas)
        //mise_a_jour_liste_pays --> mets à jour la liste en faisant des droites gauche avec les fonctions ecouteur de "prec" et "suiv" en gérant les exceptions s'il y en a (genre si on ce trouve sur la premiere page ou sur la dernière page on ne peut claiement pas faire le même gauche droite donc gérant ça dans le code avec 1 structure de controle if(mettre l'exception qui va pas avec les autres en mode !(condition_exception)),else (mettre ici dans l'exception l'autre droite gauche, contraire aux autres))

    //Ma solution n'est pas 100% performante (il faudrais récupérer l'ancien tableau, dans le cas ou on ajouter un filtre, cependant dans le cas ou on enleve un filtre on est obliger de remettre à jour en parcourant tout),(contenir dans un tableau en global les anciennes valeurs et les mettres à jours à chaque nx filtre et selon les valeurs on parcourt tout les pays ou seulement l'ancien ? )
    //Solution moins performante pour le filtre langue
        //Je récupere les langages du pays, je fais une map avec les tests pour voir si le nom est égale au nom selectionner et je fais un .contains pour voir si un true est dedans si c'est vrai on fait !(vrai)
    //Si ce qui est sélectionner est vide "" on le prend pas en compte, sinon on le prend en compte 
    //Pour eviter de parcourir le tableau trois fois on mets en place les if dans une boucle qui parcourt Country.all_countries (on fait en sorte d'ignorer le if si la variable de l'objet est null, donc une condition du genre (value_filtre != "" (ou constante qui signifie que c'est vide) && obj != ""))
    //Pour le si du champ pays (faire un truc du genre comme condition (pour vérifier que le if fonctionne regarder si contains marche sur les chaines de caractère sinon utilise une autres fonction qui doit surement être implémenter par js) if (obj["nom"].contains(texte_pays(ce qui est rentrer dans le champ de texte sur le site))))
    //Pour cela on fait trois if champ non vide alors on mets en place le filtre sur l'objet du pays
    //on met le pays dans une variable dans la boucle, si le pays respecte le filtre on laisse l'objet, sinon on met ""
    //A la fin de l'itération de boucle if(pays != "") alors on l'ajoute dans le tableau que l'on va retourner à la fin
    //On retourne le tableau à la fin 
    //Si on appui sur le bouton submit alors qu'il est vide mettre un message d'erreur en bas du champ de texte pour cela mettre 2 ecouteur sur le bouton submit un qui est la fonction filtre, puis un autre qui vérifier si l'on affiche le message d'erreur ou non
    //Initialiser le tableau que l'on va mettre à Country.all_countries
    //Faire une fonction pour chaque filtre (ecouteur) en mettant en parametre le tableau des pays, elle retourne le nouveau tableau dans la variable du tableau initialiser
    //la fonction doit permettre de garder la page de pagination (en la mettant à jour) faire une fois en avant en arrire, ou l'inverse (avec onClicksuivant e tonClickPrecedent), si pas
    //possible faire une fonction qui réinitialise la page et l'intégrer en modifiant ma pagination

}
