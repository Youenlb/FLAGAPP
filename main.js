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
        
        //Ajout population
        tr_pays.getElementsByClassName("population")[0].textContent = dict_countries[code_pays].population;

        //Ajout surface
        if(dict_countries[code_pays].area !== undefined)
        {
            tr_pays.getElementsByClassName("area")[0].textContent = dict_countries[code_pays].area;
        }
        else
        {
            tr_pays.getElementsByClassName("area")[0].textContent = PAS_SURFACE;
        }

        //Ajout densite
        if(dict_countries[code_pays].area !== undefined)
        {
            tr_pays.getElementsByClassName("density")[0].textContent = dict_countries[code_pays].getPopDensity();
        }
        else
        {
            tr_pays.getElementsByClassName("density")[0].textContent = PAS_SURFACE;
        }
        
        //Ajout continent
        tr_pays.getElementsByClassName("region")[0].textContent = dict_countries[code_pays].region;

        //Ajout flag
        tr_pays.getElementsByClassName("flag")[0].querySelector("img").setAttribute("src",dict_countries[code_pays].flag);

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
        compteur_countries-=compteur_countries-(compteur_countries%NB_PAYS_PAR_PAGE); //On enleve le reste de la division euclidienne au compteur (ce qui permet de revenir à l'avant dernière page)
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