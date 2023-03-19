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