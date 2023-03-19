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
fill_db();

function addAllCountries(tab_code_pays,template_countrie,id_table_body_pays)
{
    let dict_countries = Country.all_countries;
    for(let code_pays of tab_code_pays)
    {
        let name_countrie = dict_countries[code_pays].translations["fr"];
        let clone_content_template = document.importNode(template_countrie.content, true);

        //Mise à jour de l'id du tr du pays (attribut)
        let tr_pays = clone_content_template.querySelector("tr");
        tr_pays.setAttribute("id","pays_"+name_countrie);

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
            tr_pays.getElementsByClassName("density")[0].textContent = Math.round(dict_countries[code_pays].getPopDensity()*10)/10;
        }
        else
        {
            tr_pays.getElementsByClassName("density")[0].textContent = PAS_SURFACE;
        }
        
        //Ajout continent
        tr_pays.getElementsByClassName("region")[0].textContent = dict_countries[code_pays].region;
        //Ajout flag
        tr_pays.getElementsByClassName("flag")[0].querySelector("img").setAttribute("src",dict_countries[code_pays].flag);
        
        /*
        for(let indice_td in td_pays)
        {
            let td = td_pays[indice_td];
            let parametre = tab_parametre[indice_td];
            if(parametre !== PARAM_FLAG) //Si ce n'est pas le parametre flag (image)
            {
                //On ajoute le contenu du parametre dans td
                td.setAttribute("id",parametre+name_countrie);
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